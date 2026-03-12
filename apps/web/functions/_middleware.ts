/**
 * LO-1: CSP Nonce Injection
 * Cloudflare Pages Function — runs at the edge before every request.
 *
 * For HTML responses:
 *  1. Generates a cryptographically random base64 nonce (128-bit)
 *  2. Appends 'nonce-{value}' to the script-src CSP directive
 *  3. Uses HTMLRewriter to inject nonce="" attribute into every <script> tag
 *
 * Non-HTML assets (JS, CSS, fonts, images) pass through untouched.
 * style-src 'unsafe-inline' is deliberately kept (requires separate audit sprint).
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Env {}

export async function onRequest(
  context: EventContext<Env, string, Record<string, unknown>>,
): Promise<Response> {
  const response = await context.next()

  // Only modify HTML responses — pass everything else through unchanged
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) {
    return response
  }

  // Generate a cryptographically random nonce (128-bit, base64-encoded)
  const nonceBytes = new Uint8Array(16)
  crypto.getRandomValues(nonceBytes)
  const nonce = btoa(String.fromCharCode(...Array.from(nonceBytes)))

  // Build new headers with updated CSP: append 'nonce-{nonce}' to script-src
  const newHeaders = new Headers(response.headers)
  const currentCsp = newHeaders.get('content-security-policy') ?? ''
  const updatedCsp = currentCsp.replace(
    /script-src ([^;]+)/,
    (_match, existing: string) => `script-src ${existing.trim()} 'nonce-${nonce}'`,
  )
  newHeaders.set('content-security-policy', updatedCsp)

  // Inject nonce attribute into every <script> tag via streaming HTMLRewriter
  const rewriter = new HTMLRewriter().on('script', {
    element(el) {
      el.setAttribute('nonce', nonce)
    },
  })

  return rewriter.transform(
    new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    }),
  )
}
