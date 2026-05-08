import { useSearchParams } from 'react-router'
import { PageLayout } from '../components/layout/PageLayout'
import { LevelCard } from '../components/ui/LevelCard'
import { useGameProgress } from '../hooks/useGameProgress'
import { getLevelsByDay } from '../data/levels'

const DAYS = [1, 2, 3, 4, 5]
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const DAY_INFO: Record<number, { title: string; flavor: string; mechanics: string[]; tip: string; color: string }> = {
  1: {
    title: 'Drip Training',
    flavor: "Welcome to Water Week. Willie is a tiny water drop learning the ropes around Bloomington's pipes, hydrants, and meters.",
    mechanics: [
      'Single jump only',
      'Hydrants and water meters as obstacles',
      'Reach the score target, then answer trivia to advance',
    ],
    tip: 'Time your jumps carefully. You only get one.',
    color: 'sky',
  },
  2: {
    title: 'Double Splash',
    flavor: "Willie has been training at the water treatment plant. He can now jump twice before landing, and the trivia gets trickier.",
    mechanics: [
      'Double jump unlocked',
      'Jump again mid-air for extra height',
      'Four trivia answers',
    ],
    tip: 'Save your double jump for high water meters.',
    color: 'cyan',
  },
  3: {
    title: 'Current Affairs',
    flavor: "The current is picking up. Same double-jump moves, but the obstacle rhythm gets denser as the water flows faster.",
    mechanics: [
      'Double jump continues',
      'Tighter obstacle spacing',
      'Faster pace as your score climbs',
    ],
    tip: 'Rhythm beats reaction when obstacles stack up.',
    color: 'emerald',
  },
  4: {
    title: 'Meter Madness',
    flavor: "The water meters have gone haywire. They appear in coordinated pairs at different heights, so Willie has to thread the gap.",
    mechanics: [
      'Paired water meters at coordinated heights',
      'Double jump required for tight gaps',
      'Slower speed ramp with more precision',
    ],
    tip: 'Watch the gap between the pair.',
    color: 'amber',
  },
  5: {
    title: 'Jet-Willie',
    flavor: "Willie straps into the water jet truck for the finale. Each jump switches between foreground and background lanes.",
    mechanics: [
      'Bigger Jet-Willie sprite',
      'Jumping toggles lanes',
      'Obstacles appear in either lane',
      'Only your current lane can hurt you',
    ],
    tip: 'Jump to switch lanes, not to clear height.',
    color: 'violet',
  },
}

function DayPreview({ day }: { day: number }) {
  const isJetDay = day === 5
  const waterTower = day % 2 === 0 ? 'assets/environment/water-tower-1.png' : 'assets/environment/water-tower-2.png'

  return (
    <div className="relative min-h-[180px] overflow-hidden rounded-lg bg-[#e6edf2]">
      <img
        src={asset('assets/environment/cloud.png')}
        alt=""
        className="pixel-art absolute left-[14%] top-8 w-[92px] opacity-75"
      />
      <img
        src={asset(waterTower)}
        alt=""
        className="pixel-art absolute bottom-0 right-[-10px] z-10 w-[168px] opacity-80"
      />
      <img
        src={asset('assets/environment/tree.png')}
        alt=""
        className="pixel-art absolute bottom-2 left-4 z-20 w-[66px]"
      />
      {day === 1 && (
        <img
          src={asset('assets/environment/signpost.png')}
          alt=""
          className="pixel-art absolute bottom-0 right-[18%] z-30 w-[38px]"
        />
      )}
      <img
        src={asset(isJetDay ? 'assets/sprites/jet-willie-idle.png' : 'assets/sprites/willie-idle.png')}
        alt=""
        className={`pixel-art absolute z-30 ${isJetDay ? 'bottom-0 left-12 w-[180px]' : 'bottom-2 left-16 w-[58px]'}`}
      />
      {day === 4 ? (
        <div
          aria-hidden="true"
          className="pixel-art absolute bottom-0 right-8 z-30 h-[68px] w-[68px] bg-no-repeat"
          style={{
            backgroundImage: `url(${asset('assets/sprites/water-meter.png')})`,
            backgroundPosition: '0 0',
            backgroundSize: '400% 100%',
          }}
        />
      ) : (
        <img
          src={asset('assets/sprites/hydrant_big_2.png')}
          alt=""
          className={`pixel-art absolute bottom-2 z-30 ${isJetDay ? 'right-[34%] w-[70px]' : 'right-[30%] w-[86px]'}`}
        />
      )}
      {day === 2 && (
        <img
          src={asset('assets/environment/water-fountain.png')}
          alt=""
          className="pixel-art absolute bottom-2 right-[18%] z-20 w-[58px] opacity-85"
        />
      )}
      {day === 5 && (
        <img
          src={asset('assets/environment/traffic-cone.png')}
          alt=""
          className="pixel-art absolute bottom-0 right-[12%] z-40 w-[28px]"
        />
      )}
      <img
        src={asset('assets/environment/ground.png')}
        alt=""
        className="pixel-art absolute inset-x-0 bottom-0 z-20 h-[26px] w-full object-cover"
      />
    </div>
  )
}

export function LevelSelectPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isLevelUnlocked, getProgress } = useGameProgress()
  const requestedDay = Number(searchParams.get('day'))
  const selectedDay = DAYS.includes(requestedDay) ? requestedDay : 1

  const dayLevels = getLevelsByDay(selectedDay)
  const info = DAY_INFO[selectedDay]
  const selectDay = (day: number) => {
    setSearchParams(day === 1 ? {} : { day: String(day) })
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold">Select a Level</h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => selectDay(day)}
              className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-sky-400 text-slate-950 pixel-button'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              DAY {day}
            </button>
          ))}
        </div>

        {info && (
          <div className="pixel-panel mb-8 grid gap-5 rounded-lg p-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-2 flex items-baseline gap-3">
                <h3 className="text-xl font-bold text-sky-400">{info.title}</h3>
                <span className="text-xs uppercase text-white/30">Day {selectedDay}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/70">{info.flavor}</p>
              <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
                <div>
                  <div className="mb-2 text-xs uppercase text-white/40">What's New</div>
                  <ul className="space-y-1">
                    {info.mechanics.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-sky-400" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-white/10 sm:border-l sm:pl-4">
                  <div className="mb-2 text-xs uppercase text-white/40">Pro Tip</div>
                  <p className="text-sm italic text-yellow-300/90">{info.tip}</p>
                </div>
              </div>
            </div>
            <DayPreview day={selectedDay} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
