import { useState, useEffect, useCallback } from 'react'
import type { TriviaQuestion } from '../../types'

interface TriviaModalProps {
  question: TriviaQuestion
  onAnswer: (correct: boolean) => void
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function TriviaModal({ question, onAnswer }: TriviaModalProps) {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (answered || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [answered, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && !answered) {
      setAnswered(true)
      onAnswer(false)
    }
  }, [timeLeft, answered, onAnswer])

  const handleSelect = useCallback((index: number) => {
    if (answered) return
    setSelectedIndex(index)
    setAnswered(true)
    onAnswer(index === question.correctIndex)
  }, [answered, question.correctIndex, onAnswer])

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return 'bg-white/[0.08] border-white/15 hover:border-sky-400/60'
    }
    if (index === question.correctIndex) {
      return 'bg-green-500/20 border-green-400'
    }
    if (index === selectedIndex && index !== question.correctIndex) {
      return 'bg-red-500/20 border-red-400'
    }
    return 'bg-white/[0.08] border-white/15 opacity-50'
  }

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/92 px-4">
      <div className="pixel-panel game-overlay-enter grid w-full max-w-3xl gap-5 rounded-lg p-5 text-center sm:grid-cols-[8rem_1fr] sm:text-left">
        <div className="flex flex-row items-center justify-center gap-4 sm:flex-col">
          <div className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 text-2xl font-bold ${
            timeLeft <= 5 ? 'border-red-400 text-red-400' : 'border-sky-400 text-white'
          }`}>
            {timeLeft}
          </div>
          <img
            src={asset('assets/sprites/willie-professor.png')}
            alt=""
            className="pixel-art h-24 w-auto"
          />
        </div>

        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-sky-300/70">
            Trivia Time
          </div>
          <h3 className="mb-6 text-xl font-bold leading-snug text-white">
            {question.question}
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`min-h-16 rounded-lg border-2 p-4 text-left transition-colors cursor-pointer ${getOptionStyle(i)}`}
              >
                <span className="mr-2 font-bold text-sky-300/80">{letters[i]}</span>
                <span className="text-white">{option}</span>
              </button>
            ))}
          </div>

          {answered && (
            <div className={`mt-5 text-lg font-bold ${
              selectedIndex === question.correctIndex ? 'text-green-400' : 'text-red-400'
            }`}>
              {timeLeft === 0 && selectedIndex === null
                ? "Time's up!"
                : selectedIndex === question.correctIndex
                  ? 'Correct!'
                  : 'Incorrect!'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
