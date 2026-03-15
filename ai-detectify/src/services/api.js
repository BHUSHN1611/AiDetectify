// src/services/api.js
// Central API client for all backend calls

const BASE_URL = import.meta.env.VITE_API_URL 
// ||'http://localhost:8000'
function getToken() {
  return localStorage.getItem('access_token')
}

async function request(path, options = {}) {
  const headers = { ...options.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }

  return res.json()
}

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  me: () => request('/auth/me'),
}

// ── Detection ─────────────────────────────────────────
export const detectAPI = {
  detect: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request('/api/detect', { method: 'POST', body: form })
  },

  history: (limit = 20, skip = 0) =>
    request(`/api/history?limit=${limit}&skip=${skip}`),

  stats: () => request('/api/stats'),
}
