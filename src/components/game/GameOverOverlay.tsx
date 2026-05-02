import { gameEventEmitter, GameEvents } from '../../game/events'

interface GameOverOverlayProps {
  score: number
  onRestart: () => void
  onExit: () => void
}

export function GameOverOverlay({ score, onRestart, onExit }: GameOverOverlayProps) {
  const handleRestart = () => {
    gameEventEmitter.emit(GameEvents.RESTART)
    onRestart()
  }

  return (
    <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-red-400 mb-4">Game Over</h2>
        <p className="text-lg text-white/70 mb-2">
          Score: <span className="text-sky-400 font-bold">{score}</span>
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handleRestart}
            className="bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer"
          >
            TRY AGAIN
          </button>
          <button
            onClick={onExit}
            className="border-2 border-white/30 hover:border-white/60 text-white font-semibold py-3 px-8 rounded-lg transition-colors cursor-pointer"
          >
            LEVEL SELECT
          </button>
        </div>
      </div>
    </div>
  )
}
