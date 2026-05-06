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
  private waterTower!: Phaser.GameObjects.Image
  private fountain!: Phaser.GameObjects.Image
  private bench!: Phaser.GameObjects.Image

  // Decorative vehicles (Days 1-4 only, matching reference)
  private vroom!: Phaser.GameObjects.Sprite
  private vroomBig!: Phaser.GameObjects.Sprite
  private jetSmall!: Phaser.GameObjects.Sprite
  private jetBig!: Phaser.GameObjects.Sprite
  private meterVan!: Phaser.GameObjects.Sprite
  private utilityTruck!: Phaser.GameObjects.Sprite
  private vroomVelocity = 0
  private vroomBigVelocity = 0
  private jetSmallVelocity = 0
  private meterVanVelocity = 0
  private utilityTruckVelocity = 0

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
      this.add.image(width / 2, 170, 'cloud').setDepth(0),
      this.add.image(width - 80, 80, 'cloud').setDepth(0),
      this.add.image(width / 1.3, 100, 'cloud').setDepth(0),
    ]

    // Water tower (slow-drifting background decoration)
    this.waterTower = this.add.image(650, height + 85, 'water-tower-2')
      .setOrigin(0, 1)
      .setDepth(1)

    // Background trees (matching reference positions)
    this.trees = [
      this.add.image(700, 335, 'tree').setOrigin(0, 1).setDepth(2),
      this.add.image(1000, 355, 'tree').setOrigin(0, 1).setDepth(1),
      this.add.image(600, 380, 'tree').setOrigin(0, 1).setDepth(1),
    ]

    // Background props (matching reference)
    this.fountain = this.add.image(1500, 330, 'water-fountain')
      .setOrigin(0, 1).setDepth(3)
    this.bench = this.add.image(1200, 330, 'bench')
      .setOrigin(0, 1).setDepth(1)

    // Decorative vehicles (animated, non-colliding, matching reference)
    this.vroom = this.add.sprite(-200, 285, 'vroom-vroom_small').setDepth(2)
    this.vroom.play('vroom-vroom')

    this.vroomBig = this.add.sprite(-200, 250, 'vroom-vroom_big').setDepth(200)
    this.vroomBig.play('anim-vroom-big')

    this.jetSmall = this.add.sprite(-500, 281, 'jet-small').setDepth(2)
    this.jetSmall.play('anim-jet-small')

    this.jetBig = this.add.sprite(-200, 245, 'jet-big').setDepth(200)
    this.jetBig.play('anim-jet-big')

    this.meterVan = this.add.sprite(-1000, 294, 'meter-van').setDepth(2)
    this.meterVan.play('anim-meter-van')

    this.utilityTruck = this.add.sprite(-3000, 294, 'utility-truck').setDepth(2)
    this.utilityTruck.play('anim-utility-truck')

    // Player — positioned at canvas bottom, gravity + collideWorldBounds settles it
    this.player = new Player(this, 50, height)

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

    // Clean up listeners on both scene shutdown AND game destroy
    this.events.on('shutdown', this.cleanupListeners, this)
    this.events.on('destroy', this.cleanupListeners, this)

    // Store obstacle group reference for spawner setup
    this.data.set('obstacleGroup', this.physics.add.group())

    // Check if React already set a level to start (avoids race condition)
    if (pendingLevelId !== null) {
      this.startLevel(pendingLevelId)
      setPendingLevel(null)
    }
  }

  private startLevel(levelId: number) {
    // Guard: ignore if game was destroyed (stale listener from React StrictMode)
    if (!this.scene || !this.game?.canvas) return

    const config = getLevelById(levelId)
    if (!config) return

    this.config = config
    this.gameSpeed = config.startSpeed
    this.score = 0
    this.isGameRunning = true
    this.isDead = false

    // Resize game to match this day's dimensions (only if changed)
    const [canvasW, canvasH] = config.canvasSize
    if (this.game.canvas.width !== canvasW || this.game.canvas.height !== canvasH) {
      this.game.canvas.width = canvasW
      this.game.canvas.height = canvasH
      const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
      if ('gl' in renderer && renderer.gl) {
        renderer.resize(canvasW, canvasH)
      }
    }
    this.cameras.main.setSize(canvasW, canvasH)
    this.physics.world.setBounds(0, 0, canvasW, canvasH)

    // Update ground for new canvas size
    this.ground.setPosition(0, canvasH)
    this.ground.width = canvasW

    // Water tower — swap texture per day and reposition for canvas height
    this.waterTower.setTexture(config.waterTower)
    this.waterTower.setPosition(650, canvasH + 85)

    // Reposition trees and background props for canvas height
    // Day 5 adds +80 to y positions (1200x420 vs 1000x340)
    const yOff = config.playerType === 'jet-willie' ? 80 : 0
    this.trees[0].setPosition(700, 335 + yOff)
    this.trees[1].setPosition(1000, 355 + yOff)
    this.trees[2].setPosition(600, 380 + yOff)
    this.fountain.setPosition(1500, 330 + yOff)
    this.bench.setPosition(1200, 330 + yOff)

    // Show/hide vehicles — Day 5 has none (reference PlayScene_51 has no vehicles)
    const showVehicles = config.playerType !== 'jet-willie'
    this.vroom.setVisible(showVehicles)
    this.vroomBig.setVisible(showVehicles)
    this.jetSmall.setVisible(showVehicles)
    this.jetBig.setVisible(showVehicles)
    this.meterVan.setVisible(showVehicles)
    this.utilityTruck.setVisible(showVehicles)

    // Reset vehicle velocities (matching reference reset on death/restart)
    this.vroomVelocity = 160
    this.vroomBigVelocity = -1600
    this.jetSmallVelocity = 250
    this.meterVanVelocity = 300
    this.utilityTruckVelocity = 400

    // Reset vehicle positions
    this.vroom.setPosition(-200, 285)
    this.vroomBig.setPosition(-200, 250)
    this.jetSmall.setPosition(-500, 281)
    this.jetBig.setPosition(-200, 245)
    this.meterVan.setPosition(-1000, 294)
    this.utilityTruck.setPosition(-3000, 294)

    // Apply per-day settings
    this.cameras.main.setBackgroundColor(config.backgroundColor)
    this.player.configure({
      doubleJump: config.canDoubleJump,
      jumpVelocity: config.jumpVelocity,
      playerType: config.playerType,
    })

    // Set up spawner
    const obstacleGroup = this.data.get('obstacleGroup') as Phaser.Physics.Arcade.Group
    this.obstacleSpawner = new ObstacleSpawner(this, config, obstacleGroup)

    // Collision — destroy previous collider to avoid accumulation on restart
    this.collider?.destroy()
    this.collider = this.physics.add.collider(
      this.player,
      obstacleGroup,
      () => this.onPlayerHit(),
      // processCallback: for Day 5, only collide if player and obstacle are in the same lane
      (_player, obstacle) => {
        if (config.playerType === 'jet-willie') {
          const playerBg = this.player.isInBackground()
          const obsBg = (obstacle as Phaser.GameObjects.GameObject).getData('isBackground') ?? false
          return playerBg === obsBg
        }
        return true
      },
    )

    // Position player at ground level
    const playerX = config.playerType === 'jet-willie' ? 150 : 50
    this.player.setPosition(playerX, canvasH)
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
      // Emit particles near player feet
      const px = this.player.x + this.player.displayWidth / 2
      const py = this.config.playerType === 'jet-willie'
        ? this.player.y + 200
        : this.player.y
      this.jumpParticles.emitParticleAt(px, py)
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
    this.player.reachObjective()
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

  update(_time: number, delta: number) {
    if (!this.isGameRunning || this.isDead) return

    const width = this.scale.width

    // Scroll ground at full gameSpeed (matching original)
    this.ground.tilePositionX += this.gameSpeed

    // Water tower — very slow drift matching original (velocityX: -0.5 px/sec)
    this.waterTower.x -= 0.5 * (delta / 1000)

    // Parallax clouds (matching original: IncX -0.5)
    this.clouds.forEach(cloud => {
      cloud.x -= 0.5
      if (cloud.getBounds().right < 0) {
        cloud.x = width + 30
      }
    })

    // Background trees (matching reference velocities: gameSpeed * 20/10/5)
    const treeMultipliers = [20, 10, 5]
    this.trees.forEach((tree, i) => {
      tree.x -= this.gameSpeed * treeMultipliers[i] * (delta / 1000)
      if (tree.getBounds().left < -400) {
        tree.x = width + (i === 0 ? 400 : 200)
      }
    })

    // Background props (matching reference velocities)
    this.fountain.x -= this.gameSpeed * 25 * (delta / 1000)
    if (this.fountain.getBounds().left < -400) {
      this.fountain.x = width + 500
    }
    this.bench.x -= this.gameSpeed * 20 * (delta / 1000)
    if (this.bench.getBounds().left < -200) {
      this.bench.x = width + 200
    }

    // Decorative vehicles (Days 1-4 only, matching reference behavior)
    if (this.vroom.visible) {
      this.updateVehicles(delta)
    }

    // Update obstacles (pass delta for timer-based spawning)
    this.obstacleSpawner.update(this.gameSpeed, delta)
  }

  private updateVehicles(delta: number) {
    const width = this.scale.width
    const dt = delta / 1000

    // vroom (small van moving right, decelerates)
    this.vroomVelocity -= 0.015
    this.vroom.x += this.vroomVelocity * dt

    // When vroom exits right, reset it and spawn vroomBig from right
    if (this.vroom.getBounds().right > width + 400) {
      this.vroom.x = -200
      this.vroomBig.x = width + 400
    }

    // vroomBig (large van zooming left, accelerates left)
    this.vroomBigVelocity -= 0.25
    this.vroomBig.x += this.vroomBigVelocity * dt

    // jetSmall (small jet moving right, decelerates)
    this.jetSmallVelocity -= 0.025
    this.jetSmall.x += this.jetSmallVelocity * dt

    // When jetSmall exits right, reset it and spawn jetBig from right
    if (this.jetSmall.getBounds().right > width + 400) {
      this.jetSmall.x = -400
      this.jetBig.x = width + 600
    }

    // jetBig (zooms left, linked to vroomBig velocity)
    this.jetBig.x += this.vroomBigVelocity * dt

    // meterVan (moves right independently, decelerates)
    this.meterVanVelocity -= 0.015
    this.meterVan.x += this.meterVanVelocity * dt
    if (this.meterVan.getBounds().right > width + 400) {
      this.meterVan.x = -1500
    }

    // utilityTruck (moves right independently, decelerates)
    this.utilityTruckVelocity -= 0.025
    this.utilityTruck.x += this.utilityTruckVelocity * dt
    if (this.utilityTruck.getBounds().right > width + 200) {
      this.utilityTruck.x = -5000
    }
  }

  private cleanupListeners() {
    gameEventEmitter.off(GameEvents.START_LEVEL, this.startLevel, this)
    gameEventEmitter.off(GameEvents.RESTART, this.restartLevel, this)
    gameEventEmitter.off(GameEvents.TRIVIA_ANSWERED, this.onTriviaAnswered, this)
    gameEventEmitter.off(GameEvents.PAUSE, this.onPause, this)
    gameEventEmitter.off(GameEvents.RESUME, this.onResume, this)
    this.scoreTimer?.remove()
  }

  private onPause() { this.scene.pause() }
  private onResume() { this.scene.resume() }
}
