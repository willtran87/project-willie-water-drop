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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'willie-idle')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setGravityY(5000)
    body.setCollideWorldBounds(true)
    body.setSize(54, 88)
    body.setOffset(21, 5)

    this.setDepth(99)
    this.jumpSound = scene.sound.add('jump', { volume: 0.2 })
  }

  configure(options: { doubleJump: boolean; jumpVelocity: number; playerType: PlayerType }) {
    this.doubleJumpEnabled = options.doubleJump
    this.jumpVelocity = options.jumpVelocity
    this.currentType = options.playerType

    if (options.playerType === 'jet-willie') {
      this.setTexture('jet-willie-idle')
      // Scale down jet-willie to fit the 1000x340 canvas (original was 1200x420)
      this.setScale(0.5)
      this.setOrigin(0.5, 0.5)
      const body = this.body as Phaser.Physics.Arcade.Body
      // Body size/offset are in unscaled (400x250) coords
      body.setSize(320, 200)
      body.setOffset(40, 25)
    } else {
      this.setTexture('willie-idle')
      this.setScale(1)
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(54, 88)
      body.setOffset(21, 5)
      this.setOrigin(0.5, 0.5)
    }
  }

  jump(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (body.onFloor()) {
      this.jumpsInAir = 0
      body.setVelocityY(this.jumpVelocity)
      this.jumpSound.play()
      this.jumpCount++
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

  startRunning() {
    if (this.currentType === 'jet-willie') {
      this.play('willie-jet')
    } else {
      this.play('willie-run')
    }
  }

  hurt() {
    this.anims.stop()
    this.setTexture(this.currentType === 'jet-willie' ? 'jet-willie-hurt' : 'willie-hurt')
  }

  celebrate() {
    this.anims.stop()
    this.setTexture(this.currentType === 'jet-willie' ? 'jet-willie-cool' : 'willie-cool')
  }

  sob() {
    this.anims.stop()
    this.setTexture(this.currentType === 'jet-willie' ? 'jet-willie-hurt' : 'willie-sobbing')
  }

  getJumpCount(): number { return this.jumpCount }
  resetJumpCount() { this.jumpCount = 0; this.jumpsInAir = 0 }
}
