'use client'

/**
 * MarketBackground — Glassmorphism backdrop
 *
 * Creates the rich gradient + blurred-orb canvas that makes glass cards
 * visually pop. All positioning is fixed so it covers every page.
 *
 * Design:
 *   Light: indigo-100 → violet-50 → fuchsia-100 mesh + 5 soft bokeh orbs
 *   Dark : deep navy mesh + deep-blue / violet orbs
 */
export function MarketBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>

      {/* ── Base gradient mesh ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br
        from-indigo-100 via-violet-50 to-fuchsia-100
        dark:from-[#080b24] dark:via-[#0e0720] dark:to-[#160830]" />

      {/* ── Bokeh orbs — large blurred colour blobs ───────────────────────── */}
      {/* Top-left — periwinkle-indigo */}
      <div
        className="animate-float-slow absolute -top-40 -left-40
          w-[640px] h-[640px] rounded-full
          bg-indigo-300/45 dark:bg-indigo-600/22 blur-[110px]"
      />
      {/* Top-right — violet */}
      <div
        className="animate-float-med absolute -top-20 right-[-80px]
          w-[520px] h-[520px] rounded-full
          bg-violet-300/38 dark:bg-violet-600/18 blur-[100px]"
        style={{ animationDelay: '2s' }}
      />
      {/* Centre — fuchsia-rose */}
      <div
        className="animate-float-slow absolute top-1/3 left-1/2 -translate-x-1/2
          w-[700px] h-[380px] rounded-full
          bg-fuchsia-200/32 dark:bg-fuchsia-700/12 blur-[130px]"
        style={{ animationDelay: '4s' }}
      />
      {/* Bottom-left — cyan-teal */}
      <div
        className="animate-float-med absolute bottom-0 -left-28
          w-[460px] h-[460px] rounded-full
          bg-cyan-200/38 dark:bg-cyan-600/15 blur-[95px]"
        style={{ animationDelay: '1s' }}
      />
      {/* Bottom-right — blush-pink */}
      <div
        className="animate-float-slow absolute -bottom-20 right-[-40px]
          w-[420px] h-[420px] rounded-full
          bg-pink-200/32 dark:bg-pink-700/12 blur-[85px]"
        style={{ animationDelay: '3s' }}
      />

      {/* ── Scattered category icons — faint, category-coloured ─────────────── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* food bowl — coral-orange */}
        <g transform="translate(60,80) rotate(-12)">
          <ellipse cx="0" cy="0" rx="40" ry="14" fill="#e05c20" />
          <ellipse cx="0" cy="-6" rx="34" ry="28" fill="none" stroke="#e05c20" strokeWidth="5" />
          <path d="M-18,-30 Q0,-46 18,-30" fill="none" stroke="#e05c20" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* wrench / repair — periwinkle */}
        <g transform="translate(900,100) rotate(30)">
          <rect x="-6" y="-50" width="12" height="90" rx="6" fill="#4a7be8" />
          <circle cx="0" cy="-50" r="16" fill="none" stroke="#4a7be8" strokeWidth="9" />
          <circle cx="0" cy="-50" r="7" fill="#4a7be8" />
        </g>

        {/* house / home services — sage-green */}
        <g transform="translate(480,60) rotate(5)">
          <path d="M0,-50 L-55,10 L55,10 Z" fill="#3caa7a" />
          <rect x="-35" y="10" width="70" height="50" rx="3" fill="#3caa7a" />
          <rect x="-12" y="28" width="24" height="32" rx="2" fill="white" fillOpacity="0.4" />
        </g>

        {/* books / tutoring — violet */}
        <g transform="translate(80,620) rotate(-8)">
          <rect x="-48" y="-30" width="28" height="60" rx="3" fill="#8c5af0" />
          <rect x="-14" y="-30" width="28" height="60" rx="3" fill="#8c5af0" opacity="0.7" />
          <rect x="20"  y="-30" width="28" height="60" rx="3" fill="#8c5af0" opacity="0.5" />
        </g>

        {/* seedling / agriculture — lime-green */}
        <g transform="translate(920,660) rotate(10)">
          <line x1="0" y1="40" x2="0" y2="-20" stroke="#5aa03c" strokeWidth="7" strokeLinecap="round" />
          <path d="M0,0 Q30,-30 10,-60" fill="none" stroke="#5aa03c" strokeWidth="7" strokeLinecap="round" />
          <path d="M0,-10 Q-28,-30 -8,-58" fill="none" stroke="#5aa03c" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* shopping bag / community sharing — cyan */}
        <g transform="translate(200,350) rotate(-15)">
          <rect x="-32" y="-16" width="64" height="54" rx="6" fill="none" stroke="#14afc8" strokeWidth="6" />
          <path d="M-16,-16 Q-16,-44 0,-44 Q16,-44 16,-16" fill="none" stroke="#14afc8" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* heart / elderly care — blush-rose */}
        <g transform="translate(820,320) rotate(12)">
          <path
            d="M0,36 C0,36 -50,-8 -50,-28 C-50,-50 -28,-58 0,-36 C28,-58 50,-50 50,-28 C50,-8 0,36 0,36 Z"
            fill="none" stroke="#dc6496" strokeWidth="7"
          />
        </g>

        {/* scissors / handmade — sky-blue */}
        <g transform="translate(650,140) rotate(-20)">
          <circle cx="-24" cy="-24" r="14" fill="none" stroke="#14afe6" strokeWidth="6" />
          <circle cx="24"  cy="-24" r="14" fill="none" stroke="#14afe6" strokeWidth="6" />
          <line x1="-14" y1="-14" x2="44"  y2="44" stroke="#14afe6" strokeWidth="6" strokeLinecap="round" />
          <line x1="14"  y1="-14" x2="-44" y2="44" stroke="#14afe6" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* laptop / freelance — indigo */}
        <g transform="translate(500,700) rotate(6)">
          <rect x="-52" y="-28" width="104" height="68" rx="6" fill="none" stroke="#6473f0" strokeWidth="6" />
          <rect x="-40" y="-18" width="80"  height="46" rx="3" fill="#6473f0" opacity="0.3" />
          <line x1="-70" y1="40" x2="70" y2="40" stroke="#6473f0" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="0" cy="40" rx="22" ry="5" fill="#6473f0" />
        </g>

        {/* star / trust — amber */}
        <g transform="translate(1100,200) rotate(18)">
          <path d="M0,-55 L13,-18 L52,-18 L21,5 L32,42 L0,20 L-32,42 L-21,5 L-52,-18 L-13,-18 Z" fill="#f59e0b" />
        </g>

        {/* map pin / hyperlocal — periwinkle */}
        <g transform="translate(150,480) rotate(-6)">
          <path d="M0,-60 C-28,-60 -28,-20 0,-20 C28,-20 28,-60 0,-60 Z" fill="#5870e8" />
          <line x1="0" y1="-20" x2="0" y2="40" stroke="#5870e8" strokeWidth="8" strokeLinecap="round" />
          <circle cx="0" cy="-40" r="10" fill="white" fillOpacity="0.4" />
        </g>

        {/* handshake / community — cyan-teal */}
        <g transform="translate(850,500) rotate(8)">
          <path d="M-50,10 Q-20,-20 0,-10 Q20,-20 50,10" fill="none" stroke="#14d2dc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="-50" y1="10" x2="-50" y2="40" stroke="#14d2dc" strokeWidth="8" strokeLinecap="round" />
          <line x1="50"  y1="10" x2="50"  y2="40" stroke="#14d2dc" strokeWidth="8" strokeLinecap="round" />
          <path d="M-50,40 Q0,60 50,40" fill="none" stroke="#14d2dc" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* sparkle / health — emerald */}
        <g transform="translate(760,80) rotate(0)">
          <line x1="0"   y1="-44" x2="0"   y2="44" stroke="#28c38c" strokeWidth="6" strokeLinecap="round" />
          <line x1="-44" y1="0"   x2="44"  y2="0"  stroke="#28c38c" strokeWidth="6" strokeLinecap="round" />
          <line x1="-31" y1="-31" x2="31"  y2="31" stroke="#28c38c" strokeWidth="4" strokeLinecap="round" />
          <line x1="31"  y1="-31" x2="-31" y2="31" stroke="#28c38c" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>

      {/* ── Subtle dot-grid texture ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.032]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(100,120,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
