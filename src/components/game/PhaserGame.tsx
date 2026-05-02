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

    // Destroy any existing game before creating a new one
    if (gameRef.current) {
      gameRef.current.destroy(true)
      gameRef.current = null
    }

    const containerId = 'phaser-game-container'
    containerRef.current.id = containerId

    const config = createGameConfig(containerId)
    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
