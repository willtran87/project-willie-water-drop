import Phaser from 'phaser'

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  private animKey: string | null = null

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setImmovable(true)
    body.setAllowGravity(false)

    // Origin at bottom-left to match original
    this.setOrigin(0, 1)
    this.setDepth(50)
    this.setActive(false)
    this.setVisible(false)
  }

  spawn(x: number, y: number, texture: string, animKey?: string) {
    this.setTexture(texture)
    this.setPosition(x, y)
    this.setActive(true)
    this.setVisible(true)
    this.animKey = animKey ?? null
    if (animKey) { this.play(animKey) }

    // Reset body to match new texture dimensions before applying adjustments
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.width, this.height, false)
    body.setOffset(0, 0)

    // Tighten collision body to match original
    if (texture === 'water-meter') {
      body.setSize(body.width - 25, body.height / 1.5, false)
    } else if (texture.startsWith('obsticle')) {
      body.setSize(body.width - 10, body.height, false)
      body.setOffset(0, 5)
    }
  }

  moveLeft(speed: number) { this.x -= speed }

  isOffScreen(): boolean { return this.x < -this.width }

  recycle() {
    this.setActive(false)
    this.setVisible(false)
    this.setPosition(-100, -100)
    if (this.animKey) { this.anims.stop() }
  }
}
