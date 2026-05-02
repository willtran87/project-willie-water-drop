# Willie's Water Drop — Frontend Rebuild Design Spec

## Overview

Rebuild the Willie's Water Drop educational trivia game as a modern frontend application. The original is an Express/EJS/Phaser 3 full-stack app with 30 levels of side-scrolling gameplay gated by water-awareness trivia questions. This rebuild extracts the frontend into a standalone React + Phaser 3 SPA with modern tooling, eliminates code duplication (30 separate scene files become 1 data-driven scene), and delivers a visual overhaul of the surrounding UI while preserving the original sprite art and game feel.

## Stack

- **Framework:** React 18+ with TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **Game engine:** Phaser 3 (latest)
- **Routing:** React Router
- **State persistence:** localStorage
- **No backend required** — public-facing, no auth

## Architecture

### React / Phaser Boundary

React owns the app shell: routing, page layout, HUD overlay, trivia modal, level select, progress display. Phaser owns the game canvas: physics, sprites, obstacle spawning, collision detection, score timing.

The two communicate via a shared `EventEmitter` (`src/game/events.ts`):

- **Phaser -> React events:** `score-changed`, `objective-reached`, `player-died`, `game-started`
- **React -> Phaser events:** `start-level(levelId)`, `restart`, `trivia-answered(correct: boolean)`, `pause`, `resume`

No shared mutable state. React is source of truth for progress/persistence; Phaser is source of truth for in-game physics.

### Project Structure

```
src/
├── main.tsx
├── App.tsx
├── components/
│   ├── layout/          # Header, Footer, PageLayout
│   ├── game/            # PhaserGame wrapper, HUD overlay, TriviaModal
│   └── ui/              # LevelCard, ProgressBar, ScoreDisplay
├── game/
│   ├── scenes/
│   │   ├── PreloadScene.ts
│   │   └── PlayScene.ts      # Single data-driven scene
│   ├── objects/
│   │   ├── Player.ts
│   │   ├── Obstacle.ts
│   │   └── ObstacleSpawner.ts
│   ├── config.ts
│   └── events.ts
├── data/
│   ├── levels.ts
│   └── trivia.ts
├── hooks/
│   ├── useGameProgress.ts
│   └── useScores.ts
├── pages/
│   ├── HomePage.tsx
│   ├── LevelSelectPage.tsx
│   └── GamePage.tsx
├── types/
└── styles/
```

## Game Engine & Level System

### Data-Driven Levels

One `PlayScene` handles all 30 levels, parameterized by config:

```typescript
interface LevelConfig {
  id: number;              // e.g., 11, 12, ... 56
  day: number;             // 1-5
  levelInDay: number;      // 1-6
  objective: number | null;// target score (400-2000), null for bonus
  startSpeed: number;
  speedIncrement: number;
  obstacleTypes: string[];
  spawnRange: [number, number];
  background: string;
  isBonus: boolean;
}
```

### PlayScene Lifecycle

1. Receives `levelId` from React via event bridge
2. Looks up config from `levels.ts`
3. Spawns obstacles based on config's `obstacleTypes` and `spawnRange`
4. Increments score on timer, scales speed by `speedIncrement`
5. On reaching `objective` -> emits `objective-reached` -> React shows trivia modal, Phaser pauses
6. On collision -> emits `player-died` -> React shows game-over overlay
7. React emits `restart` or `trivia-answered` back to Phaser

### Obstacle System

- Base `Obstacle` class handles movement, collision box, recycling
- `ObstacleSpawner` picks from level's allowed types, randomizes spacing within `spawnRange`
- Object pooling for performance (recycle instead of create/destroy)

### Input

- Desktop: spacebar or click to jump
- Mobile: touch/tap to jump
- Responsive canvas that scales to viewport while preserving aspect ratio

## Progression System

- **All 5 days accessible from the start** — no date gating
- **Level X1:** always unlocked
- **Level X2-X5:** unlocked when previous level completed with correct trivia answer
- **Level X6 (bonus):** always unlocked, no trivia, no objective
- **Days are independent** — no need to beat Day 1 to access Day 2

## Data Model

### Trivia (`src/data/trivia.ts`)

```typescript
interface TriviaQuestion {
  question: string;
  options: string[];     // 4 options
  correctIndex: number;
  timeLimit: number;     // seconds (default 15)
}

// Keyed by level ID, null for bonus levels
const trivia: Record<number, TriviaQuestion | null>;
```

### localStorage Schema

```typescript
// Stored under key "willie-water-drop"
interface GameState {
  progress: Record<number, {
    completed: boolean;
    bestScore: number;
    triviaCorrect: boolean;
    attempts: number;
  }>;
  totalJumps: number;
  totalDeaths: number;
}
```

### React Hooks

- `useGameProgress()` — reads/writes localStorage. Exposes `isLevelUnlocked(id)`, `completeLevel(id, score, triviaCorrect)`, `getProgress()`
- `useScores()` — tracks current session score, jumps, deaths. Resets per attempt.

## UI Design

### Theme

- Dark theme: background `#0f172a`, cards/surfaces with white-alpha layers
- Primary accent: water-blue `#38bdf8`
- Secondary accent: purple `#818cf8` (gradients, progress bar)
- Success: `#4ade80`
- Bonus level accent: `#facc15`
- Typography: system font stack, bold headings, uppercase labels

### Pages

**Home Page:**
- Hero section with water gradient background
- Title, tagline, "Play Now" CTA
- Stats bar showing 30 levels / 5 days / 25 trivia questions

**Level Select Page:**
- Day tabs (1-5) across the top
- 3-column grid of level cards per day
- Cards show: level number, name, objective, completion status, best score
- Locked levels visually dimmed with lock icon
- Bonus levels styled distinctly (gold border)

**Game Page:**
- Top HUD bar: level info, score, target, jump count
- Progress bar showing score/target percentage
- Phaser canvas (centered, responsive)
- Bottom bar: input hint, pause/back buttons

**Trivia Modal:**
- Overlays paused game canvas with dark backdrop
- Circular countdown timer
- Question text
- 2x2 grid of answer options
- Visual feedback on correct/incorrect selection

### Responsive Strategy

- Desktop-first, scales down for mobile
- Canvas maintains aspect ratio, CSS `max-width: 100%`
- HUD stacks vertically on narrow screens
- Level select grid goes 2-column then 1-column on mobile
- Touch input for mobile gameplay

## Asset Strategy

### Reused from Original

All assets from `D:\work\code\willie-water-drop\public\assets\`:
- Willie sprites: idle, run, cool, hurt, professor, sobbing, intro
- Obstacle sprites: hydrants (small/big, 3 variants), water meters, vroom-vroom vehicles, jets, utility trucks, meter vans
- Environment: ground, clouds, trees, benches, water fountains, water towers
- UI sprites: game over, restart, correct/incorrect, times up
- Audio: jump.m4a, hit.m4a, reach.m4a
- GIMP source files (.xcf) preserved

### New Visual Enhancements

- **Particle effects:** water splash on jump, droplet trail while running, impact particles on collision
- **Parallax scrolling:** multi-layer backgrounds (sky, distant clouds, mid-ground, foreground)
- **Screen shake** on collision
- **Score milestone effects:** pulse/flash at 100-point intervals
- **Level complete celebration:** particle burst + transition animation
- **Smooth tweened transitions** between game states

### Trivia Content Source

The original trivia questions/answers live in SQL Server tables (`wwd_question`, `wwd_answer`). These will be extracted and hardcoded into `src/data/trivia.ts`. If the original database is not accessible, placeholder trivia questions about water conservation will be written to fill all 25 non-bonus levels.

### Not In Scope

- No re-drawn sprites (originals have character)
- No music/soundtrack
- No 3D rendering
