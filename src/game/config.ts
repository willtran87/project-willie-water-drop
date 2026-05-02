import Phaser from 'phaser'
import { PreloadScene } from './scenes/PreloadScene'
import { PlayScene } from './scenes/PlayScene'

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: 1000,
    height: 340,
    parent,
    pixelArt: true,
    transparent: false,
    backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [PreloadScene, PlayScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }
}
