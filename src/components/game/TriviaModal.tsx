import { useState, useEffect, useCallback } from 'react'
import type { TriviaQuestion } from '../../types'

interface TriviaModalProps {
  question: TriviaQuestion
  onAnswer: (correct: boolean) => void
}

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

  // Handle timeout
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
    const correct = index === question.correctIndex
    onAnswer(correct)
  }, [answered, question.correctIndex, onAnswer])

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return 'bg-white/[0.08] border-2 border-white/15 hover:border-sky-400/50'
    }
    if (index === question.correctIndex) {
      return 'bg-green-500/20 border-2 border-green-400'
    }
    if (index === selectedIndex && index !== question.correctIndex) {
      return 'bg-red-500/20 border-2 border-red-400'
    }
    return 'bg-white/[0.08] border-2 border-white/15 opacity-50'
  }

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center z-30">
      <div className="text-center max-w-lg px-4">
        {/* Timer */}
        <div className={`w-16 h-16 rounded-full border-3 flex items-center justify-center mx-auto mb-5 text-2xl font-bold ${
          timeLeft <= 5 ? 'border-red-400 text-red-400' : 'border-sky-400 text-white'
        }`}>
          {timeLeft}
        </div>

        <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
          Trivia Time
        </div>

        <h3 className="text-xl font-bold text-white mb-8">
          {question.question}
        </h3>

        {/* Answer grid */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`rounded-xl p-4 text-left transition-colors cursor-pointer ${getOptionStyle(i)}`}
            >
              <span className="font-bold text-white/50 mr-2">{letters[i]}</span>
              <span className="text-white">{option}</span>
            </button>
          ))}
        </div>

        {/* Feedback message */}
        {answered && (
          <div className={`mt-6 text-lg font-bold ${
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
  )
}
