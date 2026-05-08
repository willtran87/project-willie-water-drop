import { useState, useCallback } from 'react'
import type { GameState, LevelProgress } from '../types'
import { levels } from '../data/levels'

const STORAGE_KEY = 'willie-water-drop'
const EMPTY_STATE: GameState = { progress: {}, totalJumps: 0, totalDeaths: 0 }

function normalizeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeState(value: unknown): GameState {
  if (!value || typeof value !== 'object') return EMPTY_STATE

  const raw = value as Partial<GameState>
  const progress: GameState['progress'] = {}
  const rawProgress = raw.progress

  if (rawProgress && typeof rawProgress === 'object') {
    Object.entries(rawProgress).forEach(([levelId, levelProgress]) => {
      if (!levelProgress || typeof levelProgress !== 'object') return
      const entry = levelProgress as Partial<LevelProgress>
      progress[Number(levelId)] = {
        completed: entry.completed === true,
        bestScore: normalizeNumber(entry.bestScore),
        triviaCorrect: entry.triviaCorrect === true,
        attempts: normalizeNumber(entry.attempts),
      }
    })
  }

  return {
    progress,
    totalJumps: normalizeNumber(raw.totalJumps),
    totalDeaths: normalizeNumber(raw.totalDeaths),
  }
}

function loadState(): GameState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return normalizeState(JSON.parse(stored))
    } catch {
      return EMPTY_STATE
    }
  }
  return EMPTY_STATE
}

function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function withLevelAttempt(state: GameState, levelId: number, score: number, jumps = 0): GameState {
  const existing = state.progress[levelId]
  const newProgress: LevelProgress = {
    completed: existing?.completed === true,
    bestScore: Math.max(score, existing?.bestScore ?? 0),
    triviaCorrect: existing?.triviaCorrect === true,
    attempts: (existing?.attempts ?? 0) + 1,
  }

  return {
    ...state,
    totalJumps: state.totalJumps + jumps,
    progress: { ...state.progress, [levelId]: newProgress },
  }
}

export function saveLevelAttemptSnapshot(levelId: number, score: number, jumps = 0): void {
  const state = loadState()
  const newState = withLevelAttempt(state, levelId, score, jumps)
  saveState(newState)
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

  const recordLevelAttempt = useCallback((levelId: number, score: number, jumps = 0) => {
    setState(prev => {
      const newState = withLevelAttempt(prev, levelId, score, jumps)
      saveState(newState)
      return newState
    })
  }, [])

  const completeLevel = useCallback((levelId: number, score: number, triviaCorrect: boolean, jumps = 0) => {
    setState(prev => {
      const existing = prev.progress[levelId]
      const newProgress: LevelProgress = {
        completed: triviaCorrect || existing?.completed === true,
        bestScore: Math.max(score, existing?.bestScore ?? 0),
        triviaCorrect: triviaCorrect || existing?.triviaCorrect === true,
        attempts: (existing?.attempts ?? 0) + 1,
      }
      const newState: GameState = {
        ...prev,
        totalJumps: prev.totalJumps + jumps,
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

  return { isLevelUnlocked, recordLevelAttempt, completeLevel, getProgress, addJumps, addDeath, state }
}
