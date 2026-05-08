import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { LevelCard } from '../../src/components/ui/LevelCard'
import { levels } from '../../src/data/levels'
import type { LevelProgress } from '../../src/types'

describe('LevelCard', () => {
  it('shows a best score for an incomplete attempt', () => {
    const progress: LevelProgress = {
      completed: false,
      bestScore: 0,
      triviaCorrect: false,
      attempts: 1,
    }

    render(
      <MemoryRouter>
        <LevelCard level={levels[0]} progress={progress} unlocked />
      </MemoryRouter>,
    )

    expect(screen.getByText('Best: 0')).toBeInTheDocument()
  })

  it('shows a best score from older saved progress without attempts', () => {
    const progress = {
      completed: false,
      bestScore: 125,
      triviaCorrect: false,
    } as LevelProgress

    render(
      <MemoryRouter>
        <LevelCard level={levels[0]} progress={progress} unlocked />
      </MemoryRouter>,
    )

    expect(screen.getByText('Best: 125')).toBeInTheDocument()
  })
})
