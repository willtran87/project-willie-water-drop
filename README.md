# Willie Water Drop

An educational side-scrolling runner game built to celebrate [Drinking Water Week](https://www.awwa.org/communications-and-outreach/drinking-water-week/). Players guide Willie the Water Drop through 30 levels across 5 days, dodging obstacles and answering water conservation trivia.

Originally created for the City of Bloomington, MN as a Water Week engagement tool.

## Tech Stack

- **Game Engine:** [Phaser 3](https://phaser.io/) (WebGL/Canvas rendering, Arcade physics)
- **UI Shell:** React 19 + React Router 7
- **Styling:** Tailwind CSS 4
- **Build:** Vite 6
- **Language:** TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  game/
    config.ts              # Phaser game configuration
    events.ts              # React <-> Phaser event bridge
    scenes/
      PreloadScene.ts      # Asset loading and animation setup
      PlayScene.ts         # Main gameplay loop
    objects/
      Player.ts            # Willie / Jet-Willie sprite and physics
      Obstacle.ts          # Pooled obstacle sprites
      ObstacleSpawner.ts   # Spawn timing and placement logic
  components/
    game/
      PhaserGame.tsx       # Phaser lifecycle wrapper
      HudOverlay.tsx       # Score, target, jumps display
      GameOverOverlay.tsx  # Death screen
      TriviaModal.tsx      # Trivia question UI
    layout/
      Header.tsx           # Navigation bar
      PageLayout.tsx       # Page wrapper
    ui/
      LevelCard.tsx        # Level selection card
  pages/
    HomePage.tsx           # Landing page
    LevelSelectPage.tsx    # Day tabs + level grid
    GamePage.tsx           # Game + HUD + modals
  data/
    levels.ts              # 30 level configurations
    trivia.ts              # Trivia questions per level
  hooks/
    useGameProgress.ts     # localStorage persistence
    useScores.ts           # Session scoring state
  types/
    index.ts               # TypeScript interfaces
public/
  assets/
    sprites/               # Character and obstacle spritesheets
    environment/           # Ground, clouds, trees, etc.
    audio/                 # Jump, hit, reach sound effects
    ui/                    # Game over, restart, etc.
```

## Gameplay

### Controls

- **Keyboard:** Press `SPACE` to jump
- **Mouse/Touch:** Click or tap to jump

### Day Progression

Each day introduces new mechanics. Levels 1-5 have score targets (400-2000 pts); Level 6 is a bonus with no objective.

| Day | Theme | Mechanic |
|-----|-------|----------|
| 1 | Drip Training | Single jump, hydrants + water meters |
| 2 | Double Splash | Double jump unlocked, 4 trivia choices |
| 3 | Current Affairs | Double jump, denser obstacles |
| 4 | Meter Madness | Paired water meters at coordinated heights |
| 5 | Jet-Willie | Water jet truck, lane-switching (foreground/background) |

### Trivia

Reaching a level's score target pauses the game and presents a water conservation trivia question. Answer correctly to clear the level and unlock the next one. Answering incorrectly resets the level.

### Day 5 Lane Mechanic

Day 5 plays differently from Days 1-4. Instead of jumping over obstacles, each jump **switches Willie between foreground and background lanes**. Obstacles spawn randomly in either lane, and only obstacles in your current lane can hurt you.

## Architecture

The game uses a hybrid React + Phaser architecture:

- **React** handles routing, UI overlays (HUD, game over, trivia), and state persistence
- **Phaser** handles rendering, physics, input, and gameplay logic
- **Event bridge** (`gameEventEmitter`) connects the two — React emits `START_LEVEL`, `RESTART`, `TRIVIA_ANSWERED`; Phaser emits `SCORE_CHANGED`, `PLAYER_DIED`, `OBJECTIVE_REACHED`
- **`pendingLevelId`** resolves the race condition between React's useEffect timing and Phaser's scene lifecycle

### Canvas Sizing

Days 1-4 use a 1000x340 canvas. Day 5 uses 1200x420 for the larger Jet-Willie sprite. The canvas size is set at game creation time based on the pending level, and resized at runtime when switching between days.

## License

Internal project — City of Bloomington, MN.
