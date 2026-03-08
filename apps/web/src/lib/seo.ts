import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://communityHyper.co'
const SITE_NAME = 'Community Hyper Marketplace'
const DEFAULT_DESCRIPTION =
  'แพลตฟอร์มตลาดบริการชุมชนแบบดิจิทัล — เชื่อมต่อผู้ให้บริการในพื้นที่กับผู้อยู่อาศัยในชุมชน ครอบคลุม 10 หมวดบริการ อาหาร ช่าง งานบ้าน ติวเตอร์ และอีกมากมาย'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

export interface SeoOptions {
  title?: string
  description?: string
  path?: string
  ogImage?: string
  noIndex?: boolean
  keywords?: string[]
  locale?: string
}

export function buildMetadata(options: SeoOptions = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = '/',
    ogImage = DEFAULT_OG_IMAGE,
    noIndex = false,
    keywords = [],
    locale = 'th_TH',
  } = options

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = `${BASE_URL}${path}`

  const baseKeywords = [
    'marketplace', 'community', 'hyperlocal', 'บริการชุมชน', 'ตลาดออนไลน์',
    'ผู้ให้บริการ', 'ชุมชน', 'Local Economy', 'Thailand',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...baseKeywords, ...keywords],
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        'th-TH': url,
        'en-US': `${url}?lang=en`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@CommunityHyper',
      site: '@CommunityHyper',
    },
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    },
  }
}

// ── Structured Data (JSON-LD) helpers ──

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'th',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/marketplace?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: ['https://github.com/krich-intratip/Hyperlocal-community-marketplace'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Thai', 'English'],
    },
  }
}

export function marketplaceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ShoppingCenter',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'บริการชุมชนครบวงจร',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'อาหาร (Food)' },
        { '@type': 'OfferCatalog', name: 'งานช่าง (Repair/Technician)' },
        { '@type': 'OfferCatalog', name: 'งานบ้าน (Home Services)' },
        { '@type': 'OfferCatalog', name: 'สอนพิเศษ (Tutoring)' },
        { '@type': 'OfferCatalog', name: 'ดูแลผู้สูงอายุ (Elderly Care)' },
        { '@type': 'OfferCatalog', name: 'สินค้าทำมือ (Handmade)' },
        { '@type': 'OfferCatalog', name: 'สุขภาพ & ความงาม (Health & Wellness)' },
        { '@type': 'OfferCatalog', name: 'เกษตรชุมชน (Local Agriculture)' },
        { '@type': 'OfferCatalog', name: 'ฟรีแลนซ์ท้องถิ่น (Local Freelance)' },
        { '@type': 'OfferCatalog', name: 'Community Sharing (Sharing Economy)' },
      ],
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}
