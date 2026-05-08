import { gameEventEmitter, GameEvents } from '../../game/events'

interface GameOverOverlayProps {
  score: number
  onRestart: () => void
  onExit: () => void
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function GameOverOverlay({ score, onRestart, onExit }: GameOverOverlayProps) {
  const handleRestart = () => {
    gameEventEmitter.emit(GameEvents.RESTART)
    onRestart()
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/88 px-4">
      <div className="pixel-panel game-overlay-enter w-full max-w-xl rounded-lg p-6 text-center">
        <img
          src={asset('assets/ui/game-over.png')}
          alt="Game Over"
          className="pixel-art mx-auto mb-5 h-auto w-full max-w-[380px]"
        />
        <img
          src={asset('assets/sprites/willie-hurt.png')}
          alt=""
          className="pixel-art mx-auto mb-4 h-24 w-auto"
        />
        <p className="text-lg text-white/70">
          Score: <span className="font-bold text-sky-400">{score}</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleRestart}
            className="pixel-button rounded-lg bg-sky-400 px-8 py-3 font-bold text-slate-950 transition-colors cursor-pointer hover:bg-sky-300"
          >
            TRY AGAIN
          </button>
          <button
            onClick={onExit}
            className="rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors cursor-pointer hover:border-white/60"
          >
            LEVEL SELECT
          </button>
        </div>
      </div>
    </div>
  )
}
