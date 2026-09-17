const SESSION_KEY = 'airbnb-account'

export function getCurrentAccount() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export function saveCurrentAccount(account) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(account))
}

export function clearCurrentAccount() {
  localStorage.removeItem(SESSION_KEY)
}
