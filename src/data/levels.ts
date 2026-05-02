import type { LevelConfig } from '../types'

// Day-specific defaults
const DAY_DEFAULTS: Record<number, Partial<LevelConfig>> = {
  1: { speedIncrement: 0.01, spawnRateMultiplier: 0.08, backgroundColor: '#DEE8F3', canDoubleJump: false, jumpVelocity: -1600, playerType: 'willie', canvasSize: [1000, 340], waterTower: 'water-tower-2', obstaclePattern: 'random' },
  2: { speedIncrement: 0.01, spawnRateMultiplier: 0.08, backgroundColor: '#EDEDED', canDoubleJump: true, jumpVelocity: -1600, playerType: 'willie', canvasSize: [1000, 340], waterTower: 'water-tower-1', obstaclePattern: 'random' },
  3: { speedIncrement: 0.01, spawnRateMultiplier: 0.08, backgroundColor: '#EDEDED', canDoubleJump: true, jumpVelocity: -1600, playerType: 'willie', canvasSize: [1000, 340], waterTower: 'water-tower-2', obstaclePattern: 'random' },
  4: { speedIncrement: 0.008, spawnRateMultiplier: 0.015, backgroundColor: '#EDEDED', canDoubleJump: true, jumpVelocity: -1600, playerType: 'willie', canvasSize: [1000, 340], waterTower: 'water-tower-1', obstaclePattern: 'grouped' },
  5: { speedIncrement: 0.005, spawnRateMultiplier: 0.02, backgroundColor: '#EDEDED', canDoubleJump: false, jumpVelocity: -1000, playerType: 'jet-willie', canvasSize: [1200, 420], waterTower: 'water-tower-2', obstaclePattern: 'random' },
}

const OBSTACLE_TYPES = ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter']

const SPAWN_RANGES: Record<number, [number, number]> = {
  1: [600, 900], 2: [550, 850], 3: [500, 800], 4: [450, 750], 5: [400, 700],
}

const OBJECTIVES = [400, 800, 1200, 1600, 2000]

function makeLevels(): LevelConfig[] {
  const result: LevelConfig[] = []
  for (let day = 1; day <= 5; day++) {
    const defaults = DAY_DEFAULTS[day]
    for (let lvl = 1; lvl <= 6; lvl++) {
      const isBonus = lvl === 6
      let objective: number | null = isBonus ? null : OBJECTIVES[lvl - 1]
      // Day 2 Level 1 has a special objective of 4000
      if (day === 2 && lvl === 1) objective = 4000
      result.push({
        id: day * 10 + lvl,
        day,
        levelInDay: lvl,
        objective,
        startSpeed: 10,
        obstacleTypes: OBSTACLE_TYPES,
        spawnRange: SPAWN_RANGES[day],
        isBonus,
        ...defaults,
      } as LevelConfig)
    }
  }
  return result
}

export const levels: LevelConfig[] = makeLevels()

export function getLevelById(id: number): LevelConfig | undefined {
  return levels.find(l => l.id === id)
}

export function getLevelsByDay(day: number): LevelConfig[] {
  return levels.filter(l => l.day === day).sort((a, b) => a.levelInDay - b.levelInDay)
}
