import Dexie, { Table } from "dexie";
import {
  CubeCase,
  Algorithm,
  Solve,
  Session,
  PersonalBest,
  UserSettings,
} from "../types";

interface CubeCaseFavorite {
  id?: number;
  caseId: string;
  dateAdded: Date;
}

interface AlgorithmStat {
  algorithmId: string;
  caseId: string;
  times: number[];
  practiceCount: number;
  bestTime?: number;
  averageOf5?: number;
  averageOf12?: number;
  lastPracticed?: Date;
}

class CraftyCubingDB extends Dexie {
  // Active tables - all in use
  solves!: Table<Solve, number>;
  sessions!: Table<Session, string>;
  personalBests!: Table<PersonalBest, number>;
  userSettings!: Table<UserSettings, number>;
  cubeCaseFavorites!: Table<CubeCaseFavorite, number>;
  algorithmStats!: Table<AlgorithmStat, string>;

  constructor() {
    super("CraftyCubing");

    // VERSION 1 - Initial release schema
    this.version(1).stores({
      // ACTIVE TABLES:
      solves: "++id, sessionId, date, caseId, algorithmId", // Timer solves
      sessions: "id, name, date, type, stage, caseId", // Session management
      personalBests: "++id, type, date", // PB tracking
      userSettings: "++id", // App settings
      cubeCaseFavorites: "++id, caseId, dateAdded", // Case library favorites
      algorithmStats: "algorithmId, caseId, lastPracticed", // Case practice stats
    });

    /*
    ==================================================================================
    DATABASE UPGRADE GUIDE - HOW TO ADD NEW VERSIONS WITHOUT LOSING USER DATA
    ==================================================================================
    
    When you need to modify the database schema, follow these steps:
    
    1. NEVER modify existing version schemas - always add a new version
    2. Use .upgrade() to migrate existing data to new structure
    3. Test thoroughly with existing data before release
    
    EXAMPLE: Adding a new table or column
    
    this.version(2).stores({
      // Keep all existing tables with same or compatible schema
      solves: "++id, sessionId, date, caseId, algorithmId",
      sessions: "id, name, date, type, stage, caseId", 
      personalBests: "++id, type, date",
      userSettings: "++id",
      cubeCaseFavorites: "++id, caseId, dateAdded",
      algorithmStats: "algorithmId, caseId, lastPracticed",
      // Add new table
      newTable: "++id, someField, anotherField"
    });
    
    // Optional: Migrate existing data
    this.version(2).upgrade(async (tx) => {
      // Example: Add new fields to existing records
      const sessions = await tx.table("sessions").toArray();
      for (const session of sessions) {
        await tx.table("sessions").update(session.id, {
          newField: "defaultValue"
        });
      }
    });
    
    EXAMPLE: Modifying existing table structure
    
    this.version(3).stores({
      // Modify existing table (add/remove indexes, change primary key, etc.)
      solves: "++id, sessionId, date, caseId, algorithmId, newField",
      // ... other tables remain the same
    });
    
    this.version(3).upgrade(async (tx) => {
      // Migrate data if needed
      const solves = await tx.table("solves").toArray();
      for (const solve of solves) {
        await tx.table("solves").update(solve.id!, {
          newField: calculateNewFieldValue(solve)
        });
      }
    });
    
    IMPORTANT NOTES:
    - Dexie automatically handles schema changes between versions
    - Users' existing data is preserved during upgrades
    - Always test upgrades with real data before releasing
    - Consider backwards compatibility for a few versions
    - Document breaking changes in release notes
    
    TESTING UPGRADES:
    1. Create test data in current version
    2. Implement new version
    3. Verify data migrates correctly
    4. Test all app functionality with migrated data
    
    ROLLBACK STRATEGY:
    - Keep database backups before major upgrades
    - Implement export/import functionality for user data
    - Consider gradual rollouts for major schema changes
    
    ==================================================================================
    */
  }

  async initializeDefaultSettings(): Promise<void> {
    const settingsCount = await this.userSettings.count();

    if (settingsCount === 0) {
      await this.userSettings.add({
        id: 1,
        theme: "light",
        timerStartDelay: 300,
        timerStopDelay: 0,
        useInspectionTime: true,
        inspectionTime: 15,
        showAlgorithmOnTraining: true,
        defaultTrainingMode: "full",
        defaultCubeStage: "F2L",
        currentSessionId: "default",
      });
    }
  }

  async initializeDefaultSession(): Promise<void> {
    const defaultSession = await this.sessions.get("default");

    if (!defaultSession) {
      const userSettings = await this.userSettings.get(1);
      await this.sessions.put({
        id: "default",
        name: "Default Session",
        createdAt: new Date(),
        updatedAt: new Date(),
        solveCount: 0,
        useInspection: userSettings?.useInspectionTime ?? true,
        inspectionTime: userSettings?.inspectionTime ?? 15,
      });
    }
  }

  async getCurrentSession(): Promise<Session | undefined> {
    const settings = await this.userSettings.get(1);
    if (!settings) {
      return this.sessions.get("default");
    }
    return this.sessions.get(settings.currentSessionId || "default");
  }

  async setCurrentSession(sessionId: string): Promise<void> {
    await this.userSettings.update(1, { currentSessionId: sessionId });
  }

  /*
  ==================================================================================
  DATA BACKUP AND EXPORT UTILITIES
  ==================================================================================
  
  Consider implementing these methods for data safety:
  
  async exportUserData(): Promise<string> {
    const data = {
      solves: await this.solves.toArray(),
      sessions: await this.sessions.toArray(),
      personalBests: await this.personalBests.toArray(),
      userSettings: await this.userSettings.toArray(),
      cubeCaseFavorites: await this.cubeCaseFavorites.toArray(),
      algorithmStats: await this.algorithmStats.toArray(),
      exportDate: new Date().toISOString(),
      version: 1
    };
    return JSON.stringify(data, null, 2);
  }
  
  async importUserData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    
    await this.transaction('rw', this.solves, this.sessions, this.personalBests, 
                          this.userSettings, this.cubeCaseFavorites, this.algorithmStats, 
                          async () => {
      // Clear existing data
      await this.solves.clear();
      await this.sessions.clear();
      await this.personalBests.clear();
      await this.userSettings.clear();
      await this.cubeCaseFavorites.clear();
      await this.algorithmStats.clear();
      
      // Import new data
      await this.solves.bulkAdd(data.solves);
      await this.sessions.bulkAdd(data.sessions);
      await this.personalBests.bulkAdd(data.personalBests);
      await this.userSettings.bulkAdd(data.userSettings);
      await this.cubeCaseFavorites.bulkAdd(data.cubeCaseFavorites);
      await this.algorithmStats.bulkAdd(data.algorithmStats);
    });
  }
  
  ==================================================================================
  */
}

export const db = new CraftyCubingDB();

// Initialize database with default settings and session
export const initializeDatabase = async () => {
  try {
    // Don't delete existing database - just ensure defaults exist
    // This preserves user data across app updates
    await db.initializeDefaultSettings();
    await db.initializeDefaultSession();

    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

/*
==================================================================================
DEVELOPMENT UTILITIES - Remove in production
==================================================================================

// For development only - resets database to clean state
export const resetDatabase = async () => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Database reset only allowed in development');
  }
  
  await Dexie.delete("CraftyCubing");
  const newDb = new CraftyCubingDB();
  await newDb.initializeDefaultSettings();
  await newDb.initializeDefaultSession();
  return true;
};

// For development only - logs database contents
export const debugDatabase = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  console.log('=== DATABASE DEBUG ===');
  console.log('Solves:', await db.solves.toArray());
  console.log('Sessions:', await db.sessions.toArray());
  console.log('Personal Bests:', await db.personalBests.toArray());
  console.log('User Settings:', await db.userSettings.toArray());
  console.log('Case Favorites:', await db.cubeCaseFavorites.toArray());
  console.log('Algorithm Stats:', await db.algorithmStats.toArray());
  console.log('======================');
};

==================================================================================
*/