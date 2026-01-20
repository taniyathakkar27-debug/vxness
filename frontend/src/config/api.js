// Determine sensible default API base URL depending on environment
const resolveDefaultApiBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5001'
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Fallback for build-time evaluation
  return ''
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || resolveDefaultApiBaseUrl()
export const API_URL = `${API_BASE_URL}/api`
