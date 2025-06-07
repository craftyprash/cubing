# CraftyCubing

A modern web application for speedcubing practice and algorithm management, built with React and TypeScript.

## Core Features

- **Full Solve Timer**: Practice full solves with inspection time and customizable penalties
- **Case Library**: Browse and practice F2L, OLL, and PLL cases
- **Algorithm Management**: Store multiple algorithms per case with individual statistics
- **Session Management**: Track solves across multiple sessions
- **Data Persistence**: IndexedDB for reliable offline storage

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **Data Persistence**: Dexie.js (IndexedDB wrapper)

## Data Storage

### Database Schema

```typescript
// Database tables and indexes
{
  solves: '++id, sessionId, date, caseId, algorithmId',
  sessions: 'id, name, date, type, stage, caseId',
  personalBests: '++id, type, date',
  userSettings: '++id',
  cubeCaseFavorites: '++id, caseId, dateAdded',
  algorithmStats: 'algorithmId, caseId, lastPracticed'
}
```

### Example Usage with Dexie.js

```typescript
// Add a new solve
await db.solves.add({
  sessionId: currentSession.id,
  time: roundedTime,
  scramble: currentScramble,
  date: new Date(),
  penalty: undefined
});

// Query solves for a session
const sessionSolves = await db.solves
  .where('sessionId')
  .equals(sessionId)
  .reverse()
  .toArray();

// Update algorithm stats
await db.algorithmStats.update(algorithmId, {
  timesExecuted: algorithm.timesExecuted + 1,
  lastPracticed: new Date(),
  bestTime: Math.min(time, algorithm.bestTime || Infinity)
});
```

### Time Formatting

Times are stored in milliseconds and formatted for display:
```typescript
const formatTime = (ms: number): string => {
  // Round to centiseconds (2 decimal places)
  const roundedMs = Math.round(ms / 10) * 10;
  const seconds = Math.floor(roundedMs / 1000);
  const milliseconds = Math.floor((roundedMs % 1000) / 10);
  return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
};
```

### Penalties

Solve penalties are stored with each solve:
```typescript
interface Solve {
  id?: number;
  sessionId: string;
  time: number;
  scramble: string;
  date: Date;
  penalty?: 'DNF' | '+2';
  notes?: string;
}
```

## Project Structure

```
src/
├── components/
│   ├── cube/           # Cube-specific components
│   │   ├── CaseTimer.tsx       # Timer for individual case practice
│   │   └── EditCaseModal.tsx   # Modal for editing case algorithms
│   ├── timer/          # Timer-related components
│   │   ├── Timer.tsx           # Core timer component
│   │   ├── SessionManager.tsx  # Session management UI
│   │   └── SolveDetailsModal.tsx # Solve details and penalties
│   └── shared/         # Shared layout components
├── constants/
│   ├── f2lcases.ts    # F2L case definitions
│   ├── ollcases.ts    # OLL case definitions
│   └── pllcases.ts    # PLL case definitions
├── db/
│   └── index.ts       # Dexie.js database configuration
├── types/
│   └── index.ts       # TypeScript type definitions
├── utils/
│   ├── scrambleUtils.ts # Scramble generation
│   ├── timeUtils.ts    # Time formatting and calculations
│   └── visualCube.ts   # Cube visualization utilities
└── pages/             # Route components
```

## Timer Implementation

### Core Timer Component (`Timer.tsx`)

The timer is implemented with multiple states to handle different phases of timing:

```typescript
enum TimerState {
  IDLE = 'idle',         // Initial state
  READY = 'ready',       // User holding space/touch
  INSPECTION = 'inspection', // 15s inspection phase
  INSPECTION_READY = 'inspection_ready', // Ready to start after inspection
  RUNNING = 'running',    // Timer running
  STOPPED = 'stopped'     // Timer stopped
}
```

Key features:

1. **Inspection Time**
   - Optional 15-second inspection period
   - Visual countdown
   - Automatic start when inspection ends
   - Toggleable via UI

2. **Input Handling**
   - Keyboard (spacebar) support
   - Touch screen support
   - 0.25s hold-to-start mechanism
   - Anti-accidental stop protection (500ms cooldown)

3. **Display Modes**
   - Running time in real-time
   - Final time with centisecond precision
   - State indicators (ready, running, stopped)

### Session Management

The `SessionManager` component handles:

1. **Multiple Sessions**
   - Create/delete sessions
   - Switch between sessions
   - Session-specific statistics

2. **Statistics Tracking**
   - Current and best averages (ao5, ao12, ao50, ao100)
   - Session mean
   - Best/worst times

3. **Data Persistence**
   - Automatic save to IndexedDB
   - Session recovery on page load
   - Solve history retention

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Copyright © 2025 Prashant Padmanabhan. This work is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).