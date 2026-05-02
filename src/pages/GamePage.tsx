import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { PhaserGame } from '../components/game/PhaserGame'
import { HudOverlay } from '../components/game/HudOverlay'
import { TriviaModal } from '../components/game/TriviaModal'
import { GameOverOverlay } from '../components/game/GameOverOverlay'
import { useScores } from '../hooks/useScores'
import { useGameProgress } from '../hooks/useGameProgress'
import { gameEventEmitter, GameEvents } from '../game/events'
import { getLevelById } from '../data/levels'
import { trivia } from '../data/trivia'

export function GamePage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { isDead, objectiveReached, score, jumps, target } = useScores()
  const { completeLevel, addJumps, addDeath } = useGameProgress()

  const [showTrivia, setShowTrivia] = useState(false)

  const level = getLevelById(Number(levelId))
  const triviaQuestion = level ? trivia[level.id] : null

  // Start level once PlayScene signals it's ready
  useEffect(() => {
    if (!level) return
    const onSceneReady = () => {
      gameEventEmitter.emit(GameEvents.START_LEVEL, level.id)
    }
    gameEventEmitter.on(GameEvents.SCENE_READY, onSceneReady)
    return () => {
      gameEventEmitter.off(GameEvents.SCENE_READY, onSceneReady)
    }
  }, [level])

  // Show trivia when objective reached
  useEffect(() => {
    if (objectiveReached && triviaQuestion) {
      setShowTrivia(true)
    } else if (objectiveReached && !triviaQuestion) {
      if (level) {
        completeLevel(level.id, score, true)
      }
    }
  }, [objectiveReached, triviaQuestion, level, score, completeLevel])

  // Track deaths
  useEffect(() => {
    if (isDead) {
      addDeath()
      addJumps(jumps)
    }
  }, [isDead, addDeath, addJumps, jumps])

  const handleTriviaAnswer = useCallback((correct: boolean) => {
    if (!level) return
    gameEventEmitter.emit(GameEvents.TRIVIA_ANSWERED, correct)
    completeLevel(level.id, score, correct)
    addJumps(jumps)
    setTimeout(() => {
      setShowTrivia(false)
      if (correct) {
        navigate('/levels')
      } else {
        // Restart the level after incorrect answer
        gameEventEmitter.emit(GameEvents.RESTART)
      }
    }, 2000)
  }, [level, score, jumps, completeLevel, addJumps, navigate])

  const handleRestart = useCallback(() => {
    setShowTrivia(false)
  }, [])

  if (!level) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Level not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <HudOverlay dayNumber={level.day} levelInDay={level.levelInDay} score={score} target={target} jumps={jumps} />
      <div className="flex-1 flex items-center justify-center relative">
        <PhaserGame className="w-full max-w-[1000px]" />
        {showTrivia && triviaQuestion && (
          <TriviaModal question={triviaQuestion} onAnswer={handleTriviaAnswer} />
        )}
        {isDead && (
          <GameOverOverlay
            score={score}
            onRestart={handleRestart}
            onExit={() => navigate('/levels')}
          />
        )}
      </div>
      <div className="flex justify-between px-6 py-3 bg-black/30 text-sm text-white/50">
        <span>Press SPACE or tap to jump</span>
        <button
          onClick={() => navigate('/levels')}
          className="hover:text-white/80 transition-colors cursor-pointer"
        >
          ← Level Select
        </button>
      </div>
    </div>
  )
}
