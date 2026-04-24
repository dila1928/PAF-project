const USER_KEY = 'campus_session_user_id'
const ROLE_KEY = 'campus_session_role'

export function getSession() {
  return {
    userId: localStorage.getItem(USER_KEY) || 'student-1',
    role: localStorage.getItem(ROLE_KEY) || 'USER',
  }
}

export function setSession(partial) {
  if (partial.userId != null) localStorage.setItem(USER_KEY, partial.userId)
  if (partial.role != null) localStorage.setItem(ROLE_KEY, partial.role)
  window.dispatchEvent(new Event('campus-session-changed'))
}

export function getSessionHeaders() {
  const { userId, role } = getSession()
  return {
    'X-User-Id': userId,
    'X-User-Role': role,
  }
}
