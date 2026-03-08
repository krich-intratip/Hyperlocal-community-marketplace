interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Sanitize JSON-LD content to prevent XSS via </script> injection.
 * Replaces the character sequence that could break out of the script tag.
 * See: https://redux.js.org/usage/server-rendering#security-considerations
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027')
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}
