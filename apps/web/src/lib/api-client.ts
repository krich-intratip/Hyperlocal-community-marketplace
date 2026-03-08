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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    }
    return Promise.reject(error)
  },
)
