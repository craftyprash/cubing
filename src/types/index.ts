export type CubeStage = "F2L" | "OLL" | "PLL";

// ACTIVE TYPES - All in use

export interface PersonalBest {
  id?: number;
  type: "single" | "ao5" | "ao12" | "ao50" | "ao100";
  time: number;
  date: Date;
  sessionId: string;
  solveIds: number[];
}

export interface Solve {
  id?: number;
  sessionId: string;
  caseId?: string; // Used for case-specific training
  algorithmId?: number; // Used for algorithm-specific training
  time: number;
  scramble: string;
  date: Date;
  penalty?: "DNF" | "+2";
  notes?: string;
}

export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type?: "full" | "case"; // Used to distinguish session types
  stage?: CubeStage; // Used for case-specific sessions
  caseId?: string; // Used for case-specific sessions
  solveCount: number;
  // NEW: Session-specific inspection settings
  useInspection?: boolean; // Whether inspection is enabled for this session
  inspectionTime?: number; // Inspection time in seconds for this session
}

export interface UserSettings {
  id?: number;
  theme: "light" | "dark";
  timerStartDelay: number;
  timerStopDelay: number;
  useInspectionTime: boolean; // Global default
  inspectionTime: number; // Global default
  showAlgorithmOnTraining: boolean;
  defaultTrainingMode: "full" | "case";
  defaultCubeStage: CubeStage;
  currentSessionId?: string;
}

// LEGACY TYPES - Used for case library but not stored in DB

export interface Algorithm {
  id: string; // Generated dynamically
  moves: string;
  isMain: boolean;
  practiceCount: number;
  bestTime?: number;
  averageOf5?: number;
  averageOf12?: number;
  times: number[];
  lastPracticed?: Date;
}

export interface CubeCase {
  id: string;
  name: string;
  stage: CubeStage;
  group: string;
  setupMoves: string;
  algorithms: Algorithm[];
  isFavorite: boolean;
}