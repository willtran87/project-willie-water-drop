import { useScores } from '../../hooks/useScores'

interface HudOverlayProps {
  dayNumber: number
  levelInDay: number
}

export function HudOverlay({ dayNumber, levelInDay }: HudOverlayProps) {
  const { score, target, jumps } = useScores()

  const progress = target ? Math.min((score / target) * 100, 100) : 0

  return (
    <div className="w-full">
      {/* Top HUD bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-2 sm:py-3 bg-black/40 gap-2">
        <div className="text-sm text-white/60">
          DAY {dayNumber} — LEVEL {levelInDay}
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <div>
            <span className="text-[10px] sm:text-xs text-white/50 mr-1 sm:mr-2">SCORE</span>
            <span className="text-base sm:text-xl font-bold text-sky-400">
              {String(score).padStart(5, '0')}
            </span>
          </div>
          {target && (
            <div>
              <span className="text-[10px] sm:text-xs text-white/50 mr-1 sm:mr-2">TARGET</span>
              <span className="text-base sm:text-xl font-bold text-white">{target}</span>
            </div>
          )}
          <div>
            <span className="text-[10px] sm:text-xs text-white/50 mr-1 sm:mr-2">JUMPS</span>
            <span className="text-base sm:text-xl font-bold text-white">{jumps}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {target && (
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-linear-to-r from-sky-400 to-indigo-400 rounded-r transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
