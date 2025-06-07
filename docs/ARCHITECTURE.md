# CraftyCubing Architecture

This document provides a comprehensive overview of CraftyCubing's architecture, including component relationships, data flow, and design decisions.

## 🏗️ System Overview

CraftyCubing is a single-page application (SPA) built with React and TypeScript, designed for offline-first speedcubing practice. The architecture emphasizes performance, reliability, and user experience.

```
┌─────────────────────────────────────────────────────────────┐
│                    CraftyCubing App                         │
├─────────────────────────────────────────────────────────────┤
│  React Router (Navigation)                                  │
├─────────────────────────────────────────────────────────────┤
│  Pages Layer                                                │
│  ├── Training.tsx (Full Solve Practice)                     │
│  └── CaseLibrary.tsx (Algorithm Practice)                   │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                           │
│  ├── Timer System (Timer.tsx, CaseTimer.tsx)               │
│  ├── Session Management (SessionManager.tsx)               │
│  ├── UI Components (Modals, Forms, etc.)                   │
│  └── Shared Components (Layout, Header, Footer)            │
├─────────────────────────────────────────────────────────────┤
│  Utilities Layer                                            │
│  ├── timeUtils.ts (Statistics & Formatting)                │
│  ├── scrambleUtils.ts (Scramble Generation)                │
│  └── visualCube.ts (Cube Visualization)                    │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── Dexie.js (IndexedDB Wrapper)                          │
│  ├── Live Queries (Real-time Updates)                      │
│  └── Database Schema (Types & Migrations)                  │
├─────────────────────────────────────────────────────────────┤
│  Browser APIs                                               │
│  ├── IndexedDB (Persistent Storage)                        │
│  ├── Performance API (Precise Timing)                      │
│  └── Touch/Keyboard Events (User Input)                    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Design Principles

### 1. **Offline-First Architecture**
- All data stored locally in IndexedDB
- No external dependencies for core functionality
- Graceful handling of network unavailability
- Instant app startup and responsiveness

### 2. **Performance-Oriented**
- Precise timing using `Date.now()` and `setInterval`
- Optimized re-renders with React hooks
- Efficient database queries with Dexie live queries
- Minimal bundle size with tree shaking

### 3. **Mobile-First Design**
- Touch-optimized controls and gestures
- Responsive layouts for all screen sizes
- Prevention of unwanted browser behaviors
- Accessible button sizes and spacing

### 4. **Type Safety**
- Comprehensive TypeScript coverage
- Strict type checking enabled
- Interface definitions for all data structures
- Runtime type validation where needed

## 📱 Application Structure

### Page Components

#### Training.tsx
**Purpose**: Main interface for full solve practice
**Responsibilities**:
- Scramble generation and display
- Timer integration with inspection time
- Session management and switching
- Statistics calculation and display
- Solve history management
- Personal best detection

**Key Features**:
- Real-time statistics updates
- Confetti animation for personal bests
- Mobile-optimized touch controls
- Comprehensive solve management

#### CaseLibrary.tsx
**Purpose**: Algorithm practice interface
**Responsibilities**:
- Case browsing and filtering
- Algorithm timing and statistics
- Visual cube state display
- Favorites management
- Algorithm editing

**Key Features**:
- Multi-algorithm support per case
- Individual statistics tracking
- Visual case representations
- Practice history management

### Component Architecture

#### Timer System
```typescript
Timer.tsx (Main Timer)
├── Full-screen overlay modes
├── Inspection time support
├── Settings panel integration
├── Keyboard/touch event handling
└── State management (IDLE → READY → RUNNING → STOPPED)

CaseTimer.tsx (Case Practice Timer)
├── Simplified interface
├── No inspection time
├── Quick practice cycles
└── Algorithm-specific timing
```

#### Session Management
```typescript
SessionManager.tsx
├── Session creation/deletion
├── Session switching
├── Solve count display
└── Input validation
```

### Utility Functions

#### timeUtils.ts
- **formatTimeForDisplay()**: Consistent time formatting
- **calculateAverage()**: WCA-compliant averaging
- **calculateSessionStats()**: Comprehensive statistics
- **formatTime()**: Multiple format support

#### scrambleUtils.ts
- **generateScramble()**: Random scramble generation
- **formatMoves()**: Move sequence formatting
- **reverseAlgorithm()**: Algorithm inversion

#### visualCube.ts
- **generateVisualCubeUrl()**: Cube state visualization
- **generateScramblePreview()**: Scramble state images
- **generateCaseImageUrl()**: Case setup visualization

## 💾 Data Architecture

### Database Design
```typescript
// Core Tables
solves: Solve[]           // Individual solve records
sessions: Session[]       // Practice sessions
personalBests: PersonalBest[]  // Achievement tracking
userSettings: UserSettings[]   // App configuration
cubeCaseFavorites: CubeCaseFavorite[]  // Favorited cases
algorithmStats: AlgorithmStat[]        // Algorithm performance
```

### Data Flow Patterns

#### 1. **Live Query Pattern**
```typescript
// Real-time data updates
const solves = useLiveQuery(() => 
  db.solves.where('sessionId').equals(sessionId).toArray()
) || [];

// Automatic UI updates when data changes
useEffect(() => {
  // Recalculate statistics when solves change
  const stats = calculateSessionStats(solves);
  setCurrentStats(stats);
}, [solves]);
```

#### 2. **Transaction Pattern**
```typescript
// Atomic operations for data consistency
await db.transaction('rw', db.solves, db.sessions, async () => {
  await db.solves.add(newSolve);
  await db.sessions.update(sessionId, { 
    solveCount: session.solveCount + 1 
  });
});
```

#### 3. **Optimistic Updates**
```typescript
// Update UI immediately, sync to database
setDisplayTime(formatTime(elapsed));
await db.solves.add(solve); // Background save
```

## 🎮 Event Handling Architecture

### Timer Controls
```typescript
// Keyboard Events (Global)
window.addEventListener('keydown', handleKeyDown, true);  // Capture phase
window.addEventListener('keyup', handleKeyUp, true);

// Touch Events (Component-specific)
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}

// Mouse Events (Desktop fallback)
onMouseDown={handleMouseDown}
onMouseUp={handleMouseUp}
```

### Event Prevention Strategy
```typescript
// Prevent unwanted browser behaviors
e.preventDefault();    // Stop default action (scrolling)
e.stopPropagation();  // Stop event bubbling

// Touch-specific prevention
style={{ touchAction: 'none' }}  // Disable touch gestures
```

## 📊 State Management

### Component State
- **Local State**: UI-specific state (modals, forms, temporary values)
- **Derived State**: Calculated from database queries (statistics, averages)
- **Ref State**: Performance-critical state (timer intervals, DOM references)

### Global State
- **Database State**: Managed by Dexie live queries
- **User Settings**: Persisted configuration
- **Session Context**: Current active session

### State Update Patterns
```typescript
// Database-driven updates
const [stats, setStats] = useState(calculateStats(solves));
useEffect(() => {
  setStats(calculateStats(solves));
}, [solves]);

// Optimistic updates
const handleSolveComplete = async (time) => {
  setDisplayTime(formatTime(time));  // Immediate UI update
  await saveSolve(time);             // Background persistence
};
```

## 🔧 Performance Optimizations

### 1. **Efficient Rendering**
- `useMemo()` for expensive calculations
- `useCallback()` for stable function references
- Conditional rendering to minimize DOM updates

### 2. **Database Optimization**
- Indexed queries for fast lookups
- Batch operations for multiple updates
- Live queries for automatic updates

### 3. **Bundle Optimization**
- Tree shaking for unused code elimination
- Dynamic imports for code splitting
- Optimized dependencies

### 4. **Memory Management**
- Cleanup of intervals and timeouts
- Event listener removal
- Ref cleanup in useEffect

## 🚀 Deployment Architecture

### Build Process
```bash
npm run build
├── Vite bundling and optimization
├── TypeScript compilation
├── CSS processing (Tailwind)
├── Asset optimization
└── Static file generation
```

### Runtime Environment
- **Client-Side Only**: No server dependencies
- **Static Hosting**: Can be deployed anywhere
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Offline Capability**: Service worker for caching (future enhancement)

## 🔮 Future Architecture Considerations

### Scalability
- **Multi-device Sync**: Cloud storage integration
- **Plugin System**: Custom algorithm sets
- **Theming Engine**: User customization
- **Analytics**: Performance insights

### Performance
- **Web Workers**: Background calculations
- **Service Workers**: Offline functionality
- **Virtual Scrolling**: Large dataset handling
- **Lazy Loading**: Component optimization

### Features
- **Real-time Collaboration**: Multi-user sessions
- **Competition Mode**: Official timing
- **Video Integration**: Solve recording
- **AI Analysis**: Solve optimization

---

This architecture provides a solid foundation for current features while remaining flexible for future enhancements. The offline-first approach ensures reliability, while the component-based design enables maintainability and extensibility.