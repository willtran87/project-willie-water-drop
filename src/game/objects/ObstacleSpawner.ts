import Phaser from 'phaser'
import { Obstacle } from './Obstacle'
import type { LevelConfig } from '../../types'

// Water-meter floats at two random heights above ground (matching original)
const WATER_METER_HEIGHTS = [-22, -104]

const ANIMATED_OBSTACLES: Record<string, { animKey: string }> = {
  'water-meter': { animKey: 'floating-water-meter' },
  'root-ball': { animKey: 'floating-root-ball' },
}

const POOL_SIZE = 8

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

    // Scale spawn accumulation by spawnRateMultiplier (higher = more frequent)
    this.lastSpawnX += gameSpeed * (this.config.spawnRateMultiplier / 0.08)
    if (this.lastSpawnX >= this.nextSpawnDistance) {
      if (this.config.obstaclePattern === 'grouped') {
        this.spawnGrouped(cameraRight)
      } else {
        this.spawnSingle(cameraRight)
      }
      this.lastSpawnX = 0
      this.nextSpawnDistance = this.randomDistance()
    }
  }

  private spawnSingle(cameraRight: number) {
    const obstacle = this.getInactive()
    if (!obstacle) return
    const typeIndex = Math.floor(Math.random() * this.config.obstacleTypes.length)
    const type = this.config.obstacleTypes[typeIndex]
    const animated = ANIMATED_OBSTACLES[type]

    let y = this.groundY
    if (type === 'water-meter') {
      // Water-meter floats at random height above ground
      y += WATER_METER_HEIGHTS[Math.floor(Math.random() * 2)]
    } else if (type === 'root-ball') {
      y -= 60
    }

    obstacle.spawn(cameraRight + 100, y, type, animated?.animKey)
  }

  private spawnGrouped(cameraRight: number) {
    // Day 4 grouped pattern: two water-meters per spawn (matching original)
    // Original heights: [250, 250, 50] and [0, 0, 50] offset from canvas bottom
    // Original distances: [600, 100, 100] and [100, 600, 400]
    const pattern = Math.floor(Math.random() * 3)
    const heights1 = [250, 250, 50]
    const distances1 = [600, 100, 100]
    const heights2 = [0, 0, 50]
    const distances2 = [100, 600, 400]

    const obs1 = this.getInactive()
    const obs2 = this.getInactive()
    if (!obs1 || !obs2) return

    const canvasH = this.scene.scale.height
    const baseX = this.scene.scale.width

    obs1.spawn(baseX + distances1[pattern], canvasH - heights1[pattern], 'water-meter', 'floating-water-meter')
    obs2.spawn(baseX + distances2[pattern], canvasH - heights2[pattern], 'water-meter', 'floating-water-meter')
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
