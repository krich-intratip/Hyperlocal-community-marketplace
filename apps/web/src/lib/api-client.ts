import axios from 'axios'

/**
 * Token is stored as an httpOnly cookie (set by the API on OAuth callback).
 * withCredentials: true ensures the cookie is sent automatically on every request.
 * No manual token handling needed — the browser handles it securely.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,   // sends httpOnly cookie on every cross-origin request
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',  // helps backend distinguish AJAX from browser nav
  },
})

// Send Accept-Language header based on stored lang preference
apiClient.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('chm-lang')
      if (stored) {
        const parsed = JSON.parse(stored) as { state?: { lang?: string } }
        const lang = parsed?.state?.lang ?? 'th'
        config.headers['Accept-Language'] = lang
      }
    } catch {
      // ignore parse errors
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: { response?: { status?: number; headers?: Record<string, string> } }) => {
    if (error?.response?.status === 429) {
      const retryAfter = error.response.headers?.['retry-after']
      const message = retryAfter
        ? `คำขอถี่เกินไป กรุณารอ ${retryAfter} วินาที`
        : 'คำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่'
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('rate-limit', { detail: { message } }))
      }
    }
    if ((error as { response?: { status?: number } }).response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    }
    return Promise.reject(error as Error)
  },
)
