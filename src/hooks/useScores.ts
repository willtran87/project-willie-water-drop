import { useState, useEffect, useCallback } from 'react'
import { gameEventEmitter, GameEvents } from '../game/events'

interface ScoreState {
  score: number
  target: number | null
  jumps: number
  levelId: number | null
  isRunning: boolean
  isDead: boolean
  objectiveReached: boolean
}

export function useScores() {
  const [state, setState] = useState<ScoreState>({
    score: 0,
    target: null,
    jumps: 0,
    levelId: null,
    isRunning: false,
    isDead: false,
    objectiveReached: false,
  })

  useEffect(() => {
    const onScoreChanged = (data: { score: number; target: number | null; jumps?: number }) => {
      setState(prev => ({
        ...prev,
        score: data.score,
        target: data.target,
        jumps: data.jumps ?? prev.jumps,
      }))
    }

    const onGameStarted = (data: { levelId: number }) => {
      setState({
        score: 0,
        target: null,
        jumps: 0,
        levelId: data.levelId,
        isRunning: true,
        isDead: false,
        objectiveReached: false,
      })
    }

    const onPlayerDied = (data: { score: number; jumps: number }) => {
      setState(prev => ({
        ...prev,
        score: data.score,
        jumps: data.jumps,
        isRunning: false,
        isDead: true,
      }))
    }

    const onObjectiveReached = (data: { score: number; jumps: number }) => {
      setState(prev => ({
        ...prev,
        score: data.score,
        jumps: data.jumps,
        isRunning: false,
        objectiveReached: true,
      }))
    }

    gameEventEmitter.on(GameEvents.SCORE_CHANGED, onScoreChanged)
    gameEventEmitter.on(GameEvents.GAME_STARTED, onGameStarted)
    gameEventEmitter.on(GameEvents.PLAYER_DIED, onPlayerDied)
    gameEventEmitter.on(GameEvents.OBJECTIVE_REACHED, onObjectiveReached)

    return () => {
      gameEventEmitter.off(GameEvents.SCORE_CHANGED, onScoreChanged)
      gameEventEmitter.off(GameEvents.GAME_STARTED, onGameStarted)
      gameEventEmitter.off(GameEvents.PLAYER_DIED, onPlayerDied)
      gameEventEmitter.off(GameEvents.OBJECTIVE_REACHED, onObjectiveReached)
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      score: 0, target: null, jumps: 0, levelId: null,
      isRunning: false, isDead: false, objectiveReached: false,
    })
  }, [])

  return { ...state, reset }
}
