import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { saveLevelAttemptSnapshot, useGameProgress } from '../../src/hooks/useGameProgress'

describe('useGameProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty progress', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.getProgress(11)).toBeUndefined()
  })

  it('level X1 is always unlocked', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.isLevelUnlocked(11)).toBe(true)
    expect(result.current.isLevelUnlocked(21)).toBe(true)
    expect(result.current.isLevelUnlocked(31)).toBe(true)
    expect(result.current.isLevelUnlocked(41)).toBe(true)
    expect(result.current.isLevelUnlocked(51)).toBe(true)
  })

  it('bonus levels (X6) are always unlocked', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.isLevelUnlocked(16)).toBe(true)
    expect(result.current.isLevelUnlocked(26)).toBe(true)
    expect(result.current.isLevelUnlocked(36)).toBe(true)
    expect(result.current.isLevelUnlocked(46)).toBe(true)
    expect(result.current.isLevelUnlocked(56)).toBe(true)
  })

  it('level X2 is locked until X1 is completed with correct trivia', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.isLevelUnlocked(12)).toBe(false)
    act(() => { result.current.completeLevel(11, 500, true) })
    expect(result.current.isLevelUnlocked(12)).toBe(true)
  })

  it('level X2 stays locked if X1 completed without correct trivia', () => {
    const { result } = renderHook(() => useGameProgress())
    act(() => { result.current.completeLevel(11, 500, false) })
    expect(result.current.isLevelUnlocked(12)).toBe(false)
    expect(result.current.getProgress(11)?.completed).toBe(false)
  })

  it('tracks best score', () => {
    const { result } = renderHook(() => useGameProgress())
    act(() => { result.current.completeLevel(11, 500, true) })
    expect(result.current.getProgress(11)?.bestScore).toBe(500)
    act(() => { result.current.completeLevel(11, 400, true) })
    expect(result.current.getProgress(11)?.bestScore).toBe(500)
    act(() => { result.current.completeLevel(11, 600, true) })
    expect(result.current.getProgress(11)?.bestScore).toBe(600)
  })

  it('tracks best score for incomplete attempts', () => {
    const { result } = renderHook(() => useGameProgress())
    act(() => { result.current.recordLevelAttempt(11, 300, 4) })
    expect(result.current.getProgress(11)).toMatchObject({
      completed: false,
      bestScore: 300,
      triviaCorrect: false,
      attempts: 1,
    })
    expect(result.current.state.totalJumps).toBe(4)

    act(() => { result.current.recordLevelAttempt(11, 200, 2) })
    expect(result.current.getProgress(11)?.bestScore).toBe(300)
    expect(result.current.getProgress(11)?.attempts).toBe(2)
    expect(result.current.state.totalJumps).toBe(6)
    expect(result.current.isLevelUnlocked(12)).toBe(false)
  })

  it('saves an incomplete attempt snapshot without a mounted hook', () => {
    saveLevelAttemptSnapshot(11, 250, 3)
    const stored = JSON.parse(localStorage.getItem('willie-water-drop')!)

    expect(stored.progress[11]).toMatchObject({
      completed: false,
      bestScore: 250,
      triviaCorrect: false,
      attempts: 1,
    })
    expect(stored.totalJumps).toBe(3)
  })

  it('normalizes malformed saved state', () => {
    localStorage.setItem('willie-water-drop', JSON.stringify({
      progress: {
        11: { completed: true, bestScore: 'nope', triviaCorrect: false },
      },
    }))

    const { result } = renderHook(() => useGameProgress())

    expect(result.current.getProgress(11)).toMatchObject({
      completed: true,
      bestScore: 0,
      triviaCorrect: false,
      attempts: 0,
    })
    act(() => { result.current.recordLevelAttempt(11, 100, 2) })
    expect(result.current.state.totalJumps).toBe(2)
    expect(result.current.state.totalDeaths).toBe(0)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useGameProgress())
    act(() => { result.current.completeLevel(11, 500, true) })
    const stored = JSON.parse(localStorage.getItem('willie-water-drop')!)
    expect(stored.progress[11].completed).toBe(true)
  })
})
