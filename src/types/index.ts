export interface LevelConfig {
  id: number
  day: number
  levelInDay: number
  objective: number | null
  startSpeed: number
  speedIncrement: number
  spawnRateMultiplier: number
  obstacleTypes: string[]
  obstaclePattern: 'random' | 'grouped'
  spawnRange: [number, number]
  backgroundColor: string
  canDoubleJump: boolean
  jumpVelocity: number
  playerType: 'willie' | 'jet-willie'
  canvasSize: [number, number]
  waterTower: string
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
