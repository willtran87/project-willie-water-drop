# Willie's Water Drop Frontend Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Willie's Water Drop as a modern React + Phaser 3 SPA with data-driven levels, responsive UI, and visual polish — reusing all original game assets.

**Architecture:** React app shell (routing, UI, HUD, trivia modal, progress tracking) wraps an embedded Phaser 3 canvas. A shared EventEmitter bridges the two — Phaser emits gameplay events, React emits control events. One generic PlayScene replaces 30 duplicate scene files via level config data.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS 4, Phaser 3, React Router 7, Vitest, React Testing Library

---

## File Map

### New Files

```
src/
├── main.tsx                              # React entry point
├── App.tsx                               # Router + layout
├── types/
│   └── index.ts                          # All shared types
├── data/
│   ├── levels.ts                         # 30 level configs
│   └── trivia.ts                         # 25 trivia questions
├── game/
│   ├── events.ts                         # Phaser <-> React EventEmitter
│   ├── config.ts                         # Phaser game config factory
│   ├── scenes/
│   │   ├── PreloadScene.ts               # Asset loading
│   │   └── PlayScene.ts                  # Single data-driven game scene
│   └── objects/
│       ├── Player.ts                     # Willie sprite + physics
│       ├── Obstacle.ts                   # Single obstacle with movement
│       └── ObstacleSpawner.ts            # Pool + spawn logic
├── hooks/
│   ├── useGameProgress.ts                # localStorage progress
│   └── useScores.ts                      # Current session scores
├── components/
│   ├── layout/
│   │   ├── Header.tsx                    # Nav bar
│   │   └── PageLayout.tsx                # Shared page wrapper
│   ├── game/
│   │   ├── PhaserGame.tsx                # Mounts Phaser canvas
│   │   ├── HudOverlay.tsx                # Score, target, progress bar
│   │   ├── TriviaModal.tsx               # Trivia question overlay
│   │   └── GameOverOverlay.tsx           # Death screen overlay
│   └── ui/
│       └── LevelCard.tsx                 # Single level card for select grid
├── pages/
│   ├── HomePage.tsx                      # Landing page
│   ├── LevelSelectPage.tsx               # Day tabs + level grid
│   └── GamePage.tsx                      # Assembles game + overlays
└── styles/
    └── index.css                         # Tailwind directives + custom CSS

public/
└── assets/                               # Copied from original project
    ├── sprites/                          # Character + obstacle PNGs
    ├── environment/                      # Ground, clouds, trees, etc.
    ├── ui/                               # Game over, restart, etc.
    └── audio/                            # jump.m4a, hit.m4a, reach.m4a

tests/
├── data/
│   ├── levels.test.ts                    # Level config integrity
│   └── trivia.test.ts                    # Trivia data integrity
├── hooks/
│   └── useGameProgress.test.ts           # Progression logic
└── components/
    └── TriviaModal.test.tsx              # Trivia interaction
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/index.css`

- [ ] **Step 1: Scaffold Vite + React + TypeScript project**

```bash
cd "C:/Users/Will/Projects/project-willie-water-drop"
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" if prompted about existing files.

- [ ] **Step 2: Install dependencies**

```bash
npm install phaser react-router
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Configure Tailwind**

Replace `src/index.css` with `src/styles/index.css`:

```css
@import "tailwindcss";
```

Update `src/main.tsx` to import from the new path:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Add Tailwind plugin to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Configure Vitest**

Add to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Add `"test": "vitest"` to `package.json` scripts.

Add `/// <reference types="vitest" />` to the top of `vite.config.ts`.

- [ ] **Step 5: Create minimal App.tsx**

```tsx
function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <h1 className="text-4xl font-bold text-center pt-20 text-sky-400">
        Willie's Water Drop
      </h1>
    </div>
  )
}

export default App
```

- [ ] **Step 6: Verify dev server runs**

```bash
npm run dev
```

Open `http://localhost:5173` — should show "Willie's Water Drop" in sky-blue on dark background.

- [ ] **Step 7: Verify tests run**

Create a smoke test `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

```bash
npm test -- --run
```

Expected: 1 test passes.

- [ ] **Step 8: Clean up scaffolding files**

Delete generated files we don't need: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`. Remove the default `src/index.css` if it still exists (we use `src/styles/index.css`).

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind + Vitest project"
```

---

## Task 2: Types & Data Layer

**Files:**
- Create: `src/types/index.ts`, `src/data/levels.ts`, `src/data/trivia.ts`
- Create: `tests/data/levels.test.ts`, `tests/data/trivia.test.ts`

- [ ] **Step 1: Write failing tests for level config integrity**

Create `tests/data/levels.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { levels } from '../../src/data/levels'

describe('levels', () => {
  it('has 30 levels', () => {
    expect(levels).toHaveLength(30)
  })

  it('has 6 levels per day for 5 days', () => {
    for (let day = 1; day <= 5; day++) {
      const dayLevels = levels.filter(l => l.day === day)
      expect(dayLevels).toHaveLength(6)
    }
  })

  it('has unique IDs', () => {
    const ids = levels.map(l => l.id)
    expect(new Set(ids).size).toBe(30)
  })

  it('marks level 6 of each day as bonus', () => {
    const bonusLevels = levels.filter(l => l.isBonus)
    expect(bonusLevels).toHaveLength(5)
    bonusLevels.forEach(l => {
      expect(l.levelInDay).toBe(6)
      expect(l.objective).toBeNull()
    })
  })

  it('has increasing objectives within each day (non-bonus)', () => {
    for (let day = 1; day <= 5; day++) {
      const dayLevels = levels
        .filter(l => l.day === day && !l.isBonus)
        .sort((a, b) => a.levelInDay - b.levelInDay)
      for (let i = 1; i < dayLevels.length; i++) {
        expect(dayLevels[i].objective!).toBeGreaterThan(dayLevels[i - 1].objective!)
      }
    }
  })
})
```

- [ ] **Step 2: Write failing tests for trivia data integrity**

Create `tests/data/trivia.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { trivia } from '../../src/data/trivia'
import { levels } from '../../src/data/levels'

describe('trivia', () => {
  it('has entries for all non-bonus levels', () => {
    const nonBonusLevels = levels.filter(l => !l.isBonus)
    nonBonusLevels.forEach(l => {
      expect(trivia[l.id]).toBeDefined()
      expect(trivia[l.id]).not.toBeNull()
    })
  })

  it('has null entries for all bonus levels', () => {
    const bonusLevels = levels.filter(l => l.isBonus)
    bonusLevels.forEach(l => {
      expect(trivia[l.id]).toBeNull()
    })
  })

  it('each question has 4 options and a valid correctIndex', () => {
    Object.values(trivia).forEach(q => {
      if (q === null) return
      expect(q.options).toHaveLength(4)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(4)
      expect(q.timeLimit).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test -- --run
```

Expected: FAIL — modules not found.

- [ ] **Step 4: Create shared types**

Create `src/types/index.ts`:

```ts
export interface LevelConfig {
  id: number
  day: number
  levelInDay: number
  objective: number | null
  startSpeed: number
  speedIncrement: number
  obstacleTypes: string[]
  spawnRange: [number, number]
  background: string
  isBonus: boolean
}

export interface TriviaQuestion {
  question: string
  options: string[]
  correctIndex: number
  timeLimit: number
}

export interface LevelProgress {
  completed: boolean
  bestScore: number
  triviaCorrect: boolean
  attempts: number
}

export interface GameState {
  progress: Record<number, LevelProgress>
  totalJumps: number
  totalDeaths: number
}
```

- [ ] **Step 5: Create level configs**

Create `src/data/levels.ts`:

```ts
import type { LevelConfig } from '../types'

export const levels: LevelConfig[] = [
  // Day 1
  { id: 11, day: 1, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 12, day: 1, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 13, day: 1, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 14, day: 1, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 15, day: 1, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: false },
  { id: 16, day: 1, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [600, 900], background: 'day', isBonus: true },

  // Day 2
  { id: 21, day: 2, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 22, day: 2, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 23, day: 2, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 24, day: 2, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 25, day: 2, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: false },
  { id: 26, day: 2, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [550, 850], background: 'day', isBonus: true },

  // Day 3
  { id: 31, day: 3, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 32, day: 3, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 33, day: 3, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 34, day: 3, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 35, day: 3, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: false },
  { id: 36, day: 3, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [500, 800], background: 'day', isBonus: true },

  // Day 4
  { id: 41, day: 4, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 42, day: 4, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 43, day: 4, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 44, day: 4, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 45, day: 4, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: false },
  { id: 46, day: 4, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [450, 750], background: 'day', isBonus: true },

  // Day 5
  { id: 51, day: 5, levelInDay: 1, objective: 400, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 52, day: 5, levelInDay: 2, objective: 800, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 53, day: 5, levelInDay: 3, objective: 1200, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 54, day: 5, levelInDay: 4, objective: 1600, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 55, day: 5, levelInDay: 5, objective: 2000, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: false },
  { id: 56, day: 5, levelInDay: 6, objective: null, startSpeed: 10, speedIncrement: 0.01, obstacleTypes: ['obsticle-1', 'obsticle-2', 'obsticle-3', 'obsticle-4', 'obsticle-5', 'obsticle-6', 'water-meter'], spawnRange: [400, 700], background: 'day', isBonus: true },
]

export function getLevelById(id: number): LevelConfig | undefined {
  return levels.find(l => l.id === id)
}

export function getLevelsByDay(day: number): LevelConfig[] {
  return levels.filter(l => l.day === day).sort((a, b) => a.levelInDay - b.levelInDay)
}
```

- [ ] **Step 6: Create trivia data**

Create `src/data/trivia.ts`:

```ts
import type { TriviaQuestion } from '../types'

export const trivia: Record<number, TriviaQuestion | null> = {
  // Day 1
  11: { question: 'What percentage of Earth\'s water is fresh water available for human use?', options: ['Less than 1%', 'About 3%', 'About 10%', 'About 25%'], correctIndex: 0, timeLimit: 15 },
  12: { question: 'How many gallons of water does the average American use per day?', options: ['20 gallons', '50 gallons', '80 gallons', '150 gallons'], correctIndex: 2, timeLimit: 15 },
  13: { question: 'Which uses the most water in a typical household?', options: ['Dishwasher', 'Toilet flushing', 'Showering', 'Laundry'], correctIndex: 1, timeLimit: 15 },
  14: { question: 'How long can a person survive without water?', options: ['1 day', '3 days', '7 days', '14 days'], correctIndex: 1, timeLimit: 15 },
  15: { question: 'What is the largest source of fresh water on Earth?', options: ['Rivers', 'Lakes', 'Glaciers and ice caps', 'Underground aquifers'], correctIndex: 2, timeLimit: 15 },
  16: null,

  // Day 2
  21: { question: 'How much water does a leaky faucet waste per day?', options: ['1 gallon', '5 gallons', '10 gallons', '20 gallons'], correctIndex: 1, timeLimit: 15 },
  22: { question: 'What is the process called when water moves from the ground to the atmosphere?', options: ['Condensation', 'Precipitation', 'Evaporation', 'Filtration'], correctIndex: 2, timeLimit: 15 },
  23: { question: 'How many gallons of water does it take to produce one pound of beef?', options: ['100 gallons', '500 gallons', '1,000 gallons', '1,800 gallons'], correctIndex: 3, timeLimit: 15 },
  24: { question: 'What percentage of the human body is water?', options: ['About 30%', 'About 45%', 'About 60%', 'About 80%'], correctIndex: 2, timeLimit: 15 },
  25: { question: 'Which country has the most fresh water resources?', options: ['United States', 'China', 'Russia', 'Brazil'], correctIndex: 3, timeLimit: 15 },
  26: null,

  // Day 3
  31: { question: 'How much water can you save by turning off the tap while brushing teeth?', options: ['1 gallon', '4 gallons', '8 gallons', '12 gallons'], correctIndex: 2, timeLimit: 15 },
  32: { question: 'What is an aquifer?', options: ['A type of water filter', 'An underground layer of water-bearing rock', 'A water treatment plant', 'A type of reservoir'], correctIndex: 1, timeLimit: 15 },
  33: { question: 'How many gallons of water does a 10-minute shower use?', options: ['5 gallons', '10 gallons', '20 gallons', '40 gallons'], correctIndex: 2, timeLimit: 15 },
  34: { question: 'What is the main cause of water pollution worldwide?', options: ['Industrial waste', 'Agricultural runoff', 'Sewage', 'Oil spills'], correctIndex: 1, timeLimit: 15 },
  35: { question: 'How much of Earth\'s surface is covered by water?', options: ['About 50%', 'About 60%', 'About 71%', 'About 85%'], correctIndex: 2, timeLimit: 15 },
  36: null,

  // Day 4
  41: { question: 'What is the term for water that is safe to drink?', options: ['Distilled water', 'Potable water', 'Mineral water', 'Spring water'], correctIndex: 1, timeLimit: 15 },
  42: { question: 'How much water does it take to grow one orange?', options: ['5 gallons', '13 gallons', '25 gallons', '50 gallons'], correctIndex: 1, timeLimit: 15 },
  43: { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, timeLimit: 15 },
  44: { question: 'How often should you replace your home water filter?', options: ['Every month', 'Every 2-3 months', 'Every 6 months', 'Every year'], correctIndex: 2, timeLimit: 15 },
  45: { question: 'What is the chemical formula for water?', options: ['HO2', 'H2O', 'H2O2', 'OH'], correctIndex: 1, timeLimit: 15 },
  46: null,

  // Day 5
  51: { question: 'How many people worldwide lack access to clean drinking water?', options: ['100 million', '500 million', '1 billion', '2 billion'], correctIndex: 3, timeLimit: 15 },
  52: { question: 'What is the water cycle also known as?', options: ['Hydrological cycle', 'Aquatic cycle', 'Hydration cycle', 'Moisture cycle'], correctIndex: 0, timeLimit: 15 },
  53: { question: 'Which appliance uses the most water in the average home?', options: ['Dishwasher', 'Washing machine', 'Toilet', 'Shower'], correctIndex: 2, timeLimit: 15 },
  54: { question: 'How much water does a running garden hose use per minute?', options: ['1 gallon', '2 gallons', '4 gallons', '6 gallons'], correctIndex: 1, timeLimit: 15 },
  55: { question: 'What is the deepest point in the ocean?', options: ['Mariana Trench', 'Puerto Rico Trench', 'Java Trench', 'Tonga Trench'], correctIndex: 0, timeLimit: 15 },
  56: null,
}
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npm test -- --run
```

Expected: All tests pass (levels integrity + trivia integrity).

- [ ] **Step 8: Commit**

```bash
git add src/types/ src/data/ tests/data/
git commit -m "feat: add types, level configs, and trivia data with tests"
```

---

## Task 3: Event Bridge

**Files:**
- Create: `src/game/events.ts`

- [ ] **Step 1: Create the Phaser <-> React event emitter**

Create `src/game/events.ts`:

```ts
import { EventEmitter } from 'phaser'

export const GameEvents = {
  // Phaser -> React
  SCORE_CHANGED: 'score-changed',
  OBJECTIVE_REACHED: 'objective-reached',
  PLAYER_DIED: 'player-died',
  GAME_STARTED: 'game-started',

  // React -> Phaser
  START_LEVEL: 'start-level',
  RESTART: 'restart',
  TRIVIA_ANSWERED: 'trivia-answered',
  PAUSE: 'pause',
  RESUME: 'resume',
} as const

export const gameEventEmitter = new EventEmitter()
```

- [ ] **Step 2: Commit**

```bash
git add src/game/events.ts
git commit -m "feat: add Phaser <-> React event bridge"
```

---

## Task 4: Game Progress Hook

**Files:**
- Create: `src/hooks/useGameProgress.ts`
- Create: `tests/hooks/useGameProgress.test.ts`

- [ ] **Step 1: Write failing tests for progression logic**

Create `tests/hooks/useGameProgress.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameProgress } from '../../src/hooks/useGameProgress'

describe('useGameProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty progress', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.getProgress(11)).toBeUndefined()
  })

  it('level X1 is always unlocked', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.isLevelUnlocked(11)).toBe(true)
    expect(result.current.isLevelUnlocked(21)).toBe(true)
    expect(result.current.isLevelUnlocked(31)).toBe(true)
    expect(result.current.isLevelUnlocked(41)).toBe(true)
    expect(result.current.isLevelUnlocked(51)).toBe(true)
  })

  it('bonus levels (X6) are always unlocked', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.isLevelUnlocked(16)).toBe(true)
    expect(result.current.isLevelUnlocked(26)).toBe(true)
    expect(result.current.isLevelUnlocked(36)).toBe(true)
    expect(result.current.isLevelUnlocked(46)).toBe(true)
    expect(result.current.isLevelUnlocked(56)).toBe(true)
  })

  it('level X2 is locked until X1 is completed with correct trivia', () => {
    const { result } = renderHook(() => useGameProgress())
    expect(result.current.isLevelUnlocked(12)).toBe(false)

    act(() => {
      result.current.completeLevel(11, 500, true)
    })

    expect(result.current.isLevelUnlocked(12)).toBe(true)
  })

  it('level X2 stays locked if X1 completed without correct trivia', () => {
    const { result } = renderHook(() => useGameProgress())

    act(() => {
      result.current.completeLevel(11, 500, false)
    })

    expect(result.current.isLevelUnlocked(12)).toBe(false)
  })

  it('tracks best score', () => {
    const { result } = renderHook(() => useGameProgress())

    act(() => {
      result.current.completeLevel(11, 500, true)
    })
    expect(result.current.getProgress(11)?.bestScore).toBe(500)

    act(() => {
      result.current.completeLevel(11, 400, true)
    })
    expect(result.current.getProgress(11)?.bestScore).toBe(500)

    act(() => {
      result.current.completeLevel(11, 600, true)
    })
    expect(result.current.getProgress(11)?.bestScore).toBe(600)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useGameProgress())

    act(() => {
      result.current.completeLevel(11, 500, true)
    })

    const stored = JSON.parse(localStorage.getItem('willie-water-drop')!)
    expect(stored.progress[11].completed).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run tests/hooks/useGameProgress.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement useGameProgress**

Create `src/hooks/useGameProgress.ts`:

```ts
import { useState, useCallback } from 'react'
import type { GameState, LevelProgress } from '../types'
import { levels } from '../data/levels'

const STORAGE_KEY = 'willie-water-drop'

function loadState(): GameState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { progress: {}, totalJumps: 0, totalDeaths: 0 }
}

function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useGameProgress() {
  const [state, setState] = useState<GameState>(loadState)

  const isLevelUnlocked = useCallback((levelId: number): boolean => {
    const level = levels.find(l => l.id === levelId)
    if (!level) return false

    // X1 levels are always unlocked
    if (level.levelInDay === 1) return true

    // Bonus levels (X6) are always unlocked
    if (level.isBonus) return true

    // X2-X5: previous level in same day must be completed with correct trivia
    const prevLevel = levels.find(
      l => l.day === level.day && l.levelInDay === level.levelInDay - 1
    )
    if (!prevLevel) return false

    const prevProgress = state.progress[prevLevel.id]
    return prevProgress?.completed === true && prevProgress?.triviaCorrect === true
  }, [state])

  const completeLevel = useCallback((levelId: number, score: number, triviaCorrect: boolean) => {
    setState(prev => {
      const existing = prev.progress[levelId]
      const newProgress: LevelProgress = {
        completed: true,
        bestScore: Math.max(score, existing?.bestScore ?? 0),
        triviaCorrect: triviaCorrect || existing?.triviaCorrect === true,
        attempts: (existing?.attempts ?? 0) + 1,
      }
      const newState: GameState = {
        ...prev,
        progress: { ...prev.progress, [levelId]: newProgress },
      }
      saveState(newState)
      return newState
    })
  }, [])

  const getProgress = useCallback((levelId: number): LevelProgress | undefined => {
    return state.progress[levelId]
  }, [state])

  const addJumps = useCallback((count: number) => {
    setState(prev => {
      const newState = { ...prev, totalJumps: prev.totalJumps + count }
      saveState(newState)
      return newState
    })
  }, [])

  const addDeath = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, totalDeaths: prev.totalDeaths + 1 }
      saveState(newState)
      return newState
    })
  }, [])

  return { isLevelUnlocked, completeLevel, getProgress, addJumps, addDeath, state }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --run tests/hooks/useGameProgress.test.ts
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useGameProgress.ts tests/hooks/
git commit -m "feat: add useGameProgress hook with localStorage persistence and tests"
```

---

## Task 5: Asset Migration

**Files:**
- Create: `public/assets/sprites/`, `public/assets/environment/`, `public/assets/ui/`, `public/assets/audio/`

- [ ] **Step 1: Create asset directories**

```bash
mkdir -p public/assets/sprites public/assets/environment public/assets/ui public/assets/audio
```

- [ ] **Step 2: Copy sprite assets**

```bash
cp "D:/work/code/willie-water-drop/public/assets/willie-run.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/willie-idle.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/willie-hurt.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/willie-cool.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/willie-intro.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/willie-sobbing.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/cool-and-hydrated.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/willie-professor.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/hydrant_small_1.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/hydrant_small_2.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/hydrant_small_3.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/hydrant_big_1.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/hydrant_big_2.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/hydrant_big_3.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/vroom-vroom_small.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/vroom-vroom_big.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-small.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-big.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-willie.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-willie-idle.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-willie-hurt.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-willie-cool.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/jet-willie-professor.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/meter-van.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/utility-truck.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/water-meter.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/root-ball.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/water-medallion.png" public/assets/sprites/
cp "D:/work/code/willie-water-drop/public/assets/roaring-willie.png" public/assets/sprites/
```

- [ ] **Step 3: Copy environment assets**

```bash
cp "D:/work/code/willie-water-drop/public/assets/ground.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/cloud.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/tree.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/bench.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/water-fountain.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/water-tower-1.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/water-tower-2.png" public/assets/environment/
cp "D:/work/code/willie-water-drop/public/assets/water-plant.png" public/assets/environment/
```

- [ ] **Step 4: Copy UI and audio assets**

```bash
cp "D:/work/code/willie-water-drop/public/assets/game-over.png" public/assets/ui/
cp "D:/work/code/willie-water-drop/public/assets/restart.png" public/assets/ui/
cp "D:/work/code/willie-water-drop/public/assets/incorrect.png" public/assets/ui/
cp "D:/work/code/willie-water-drop/public/assets/times-up.png" public/assets/ui/
cp "D:/work/code/willie-water-drop/public/assets/congratulations.png" public/assets/ui/

cp "D:/work/code/willie-water-drop/public/assets/jump.m4a" public/assets/audio/
cp "D:/work/code/willie-water-drop/public/assets/hit.m4a" public/assets/audio/
cp "D:/work/code/willie-water-drop/public/assets/reach.m4a" public/assets/audio/
```

- [ ] **Step 5: Verify all assets are present**

```bash
find public/assets -type f | wc -l
```

Expected: 41 files (30 sprites + 8 environment + 5 UI + 3 audio — excludes XCF source files and duplicate willie-run variants).

- [ ] **Step 6: Commit**

```bash
git add public/assets/
git commit -m "feat: migrate game assets from original project"
```

---

## Task 6: PreloadScene

**Files:**
- Create: `src/game/scenes/PreloadScene.ts`

- [ ] **Step 1: Create PreloadScene**

Create `src/game/scenes/PreloadScene.ts`:

```ts
import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    // Audio
    this.load.audio('jump', 'assets/audio/jump.m4a')
    this.load.audio('hit', 'assets/audio/hit.m4a')
    this.load.audio('reach', 'assets/audio/reach.m4a')

    // Willie spritesheets
    this.load.spritesheet('willie', 'assets/sprites/willie-run.png', {
      frameWidth: 88,
      frameHeight: 94,
    })

    // Willie static images
    this.load.image('willie-idle', 'assets/sprites/willie-idle.png')
    this.load.image('willie-hurt', 'assets/sprites/willie-hurt.png')
    this.load.image('willie-cool', 'assets/sprites/willie-cool.png')
    this.load.image('willie-intro', 'assets/sprites/willie-intro.png')
    this.load.image('willie-sobbing', 'assets/sprites/willie-sobbing.png')
    this.load.image('willie-cool-and-hydrated', 'assets/sprites/cool-and-hydrated.png')
    this.load.image('willie-professor', 'assets/sprites/willie-professor.png')

    // Obstacle images (hydrants)
    this.load.image('obsticle-1', 'assets/sprites/hydrant_small_1.png')
    this.load.image('obsticle-2', 'assets/sprites/hydrant_small_2.png')
    this.load.image('obsticle-3', 'assets/sprites/hydrant_small_3.png')
    this.load.image('obsticle-4', 'assets/sprites/hydrant_big_1.png')
    this.load.image('obsticle-5', 'assets/sprites/hydrant_big_2.png')
    this.load.image('obsticle-6', 'assets/sprites/hydrant_big_3.png')

    // Animated obstacle spritesheets
    this.load.spritesheet('water-meter', 'assets/sprites/water-meter.png', {
      frameWidth: 90,
      frameHeight: 90,
    })
    this.load.spritesheet('root-ball', 'assets/sprites/root-ball.png', {
      frameWidth: 92,
      frameHeight: 77,
    })
    this.load.spritesheet('vroom-vroom_small', 'assets/sprites/vroom-vroom_small.png', {
      frameWidth: 200,
      frameHeight: 100,
    })
    this.load.spritesheet('vroom-vroom_big', 'assets/sprites/vroom-vroom_big.png', {
      frameWidth: 400,
      frameHeight: 250,
    })
    this.load.spritesheet('jet-small', 'assets/sprites/jet-small.png', {
      frameWidth: 200,
      frameHeight: 100,
    })
    this.load.spritesheet('jet-big', 'assets/sprites/jet-big.png', {
      frameWidth: 400,
      frameHeight: 250,
    })
    this.load.spritesheet('meter-van', 'assets/sprites/meter-van.png', {
      frameWidth: 125,
      frameHeight: 80,
    })
    this.load.spritesheet('utility-truck', 'assets/sprites/utility-truck.png', {
      frameWidth: 150,
      frameHeight: 80,
    })

    // Environment
    this.load.image('ground', 'assets/environment/ground.png')
    this.load.image('cloud', 'assets/environment/cloud.png')
    this.load.image('tree', 'assets/environment/tree.png')
    this.load.image('bench', 'assets/environment/bench.png')
    this.load.image('water-fountain', 'assets/environment/water-fountain.png')
    this.load.image('water-tower-1', 'assets/environment/water-tower-1.png')
    this.load.image('water-tower-2', 'assets/environment/water-tower-2.png')

    // UI images
    this.load.image('game-over', 'assets/ui/game-over.png')
    this.load.image('restart', 'assets/ui/restart.png')
    this.load.image('incorrect', 'assets/ui/incorrect.png')
    this.load.image('times-up', 'assets/ui/times-up.png')
    this.load.image('congratulations', 'assets/ui/congratulations.png')
  }

  create() {
    // Create animations
    this.anims.create({
      key: 'willie-run',
      frames: this.anims.generateFrameNumbers('willie', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'floating-water-meter',
      frames: this.anims.generateFrameNumbers('water-meter', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'floating-root-ball',
      frames: this.anims.generateFrameNumbers('root-ball', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'vroom-vroom',
      frames: this.anims.generateFrameNumbers('vroom-vroom_small', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'anim-vroom-big',
      frames: this.anims.generateFrameNumbers('vroom-vroom_big', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'anim-jet-small',
      frames: this.anims.generateFrameNumbers('jet-small', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'anim-jet-big',
      frames: this.anims.generateFrameNumbers('jet-big', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'anim-meter-van',
      frames: this.anims.generateFrameNumbers('meter-van', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'anim-utility-truck',
      frames: this.anims.generateFrameNumbers('utility-truck', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    })

    this.scene.start('PlayScene')
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/game/scenes/PreloadScene.ts
git commit -m "feat: add PreloadScene with all asset loading and animations"
```

---

## Task 7: Player Object

**Files:**
- Create: `src/game/objects/Player.ts`

- [ ] **Step 1: Create Player class**

Create `src/game/objects/Player.ts`:

```ts
import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpSound: Phaser.Sound.BaseSound
  private jumpCount = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'willie-idle')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setGravityY(5000)
    body.setCollideWorldBounds(true)
    body.setSize(54, 88)
    body.setOffset(21, 5)

    this.setDepth(99)
    this.jumpSound = scene.sound.add('jump', { volume: 0.2 })
  }

  jump(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body.onFloor()) return false

    body.setVelocityY(-1600)
    this.jumpSound.play()
    this.jumpCount++
    return true
  }

  startRunning() {
    this.play('willie-run')
  }

  hurt() {
    this.setTexture('willie-hurt')
    this.anims.stop()
  }

  celebrate() {
    this.setTexture('willie-cool')
    this.anims.stop()
  }

  sob() {
    this.setTexture('willie-sobbing')
    this.anims.stop()
  }

  getJumpCount(): number {
    return this.jumpCount
  }

  resetJumpCount() {
    this.jumpCount = 0
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/game/objects/Player.ts
git commit -m "feat: add Player class with physics, jump, and state changes"
```

---

## Task 8: Obstacle System

**Files:**
- Create: `src/game/objects/Obstacle.ts`, `src/game/objects/ObstacleSpawner.ts`

- [ ] **Step 1: Create Obstacle class**

Create `src/game/objects/Obstacle.ts`:

```ts
import Phaser from 'phaser'

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  private animKey: string | null = null

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setImmovable(true)
    body.setAllowGravity(false)

    this.setDepth(50)
    this.setActive(false)
    this.setVisible(false)
  }

  spawn(x: number, y: number, texture: string, animKey?: string) {
    this.setTexture(texture)
    this.setPosition(x, y)
    this.setActive(true)
    this.setVisible(true)
    this.animKey = animKey ?? null

    if (animKey) {
      this.play(animKey)
    }
  }

  moveLeft(speed: number) {
    this.x -= speed
  }

  isOffScreen(): boolean {
    return this.x < -this.width
  }

  recycle() {
    this.setActive(false)
    this.setVisible(false)
    this.setPosition(-100, -100)
    if (this.animKey) {
      this.anims.stop()
    }
  }
}
```

- [ ] **Step 2: Create ObstacleSpawner**

Create `src/game/objects/ObstacleSpawner.ts`:

```ts
import Phaser from 'phaser'
import { Obstacle } from './Obstacle'
import type { LevelConfig } from '../../types'

const ANIMATED_OBSTACLES: Record<string, { animKey: string; yOffset: number }> = {
  'water-meter': { animKey: 'floating-water-meter', yOffset: 0 },
  'root-ball': { animKey: 'floating-root-ball', yOffset: -60 },
}

const POOL_SIZE = 5

export class ObstacleSpawner {
  private pool: Obstacle[] = []
  private lastSpawnX = 0
  private nextSpawnDistance = 0
  private config: LevelConfig

  constructor(
    private scene: Phaser.Scene,
    config: LevelConfig,
    private groundY: number,
    public group: Phaser.Physics.Arcade.Group,
  ) {
    this.config = config

    // Pre-populate pool
    for (let i = 0; i < POOL_SIZE; i++) {
      const obstacle = new Obstacle(scene, -100, -100, config.obstacleTypes[0])
      this.pool.push(obstacle)
      group.add(obstacle)
    }

    this.nextSpawnDistance = this.randomDistance()
  }

  update(gameSpeed: number, cameraRight: number) {
    // Move active obstacles
    this.pool.forEach(obstacle => {
      if (!obstacle.active) return
      obstacle.moveLeft(gameSpeed)
      if (obstacle.isOffScreen()) {
        obstacle.recycle()
      }
    })

    // Check if we should spawn
    this.lastSpawnX += gameSpeed
    if (this.lastSpawnX >= this.nextSpawnDistance) {
      this.spawn(cameraRight)
      this.lastSpawnX = 0
      this.nextSpawnDistance = this.randomDistance()
    }
  }

  private spawn(cameraRight: number) {
    const obstacle = this.getInactive()
    if (!obstacle) return

    const typeIndex = Math.floor(Math.random() * this.config.obstacleTypes.length)
    const type = this.config.obstacleTypes[typeIndex]
    const animated = ANIMATED_OBSTACLES[type]

    const y = this.groundY + (animated?.yOffset ?? 0)
    obstacle.spawn(cameraRight + 100, y, type, animated?.animKey)
  }

  private getInactive(): Obstacle | null {
    const inactive = this.pool.find(o => !o.active)
    if (inactive) return inactive

    // Expand pool if needed
    const obstacle = new Obstacle(this.scene, -100, -100, this.config.obstacleTypes[0])
    this.pool.push(obstacle)
    this.group.add(obstacle)
    return obstacle
  }

  private randomDistance(): number {
    const [min, max] = this.config.spawnRange
    return min + Math.random() * (max - min)
  }

  reset() {
    this.pool.forEach(o => o.recycle())
    this.lastSpawnX = 0
    this.nextSpawnDistance = this.randomDistance()
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/game/objects/
git commit -m "feat: add Obstacle and ObstacleSpawner with object pooling"
```

---

## Task 9: PlayScene

**Files:**
- Create: `src/game/scenes/PlayScene.ts`, `src/game/config.ts`

- [ ] **Step 1: Create Phaser game config factory**

Create `src/game/config.ts`:

```ts
import Phaser from 'phaser'
import { PreloadScene } from './scenes/PreloadScene'
import { PlayScene } from './scenes/PlayScene'

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: 1000,
    height: 340,
    parent,
    pixelArt: true,
    transparent: false,
    backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [PreloadScene, PlayScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }
}
```

- [ ] **Step 2: Create PlayScene**

Create `src/game/scenes/PlayScene.ts`:

```ts
import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ObstacleSpawner } from '../objects/ObstacleSpawner'
import { gameEventEmitter, GameEvents } from '../events'
import { getLevelById } from '../../data/levels'
import type { LevelConfig } from '../../types'

export class PlayScene extends Phaser.Scene {
  private player!: Player
  private obstacleSpawner!: ObstacleSpawner
  private ground!: Phaser.GameObjects.TileSprite
  private clouds: Phaser.GameObjects.Image[] = []
  private trees: Phaser.GameObjects.Image[] = []

  private config!: LevelConfig
  private gameSpeed = 0
  private score = 0
  private isGameRunning = false
  private isDead = false
  private scoreTimer?: Phaser.Time.TimerEvent

  private hitSound!: Phaser.Sound.BaseSound
  private reachSound!: Phaser.Sound.BaseSound

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('PlayScene')
  }

  create() {
    const { width, height } = this.scale

    // Ground
    this.ground = this.add.tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1)
      .setDepth(10)

    // Clouds (parallax layer)
    this.clouds = [
      this.add.image(width / 2, 50, 'cloud').setDepth(0).setAlpha(0.6),
      this.add.image(width - 80, 30, 'cloud').setDepth(0).setAlpha(0.4).setScale(0.8),
      this.add.image(width / 4, 70, 'cloud').setDepth(0).setAlpha(0.5).setScale(0.6),
    ]

    // Background trees (parallax)
    this.trees = [
      this.add.image(width * 0.3, height - 70, 'tree').setDepth(1).setAlpha(0.3).setScale(0.6),
      this.add.image(width * 0.7, height - 60, 'tree').setDepth(2).setAlpha(0.5).setScale(0.8),
      this.add.image(width * 1.2, height - 65, 'tree').setDepth(1).setAlpha(0.4).setScale(0.7),
    ]

    // Player
    this.player = new Player(this, 50, height - 30)

    // Obstacle group and spawner (will be set up on level start)
    const obstacleGroup = this.physics.add.group()

    // Sounds
    this.hitSound = this.sound.add('hit', { volume: 0.2 })
    this.reachSound = this.sound.add('reach', { volume: 0.2 })

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()
      this.input.keyboard.on('keydown-SPACE', () => this.handleJump())
    }
    this.input.on('pointerdown', () => this.handleJump())

    // Listen for React events
    gameEventEmitter.on(GameEvents.START_LEVEL, this.startLevel, this)
    gameEventEmitter.on(GameEvents.RESTART, this.restartLevel, this)
    gameEventEmitter.on(GameEvents.TRIVIA_ANSWERED, this.onTriviaAnswered, this)
    gameEventEmitter.on(GameEvents.PAUSE, () => this.scene.pause())
    gameEventEmitter.on(GameEvents.RESUME, () => this.scene.resume())

    // Store obstacle group reference for spawner setup
    this.data.set('obstacleGroup', obstacleGroup)
  }

  private startLevel(levelId: number) {
    const config = getLevelById(levelId)
    if (!config) return

    this.config = config
    this.gameSpeed = config.startSpeed
    this.score = 0
    this.isGameRunning = true
    this.isDead = false

    // Set up spawner
    const { height } = this.scale
    const obstacleGroup = this.data.get('obstacleGroup') as Phaser.Physics.Arcade.Group
    this.obstacleSpawner = new ObstacleSpawner(this, config, height - 30, obstacleGroup)

    // Collision
    this.physics.add.collider(this.player, obstacleGroup, () => this.onPlayerHit())

    // Start player running
    this.player.setPosition(50, height - 30)
    this.player.startRunning()
    this.player.resetJumpCount()

    // Score timer: +1 every 100ms
    this.scoreTimer = this.time.addEvent({
      delay: 100,
      callback: this.incrementScore,
      callbackScope: this,
      loop: true,
    })

    gameEventEmitter.emit(GameEvents.GAME_STARTED, { levelId })
    gameEventEmitter.emit(GameEvents.SCORE_CHANGED, { score: 0, target: config.objective })
  }

  private restartLevel() {
    if (!this.config) return
    this.obstacleSpawner.reset()
    this.scoreTimer?.remove()
    this.physics.resume()
    this.startLevel(this.config.id)
  }

  private handleJump() {
    if (!this.isGameRunning || this.isDead) return
    this.player.jump()
  }

  private incrementScore() {
    if (!this.isGameRunning || this.isDead) return

    this.score++
    this.gameSpeed = this.config.startSpeed + this.score * this.config.speedIncrement

    gameEventEmitter.emit(GameEvents.SCORE_CHANGED, {
      score: this.score,
      target: this.config.objective,
      jumps: this.player.getJumpCount(),
    })

    // Milestone sound every 100 points
    if (this.score % 100 === 0 && this.score > 0) {
      this.reachSound.play()
    }

    // Check objective
    if (this.config.objective && this.score >= this.config.objective) {
      this.onObjectiveReached()
    }
  }

  private onObjectiveReached() {
    this.isGameRunning = false
    this.scoreTimer?.remove()
    this.physics.pause()
    this.player.celebrate()

    gameEventEmitter.emit(GameEvents.OBJECTIVE_REACHED, {
      score: this.score,
      jumps: this.player.getJumpCount(),
      levelId: this.config.id,
    })
  }

  private onPlayerHit() {
    if (this.isDead) return
    this.isDead = true
    this.isGameRunning = false
    this.scoreTimer?.remove()
    this.physics.pause()

    this.player.hurt()
    this.hitSound.play()

    // Screen shake
    this.cameras.main.shake(200, 0.01)

    gameEventEmitter.emit(GameEvents.PLAYER_DIED, {
      score: this.score,
      jumps: this.player.getJumpCount(),
      levelId: this.config.id,
    })
  }

  private onTriviaAnswered(correct: boolean) {
    if (correct) {
      this.player.celebrate()
    } else {
      this.player.sob()
    }
  }

  update() {
    if (!this.isGameRunning || this.isDead) return

    // Scroll ground
    this.ground.tilePositionX += this.gameSpeed * 0.5

    // Parallax clouds
    this.clouds.forEach((cloud, i) => {
      cloud.x -= 0.5 + i * 0.1
      if (cloud.x + cloud.width / 2 < 0) {
        cloud.x = this.scale.width + cloud.width / 2
      }
    })

    // Parallax trees
    this.trees.forEach((tree, i) => {
      tree.x -= this.gameSpeed * (0.2 + i * 0.1)
      if (tree.x + tree.width / 2 < 0) {
        tree.x = this.scale.width + tree.width / 2 + Math.random() * 200
      }
    })

    // Update obstacles
    this.obstacleSpawner.update(this.gameSpeed, this.scale.width)
  }

  shutdown() {
    gameEventEmitter.off(GameEvents.START_LEVEL, this.startLevel, this)
    gameEventEmitter.off(GameEvents.RESTART, this.restartLevel, this)
    gameEventEmitter.off(GameEvents.TRIVIA_ANSWERED, this.onTriviaAnswered, this)
    gameEventEmitter.removeAllListeners(GameEvents.PAUSE)
    gameEventEmitter.removeAllListeners(GameEvents.RESUME)
  }
}
```

- [ ] **Step 3: Verify by starting the dev server**

```bash
npm run dev
```

No errors in the console. The game module compiles without issues. (It won't render yet — we need the React wrapper in the next task.)

- [ ] **Step 4: Commit**

```bash
git add src/game/config.ts src/game/scenes/PlayScene.ts
git commit -m "feat: add data-driven PlayScene with parallax, scoring, and event bridge"
```

---

## Task 10: PhaserGame React Wrapper

**Files:**
- Create: `src/components/game/PhaserGame.tsx`

- [ ] **Step 1: Create PhaserGame component**

Create `src/components/game/PhaserGame.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '../../game/config'

interface PhaserGameProps {
  className?: string
}

export function PhaserGame({ className }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const containerId = 'phaser-game-container'
    containerRef.current.id = containerId

    const config = createGameConfig(containerId)
    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/game/PhaserGame.tsx
git commit -m "feat: add PhaserGame React wrapper component"
```

---

## Task 11: HUD Overlay & Game Over Overlay

**Files:**
- Create: `src/components/game/HudOverlay.tsx`, `src/components/game/GameOverOverlay.tsx`, `src/hooks/useScores.ts`

- [ ] **Step 1: Create useScores hook**

Create `src/hooks/useScores.ts`:

```ts
import { useState, useEffect, useCallback } from 'react'
import { gameEventEmitter, GameEvents } from '../game/events'

interface ScoreState {
  score: number
  target: number | null
  jumps: number
  levelId: number | null
  isRunning: boolean
  isDead: boolean
  objectiveReached: boolean
}

export function useScores() {
  const [state, setState] = useState<ScoreState>({
    score: 0,
    target: null,
    jumps: 0,
    levelId: null,
    isRunning: false,
    isDead: false,
    objectiveReached: false,
  })

  useEffect(() => {
    const onScoreChanged = (data: { score: number; target: number | null; jumps?: number }) => {
      setState(prev => ({
        ...prev,
        score: data.score,
        target: data.target,
        jumps: data.jumps ?? prev.jumps,
      }))
    }

    const onGameStarted = (data: { levelId: number }) => {
      setState({
        score: 0,
        target: null,
        jumps: 0,
        levelId: data.levelId,
        isRunning: true,
        isDead: false,
        objectiveReached: false,
      })
    }

    const onPlayerDied = (data: { score: number; jumps: number }) => {
      setState(prev => ({
        ...prev,
        score: data.score,
        jumps: data.jumps,
        isRunning: false,
        isDead: true,
      }))
    }

    const onObjectiveReached = (data: { score: number; jumps: number }) => {
      setState(prev => ({
        ...prev,
        score: data.score,
        jumps: data.jumps,
        isRunning: false,
        objectiveReached: true,
      }))
    }

    gameEventEmitter.on(GameEvents.SCORE_CHANGED, onScoreChanged)
    gameEventEmitter.on(GameEvents.GAME_STARTED, onGameStarted)
    gameEventEmitter.on(GameEvents.PLAYER_DIED, onPlayerDied)
    gameEventEmitter.on(GameEvents.OBJECTIVE_REACHED, onObjectiveReached)

    return () => {
      gameEventEmitter.off(GameEvents.SCORE_CHANGED, onScoreChanged)
      gameEventEmitter.off(GameEvents.GAME_STARTED, onGameStarted)
      gameEventEmitter.off(GameEvents.PLAYER_DIED, onPlayerDied)
      gameEventEmitter.off(GameEvents.OBJECTIVE_REACHED, onObjectiveReached)
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      score: 0,
      target: null,
      jumps: 0,
      levelId: null,
      isRunning: false,
      isDead: false,
      objectiveReached: false,
    })
  }, [])

  return { ...state, reset }
}
```

- [ ] **Step 2: Create HUD overlay**

Create `src/components/game/HudOverlay.tsx`:

```tsx
import { useScores } from '../../hooks/useScores'

interface HudOverlayProps {
  dayNumber: number
  levelInDay: number
}

export function HudOverlay({ dayNumber, levelInDay }: HudOverlayProps) {
  const { score, target, jumps } = useScores()

  const progress = target ? Math.min((score / target) * 100, 100) : 0

  return (
    <div className="w-full">
      {/* Top HUD bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-black/40">
        <div className="text-sm text-white/60">
          DAY {dayNumber} — LEVEL {levelInDay}
        </div>
        <div className="flex gap-6 items-center">
          <div>
            <span className="text-xs text-white/50 mr-2">SCORE</span>
            <span className="text-xl font-bold text-sky-400">
              {String(score).padStart(5, '0')}
            </span>
          </div>
          {target && (
            <div>
              <span className="text-xs text-white/50 mr-2">TARGET</span>
              <span className="text-xl font-bold text-white">{target}</span>
            </div>
          )}
          <div>
            <span className="text-xs text-white/50 mr-2">JUMPS</span>
            <span className="text-xl font-bold text-white">{jumps}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {target && (
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-linear-to-r from-sky-400 to-indigo-400 rounded-r transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create GameOver overlay**

Create `src/components/game/GameOverOverlay.tsx`:

```tsx
import { gameEventEmitter, GameEvents } from '../../game/events'

interface GameOverOverlayProps {
  score: number
  onRestart: () => void
  onExit: () => void
}

export function GameOverOverlay({ score, onRestart, onExit }: GameOverOverlayProps) {
  const handleRestart = () => {
    gameEventEmitter.emit(GameEvents.RESTART)
    onRestart()
  }

  return (
    <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-red-400 mb-4">Game Over</h2>
        <p className="text-lg text-white/70 mb-2">
          Score: <span className="text-sky-400 font-bold">{score}</span>
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handleRestart}
            className="bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer"
          >
            TRY AGAIN
          </button>
          <button
            onClick={onExit}
            className="border-2 border-white/30 hover:border-white/60 text-white font-semibold py-3 px-8 rounded-lg transition-colors cursor-pointer"
          >
            LEVEL SELECT
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useScores.ts src/components/game/HudOverlay.tsx src/components/game/GameOverOverlay.tsx
git commit -m "feat: add HUD overlay, game over overlay, and useScores hook"
```

---

## Task 12: Trivia Modal

**Files:**
- Create: `src/components/game/TriviaModal.tsx`
- Create: `tests/components/TriviaModal.test.tsx`

- [ ] **Step 1: Write failing test for trivia modal**

Create `tests/components/TriviaModal.test.tsx`:

```tsx
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
    render(
      <TriviaModal
        question={mockQuestion}
        onAnswer={vi.fn()}
      />
    )

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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --run tests/components/TriviaModal.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement TriviaModal**

Create `src/components/game/TriviaModal.tsx`:

```tsx
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
            {timeLeft === 0 && !selectedIndex
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --run tests/components/TriviaModal.test.tsx
```

Expected: All 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/game/TriviaModal.tsx tests/components/
git commit -m "feat: add TriviaModal with timer, answer validation, and tests"
```

---

## Task 13: GamePage

**Files:**
- Create: `src/pages/GamePage.tsx`

- [ ] **Step 1: Create GamePage**

Create `src/pages/GamePage.tsx`:

```tsx
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { PhaserGame } from '../components/game/PhaserGame'
import { HudOverlay } from '../components/game/HudOverlay'
import { TriviaModal } from '../components/game/TriviaModal'
import { GameOverOverlay } from '../components/game/GameOverOverlay'
import { useScores } from '../hooks/useScores'
import { useGameProgress } from '../hooks/useGameProgress'
import { gameEventEmitter, GameEvents } from '../game/events'
import { getLevelById } from '../data/levels'
import { trivia } from '../data/trivia'

export function GamePage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { isDead, objectiveReached, score, jumps } = useScores()
  const { completeLevel, addJumps, addDeath } = useGameProgress()

  const [showTrivia, setShowTrivia] = useState(false)
  const [gameReady, setGameReady] = useState(false)

  const level = getLevelById(Number(levelId))
  const triviaQuestion = level ? trivia[level.id] : null

  // Start level once game is ready
  useEffect(() => {
    if (!gameReady || !level) return

    // Small delay to ensure Phaser scene is initialized
    const timer = setTimeout(() => {
      gameEventEmitter.emit(GameEvents.START_LEVEL, level.id)
    }, 500)

    return () => clearTimeout(timer)
  }, [gameReady, level])

  // Show trivia when objective reached
  useEffect(() => {
    if (objectiveReached && triviaQuestion) {
      setShowTrivia(true)
    } else if (objectiveReached && !triviaQuestion) {
      // Bonus level — just complete it
      if (level) {
        completeLevel(level.id, score, true)
      }
    }
  }, [objectiveReached, triviaQuestion, level, score, completeLevel])

  // Track deaths
  useEffect(() => {
    if (isDead) {
      addDeath()
      addJumps(jumps)
    }
  }, [isDead, addDeath, addJumps, jumps])

  const handleTriviaAnswer = useCallback((correct: boolean) => {
    if (!level) return

    gameEventEmitter.emit(GameEvents.TRIVIA_ANSWERED, correct)
    completeLevel(level.id, score, correct)
    addJumps(jumps)

    // Hide trivia after a delay to show feedback
    setTimeout(() => {
      setShowTrivia(false)
      if (correct) {
        navigate('/levels')
      }
    }, 2000)
  }, [level, score, jumps, completeLevel, addJumps, navigate])

  const handleRestart = useCallback(() => {
    setShowTrivia(false)
  }, [])

  if (!level) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Level not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* HUD */}
      <HudOverlay dayNumber={level.day} levelInDay={level.levelInDay} />

      {/* Game canvas wrapper */}
      <div className="flex-1 flex items-center justify-center relative">
        <PhaserGame
          className="w-full max-w-[1000px]"
          ref={() => setGameReady(true)}
        />

        {/* Trivia overlay */}
        {showTrivia && triviaQuestion && (
          <TriviaModal
            question={triviaQuestion}
            onAnswer={handleTriviaAnswer}
          />
        )}

        {/* Game over overlay */}
        {isDead && (
          <GameOverOverlay
            score={score}
            onRestart={handleRestart}
            onExit={() => navigate('/levels')}
          />
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between px-6 py-3 bg-black/30 text-sm text-white/50">
        <span>Press SPACE or tap to jump</span>
        <button
          onClick={() => navigate('/levels')}
          className="hover:text-white/80 transition-colors cursor-pointer"
        >
          ← Level Select
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Fix PhaserGame to support ready callback**

Update `src/components/game/PhaserGame.tsx` — replace the component with:

```tsx
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
```

Update `GamePage.tsx` to use `onReady` prop:

Replace:
```tsx
        <PhaserGame
          className="w-full max-w-[1000px]"
          ref={() => setGameReady(true)}
        />
```

With:
```tsx
        <PhaserGame
          className="w-full max-w-[1000px]"
          onReady={() => setGameReady(true)}
        />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/GamePage.tsx src/components/game/PhaserGame.tsx
git commit -m "feat: add GamePage assembling Phaser canvas, HUD, trivia, and game over"
```

---

## Task 14: Layout Components

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/PageLayout.tsx`

- [ ] **Step 1: Create Header**

Create `src/components/layout/Header.tsx`:

```tsx
import { Link, useLocation } from 'react-router'

export function Header() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-sky-400'
        : 'text-white/60 hover:text-white/90'
    }`

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-black/20">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center text-xl">
          💧
        </div>
        <span className="font-bold text-lg tracking-wide text-white">
          WILLIE'S WATER DROP
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link to="/" className={linkClass('/')}>HOME</Link>
        <Link to="/levels" className={linkClass('/levels')}>PLAY</Link>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create PageLayout**

Create `src/components/layout/PageLayout.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Header } from './Header'

interface PageLayoutProps {
  children: ReactNode
  showHeader?: boolean
}

export function PageLayout({ children, showHeader = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {showHeader && <Header />}
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Header and PageLayout components"
```

---

## Task 15: Home Page

**Files:**
- Create: `src/pages/HomePage.tsx`

- [ ] **Step 1: Create HomePage**

Create `src/pages/HomePage.tsx`:

```tsx
import { Link } from 'react-router'
import { PageLayout } from '../components/layout/PageLayout'

export function HomePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div className="text-center px-8 py-24"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)' }}
      >
        <div className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">
          Water Awareness Game
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Meet Willie<br />the Water Drop
        </h1>
        <p className="text-lg text-white/70 max-w-md mx-auto mb-10">
          Run, jump, and learn about water conservation across 30 levels of trivia-powered fun.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/levels"
            className="bg-sky-400 text-slate-900 px-9 py-4 rounded-lg font-bold text-lg hover:bg-sky-300 transition-colors"
          >
            PLAY NOW
          </Link>
          <a
            href="#about"
            className="border-2 border-white/30 px-9 py-4 rounded-lg font-semibold text-lg hover:border-white/60 transition-colors"
          >
            LEARN MORE
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex justify-center gap-16 py-6 bg-black/20">
        <div className="text-center">
          <div className="text-3xl font-bold">30</div>
          <div className="text-xs uppercase text-white/50">Levels</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">5</div>
          <div className="text-xs uppercase text-white/50">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">25</div>
          <div className="text-xs uppercase text-white/50">Trivia Q's</div>
        </div>
      </div>

      {/* About section */}
      <div id="about" className="max-w-2xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-6">How to Play</h2>
        <div className="space-y-4 text-white/70">
          <p>
            Willie is a water drop on a mission! Help him run through each level
            by jumping over obstacles — fire hydrants, vehicles, and more.
          </p>
          <p>
            Reach the score target and you'll face a trivia question about water
            conservation. Answer correctly to unlock the next level!
          </p>
          <p>
            <strong className="text-white">Controls:</strong> Press <kbd className="bg-white/10 px-2 py-1 rounded text-sm">SPACE</kbd> or
            tap/click to jump.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: add HomePage with hero, stats, and about section"
```

---

## Task 16: Level Select Page

**Files:**
- Create: `src/components/ui/LevelCard.tsx`, `src/pages/LevelSelectPage.tsx`

- [ ] **Step 1: Create LevelCard component**

Create `src/components/ui/LevelCard.tsx`:

```tsx
import { Link } from 'react-router'
import type { LevelConfig, LevelProgress } from '../../types'

interface LevelCardProps {
  level: LevelConfig
  progress?: LevelProgress
  unlocked: boolean
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Drip Start', 2: 'Puddle Jump', 3: 'Stream Run',
  4: 'Rapids', 5: 'Waterfall', 6: 'Free Flow',
}

export function LevelCard({ level, progress, unlocked }: LevelCardProps) {
  const name = LEVEL_NAMES[level.levelInDay] ?? `Level ${level.levelInDay}`
  const completed = progress?.completed && progress?.triviaCorrect

  if (!unlocked) {
    return (
      <div className="bg-white/[0.03] border-2 border-white/[0.08] rounded-xl p-5 text-center opacity-40">
        <div className="text-xs uppercase text-white/50 mb-1">Level {level.levelInDay}</div>
        <div className="text-xl font-bold mb-2">{name}</div>
        <div className="text-sm text-white/50 mb-3">
          {level.objective ? `Score ${level.objective} pts` : 'No objective'}
        </div>
        <div className="text-2xl">🔒</div>
      </div>
    )
  }

  const borderClass = level.isBonus
    ? 'border-yellow-400/30 bg-linear-to-br from-yellow-400/10 to-yellow-400/5'
    : completed
      ? 'border-sky-400 bg-sky-400/15'
      : 'border-white/15 bg-white/5'

  return (
    <Link
      to={`/game/${level.id}`}
      className={`block border-2 rounded-xl p-5 text-center hover:scale-[1.03] transition-transform ${borderClass}`}
    >
      <div className={`text-xs uppercase mb-1 ${level.isBonus ? 'text-yellow-400' : 'text-white/50'}`}>
        {level.isBonus ? 'Bonus' : `Level ${level.levelInDay}`}
      </div>
      <div className="text-xl font-bold mb-2">{name}</div>
      <div className="text-sm text-white/50 mb-3">
        {level.objective ? `Score ${level.objective} pts` : 'No objective'}
      </div>
      {completed ? (
        <div className="flex justify-between items-center">
          <div className="text-xs text-green-400">✓ Best: {progress!.bestScore}</div>
        </div>
      ) : (
        <div className="text-2xl opacity-30">
          {level.isBonus ? '🎮' : '▶'}
        </div>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create LevelSelectPage**

Create `src/pages/LevelSelectPage.tsx`:

```tsx
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

        {/* Day tabs */}
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

        {/* Level grid */}
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/LevelCard.tsx src/pages/LevelSelectPage.tsx
git commit -m "feat: add LevelSelectPage with day tabs and level cards"
```

---

## Task 17: App Routing

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Set up React Router**

Replace `src/App.tsx` with:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router'
import { HomePage } from './pages/HomePage'
import { LevelSelectPage } from './pages/LevelSelectPage'
import { GamePage } from './pages/GamePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/game/:levelId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 2: Verify the app runs end-to-end**

```bash
npm run dev
```

Test in browser:
1. `http://localhost:5173/` — HomePage renders with hero and "PLAY NOW" button
2. Click "PLAY NOW" — navigates to `/levels`, shows day tabs and level grid
3. Click Level 1 — navigates to `/game/11`, Phaser canvas loads and game starts
4. Press SPACE to jump — Willie jumps over obstacles
5. Die — game over overlay appears with "TRY AGAIN" and "LEVEL SELECT" buttons

- [ ] **Step 3: Run all tests**

```bash
npm test -- --run
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add React Router with home, level select, and game routes"
```

---

## Task 18: Visual Polish

**Files:**
- Modify: `src/game/scenes/PlayScene.ts`
- Modify: `src/styles/index.css`

- [ ] **Step 1: Add particle effects to PlayScene**

Add to `src/game/scenes/PlayScene.ts` — in the `create()` method, after the player setup, add a particle emitter configuration. Add these methods to the PlayScene class:

```ts
  private jumpParticles!: Phaser.GameObjects.Particles.ParticleEmitter
  private trailParticles!: Phaser.GameObjects.Particles.ParticleEmitter
```

In `create()`, after `this.player = new Player(...)`:

```ts
    // Jump splash particles
    this.jumpParticles = this.add.particles(0, 0, 'willie', {
      speed: { min: 50, max: 150 },
      angle: { min: 220, max: 320 },
      scale: { start: 0.1, end: 0 },
      lifespan: 400,
      tint: 0x38bdf8,
      emitting: false,
      quantity: 6,
    })
    this.jumpParticles.setDepth(98)

    // Running trail
    this.trailParticles = this.add.particles(0, 0, 'willie', {
      speed: { min: 10, max: 30 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.05, end: 0 },
      lifespan: 300,
      tint: 0x38bdf8,
      frequency: 100,
      follow: this.player,
      followOffset: { x: -20, y: 10 },
      emitting: false,
    })
    this.trailParticles.setDepth(98)
```

In `startLevel()` method, after `this.player.startRunning()`:

```ts
    this.trailParticles.start()
```

In `handleJump()` method, after `this.player.jump()`:

```ts
    if (jumped) {
      this.jumpParticles.emitParticleAt(this.player.x, this.player.y + 40)
    }
```

Update the handleJump method:

```ts
  private handleJump() {
    if (!this.isGameRunning || this.isDead) return
    const jumped = this.player.jump()
    if (jumped) {
      this.jumpParticles.emitParticleAt(this.player.x, this.player.y + 40)
    }
  }
```

In `onPlayerHit()`:

```ts
    this.trailParticles.stop()
```

In `onObjectiveReached()`:

```ts
    this.trailParticles.stop()
```

- [ ] **Step 2: Add milestone score flash effect**

In `incrementScore()`, inside the `if (this.score % 100 === 0)` block, add a camera flash:

```ts
    if (this.score % 100 === 0 && this.score > 0) {
      this.reachSound.play()
      this.cameras.main.flash(200, 56, 189, 248, true, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        // Flash fades automatically
      })
    }
```

- [ ] **Step 3: Add custom CSS for smooth transitions**

Append to `src/styles/index.css`:

```css
@import "tailwindcss";

/* Game canvas responsive scaling */
#phaser-game-container canvas {
  max-width: 100%;
  height: auto !important;
}

/* Smooth overlay transitions */
.game-overlay-enter {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

- [ ] **Step 4: Verify visual polish in browser**

```bash
npm run dev
```

Test: jump to see water splash particles, watch the running trail, hit an obstacle to see screen shake, reach 100-point milestones to see camera flash.

- [ ] **Step 5: Commit**

```bash
git add src/game/scenes/PlayScene.ts src/styles/index.css
git commit -m "feat: add particle effects, screen shake, and score milestone flash"
```

---

## Task 19: Responsive & Mobile Support

**Files:**
- Modify: `src/game/scenes/PlayScene.ts`
- Modify: `src/components/game/HudOverlay.tsx`
- Modify: `src/pages/LevelSelectPage.tsx`

- [ ] **Step 1: Ensure Phaser scale mode is set correctly**

Verify `src/game/config.ts` has the scale config (already added in Task 9):

```ts
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
```

This ensures the 1000x340 canvas scales to fit the viewport while maintaining aspect ratio.

- [ ] **Step 2: Make HUD responsive**

Update `src/components/game/HudOverlay.tsx` — replace the top HUD bar's `className`:

```tsx
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-2 sm:py-3 bg-black/40 gap-2">
        <div className="text-xs sm:text-sm text-white/60">
          DAY {dayNumber} — LEVEL {levelInDay}
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <div>
            <span className="text-[10px] sm:text-xs text-white/50 mr-1 sm:mr-2">SCORE</span>
            <span className="text-base sm:text-xl font-bold text-sky-400">
              {String(score).padStart(5, '0')}
            </span>
          </div>
          {target && (
            <div>
              <span className="text-[10px] sm:text-xs text-white/50 mr-1 sm:mr-2">TARGET</span>
              <span className="text-base sm:text-xl font-bold text-white">{target}</span>
            </div>
          )}
          <div>
            <span className="text-[10px] sm:text-xs text-white/50 mr-1 sm:mr-2">JUMPS</span>
            <span className="text-base sm:text-xl font-bold text-white">{jumps}</span>
          </div>
        </div>
      </div>
```

- [ ] **Step 3: Verify responsive behavior**

```bash
npm run dev
```

Test in browser dev tools:
- Desktop (1920px): full layout, 3-column level grid
- Tablet (768px): 2-column level grid, HUD still readable
- Mobile (375px): 1-column level grid, stacked HUD, tap-to-jump works

- [ ] **Step 4: Commit**

```bash
git add src/components/game/HudOverlay.tsx
git commit -m "feat: add responsive layout for HUD and mobile support"
```

---

## Task 20: Build Verification & Final Cleanup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update index.html title and meta**

Update `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Willie's Water Drop - An educational water awareness game" />
    <title>Willie's Water Drop</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Run all tests**

```bash
npm test -- --run
```

Expected: All tests pass.

- [ ] **Step 4: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173` — verify the full app works: home page, level select, gameplay, trivia, progression.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "chore: update page title and meta, verify production build"
```
