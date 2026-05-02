import { useState, useCallback } from 'react'
import type { GameState, LevelProgress } from '../types'
import { levels } from '../data/levels'

const STORAGE_KEY = 'willie-water-drop'

function loadState(): GameState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { progress: {}, totalJumps: 0, totalDeaths: 0 }
}

function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useGameProgress() {
  const [state, setState] = useState<GameState>(loadState)

  const isLevelUnlocked = useCallback((levelId: number): boolean => {
    const level = levels.find(l => l.id === levelId)
    if (!level) return false
    if (level.levelInDay === 1) return true
    if (level.isBonus) return true
    const prevLevel = levels.find(
      l => l.day === level.day && l.levelInDay === level.levelInDay - 1
    )
    if (!prevLevel) return false
    const prevProgress = state.progress[prevLevel.id]
    return prevProgress?.completed === true && prevProgress?.triviaCorrect === true
  }, [state])

  const completeLevel = useCallback((levelId: number, score: number, triviaCorrect: boolean) => {
    setState(prev => {
      const existing = prev.progress[levelId]
      const newProgress: LevelProgress = {
        completed: true,
        bestScore: Math.max(score, existing?.bestScore ?? 0),
        triviaCorrect: triviaCorrect || existing?.triviaCorrect === true,
        attempts: (existing?.attempts ?? 0) + 1,
      }
      const newState: GameState = {
        ...prev,
        progress: { ...prev.progress, [levelId]: newProgress },
      }
      saveState(newState)
      return newState
    })
  }, [])

  const getProgress = useCallback((levelId: number): LevelProgress | undefined => {
    return state.progress[levelId]
  }, [state])

  const addJumps = useCallback((count: number) => {
    setState(prev => {
      const newState = { ...prev, totalJumps: prev.totalJumps + count }
      saveState(newState)
      return newState
    })
  }, [])

  const addDeath = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, totalDeaths: prev.totalDeaths + 1 }
      saveState(newState)
      return newState
    })
  }, [])

  return { isLevelUnlocked, completeLevel, getProgress, addJumps, addDeath, state }
}
