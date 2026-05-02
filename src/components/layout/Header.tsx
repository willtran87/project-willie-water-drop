import { Link, useLocation } from 'react-router'

export function Header() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-sky-400'
        : 'text-white/60 hover:text-white/90'
    }`

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-black/20">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center text-xl">
          💧
        </div>
        <span className="font-bold text-lg tracking-wide text-white">
          WILLIE'S WATER DROP
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link to="/" className={linkClass('/')}>HOME</Link>
        <Link to="/levels" className={linkClass('/levels')}>PLAY</Link>
      </nav>
    </header>
  )
}
