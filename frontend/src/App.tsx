import { useState} from 'react'
import { LoginForm } from './components/LoginForm'
import { DashboardPage } from './pages/DashboardPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { Register } from './components/Register'
import { Layout } from './components/Layout'
import { Routes, Route, Navigate, useNavigate } from 'react-router'

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [name, setName] = useState(() => localStorage.getItem('name') ?? '')

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

  return(
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <LoginForm onLogin={handleLogin} />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" replace /> : <Register onRegistered={() => navigate('/login')} />}
      />
      <Route element={token ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<DashboardPage name={name}/>} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
