export interface LevelConfig {
  id: number
  day: number
  levelInDay: number
  objective: number | null
  startSpeed: number
  speedIncrement: number
  obstacleTypes: string[]
  spawnRange: [number, number]
  background: string
  isBonus: boolean
}

export interface TriviaQuestion {
  question: string
  options: string[]
  correctIndex: number
  timeLimit: number
}

export interface LevelProgress {
  completed: boolean
  bestScore: number
  triviaCorrect: boolean
  attempts: number
}

export interface GameState {
  progress: Record<number, LevelProgress>
  totalJumps: number
  totalDeaths: number
}
