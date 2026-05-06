import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '../../game/config'

interface PhaserGameProps {
  className?: string
}

export function PhaserGame({ className }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const containerId = 'phaser-game-container'
    containerRef.current.id = containerId

    // Defer game creation so React StrictMode's immediate unmount/remount
    // cycle completes before Phaser starts initializing WebGL.
    const timer = setTimeout(() => {
      if (!containerRef.current) return
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
      const config = createGameConfig(containerId)
      gameRef.current = new Phaser.Game(config)
    }, 0)

    return () => {
      clearTimeout(timer)
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
