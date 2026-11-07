import { useState} from 'react'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [name, setName] = useState('')

  function handleLogin(newToken: string, name: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setName(name)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
  }


  if (!token) return <LoginForm onLogin={handleLogin}/>
  return <Dashboard token={token} name={name} onLogout={handleLogout} />
}

export default App
