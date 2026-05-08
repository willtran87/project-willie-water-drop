import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { PhaserGame } from '../components/game/PhaserGame'
import { HudOverlay } from '../components/game/HudOverlay'
import { TriviaModal } from '../components/game/TriviaModal'
import { GameOverOverlay } from '../components/game/GameOverOverlay'
import { useScores } from '../hooks/useScores'
import { saveLevelAttemptSnapshot, useGameProgress } from '../hooks/useGameProgress'
import { gameEventEmitter, GameEvents, setPendingLevel } from '../game/events'
import { getLevelById } from '../data/levels'
import { trivia } from '../data/trivia'

export function GamePage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { isDead, objectiveReached, score, jumps, target, isRunning } = useScores()
  const { completeLevel, recordLevelAttempt, addDeath } = useGameProgress()

  const [showTrivia, setShowTrivia] = useState(false)
  const attemptRecordedRef = useRef(false)
  const triviaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestAttemptRef = useRef({
    levelId: null as number | null,
    score: 0,
    jumps: 0,
    shouldRecord: false,
  })

  const level = getLevelById(Number(levelId))
  const triviaQuestion = level ? trivia[level.id] : null
  const levelSelectUrl = level ? `/levels?day=${level.day}` : '/levels'

  useEffect(() => {
    if (!level) return
    setPendingLevel(level.id)
    gameEventEmitter.emit(GameEvents.START_LEVEL, level.id)
    return () => {
      setPendingLevel(null)
    }
  }, [level])

  useEffect(() => {
    if (isRunning) {
      attemptRecordedRef.current = false
    }
  }, [isRunning, level?.id])

  const canRecordCurrentAttempt = Boolean(level && (isRunning || objectiveReached))

  const recordCurrentAttempt = useCallback(() => {
    if (!level || attemptRecordedRef.current || !canRecordCurrentAttempt) return
    attemptRecordedRef.current = true
    latestAttemptRef.current.shouldRecord = false
    recordLevelAttempt(level.id, score, jumps)
  }, [level, canRecordCurrentAttempt, score, jumps, recordLevelAttempt])

  useEffect(() => {
    latestAttemptRef.current = {
      levelId: level?.id ?? null,
      score,
      jumps,
      shouldRecord: canRecordCurrentAttempt && !attemptRecordedRef.current,
    }
  }, [level, score, jumps, canRecordCurrentAttempt])

  useEffect(() => {
    return () => {
      if (triviaTimeoutRef.current) {
        clearTimeout(triviaTimeoutRef.current)
      }

      const { levelId, score: latestScore, jumps: latestJumps, shouldRecord } = latestAttemptRef.current
      if (levelId && shouldRecord) {
        saveLevelAttemptSnapshot(levelId, latestScore, latestJumps)
      }
    }
  }, [])

  useEffect(() => {
    if (objectiveReached && triviaQuestion) {
      setShowTrivia(true)
    } else if (objectiveReached && !triviaQuestion) {
      if (level) {
        attemptRecordedRef.current = true
        latestAttemptRef.current.shouldRecord = false
        completeLevel(level.id, score, true, jumps)
      }
    }
  }, [objectiveReached, triviaQuestion, level, score, jumps, completeLevel])

  useEffect(() => {
    if (isDead && level && !attemptRecordedRef.current) {
      attemptRecordedRef.current = true
      latestAttemptRef.current.shouldRecord = false
      recordLevelAttempt(level.id, score, jumps)
      addDeath()
    }
  }, [isDead, level, score, jumps, recordLevelAttempt, addDeath])

  const handleTriviaAnswer = useCallback((correct: boolean) => {
    if (!level) return
    gameEventEmitter.emit(GameEvents.TRIVIA_ANSWERED, correct)
    attemptRecordedRef.current = true
    latestAttemptRef.current.shouldRecord = false
    completeLevel(level.id, score, correct, jumps)

    if (triviaTimeoutRef.current) {
      clearTimeout(triviaTimeoutRef.current)
    }

    triviaTimeoutRef.current = setTimeout(() => {
      triviaTimeoutRef.current = null
      setShowTrivia(false)
      if (correct) {
        navigate(levelSelectUrl)
      } else {
        gameEventEmitter.emit(GameEvents.RESTART)
      }
    }, 2000)
  }, [level, levelSelectUrl, score, jumps, completeLevel, navigate])

  const handleRestart = useCallback(() => {
    setShowTrivia(false)
  }, [])

  const handleExitToLevels = useCallback(() => {
    recordCurrentAttempt()
    navigate(levelSelectUrl)
  }, [recordCurrentAttempt, levelSelectUrl, navigate])

  if (!level) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Level not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 scanline-field flex flex-col">
      <HudOverlay dayNumber={level.day} levelInDay={level.levelInDay} score={score} target={target} jumps={jumps} />
      <div className="flex-1 flex items-center justify-center relative">
        <PhaserGame className="w-full max-w-[1200px]" />
        {showTrivia && triviaQuestion && (
          <TriviaModal question={triviaQuestion} onAnswer={handleTriviaAnswer} />
        )}
        {isDead && (
          <GameOverOverlay
            score={score}
            onRestart={handleRestart}
            onExit={handleExitToLevels}
          />
        )}
      </div>
      <div className="flex justify-between px-6 py-3 bg-slate-950/70 border-t border-sky-400/10 text-sm text-white/50">
        <span>Press SPACE or tap to jump</span>
        <button
          onClick={handleExitToLevels}
          className="hover:text-white/80 transition-colors cursor-pointer"
        >
          &larr; Level Select
        </button>
      </div>
    </div>
  )
}
