import Phaser from 'phaser'
import { Obstacle } from './Obstacle'
import type { LevelConfig } from '../../types'

const ANIMATED_OBSTACLES: Record<string, { animKey: string }> = {
  'water-meter': { animKey: 'floating-water-meter' },
  'root-ball': { animKey: 'floating-root-ball' },
}

const POOL_SIZE = 8

export class ObstacleSpawner {
  private pool: Obstacle[] = []
  private respawnTime = 0
  private config: LevelConfig

  constructor(
    private scene: Phaser.Scene,
    config: LevelConfig,
    public group: Phaser.Physics.Arcade.Group,
  ) {
    this.config = config

    for (let i = 0; i < POOL_SIZE; i++) {
      const obstacle = new Obstacle(scene, -100, -100, config.obstacleTypes[0])
      this.pool.push(obstacle)
      group.add(obstacle)
    }
  }

  update(gameSpeed: number, delta: number) {
    this.pool.forEach(obstacle => {
      if (!obstacle.active) return
      obstacle.moveLeft(gameSpeed)
      if (obstacle.isOffScreen()) { obstacle.recycle() }
    })

    // Delta-based spawn timer matching original:
    // respawnTime += delta * gameSpeed * spawnRateMultiplier; spawn when >= 1500
    this.respawnTime += delta * gameSpeed * this.config.spawnRateMultiplier
    if (this.respawnTime >= 1500) {
      if (this.config.obstaclePattern === 'grouped') {
        this.spawnGrouped()
      } else {
        this.spawnSingle()
      }
      this.respawnTime = 0
    }
  }

  private spawnSingle() {
    const obstacle = this.getInactive()
    if (!obstacle) return
    const typeIndex = Math.floor(Math.random() * this.config.obstacleTypes.length)
    const type = this.config.obstacleTypes[typeIndex]
    const animated = ANIMATED_OBSTACLES[type]

    const width = this.scene.scale.width
    const height = this.scene.scale.height
    const distance = Phaser.Math.Between(600, 900)

    // Obstacles spawn at canvas bottom (height), matching original
    let y = height
    if (type === 'water-meter') {
      // Original: height - enemyHeight where enemyHeight = [22, 104]
      const enemyHeight = [22, 104]
      y = height - enemyHeight[Math.floor(Math.random() * 2)]
    } else if (type === 'root-ball') {
      y -= 60
    }

    obstacle.spawn(width + distance, y, type, animated?.animKey)

    // Day 5: randomly assign obstacle to foreground or background lane
    if (this.config.playerType === 'jet-willie') {
      const isBackground = Math.random() < 0.5
      obstacle.setDepth(isBackground ? 5 : 101)
      obstacle.setAlpha(isBackground ? 0.62 : 1)
      obstacle.setData('isBackground', isBackground)
    }
  }

  private spawnGrouped() {
    // Day 4 grouped pattern: matching original exactly
    const pattern = Math.floor(Math.random() * 3)
    const heights1 = [250, 250, 50]
    const distances1 = [600, 100, 100]
    const heights2 = [0, 0, 50]
    const distances2 = [100, 600, 400]

    const obs1 = this.getInactive()
    const obs2 = this.getInactive()
    if (!obs1 || !obs2) return

    const width = this.scene.scale.width
    const height = this.scene.scale.height

    obs1.spawn(width + distances1[pattern], height - heights1[pattern], 'water-meter', 'floating-water-meter')
    obs2.spawn(width + distances2[pattern], height - heights2[pattern], 'water-meter', 'floating-water-meter')
  }

  private getInactive(): Obstacle | null {
    const inactive = this.pool.find(o => !o.active)
    if (inactive) return inactive
    const obstacle = new Obstacle(this.scene, -100, -100, this.config.obstacleTypes[0])
    this.pool.push(obstacle)
    this.group.add(obstacle)
    return obstacle
  }

  reset() {
    this.pool.forEach(o => o.recycle())
    this.respawnTime = 0
  }
}
