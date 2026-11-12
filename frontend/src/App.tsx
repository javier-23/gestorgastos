import { useState} from 'react'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
import { Register } from './components/Register'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [name, setName] = useState(() => {
    const storedName = localStorage.getItem('name')
    return storedName ? storedName : ''
  })

  function handleLogin(newToken: string, name: string) {
    localStorage.setItem('token', newToken)
    localStorage.setItem('name', name)
    setToken(newToken)
    setName(name)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    setName('')
    setToken(null)
  }


  if (!token) return <LoginForm onLogin={handleLogin}/>
  return <Dashboard token={token} name={name} onLogout={handleLogout} />
}

export default App
