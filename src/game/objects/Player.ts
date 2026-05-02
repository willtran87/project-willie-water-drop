import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpSound: Phaser.Sound.BaseSound
  private jumpCount = 0
  private doubleJumpEnabled = false
  private jumpVelocity = -1600
  private jumpsInAir = 0
  private maxAirJumps = 1

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

  configure(options: { doubleJump: boolean; jumpVelocity: number; playerType: 'willie' | 'jet-willie' }) {
    this.doubleJumpEnabled = options.doubleJump
    this.jumpVelocity = options.jumpVelocity

    if (options.playerType === 'jet-willie') {
      this.setTexture('jet-willie-idle')
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(350, 200)
      body.setOffset(25, 25)
    } else {
      this.setTexture('willie-idle')
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

  startRunning() { this.play('willie-run') }
  hurt() { this.setTexture('willie-hurt'); this.anims.stop() }
  celebrate() { this.setTexture('willie-cool'); this.anims.stop() }
  sob() { this.setTexture('willie-sobbing'); this.anims.stop() }
  getJumpCount(): number { return this.jumpCount }
  resetJumpCount() { this.jumpCount = 0; this.jumpsInAir = 0 }
}
