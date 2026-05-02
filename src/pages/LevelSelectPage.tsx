import { useState } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { LevelCard } from '../components/ui/LevelCard'
import { useGameProgress } from '../hooks/useGameProgress'
import { getLevelsByDay } from '../data/levels'

const DAYS = [1, 2, 3, 4, 5]

export function LevelSelectPage() {
  const [selectedDay, setSelectedDay] = useState(1)
  const { isLevelUnlocked, getProgress } = useGameProgress()

  const dayLevels = getLevelsByDay(selectedDay)

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Select a Level</h2>

        <div className="flex gap-2 mb-8 flex-wrap">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-sky-400 text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              DAY {day}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dayLevels.map(level => (
            <LevelCard
              key={level.id}
              level={level}
              progress={getProgress(level.id)}
              unlocked={isLevelUnlocked(level.id)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
