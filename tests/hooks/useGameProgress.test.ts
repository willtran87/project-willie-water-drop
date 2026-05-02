import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameProgress } from '../../src/hooks/useGameProgress'

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

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useGameProgress())
    act(() => { result.current.completeLevel(11, 500, true) })
    const stored = JSON.parse(localStorage.getItem('willie-water-drop')!)
    expect(stored.progress[11].completed).toBe(true)
  })
})
