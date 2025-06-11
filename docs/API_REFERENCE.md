# API Reference

This document provides detailed reference information for CraftyCubing's key functions, utilities, and components.

## 🗄️ Database API

### Database Instance
```typescript
import { db } from './src/db';
```

#### Core Tables
- `db.solves` - Individual solve records
- `db.sessions` - Practice sessions
- `db.personalBests` - Achievement tracking
- `db.userSettings` - App configuration
- `db.cubeCaseFavorites` - Favorited cases
- `db.algorithmStats` - Algorithm performance

#### Common Operations
```typescript
// Add a solve
await db.solves.add({
  sessionId: 'session_123',
  time: 8450, // milliseconds
  scramble: "R U R' U' R' F R2 U' R' U' R U R' F'",
  date: new Date()
});

// Query solves by session
const solves = await db.solves
  .where('sessionId')
  .equals(sessionId)
  .reverse()
  .toArray();

// Update session
await db.sessions.update(sessionId, {
  solveCount: session.solveCount + 1,
  updatedAt: new Date()
});
```

## ⏱️ Time Utilities

### formatTimeForDisplay()
Formats time in milliseconds for consistent display.

```typescript
function formatTimeForDisplay(
  timeMs: number | undefined | null,
  precision?: number
): string
```

**Parameters:**
- `timeMs` - Time in milliseconds
- `precision` - Decimal places (default: 2)

**Returns:** Formatted time string (e.g., "8.45")

**Examples:**
```typescript
formatTimeForDisplay(8450);     // "8.45"
formatTimeForDisplay(12340);    // "12.34"
formatTimeForDisplay(null);     // "--"
formatTimeForDisplay(8450, 3);  // "8.450"
```

### calculateAverage()
Calculates WCA-compliant averages with proper trimming.

```typescript
function calculateAverage(
  times: number[],
  count: number
): number | null
```

**Parameters:**
- `times` - Array of solve times in milliseconds
- `count` - Number of solves to include

**Returns:** Average time in milliseconds, or null if insufficient data

**Rules:**
- For count ≥ 5: Removes best and worst times before averaging
- For count < 5: Simple average
- Returns null if more than 1 DNF in the set
- DNF represented as -1 in times array

**Examples:**
```typescript
calculateAverage([8000, 9000, 7000, 8500, 9500], 5);
// Returns: 8500 (average of 8000, 8500, 9000)

calculateAverage([8000, 9000, 7000], 3);
// Returns: 8000 (simple average)

calculateAverage([8000, -1, 7000, 8500, 9500], 5);
// Returns: 8500 (one DNF allowed)

calculateAverage([8000, -1, -1, 8500, 9500], 5);
// Returns: null (too many DNFs)
```

### calculateSessionStats()
Computes comprehensive session statistics.

```typescript
function calculateSessionStats(
  sessionSolves: Solve[],
  allSolves?: Solve[]
): SessionStats
```

**Parameters:**
- `sessionSolves` - Solves from current session
- `allSolves` - All solves across sessions (for all-time bests)

**Returns:** Object containing current and best statistics

```typescript
interface SessionStats {
  currentSingle: number | null;
  ao5: number | null;
  ao12: number | null;
  ao50: number | null;
  ao100: number | null;
  bestSingle: number | null;
  bestAo5: number | null;
  bestAo12: number | null;
  bestAo50: number | null;
  bestAo100: number | null;
}
```

**Example:**
```typescript
const stats = calculateSessionStats(sessionSolves, allSolves);
console.log(`Current ao5: ${formatTimeForDisplay(stats.ao5)}`);
console.log(`Best single: ${formatTimeForDisplay(stats.bestSingle)}`);
```

### formatTime()
Formats time with minutes for longer solves.

```typescript
function formatTime(timeMs: number): string
```

**Examples:**
```typescript
formatTime(8450);   // "8.45"
formatTime(65000);  // "1:05.00"
formatTime(125000); // "2:05.00"
```

## 🎲 Scramble Utilities

### generateScramble()
Generates random cube scrambles following WCA standards.

```typescript
function generateScramble(length?: number): string
```

**Parameters:**
- `length` - Scramble length (default: 20)

**Returns:** Space-separated scramble string

**Rules:**
- Uses moves: U, D, R, L, F, B
- Modifiers: none, ', 2
- Avoids consecutive moves on same axis
- Follows white-on-top, green-in-front orientation

**Example:**
```typescript
generateScramble();    // "R U R' U' R' F R2 U' R' U' R U R' F'"
generateScramble(15);  // Shorter scramble
```

### formatMoves()
Cleans and formats move sequences.

```typescript
function formatMoves(moves: string): string
```

**Example:**
```typescript
formatMoves("R  U   R'  U'"); // "R U R' U'"
```

### reverseAlgorithm()
Reverses an algorithm sequence for setup/teardown.

```typescript
function reverseAlgorithm(algorithm: string): string
```

**Example:**
```typescript
reverseAlgorithm("R U R' U'"); // "U R U' R'"
```

## 🎨 Visual Cube API

### generateVisualCubeUrl()
Creates URLs for cube state visualization.

```typescript
function generateVisualCubeUrl(options: VisualCubeOptions): string
```

**Options:**
```typescript
interface VisualCubeOptions {
  size?: number;                    // Image size (default: 200)
  view?: 'plan' | 'trans' | 'oblique'; // View angle
  stage?: 'f2l' | 'oll' | 'pll';   // Cube stage
  case?: string;                    // Case identifier
  fmt?: 'svg' | 'png';             // Image format
  alg?: string;                     // Algorithm to apply
  bg?: string;                      // Background color
  sch?: string;                     // Color scheme
}
```

**Example:**
```typescript
const url = generateVisualCubeUrl({
  size: 150,
  view: 'plan',
  alg: "R U R' U'",
  fmt: 'png'
});
```

### generateScramblePreview()
Creates preview image for scramble state.

```typescript
function generateScramblePreview(scramble: string): string
```

**Example:**
```typescript
const previewUrl = generateScramblePreview("R U R' U' R' F R2 U' R' U'");
// Returns URL for cube image showing scrambled state
```

### generateCaseImageUrl()
Creates case setup visualization.

```typescript
function generateCaseImageUrl(
  caseId: string,
  stage: string,
  setupMoves: string,
  size?: number
): string
```

**Example:**
```typescript
const caseUrl = generateCaseImageUrl("F2L-1", "f2l", "R U R'", 120);
```

## 🧩 Component APIs

### Timer Component
Main timer component for full solve practice.

```typescript
interface TimerProps {
  onComplete: (time: number) => void;
  inspectionTime?: number;
  useInspection?: boolean;
  isFullSolve?: boolean;
  onTimerStateChange?: (state: TimerState) => void;
  onInspectionToggle?: (useInspection: boolean) => void;
  onInspectionTimeChange?: (inspectionTime: number) => void;
  initialDisplayTime?: string;
}
```

**Usage:**
```typescript
<Timer
  onComplete={handleSolveComplete}
  inspectionTime={15}
  useInspection={false}
  onTimerStateChange={(state) => setShowScramble(state === 'idle')}
/>
```

### CaseTimer Component
Simplified timer for algorithm practice.

```typescript
interface CaseTimerProps {
  caseId: string;
  onComplete: (time: number) => void;
  onClose?: () => void;
}
```

**Usage:**
```typescript
<CaseTimer
  caseId="F2L-1"
  onComplete={(time) => recordAlgorithmTime(algorithmId, time)}
  onClose={() => setActiveTimer(null)}
/>
```

### SessionManager Component
Session creation and management interface.

```typescript
interface SessionManagerProps {
  sessions: Session[];
  currentSession: Session;
  onSessionChange: (sessionId: string) => void;
  onCreateSession: (name: string) => void;
  onDeleteSession: (sessionId: string) => void;
}
```

## 🔧 Utility Functions

### Live Query Hooks
Dexie React hooks for real-time data updates.

```typescript
// Get all sessions
const sessions = useLiveQuery(() => db.sessions.toArray()) || [];

// Get current session
const currentSession = useLiveQuery(() => db.getCurrentSession());

// Get session solves
const solves = useLiveQuery(() => 
  currentSession 
    ? db.solves.where('sessionId').equals(currentSession.id).reverse().toArray()
    : Promise.resolve([])
, [currentSession?.id]) || [];
```

### Database Helpers
```typescript
// Initialize database with defaults
await initializeDatabase();

// Get current session
const session = await db.getCurrentSession();

// Set current session
await db.setCurrentSession(sessionId);
```

## 📊 Type Definitions

### Core Types
```typescript
// Solve record
interface Solve {
  id?: number;
  sessionId: string;
  caseId?: string;
  algorithmId?: number;
  time: number;
  scramble: string;
  date: Date;
  penalty?: "DNF" | "+2";
  notes?: string;
}

// Practice session
interface Session {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type?: "full" | "case";
  stage?: CubeStage;
  caseId?: string;
  solveCount: number;
  useInspection?: boolean;
  inspectionTime?: number;
}

// Personal best record
interface PersonalBest {
  id?: number;
  type: "single" | "ao5" | "ao12" | "ao50" | "ao100";
  time: number;
  date: Date;
  sessionId: string;
  solveIds: number[];
}

// Algorithm definition
interface Algorithm {
  id: string;
  moves: string;
  isMain: boolean;
  practiceCount: number;
  bestTime?: number;
  averageOf5?: number;
  averageOf12?: number;
  times: number[];
  lastPracticed?: Date;
}

// Cube case definition
interface CubeCase {
  id: string;
  name: string;
  stage: CubeStage;
  group: string;
  setupMoves: string;
  algorithms: Algorithm[];
  isFavorite: boolean;
}
```

### Enums
```typescript
// Timer states
enum TimerState {
  IDLE = "idle",
  READY = "ready",
  INSPECTION = "inspection",
  INSPECTION_READY = "inspection_ready",
  RUNNING = "running",
  STOPPED = "stopped"
}

// Cube stages
type CubeStage = "F2L" | "OLL" | "PLL";
```

## 🔍 Error Handling

### Database Errors
```typescript
try {
  await db.solves.add(solve);
} catch (error) {
  if (error.name === 'ConstraintError') {
    console.error('Data constraint violation:', error);
  } else if (error.name === 'QuotaExceededError') {
    console.error('Storage quota exceeded:', error);
  } else {
    console.error('Database error:', error);
  }
}
```

### Timer Errors
```typescript
// Handle timer precision issues
const startTime = performance.now ? performance.now() : Date.now();

// Validate time values
const isValidTime = (time: number): boolean => {
  return time > 0 && time < 600000; // 0-10 minutes
};
```

## 🚀 Performance Considerations

### Database Optimization
```typescript
// Use indexes for efficient queries
const recentSolves = await db.solves
  .orderBy('date')        // Uses date index
  .reverse()
  .limit(100)
  .toArray();

// Batch operations
await db.transaction('rw', db.solves, db.sessions, async () => {
  await db.solves.add(solve);
  await db.sessions.update(sessionId, { solveCount: count + 1 });
});
```

### React Optimization
```typescript
// Memoize expensive calculations
const stats = useMemo(() => 
  calculateSessionStats(solves), [solves]
);

// Stable callback references
const handleComplete = useCallback((time: number) => {
  onComplete(time);
}, [onComplete]);
```

---

This API reference covers the core functionality of CraftyCubing. For implementation details and examples, refer to the source code and other documentation files.