import { describe, it, expect } from 'vitest'
import { trivia } from '../../src/data/trivia'
import { levels } from '../../src/data/levels'

describe('trivia', () => {
  it('has entries for all non-bonus levels', () => {
    const nonBonusLevels = levels.filter(l => !l.isBonus)
    nonBonusLevels.forEach(l => {
      expect(trivia[l.id]).toBeDefined()
      expect(trivia[l.id]).not.toBeNull()
    })
  })

  it('has null entries for all bonus levels', () => {
    const bonusLevels = levels.filter(l => l.isBonus)
    bonusLevels.forEach(l => {
      expect(trivia[l.id]).toBeNull()
    })
  })

  it('each question has 4 options and a valid correctIndex', () => {
    Object.values(trivia).forEach(q => {
      if (q === null) return
      expect(q.options).toHaveLength(4)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(4)
      expect(q.timeLimit).toBeGreaterThan(0)
    })
  })
})
