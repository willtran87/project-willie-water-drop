import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpSound: Phaser.Sound.BaseSound
  private jumpCount = 0

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

  jump(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body.onFloor()) return false
    body.setVelocityY(-1600)
    this.jumpSound.play()
    this.jumpCount++
    return true
  }

  startRunning() { this.play('willie-run') }
  hurt() { this.setTexture('willie-hurt'); this.anims.stop() }
  celebrate() { this.setTexture('willie-cool'); this.anims.stop() }
  sob() { this.setTexture('willie-sobbing'); this.anims.stop() }
  getJumpCount(): number { return this.jumpCount }
  resetJumpCount() { this.jumpCount = 0 }
}
