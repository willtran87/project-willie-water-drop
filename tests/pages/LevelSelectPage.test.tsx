import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { LevelSelectPage } from '../../src/pages/LevelSelectPage'

describe('LevelSelectPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('selects the day from the URL query string', () => {
    render(
      <MemoryRouter initialEntries={['/levels?day=5']}>
        <LevelSelectPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Jet-Willie')).toBeInTheDocument()
    expect(screen.getByText('Day 5')).toBeInTheDocument()
  })

  it('falls back to day 1 when the query string day is invalid', () => {
    render(
      <MemoryRouter initialEntries={['/levels?day=99']}>
        <LevelSelectPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Drip Training')).toBeInTheDocument()
    expect(screen.getByText('Day 1')).toBeInTheDocument()
  })
})
