import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { GamePage } from '../../src/pages/GamePage'

const mocks = vi.hoisted(() => ({
  GameEvents: {
    START_LEVEL: 'start-level',
    RESTART: 'restart',
    TRIVIA_ANSWERED: 'trivia-answered',
  },
  emit: vi.fn(),
  setPendingLevel: vi.fn(),
  scoreState: {
    isDead: false,
    objectiveReached: false,
    score: 123,
    jumps: 4,
    target: 400,
    isRunning: true,
  },
  completeLevel: vi.fn(),
  recordLevelAttempt: vi.fn(),
  addDeath: vi.fn(),
  saveLevelAttemptSnapshot: vi.fn(),
}))

vi.mock('../../src/components/game/PhaserGame', () => ({
  PhaserGame: () => <div data-testid="phaser-game" />,
}))

vi.mock('../../src/components/game/TriviaModal', () => ({
  TriviaModal: ({ onAnswer }: { onAnswer: (correct: boolean) => void }) => (
    <div>
      <button onClick={() => onAnswer(true)}>Answer Correct</button>
      <button onClick={() => onAnswer(false)}>Answer Incorrect</button>
    </div>
  ),
}))

vi.mock('../../src/game/events', () => ({
  GameEvents: mocks.GameEvents,
  gameEventEmitter: {
    emit: mocks.emit,
  },
  setPendingLevel: mocks.setPendingLevel,
}))

vi.mock('../../src/hooks/useScores', () => ({
  useScores: () => mocks.scoreState,
}))

vi.mock('../../src/hooks/useGameProgress', () => ({
  saveLevelAttemptSnapshot: mocks.saveLevelAttemptSnapshot,
  useGameProgress: () => ({
    completeLevel: mocks.completeLevel,
    recordLevelAttempt: mocks.recordLevelAttempt,
    addDeath: mocks.addDeath,
  }),
}))

function LocationView() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}{location.search}</div>
}

function renderGame(levelId = 51) {
  return render(
    <MemoryRouter initialEntries={[`/game/${levelId}`]}>
      <Routes>
        <Route path="/game/:levelId" element={<GamePage />} />
        <Route path="/levels" element={<LocationView />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GamePage', () => {
  beforeEach(() => {
    vi.useRealTimers()
    mocks.scoreState = {
      isDead: false,
      objectiveReached: false,
      score: 123,
      jumps: 4,
      target: 400,
      isRunning: true,
    }
    mocks.completeLevel.mockClear()
    mocks.recordLevelAttempt.mockClear()
    mocks.addDeath.mockClear()
    mocks.saveLevelAttemptSnapshot.mockClear()
    mocks.emit.mockClear()
    mocks.setPendingLevel.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns to the day the player was playing from the footer exit', () => {
    renderGame(51)

    fireEvent.click(screen.getByText('← Level Select'))

    expect(mocks.recordLevelAttempt).toHaveBeenCalledWith(51, 123, 4)
    expect(screen.getByTestId('location')).toHaveTextContent('/levels?day=5')
  })

  it('returns to the level day after correct trivia', async () => {
    vi.useFakeTimers()
    mocks.scoreState = {
      isDead: false,
      objectiveReached: true,
      score: 400,
      jumps: 6,
      target: 400,
      isRunning: false,
    }

    renderGame(51)
    fireEvent.click(screen.getByText('Answer Correct'))

    expect(mocks.completeLevel).toHaveBeenCalledWith(51, 400, true, 6)

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByTestId('location')).toHaveTextContent('/levels?day=5')
  })

  it('clears the delayed trivia callback when unmounted', async () => {
    vi.useFakeTimers()
    mocks.scoreState = {
      isDead: false,
      objectiveReached: true,
      score: 400,
      jumps: 6,
      target: 400,
      isRunning: false,
    }
    const { unmount } = renderGame(51)
    fireEvent.click(screen.getByText('Answer Incorrect'))
    unmount()

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(mocks.emit).toHaveBeenCalledWith(mocks.GameEvents.TRIVIA_ANSWERED, false)
    expect(mocks.emit).not.toHaveBeenCalledWith(mocks.GameEvents.RESTART)
  })
})
