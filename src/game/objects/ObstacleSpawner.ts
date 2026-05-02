import Phaser from 'phaser'
import { Obstacle } from './Obstacle'
import type { LevelConfig } from '../../types'

const ANIMATED_OBSTACLES: Record<string, { animKey: string; yOffset: number }> = {
  'water-meter': { animKey: 'floating-water-meter', yOffset: 0 },
  'root-ball': { animKey: 'floating-root-ball', yOffset: -60 },
}

const POOL_SIZE = 5

export class ObstacleSpawner {
  private pool: Obstacle[] = []
  private lastSpawnX = 0
  private nextSpawnDistance = 0
  private config: LevelConfig

  constructor(
    private scene: Phaser.Scene,
    config: LevelConfig,
    private groundY: number,
    public group: Phaser.Physics.Arcade.Group,
  ) {
    this.config = config
    for (let i = 0; i < POOL_SIZE; i++) {
      const obstacle = new Obstacle(scene, -100, -100, config.obstacleTypes[0])
      this.pool.push(obstacle)
      group.add(obstacle)
    }
    this.nextSpawnDistance = this.randomDistance()
  }

  update(gameSpeed: number, cameraRight: number) {
    this.pool.forEach(obstacle => {
      if (!obstacle.active) return
      obstacle.moveLeft(gameSpeed)
      if (obstacle.isOffScreen()) { obstacle.recycle() }
    })

    this.lastSpawnX += gameSpeed
    if (this.lastSpawnX >= this.nextSpawnDistance) {
      this.spawn(cameraRight)
      this.lastSpawnX = 0
      this.nextSpawnDistance = this.randomDistance()
    }
  }

  private spawn(cameraRight: number) {
    const obstacle = this.getInactive()
    if (!obstacle) return
    const typeIndex = Math.floor(Math.random() * this.config.obstacleTypes.length)
    const type = this.config.obstacleTypes[typeIndex]
    const animated = ANIMATED_OBSTACLES[type]
    const y = this.groundY + (animated?.yOffset ?? 0)
    obstacle.spawn(cameraRight + 100, y, type, animated?.animKey)
  }

  private getInactive(): Obstacle | null {
    const inactive = this.pool.find(o => !o.active)
    if (inactive) return inactive
    const obstacle = new Obstacle(this.scene, -100, -100, this.config.obstacleTypes[0])
    this.pool.push(obstacle)
    this.group.add(obstacle)
    return obstacle
  }

  private randomDistance(): number {
    const [min, max] = this.config.spawnRange
    return min + Math.random() * (max - min)
  }

  reset() {
    this.pool.forEach(o => o.recycle())
    this.lastSpawnX = 0
    this.nextSpawnDistance = this.randomDistance()
  }
}
