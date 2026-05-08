import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    // Audio
    this.load.audio('jump', 'assets/audio/jump.m4a')
    this.load.audio('hit', 'assets/audio/hit.m4a')
    this.load.audio('reach', 'assets/audio/reach.m4a')

    // Willie spritesheets
    this.load.spritesheet('willie', 'assets/sprites/willie-run.png', {
      frameWidth: 88, frameHeight: 94,
    })

    // Willie static images
    this.load.image('willie-idle', 'assets/sprites/willie-idle.png')
    this.load.image('willie-hurt', 'assets/sprites/willie-hurt.png')
    this.load.image('willie-cool', 'assets/sprites/willie-cool.png')
    this.load.image('willie-intro', 'assets/sprites/willie-intro.png')
    this.load.image('willie-sobbing', 'assets/sprites/willie-sobbing.png')
    this.load.image('willie-cool-and-hydrated', 'assets/sprites/cool-and-hydrated.png')
    this.load.image('willie-professor', 'assets/sprites/willie-professor.png')
    this.load.image('jet-willie-professor', 'assets/sprites/jet-willie-professor.png')

    // Obstacle images (hydrants)
    this.load.image('obsticle-1', 'assets/sprites/hydrant_small_1.png')
    this.load.image('obsticle-2', 'assets/sprites/hydrant_small_2.png')
    this.load.image('obsticle-3', 'assets/sprites/hydrant_small_3.png')
    this.load.image('obsticle-4', 'assets/sprites/hydrant_big_1.png')
    this.load.image('obsticle-5', 'assets/sprites/hydrant_big_2.png')
    this.load.image('obsticle-6', 'assets/sprites/hydrant_big_3.png')

    // Animated obstacle spritesheets
    this.load.spritesheet('water-meter', 'assets/sprites/water-meter.png', { frameWidth: 90, frameHeight: 90 })
    this.load.spritesheet('root-ball', 'assets/sprites/root-ball.png', { frameWidth: 92, frameHeight: 77 })
    this.load.spritesheet('vroom-vroom_small', 'assets/sprites/vroom-vroom_small.png', { frameWidth: 200, frameHeight: 100 })
    this.load.spritesheet('vroom-vroom_big', 'assets/sprites/vroom-vroom_big.png', { frameWidth: 400, frameHeight: 250 })
    this.load.spritesheet('jet-small', 'assets/sprites/jet-small.png', { frameWidth: 200, frameHeight: 100 })
    this.load.spritesheet('jet-big', 'assets/sprites/jet-big.png', { frameWidth: 400, frameHeight: 250 })
    this.load.spritesheet('meter-van', 'assets/sprites/meter-van.png', { frameWidth: 125, frameHeight: 80 })
    this.load.spritesheet('utility-truck', 'assets/sprites/utility-truck.png', { frameWidth: 150, frameHeight: 80 })

    // Jet-Willie spritesheet (Day 5)
    this.load.spritesheet('jet-willie', 'assets/sprites/jet-willie.png', {
      frameWidth: 400, frameHeight: 250,
    })

    // Environment
    this.load.image('ground', 'assets/environment/ground.png')
    this.load.image('cloud', 'assets/environment/cloud.png')
    this.load.image('tree', 'assets/environment/tree.png')
    this.load.image('bench', 'assets/environment/bench.png')
    this.load.image('signpost', 'assets/environment/signpost.png')
    this.load.image('traffic-cone', 'assets/environment/traffic-cone.png')
    this.load.image('water-fountain', 'assets/environment/water-fountain.png')
    this.load.image('water-tower-1', 'assets/environment/water-tower-1.png')
    this.load.image('water-tower-2', 'assets/environment/water-tower-2.png')

    // UI images
    this.load.image('game-over', 'assets/ui/game-over.png')
    this.load.image('restart', 'assets/ui/restart.png')
    this.load.image('incorrect', 'assets/ui/incorrect.png')
    this.load.image('times-up', 'assets/ui/times-up.png')
    this.load.image('congratulations', 'assets/ui/congratulations.png')
  }

  create() {
    this.anims.create({ key: 'willie-run', frames: this.anims.generateFrameNumbers('willie', { start: 2, end: 3 }), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'willie-jet', frames: this.anims.generateFrameNumbers('jet-willie', { start: 0, end: 1 }), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'floating-water-meter', frames: this.anims.generateFrameNumbers('water-meter', { start: 0, end: 3 }), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'floating-root-ball', frames: this.anims.generateFrameNumbers('root-ball', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'vroom-vroom', frames: this.anims.generateFrameNumbers('vroom-vroom_small', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'anim-vroom-big', frames: this.anims.generateFrameNumbers('vroom-vroom_big', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'anim-jet-small', frames: this.anims.generateFrameNumbers('jet-small', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'anim-jet-big', frames: this.anims.generateFrameNumbers('jet-big', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'anim-meter-van', frames: this.anims.generateFrameNumbers('meter-van', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'anim-utility-truck', frames: this.anims.generateFrameNumbers('utility-truck', { start: 0, end: 1 }), frameRate: 6, repeat: -1 })

    this.scene.start('PlayScene')
  }
}
