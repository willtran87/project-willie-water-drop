import Phaser from 'phaser'
import { PreloadScene } from './scenes/PreloadScene'
import { PlayScene } from './scenes/PlayScene'
import { pendingLevelId } from './events'
import { getLevelById } from '../data/levels'

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  // Use the pending level's background color to avoid a flash of wrong color
  const level = pendingLevelId ? getLevelById(pendingLevelId) : null
  const bgColor = level?.backgroundColor ?? '#87CEEB'

  return {
    type: Phaser.AUTO,
    width: 1000,
    height: 340,
    parent,
    pixelArt: true,
    transparent: false,
    backgroundColor: bgColor,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [PreloadScene, PlayScene],
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
  }
}
