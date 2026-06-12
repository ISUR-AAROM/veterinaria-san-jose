import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white border border-[#E8DDD0] rounded-xl p-8 max-w-md text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#B91C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8V12M12 16H12.01" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">Algo salió mal</h2>
            <p className="text-sm text-[#7A6555] mb-4">Ocurrió un error inesperado. Intenta recargar la página.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#C2570F] text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#A8480C] transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
