import { NavLink, Outlet } from 'react-router'

interface LayoutProps {
  onLogout: () => void
}

export function Layout({ onLogout }: LayoutProps) {
  const estiloEnlace = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal'
  })

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, borderBottom: '1px solid #e5e7eb' }}>
        <strong>Gestor de gastos</strong>
        <nav style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/" end style={estiloEnlace}>Resumen</NavLink>
          <NavLink to="/expenses" style={estiloEnlace}>Gastos</NavLink>
          <NavLink to="/categories" style={estiloEnlace}>Categorías</NavLink>
        </nav>
        <button onClick={onLogout}>Cerrar sesión</button>
      </header>
      <main style={{ padding: 12 }}>
        <Outlet />
      </main>
    </div>
  )
}