import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ObstacleSpawner } from '../objects/ObstacleSpawner'
import { gameEventEmitter, GameEvents, pendingLevelId, setPendingLevel } from '../events'
import { getLevelById } from '../../data/levels'
import type { LevelConfig } from '../../types'

export class PlayScene extends Phaser.Scene {
  private player!: Player
  private obstacleSpawner!: ObstacleSpawner
  private ground!: Phaser.GameObjects.TileSprite
  private clouds: Phaser.GameObjects.Image[] = []
  private trees: Phaser.GameObjects.Image[] = []

  private config!: LevelConfig
  private gameSpeed = 0
  private score = 0
  private isGameRunning = false
  private isDead = false
  private scoreTimer?: Phaser.Time.TimerEvent
  private collider?: Phaser.Physics.Arcade.Collider

  private jumpParticles!: Phaser.GameObjects.Particles.ParticleEmitter
  private trailParticles!: Phaser.GameObjects.Particles.ParticleEmitter

  private hitSound!: Phaser.Sound.BaseSound
  private reachSound!: Phaser.Sound.BaseSound

  constructor() {
    super('PlayScene')
  }

  create() {
    const { width, height } = this.scale

    // Ground
    this.ground = this.add.tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1)
      .setDepth(10)

    // Clouds (parallax layer)
    this.clouds = [
      this.add.image(width / 2, 50, 'cloud').setDepth(0).setAlpha(0.6),
      this.add.image(width - 80, 30, 'cloud').setDepth(0).setAlpha(0.4).setScale(0.8),
      this.add.image(width / 4, 70, 'cloud').setDepth(0).setAlpha(0.5).setScale(0.6),
    ]

    // Background trees (parallax)
    this.trees = [
      this.add.image(width * 0.3, height - 70, 'tree').setDepth(1).setAlpha(0.3).setScale(0.6),
      this.add.image(width * 0.7, height - 60, 'tree').setDepth(2).setAlpha(0.5).setScale(0.8),
      this.add.image(width * 1.2, height - 65, 'tree').setDepth(1).setAlpha(0.4).setScale(0.7),
    ]

    // Player
    this.player = new Player(this, 50, height - 30)

    // Jump splash particles
    this.jumpParticles = this.add.particles(0, 0, 'willie', {
      speed: { min: 50, max: 150 },
      angle: { min: 220, max: 320 },
      scale: { start: 0.1, end: 0 },
      lifespan: 400,
      tint: 0x38bdf8,
      emitting: false,
      quantity: 6,
    })
    this.jumpParticles.setDepth(98)

    // Running trail
    this.trailParticles = this.add.particles(0, 0, 'willie', {
      speed: { min: 10, max: 30 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.05, end: 0 },
      lifespan: 300,
      tint: 0x38bdf8,
      frequency: 100,
      follow: this.player,
      followOffset: { x: -20, y: 10 },
      emitting: false,
    })
    this.trailParticles.setDepth(98)

    // Sounds
    this.hitSound = this.sound.add('hit', { volume: 0.2 })
    this.reachSound = this.sound.add('reach', { volume: 0.2 })

    // Input
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-SPACE', () => this.handleJump())
    }
    this.input.on('pointerdown', () => this.handleJump())

    // Listen for React events
    gameEventEmitter.on(GameEvents.START_LEVEL, this.startLevel, this)
    gameEventEmitter.on(GameEvents.RESTART, this.restartLevel, this)
    gameEventEmitter.on(GameEvents.TRIVIA_ANSWERED, this.onTriviaAnswered, this)
    gameEventEmitter.on(GameEvents.PAUSE, this.onPause, this)
    gameEventEmitter.on(GameEvents.RESUME, this.onResume, this)

    // Store obstacle group reference for spawner setup
    this.data.set('obstacleGroup', this.physics.add.group())

    // Check if React already set a level to start (avoids race condition)
    if (pendingLevelId !== null) {
      this.startLevel(pendingLevelId)
      setPendingLevel(null)
    }
  }

  private startLevel(levelId: number) {
    const config = getLevelById(levelId)
    if (!config) return

    this.config = config
    this.gameSpeed = config.startSpeed
    this.score = 0
    this.isGameRunning = true
    this.isDead = false

    // Apply per-day settings
    this.cameras.main.setBackgroundColor(config.backgroundColor)
    this.player.configure({
      doubleJump: config.canDoubleJump,
      jumpVelocity: config.jumpVelocity,
      playerType: config.playerType,
    })

    // Set up spawner
    const { height } = this.scale
    const obstacleGroup = this.data.get('obstacleGroup') as Phaser.Physics.Arcade.Group
    this.obstacleSpawner = new ObstacleSpawner(this, config, height - 30, obstacleGroup)

    // Collision — destroy previous collider to avoid accumulation on restart
    this.collider?.destroy()
    this.collider = this.physics.add.collider(this.player, obstacleGroup, () => this.onPlayerHit())

    // Position player at ground level
    this.player.setPosition(50, height - 30)
    this.player.startRunning()
    this.trailParticles.start()
    this.player.resetJumpCount()

    // Score timer: +1 every 100ms
    this.scoreTimer = this.time.addEvent({
      delay: 100,
      callback: this.incrementScore,
      callbackScope: this,
      loop: true,
    })

    gameEventEmitter.emit(GameEvents.GAME_STARTED, { levelId })
    gameEventEmitter.emit(GameEvents.SCORE_CHANGED, { score: 0, target: config.objective })
  }

  private restartLevel() {
    if (!this.config) return
    this.obstacleSpawner.reset()
    this.scoreTimer?.remove()
    this.physics.resume()
    this.startLevel(this.config.id)
  }

  private handleJump() {
    if (!this.isGameRunning || this.isDead) return
    const jumped = this.player.jump()
    if (jumped) {
      this.jumpParticles.emitParticleAt(this.player.x, this.player.y + 40)
    }
  }

  private incrementScore() {
    if (!this.isGameRunning || this.isDead) return

    this.score++
    this.gameSpeed = this.config.startSpeed + this.score * this.config.speedIncrement

    gameEventEmitter.emit(GameEvents.SCORE_CHANGED, {
      score: this.score,
      target: this.config.objective,
      jumps: this.player.getJumpCount(),
    })

    if (this.score % 100 === 0 && this.score > 0) {
      this.reachSound.play()
      this.cameras.main.flash(200, 56, 189, 248, true)
    }

    // Check objective
    if (this.config.objective && this.score >= this.config.objective) {
      this.onObjectiveReached()
    }
  }

  private onObjectiveReached() {
    this.isGameRunning = false
    this.scoreTimer?.remove()
    this.physics.pause()
    this.player.celebrate()
    this.trailParticles.stop()

    gameEventEmitter.emit(GameEvents.OBJECTIVE_REACHED, {
      score: this.score,
      jumps: this.player.getJumpCount(),
      levelId: this.config.id,
    })
  }

  private onPlayerHit() {
    if (this.isDead) return
    this.isDead = true
    this.isGameRunning = false
    this.scoreTimer?.remove()
    this.physics.pause()

    this.player.hurt()
    this.trailParticles.stop()
    this.hitSound.play()

    // Screen shake
    this.cameras.main.shake(200, 0.01)

    gameEventEmitter.emit(GameEvents.PLAYER_DIED, {
      score: this.score,
      jumps: this.player.getJumpCount(),
      levelId: this.config.id,
    })
  }

  private onTriviaAnswered(correct: boolean) {
    if (correct) {
      this.player.celebrate()
    } else {
      this.player.sob()
    }
  }

  update() {
    if (!this.isGameRunning || this.isDead) return

    // Scroll ground
    this.ground.tilePositionX += this.gameSpeed * 0.5

    // Parallax clouds
    this.clouds.forEach((cloud, i) => {
      cloud.x -= 0.5 + i * 0.1
      if (cloud.x + cloud.width / 2 < 0) {
        cloud.x = this.scale.width + cloud.width / 2
      }
    })

    // Parallax trees
    this.trees.forEach((tree, i) => {
      tree.x -= this.gameSpeed * (0.2 + i * 0.1)
      if (tree.x + tree.width / 2 < 0) {
        tree.x = this.scale.width + tree.width / 2 + Math.random() * 200
      }
    })

    // Update obstacles
    this.obstacleSpawner.update(this.gameSpeed, this.scale.width)
  }

  shutdown() {
    gameEventEmitter.off(GameEvents.START_LEVEL, this.startLevel, this)
    gameEventEmitter.off(GameEvents.RESTART, this.restartLevel, this)
    gameEventEmitter.off(GameEvents.TRIVIA_ANSWERED, this.onTriviaAnswered, this)
    gameEventEmitter.off(GameEvents.PAUSE, this.onPause, this)
    gameEventEmitter.off(GameEvents.RESUME, this.onResume, this)
  }

  private onPause() { this.scene.pause() }
  private onResume() { this.scene.resume() }
}
