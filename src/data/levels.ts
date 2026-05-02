import type { LevelConfig } from '../types'

export const levels: LevelConfig[] = [
  // Day 1
  { id: 11, day: 1, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 12, day: 1, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 13, day: 1, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 14, day: 1, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 15, day: 1, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 16, day: 1, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: true },

  // Day 2
  { id: 21, day: 2, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 22, day: 2, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 23, day: 2, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 24, day: 2, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 25, day: 2, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 26, day: 2, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: true },

  // Day 3
  { id: 31, day: 3, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 32, day: 3, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 33, day: 3, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 34, day: 3, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 35, day: 3, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 36, day: 3, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: true },

  // Day 4
  { id: 41, day: 4, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 42, day: 4, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 43, day: 4, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 44, day: 4, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 45, day: 4, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 46, day: 4, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: true },

  // Day 5
  { id: 51, day: 5, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 52, day: 5, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 53, day: 5, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 54, day: 5, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 55, day: 5, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 56, day: 5, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: true },
]

export function getLevelById(id: number): LevelConfig | undefined {
  return levels.find(l => l.id === id)
}

export function getLevelsByDay(day: number): LevelConfig[] {
  return levels.filter(l => l.day === day).sort((a, b) => a.levelInDay - b.levelInDay)
}
