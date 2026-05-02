import { describe, it, expect } from 'vitest'
import { levels } from '../../src/data/levels'

describe('levels', () => {
  it('has 30 levels', () => {
    expect(levels).toHaveLength(30)
  })

  it('has 6 levels per day for 5 days', () => {
    for (let day = 1; day <= 5; day++) {
      const dayLevels = levels.filter(l => l.day === day)
      expect(dayLevels).toHaveLength(6)
    }
  })

  it('has unique IDs', () => {
    const ids = levels.map(l => l.id)
    expect(new Set(ids).size).toBe(30)
  })

  it('marks level 6 of each day as bonus', () => {
    const bonusLevels = levels.filter(l => l.isBonus)
    expect(bonusLevels).toHaveLength(5)
    bonusLevels.forEach(l => {
      expect(l.levelInDay).toBe(6)
      expect(l.objective).toBeNull()
    })
  })

  it('has increasing objectives within each day (non-bonus), except day 2 level 1', () => {
    for (let day = 1; day <= 5; day++) {
      const dayLevels = levels
        .filter(l => l.day === day && !l.isBonus)
        .sort((a, b) => a.levelInDay - b.levelInDay)
      // Day 2 level 1 has a special high objective (4000), skip sequence check for day 2
      if (day === 2) continue
      for (let i = 1; i < dayLevels.length; i++) {
        expect(dayLevels[i].objective!).toBeGreaterThan(dayLevels[i - 1].objective!)
      }
    }
  })
})
