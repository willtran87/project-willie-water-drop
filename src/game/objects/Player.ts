import Phaser from 'phaser'

type PlayerType = 'willie' | 'jet-willie'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpSound: Phaser.Sound.BaseSound
  private jumpCount = 0
  private doubleJumpEnabled = false
  private jumpVelocity = -1600
  private jumpsInAir = 0
  private maxAirJumps = 1
  private currentType: PlayerType = 'willie'
  private inBackground = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'willie-idle')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setGravityY(5000)
    body.setCollideWorldBounds(true)
    body.setSize(54, 88)
    body.setOffset(21, 5)

    this.setOrigin(0, 1)
    this.setDepth(99)
    this.jumpSound = scene.sound.add('jump', { volume: 0.2 })
  }

  configure(options: { doubleJump: boolean; jumpVelocity: number; playerType: PlayerType }) {
    this.doubleJumpEnabled = options.doubleJump
    this.jumpVelocity = options.jumpVelocity
    this.currentType = options.playerType
    this.inBackground = false

    if (options.playerType === 'jet-willie') {
      this.setTexture('jet-willie-idle')
      this.setOrigin(0, 0)
      this.setDepth(100)
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(350, 200)
      body.setOffset(0, 0)
    } else {
      this.setTexture('willie-idle')
      this.setOrigin(0, 1)
      this.setDepth(99)
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(54, 88)
      body.setOffset(21, 5)
    }
  }

  jump(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (body.onFloor()) {
      this.jumpsInAir = 0
      body.setVelocityY(this.jumpVelocity)
      this.jumpSound.play()
      this.jumpCount++

      // Day 5 jet-willie: jump toggles between foreground/background lanes
      if (this.currentType === 'jet-willie') {
        this.inBackground = !this.inBackground
        this.setDepth(this.inBackground ? 5 : 100)
      }

      return true
    }

    if (this.doubleJumpEnabled && this.jumpsInAir < this.maxAirJumps) {
      this.jumpsInAir++
      body.setVelocityY(this.jumpVelocity)
      this.jumpSound.play()
      this.jumpCount++
      return true
    }

    return false
  }

  isInBackground(): boolean { return this.inBackground }

  startRunning() {
    if (this.currentType === 'jet-willie') {
      this.play('willie-jet')
    } else {
      this.play('willie-run')
    }
  }

  hurt() {
    this.anims.stop()
    if (this.currentType === 'jet-willie') {
      this.setTexture('jet-willie-hurt')
    } else {
      this.setTexture('willie-hurt')
    }
  }

  celebrate() {
    this.anims.stop()
    if (this.currentType === 'jet-willie') {
      this.setTexture('jet-willie-cool')
    } else {
      this.setTexture('willie-cool')
    }
  }

  sob() {
    this.anims.stop()
    if (this.currentType === 'jet-willie') {
      this.setTexture('jet-willie-hurt')
    } else {
      this.setTexture('willie-sobbing')
    }
  }

  getJumpCount(): number { return this.jumpCount }
  resetJumpCount() { this.jumpCount = 0; this.jumpsInAir = 0 }
}
