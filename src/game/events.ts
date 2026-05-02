import Phaser from 'phaser'

export const GameEvents = {
  // Phaser -> React
  SCENE_READY: 'scene-ready',
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
