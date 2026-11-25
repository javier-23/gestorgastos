import { Component } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hayError: boolean
}

// Clase porque en React solo se captura para estos componentes de clase
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    // De entrada no hay error
    state: ErrorBoundaryState = { hayError: false }

  // Se ejecuta cuando un hijo lanza una excepción al pintar, y activa hayError
  static getDerivedStateFromError() {
    return { hayError: true }
  }

  // Que hace con el error
  componentDidCatch(error: Error) {
    console.error(error)
  }

  render() {
    if (this.state.hayError) {
      return (
        <div>
          <h2>Algo ha salido mal</h2>
          <button onClick={() => window.location.reload()}>Recargar la página</button>
        </div>
      )
    }
    return this.props.children
  }
}