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

export function LevelCard({ level, progress, unlocked }: LevelCardProps) {
  const name = LEVEL_NAMES[level.levelInDay] ?? `Level ${level.levelInDay}`
  const completed = progress?.completed && progress?.triviaCorrect

  if (!unlocked) {
    return (
      <div className="bg-white/[0.03] border-2 border-white/[0.08] rounded-xl p-5 text-center opacity-40">
        <div className="text-xs uppercase text-white/50 mb-1">Level {level.levelInDay}</div>
        <div className="text-xl font-bold mb-2">{name}</div>
        <div className="text-sm text-white/50 mb-3">
          {level.objective ? `Score ${level.objective} pts` : 'No objective'}
        </div>
        <div className="text-2xl">🔒</div>
      </div>
    )
  }

  const borderClass = level.isBonus
    ? 'border-yellow-400/30 bg-linear-to-br from-yellow-400/10 to-yellow-400/5'
    : completed
      ? 'border-sky-400 bg-sky-400/15'
      : 'border-white/15 bg-white/5'

  return (
    <Link
      to={`/game/${level.id}`}
      className={`block border-2 rounded-xl p-5 text-center hover:scale-[1.03] transition-transform ${borderClass}`}
    >
      <div className={`text-xs uppercase mb-1 ${level.isBonus ? 'text-yellow-400' : 'text-white/50'}`}>
        {level.isBonus ? 'Bonus' : `Level ${level.levelInDay}`}
      </div>
      <div className="text-xl font-bold mb-2">{name}</div>
      <div className="text-sm text-white/50 mb-3">
        {level.objective ? `Score ${level.objective} pts` : 'No objective'}
      </div>
      {completed ? (
        <div className="flex justify-between items-center">
          <div className="text-xs text-green-400">✓ Best: {progress!.bestScore}</div>
        </div>
      ) : (
        <div className="text-2xl opacity-30">
          {level.isBonus ? '🎮' : '▶'}
        </div>
      )}
    </Link>
  )
}
