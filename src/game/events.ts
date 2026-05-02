import Phaser from 'phaser'

export const GameEvents = {
  // Phaser -> React
  SCORE_CHANGED: 'score-changed',
  OBJECTIVE_REACHED: 'objective-reached',
  PLAYER_DIED: 'player-died',
  GAME_STARTED: 'game-started',

  // React -> Phaser
  START_LEVEL: 'start-level',
  RESTART: 'restart',
  TRIVIA_ANSWERED: 'trivia-answered',
  PAUSE: 'pause',
  RESUME: 'resume',
} as const

export const gameEventEmitter = new Phaser.Events.EventEmitter()

// Shared state for level startup — avoids race condition between
// React useEffect timing and Phaser scene create() timing.
export let pendingLevelId: number | null = null
export function setPendingLevel(id: number | null) { pendingLevelId = id }
