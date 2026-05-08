import { Link, useLocation } from 'react-router'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function Header() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-sky-400'
        : 'text-white/60 hover:text-white/90'
    }`

  return (
    <header className="flex justify-between items-center px-5 sm:px-8 py-4 bg-slate-950/70 border-b border-sky-400/10">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-400 rounded-lg flex items-center justify-center">
          <img
            src={asset('assets/sprites/water-medallion.png')}
            alt=""
            className="pixel-art w-8 h-8"
          />
        </div>
        <span className="font-bold text-base sm:text-lg tracking-wide text-white">
          WILLIE WATER DROP
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link to="/" className={linkClass('/')}>HOME</Link>
        <Link to="/levels" className={linkClass('/levels')}>PLAY</Link>
      </nav>
    </header>
  )
}
