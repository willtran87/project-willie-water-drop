import { useState } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { LevelCard } from '../components/ui/LevelCard'
import { useGameProgress } from '../hooks/useGameProgress'
import { getLevelsByDay } from '../data/levels'

const DAYS = [1, 2, 3, 4, 5]

const DAY_INFO: Record<number, { title: string; flavor: string; mechanics: string[]; tip: string }> = {
  1: {
    title: 'Drip Training',
    flavor: "Welcome to Water Week! Willie's just a tiny water drop learning the ropes. Dodge hydrants and spinning water meters as you make your way through Bloomington's pipes!",
    mechanics: [
      'Single jump only',
      'Hydrants and water meters as obstacles',
      'Reach the score target, then answer trivia to advance',
    ],
    tip: 'Time your jumps carefully — you only get one!',
  },
  2: {
    title: 'Double Splash',
    flavor: "Willie's been hitting the gym (well, the water treatment plant). He can now jump TWICE before landing! The trivia gets trickier too — four answer choices now.",
    mechanics: [
      'Double jump unlocked!',
      'Jump again mid-air for extra height',
      'Four trivia answers (A through D)',
    ],
    tip: 'Save your double jump for water meters floating high up.',
  },
  3: {
    title: 'Current Affairs',
    flavor: "The current is picking up! Same double-jump moves, but the obstacles are getting denser. Willie needs to stay sharp as the water flows faster through Bloomington.",
    mechanics: [
      'Double jump continues',
      'Tighter obstacle spacing',
      'Faster pace as your score climbs',
    ],
    tip: "Don't panic when obstacles stack up — rhythm beats reaction.",
  },
  4: {
    title: 'Meter Madness',
    flavor: "The water meters have gone haywire! They now appear in coordinated pairs at different heights. You'll need to thread the needle between them. Double jump is your best friend here.",
    mechanics: [
      'Paired water meters at coordinated heights',
      'Double jump required for tight gaps',
      'Slower speed ramp — precision over speed',
    ],
    tip: 'Watch the gap between the pair — jump through, not over.',
  },
  5: {
    title: 'Jet-Willie',
    flavor: "Willie hops aboard a water jet truck for the grand finale! But this isn't about jumping over obstacles anymore — each jump switches Willie between the foreground and background lanes. Dodge hydrants by hopping between dimensions!",
    mechanics: [
      'Willie rides a water jet truck — bigger vehicle, bigger stakes',
      'Jumping toggles between foreground & background',
      'Obstacles appear randomly in either lane',
      'Only obstacles in YOUR lane can hurt you',
    ],
    tip: "Don't jump to dodge — jump to SWITCH LANES. Timing is everything.",
  },
}

export function LevelSelectPage() {
  const [selectedDay, setSelectedDay] = useState(1)
  const { isLevelUnlocked, getProgress } = useGameProgress()

  const dayLevels = getLevelsByDay(selectedDay)
  const info = DAY_INFO[selectedDay]

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Select a Level</h2>

        <div className="flex gap-2 mb-6 flex-wrap">
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

        {info && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="text-xl font-bold text-sky-400">{info.title}</h3>
              <span className="text-xs text-white/30 uppercase">Day {selectedDay}</span>
            </div>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">{info.flavor}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase text-white/40 mb-2">What's New</div>
                <ul className="space-y-1">
                  {info.mechanics.map((m, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">*</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:w-48 sm:border-l sm:border-white/10 sm:pl-4">
                <div className="text-xs uppercase text-white/40 mb-2">Pro Tip</div>
                <p className="text-sm text-yellow-400/80 italic">{info.tip}</p>
              </div>
            </div>
          </div>
        )}

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
