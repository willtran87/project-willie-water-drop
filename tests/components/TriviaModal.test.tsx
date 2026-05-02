import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TriviaModal } from '../../src/components/game/TriviaModal'

const mockQuestion = {
  question: 'What percentage of Earth\'s water is fresh?',
  options: ['Less than 1%', 'About 3%', 'About 10%', 'About 25%'],
  correctIndex: 0,
  timeLimit: 15,
}

describe('TriviaModal', () => {
  it('renders the question and all options', () => {
    render(<TriviaModal question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument()
    mockQuestion.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument()
    })
  })

  it('calls onAnswer with true when correct option clicked', () => {
    const onAnswer = vi.fn()
    render(<TriviaModal question={mockQuestion} onAnswer={onAnswer} />)
    fireEvent.click(screen.getByText('Less than 1%'))
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it('calls onAnswer with false when incorrect option clicked', () => {
    const onAnswer = vi.fn()
    render(<TriviaModal question={mockQuestion} onAnswer={onAnswer} />)
    fireEvent.click(screen.getByText('About 25%'))
    expect(onAnswer).toHaveBeenCalledWith(false)
  })
})
