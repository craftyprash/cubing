# Database Schema Documentation

CraftyCubing uses IndexedDB through Dexie.js for client-side data persistence. This document covers the database schema, migration strategies, and data management patterns.

## 🗄️ Database Overview

### Technology Stack
- **IndexedDB**: Browser-native NoSQL database
- **Dexie.js**: Promise-based IndexedDB wrapper
- **Live Queries**: Real-time UI updates
- **Transactions**: ACID compliance for data integrity

### Database Name
`CraftyCubing` (stored in browser's IndexedDB)

## 📋 Schema Definition

### Current Schema (Version 1)

```typescript
this.version(1).stores({
  solves: "++id, sessionId, date, caseId, algorithmId",
  sessions: "id, name, date, type, stage, caseId", 
  personalBests: "++id, type, date",
  userSettings: "++id",
  cubeCaseFavorites: "++id, caseId, dateAdded",
  algorithmStats: "algorithmId, caseId, lastPracticed"
});
```

## 📊 Table Definitions

### 1. Solves Table
**Purpose**: Individual solve records for timing and statistics

```typescript
interface Solve {
  id?: number;              // Auto-increment primary key
  sessionId: string;        // Foreign key to sessions
  caseId?: string;          // Optional: for case-specific practice
  algorithmId?: number;     // Optional: for algorithm-specific practice
  time: number;             // Solve time in milliseconds
  scramble: string;         // Scramble sequence used
  date: Date;               // When the solve was completed
  penalty?: "DNF" | "+2";   // Time penalties
  notes?: string;           // User notes about the solve
}
```

**Indexes**:
- `++id`: Primary key (auto-increment)
- `sessionId`: For session-specific queries
- `date`: For chronological sorting
- `caseId`: For case practice statistics
- `algorithmId`: For algorithm practice statistics

**Usage Examples**:
```typescript
// Get all solves for a session
const sessionSolves = await db.solves
  .where('sessionId')
  .equals(sessionId)
  .reverse()
  .toArray();

// Get recent solves across all sessions
const recentSolves = await db.solves
  .orderBy('date')
  .reverse()
  .limit(100)
  .toArray();
```

### 2. Sessions Table
**Purpose**: Practice session organization and settings

```typescript
interface Session {
  id: string;               // Unique session identifier
  name: string;             // User-defined session name
  createdAt: Date;          // Session creation timestamp
  updatedAt: Date;          // Last modification timestamp
  type?: "full" | "case";   // Session type
  stage?: CubeStage;        // For case-specific sessions
  caseId?: string;          // For case-specific sessions
  solveCount: number;       // Cached solve count
  useInspection?: boolean;  // Session-specific inspection setting
  inspectionTime?: number;  // Session-specific inspection time
}
```

**Indexes**:
- `id`: Primary key
- `name`: For session lookup
- `date`: For chronological sorting
- `type`: For filtering by session type
- `stage`: For case practice filtering
- `caseId`: For case-specific sessions

**Usage Examples**:
```typescript
// Create new session
await db.sessions.put({
  id: `session_${Date.now()}`,
  name: "Speed Practice",
  createdAt: new Date(),
  updatedAt: new Date(),
  solveCount: 0,
  useInspection: true,
  inspectionTime: 15
});

// Update session solve count
await db.sessions.update(sessionId, {
  solveCount: session.solveCount + 1,
  updatedAt: new Date()
});
```

### 3. Personal Bests Table
**Purpose**: Track achievement records across all sessions

```typescript
interface PersonalBest {
  id?: number;              // Auto-increment primary key
  type: "single" | "ao5" | "ao12" | "ao50" | "ao100";
  time: number;             // Record time in milliseconds
  date: Date;               // When the record was achieved
  sessionId: string;        // Session where record was set
  solveIds: number[];       // Solve IDs that contributed to the record
}
```

**Indexes**:
- `++id`: Primary key (auto-increment)
- `type`: For record type queries
- `date`: For chronological sorting

**Usage Examples**:
```typescript
// Save new personal best
await db.personalBests.add({
  type: "single",
  time: 8450, // 8.45 seconds
  date: new Date(),
  sessionId: currentSession.id,
  solveIds: [latestSolveId]
});

// Get all personal bests
const allPBs = await db.personalBests
  .orderBy('date')
  .reverse()
  .toArray();
```

### 4. User Settings Table
**Purpose**: Application configuration and preferences

```typescript
interface UserSettings {
  id?: number;              // Primary key (always 1)
  theme: "light" | "dark";  // UI theme preference
  timerStartDelay: number;  // Hold time before timer starts (ms)
  timerStopDelay: number;   // Delay before timer can be stopped (ms)
  useInspectionTime: boolean; // Global inspection default
  inspectionTime: number;   // Global inspection time default
  showAlgorithmOnTraining: boolean; // Show algorithms during practice
  defaultTrainingMode: "full" | "case"; // Default practice mode
  defaultCubeStage: CubeStage; // Default stage for case practice
  currentSessionId?: string; // Currently active session
}
```

**Indexes**:
- `++id`: Primary key (singleton record)

**Usage Examples**:
```typescript
// Initialize default settings
await db.userSettings.add({
  id: 1,
  theme: "dark",
  timerStartDelay: 250,
  useInspectionTime: true,
  inspectionTime: 15,
  currentSessionId: "default"
});

// Update current session
await db.userSettings.update(1, {
  currentSessionId: newSessionId
});
```

### 5. Cube Case Favorites Table
**Purpose**: Track user's favorite cases for quick access

```typescript
interface CubeCaseFavorite {
  id?: number;              // Auto-increment primary key
  caseId: string;           // Case identifier (e.g., "F2L-1", "OLL-21")
  dateAdded: Date;          // When case was favorited
}
```

**Indexes**:
- `++id`: Primary key (auto-increment)
- `caseId`: For case lookup
- `dateAdded`: For chronological sorting

**Usage Examples**:
```typescript
// Add case to favorites
await db.cubeCaseFavorites.add({
  caseId: "F2L-1",
  dateAdded: new Date()
});

// Remove from favorites
await db.cubeCaseFavorites
  .where('caseId')
  .equals(caseId)
  .delete();

// Get all favorites
const favorites = await db.cubeCaseFavorites.toArray();
```

### 6. Algorithm Stats Table
**Purpose**: Performance statistics for individual algorithms

```typescript
interface AlgorithmStat {
  algorithmId: string;      // Primary key (e.g., "F2L-1_main")
  caseId: string;           // Parent case identifier
  times: number[];          // Array of all practice times
  practiceCount: number;    // Total number of executions
  bestTime?: number;        // Best time achieved
  averageOf5?: number;      // Best average of 5
  averageOf12?: number;     // Best average of 12
  lastPracticed?: Date;     // Last practice session
}
```

**Indexes**:
- `algorithmId`: Primary key
- `caseId`: For case-specific queries
- `lastPracticed`: For sorting by recency

**Usage Examples**:
```typescript
// Update algorithm statistics
const existingStat = await db.algorithmStats.get(algorithmId);
const newTimes = [...(existingStat?.times || []), newTime];

await db.algorithmStats.put({
  algorithmId,
  caseId,
  times: newTimes,
  practiceCount: newTimes.length,
  bestTime: Math.min(...newTimes),
  lastPracticed: new Date()
});

// Get statistics for all algorithms of a case
const caseStats = await db.algorithmStats
  .where('caseId')
  .equals(caseId)
  .toArray();
```

## 🔄 Database Migrations

### Migration Strategy
CraftyCubing uses Dexie's versioning system for schema evolution:

```typescript
// Version 1 - Initial schema
this.version(1).stores({
  solves: "++id, sessionId, date, caseId, algorithmId",
  sessions: "id, name, date, type, stage, caseId",
  // ... other tables
});

// Version 2 - Example future migration
this.version(2).stores({
  // Keep existing tables
  solves: "++id, sessionId, date, caseId, algorithmId",
  sessions: "id, name, date, type, stage, caseId",
  // Add new table
  competitions: "++id, name, date, results"
});

// Data migration
this.version(2).upgrade(async (tx) => {
  // Migrate existing data if needed
  const sessions = await tx.table("sessions").toArray();
  for (const session of sessions) {
    await tx.table("sessions").update(session.id, {
      newField: "defaultValue"
    });
  }
});
```

### Migration Best Practices

#### ✅ Do's
- **Always increment version numbers**
- **Preserve existing data**
- **Test migrations thoroughly**
- **Document all changes**
- **Use transactions for complex migrations**

#### ❌ Don'ts
- **Never modify existing version schemas**
- **Don't remove required fields without migration**
- **Avoid complex migrations that could fail**
- **Don't skip version numbers**

### Example Migration Scenarios

#### Adding New Fields
```typescript
this.version(2).stores({
  sessions: "id, name, date, type, stage, caseId", // Same schema
});

this.version(2).upgrade(async (tx) => {
  const sessions = await tx.table("sessions").toArray();
  for (const session of sessions) {
    await tx.table("sessions").update(session.id, {
      useInspection: true, // Default value
      inspectionTime: 15
    });
  }
});
```

#### Restructuring Data
```typescript
this.version(3).stores({
  algorithmStats: "algorithmId, caseId, lastPracticed",
  algorithmTimes: "++id, algorithmId, time, date", // New table
});

this.version(3).upgrade(async (tx) => {
  const stats = await tx.table("algorithmStats").toArray();
  
  for (const stat of stats) {
    if (stat.times && stat.times.length > 0) {
      // Move times to new table
      for (const time of stat.times) {
        await tx.table("algorithmTimes").add({
          algorithmId: stat.algorithmId,
          time: time,
          date: new Date()
        });
      }
    }
  }
});
```

## 🔍 Query Patterns

### Live Queries
Real-time UI updates using Dexie React hooks:

```typescript
// Automatic updates when data changes
const solves = useLiveQuery(() => 
  db.solves
    .where('sessionId')
    .equals(currentSession?.id || '')
    .reverse()
    .toArray()
) || [];

// Statistics recalculate automatically
const stats = useMemo(() => 
  calculateSessionStats(solves), [solves]
);
```

### Complex Queries
```typescript
// Get best times across all sessions
const bestTimes = await db.solves
  .where('penalty')
  .notEqual('DNF')
  .sortBy('time');

// Get session statistics
const sessionStats = await db.solves
  .where('sessionId')
  .equals(sessionId)
  .and(solve => solve.penalty !== 'DNF')
  .toArray();
```

### Batch Operations
```typescript
// Bulk insert for data import
await db.solves.bulkAdd(importedSolves);

// Transaction for related updates
await db.transaction('rw', db.solves, db.sessions, async () => {
  await db.solves.add(newSolve);
  await db.sessions.update(sessionId, {
    solveCount: session.solveCount + 1
  });
});
```

## 🛡️ Data Integrity

### Validation
```typescript
// Validate solve data before insertion
const validateSolve = (solve: Solve): boolean => {
  return solve.time > 0 && 
         solve.scramble.length > 0 && 
         solve.sessionId.length > 0;
};

// Validate before saving
if (validateSolve(newSolve)) {
  await db.solves.add(newSolve);
}
```

### Error Handling
```typescript
try {
  await db.solves.add(solve);
} catch (error) {
  if (error.name === 'ConstraintError') {
    console.error('Data constraint violation:', error);
  } else if (error.name === 'QuotaExceededError') {
    console.error('Storage quota exceeded:', error);
  }
}
```

## 💾 Backup and Export

### Data Export
```typescript
export const exportUserData = async (): Promise<string> => {
  const data = {
    solves: await db.solves.toArray(),
    sessions: await db.sessions.toArray(),
    personalBests: await db.personalBests.toArray(),
    userSettings: await db.userSettings.toArray(),
    cubeCaseFavorites: await db.cubeCaseFavorites.toArray(),
    algorithmStats: await db.algorithmStats.toArray(),
    exportDate: new Date().toISOString(),
    version: db.verno
  };
  return JSON.stringify(data, null, 2);
};
```

### Data Import
```typescript
export const importUserData = async (jsonData: string): Promise<void> => {
  const data = JSON.parse(jsonData);
  
  await db.transaction('rw', 
    db.solves, db.sessions, db.personalBests, 
    db.userSettings, db.cubeCaseFavorites, db.algorithmStats,
    async () => {
      // Clear existing data
      await Promise.all([
        db.solves.clear(),
        db.sessions.clear(),
        db.personalBests.clear(),
        db.userSettings.clear(),
        db.cubeCaseFavorites.clear(),
        db.algorithmStats.clear()
      ]);
      
      // Import new data
      await Promise.all([
        db.solves.bulkAdd(data.solves),
        db.sessions.bulkAdd(data.sessions),
        db.personalBests.bulkAdd(data.personalBests),
        db.userSettings.bulkAdd(data.userSettings),
        db.cubeCaseFavorites.bulkAdd(data.cubeCaseFavorites),
        db.algorithmStats.bulkAdd(data.algorithmStats)
      ]);
    }
  );
};
```

## 🔧 Performance Optimization

### Indexing Strategy
- **Primary Keys**: Auto-increment for natural ordering
- **Foreign Keys**: Indexed for join-like operations
- **Date Fields**: Indexed for chronological queries
- **Frequently Queried Fields**: Custom indexes

### Query Optimization
```typescript
// Use indexes for efficient queries
const recentSolves = await db.solves
  .orderBy('date')        // Uses date index
  .reverse()
  .limit(50)
  .toArray();

// Compound queries with where clauses
const sessionSolves = await db.solves
  .where('sessionId')     // Uses sessionId index
  .equals(sessionId)
  .and(solve => solve.penalty !== 'DNF') // Additional filtering
  .toArray();
```

### Memory Management
```typescript
// Use cursors for large datasets
await db.solves.each(solve => {
  // Process each solve without loading all into memory
  processSolve(solve);
});

// Limit query results
const latestSolves = await db.solves
  .orderBy('date')
  .reverse()
  .limit(1000)  // Prevent memory issues
  .toArray();
```

---

This database schema provides a robust foundation for speedcubing data management while maintaining flexibility for future enhancements and ensuring data integrity across all operations.