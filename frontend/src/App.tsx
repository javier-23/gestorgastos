import { useState} from 'react'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  function handleLogin(newToken: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) return <LoginForm onLogin={handleLogin} />
  return <Dashboard token={token} onLogout={handleLogout} />
}

export default App
