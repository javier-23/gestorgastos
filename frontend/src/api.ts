const API_URL = 'http://localhost:1234'

export async function fetchApi(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token? {Authorization: `Bearer ${token}`} : {})
    }
  })

  if (res.status === 401 && path !== '/auth/login') {
    localStorage.clear()
    window.location.reload()
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(Array.isArray(data.error) ? data.error.join(', ') : data.error)
  }

  return data
}