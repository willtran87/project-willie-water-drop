import { Link } from 'react-router'
import type { LevelConfig, LevelProgress } from '../../types'

interface LevelCardProps {
  level: LevelConfig
  progress?: LevelProgress
  unlocked: boolean
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Drip Start', 2: 'Puddle Jump', 3: 'Stream Run',
  4: 'Rapids', 5: 'Waterfall', 6: 'Free Flow',
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

function LevelIcon({ level, muted = false }: { level: LevelConfig; muted?: boolean }) {
  const icon = level.isBonus
    ? 'assets/sprites/water-medallion.png'
    : level.playerType === 'jet-willie'
      ? 'assets/sprites/jet-willie-idle.png'
      : 'assets/sprites/willie-idle.png'

  return (
    <img
      src={asset(icon)}
      alt=""
      className={`pixel-art mx-auto h-12 w-auto object-contain ${muted ? 'opacity-35 grayscale' : ''}`}
    />
  )
}

export function LevelCard({ level, progress, unlocked }: LevelCardProps) {
  const name = LEVEL_NAMES[level.levelInDay] ?? `Level ${level.levelInDay}`
  const completed = progress?.completed && progress?.triviaCorrect
  const bestScore = progress?.bestScore ?? 0
  const hasBestScore = (progress?.attempts ?? 0) > 0 || bestScore > 0 || completed

  if (!unlocked) {
    return (
      <div className="pixel-card rounded-lg border-2 border-white/10 p-5 text-center opacity-40">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
          <div className="text-xs uppercase text-white/50">Level {level.levelInDay}</div>
        </div>
        <LevelIcon level={level} muted />
        <div className="mt-3 text-xl font-bold">{name}</div>
        <div className="mt-2 text-sm text-white/50">
          {level.objective ? `Score ${level.objective} pts` : 'No objective'}
        </div>
      </div>
    )
  }

  const borderClass = level.isBonus
    ? 'border-yellow-400/40 bg-yellow-400/10'
    : completed
      ? 'border-sky-400 bg-sky-400/15'
      : 'border-white/15 bg-white/5'

  return (
    <Link
      to={`/game/${level.id}`}
      className={`pixel-card block rounded-lg border-2 p-5 text-center transition-transform hover:scale-[1.03] ${borderClass}`}
    >
      <div className={`mb-1 text-xs uppercase ${level.isBonus ? 'text-yellow-400' : 'text-white/50'}`}>
        {level.isBonus ? 'Bonus' : `Level ${level.levelInDay}`}
      </div>
      <LevelIcon level={level} />
      <div className="mt-3 text-xl font-bold">{name}</div>
      <div className="mt-2 text-sm text-white/50">
        {level.objective ? `Score ${level.objective} pts` : 'No objective'}
      </div>
      {hasBestScore && (
        <div className="mt-4 text-xs font-semibold text-green-400">
          Best: {bestScore}
        </div>
      )}
    </Link>
  )
}
