import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '../../game/config'

interface PhaserGameProps {
  className?: string
  onReady?: () => void
}

export function PhaserGame({ className, onReady }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const containerId = 'phaser-game-container'
    containerRef.current.id = containerId

    const config = createGameConfig(containerId)
    gameRef.current = new Phaser.Game(config)
    onReady?.()

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [onReady])

  return <div ref={containerRef} className={className} />
}
