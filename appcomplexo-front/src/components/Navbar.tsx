import { Link, useLocation } from "react-router-dom"

export default function Navbar() {

  const location = useLocation()

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg transition-all font-semibold ${
      location.pathname === path
        ? "bg-indigo-700 text-white"
        : "text-indigo-100 hover:bg-indigo-800"
    }`

  return (
    <header className="bg-indigo-900 text-white py-6 px-6 shadow-lg mb-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
          <span className="text-3xl">⚓</span>
          Sistema de Expedições
        </h1>

        <nav className="flex gap-2 text-sm">
          <Link to="/" className={linkClass("/")}>
            Expedições
          </Link>

          <Link to="/eventos" className={linkClass("/eventos")}>
            Eventos
          </Link>

          <Link to="/tripulantes" className={linkClass("/tripulantes")}>
            Tripulantes
          </Link>
        </nav>

      </div>
    </header>
  )
}