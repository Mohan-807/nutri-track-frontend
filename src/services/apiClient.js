const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  // Fails loudly instead of quietly falling back to a hardcoded URL — the whole point of
  // removing mock data is that a missing real backend should be obvious immediately, not
  // paper over itself.
  throw new Error(
    'VITE_API_URL is not set. Add it to frontend/.env (see .env.example) — it must point at the running backend.',
  )
}

let authToken = null

// Called by authStore whenever the session's token changes (login, signup, logout, or
// rehydrating a persisted session from localStorage on page load). apiClient never touches
// localStorage or any store directly — it just holds the token in memory — so it stays a
// generic HTTP client any future service can reuse, not something coupled to auth internals.
export function setAuthToken(token) {
  authToken = token
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractErrorMessage(body, fallback) {
  const detail = body?.detail
  if (typeof detail === 'string') return detail
  // FastAPI validation errors (422) return detail as a list of {msg, loc, type} objects.
  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((issue) => issue.msg).filter(Boolean).join(' ') || fallback
  }
  return fallback
}

async function request(path, { method = 'GET', body, headers, ...rest } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...rest,
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      // Non-JSON body (e.g. an upstream proxy error page) — fall through with data left null.
    }
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data, `Request failed (${response.status}).`), response.status)
  }

  return data
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
