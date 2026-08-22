import { apiClient, ApiError } from './apiClient'

function normalizeUser(user) {
  return { id: user.id, email: user.email }
}

function normalizeError(error) {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.'
}

// Real backend calls now — POST /auth/signup and POST /auth/login (backend/app/routers/auth.py).
// Keeps the exact same { success, user, error } contract the mocked version had, so
// authStore/LoginPage/SignupPage didn't need to change; `token` is new and is what authStore
// hands to apiClient.setAuthToken so every later request is authenticated.
export async function signup({ email, password }) {
  try {
    const { user, token } = await apiClient.post('/auth/signup', { email, password })
    return { success: true, user: normalizeUser(user), token }
  } catch (error) {
    return { success: false, error: normalizeError(error) }
  }
}

export async function login({ email, password }) {
  try {
    const { user, token } = await apiClient.post('/auth/login', { email, password })
    return { success: true, user: normalizeUser(user), token }
  } catch (error) {
    return { success: false, error: normalizeError(error) }
  }
}

// The backend issues stateless JWTs — there's no server-side session to invalidate, so there's
// nothing to call here. Logging out is entirely a client-side action (authStore clears the
// token from apiClient and its persisted state).
export async function logout() {}
