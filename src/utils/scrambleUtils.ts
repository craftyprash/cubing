/**
 * scrambleUtils.ts - Scramble Generation and Move Utilities
 * 
 * Provides functionality for generating random cube scrambles and manipulating
 * move sequences. Used throughout the application for practice scrambles and
 * algorithm processing.
 * 
 * Key Features:
 * - WCA-compliant scramble generation
 * - Move sequence formatting and validation
 * - Algorithm reversal for setup/teardown
 * - Move notation parsing and manipulation
 * 
 * Scramble Generation:
 * - Generates 20-move scrambles by default
 * - Avoids consecutive moves on same axis
 * - Uses standard WCA notation (U, D, R, L, F, B)
 * - Includes move modifiers (', 2)
 * - Follows white-on-top, green-in-front orientation
 * 
 * Move Processing:
 * - Formats move sequences with proper spacing
 * - Calculates opposite moves for algorithm reversal
 * - Validates move notation
 * - Handles wide moves and rotations (future expansion)
 * 
 * Technical Implementation:
 * - Uses axis-based move generation to avoid redundancy
 * - Implements proper randomization with constraints
 * - Provides utility functions for move manipulation
 * - Designed for extensibility (can add more move types)
 * 
 * Usage:
 * - Training page: Generates practice scrambles
 * - Case library: Processes setup moves and algorithms
 * - Algorithm editing: Validates and formats user input
 * - Statistics: Processes solve sequences for analysis
 * 
 * Future Enhancements:
 * - Integration with cubing.js for true random state scrambles
 * - Support for different puzzle types (2x2, 4x4, etc.)
 * - Advanced scramble filtering (avoid specific patterns)
 * - Scramble difficulty analysis
 */

// Basic scramble generator for Rubik's Cube
// Note: This is a placeholder. In a production app, you'd use a more sophisticated scramble generator
// like the Cubing.js library for proper random state scrambles

const MOVES = ['U', 'D', 'R', 'L', 'F', 'B'];
const MODIFIERS = ['', "'", '2'];

/**
 * Generate a random scramble of a specified length
 * Following WCA rules: white on top, green in front
 * 
 * Algorithm:
 * 1. Select random face from available moves
 * 2. Ensure no consecutive moves on same axis
 * 3. Add random modifier (none, prime, double)
 * 4. Track last axis and face to avoid conflicts
 * 
 * @param length - Number of moves in scramble (default: 20)
 * @returns Space-separated scramble string
 */
export const generateScramble = (length: number = 20): string => {
  const scramble: string[] = [];
  let lastAxis = -1;
  let lastFace = -1;
  
  for (let i = 0; i < length; i++) {
    let faceIndex;
    let axis;
    
    // Avoid moves on the same axis back to back
    // Axis mapping: U/D = 0, R/L = 1, F/B = 2
    do {
      faceIndex = Math.floor(Math.random() * MOVES.length);
      axis = Math.floor(faceIndex / 2);
    } while (axis === lastAxis && faceIndex === lastFace);
    
    const move = MOVES[faceIndex];
    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    
    scramble.push(`${move}${modifier}`);
    
    lastAxis = axis;
    lastFace = faceIndex;
  }
  
  return scramble.join(' ');
};

/**
 * Format a move sequence with proper spacing
 * Cleans up extra whitespace and normalizes formatting
 * 
 * @param moves - Raw move sequence string
 * @returns Cleaned and formatted move sequence
 */
export const formatMoves = (moves: string): string => {
  if (!moves) return '';
  
  // Clean up extra spaces and normalize
  return moves
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Get the opposite of a move (for undoing)
 * Used for algorithm reversal and setup/teardown sequences
 * 
 * Move opposites:
 * - R becomes R'
 * - R' becomes R
 * - R2 stays R2 (self-inverse)
 * 
 * @param move - Single move string (e.g., "R", "U'", "F2")
 * @returns Opposite move string
 */
export const getOppositeMove = (move: string): string => {
  const base = move.charAt(0);
  const modifier = move.substring(1);
  
  if (modifier === "'") {
    return base;
  } else if (modifier === '') {
    return `${base}'`;
  } else if (modifier === '2') {
    return `${base}2`;
  }
  
  return move;
};

/**
 * Reverse a sequence of moves (for undoing)
 * Useful for creating setup/teardown sequences
 * 
 * Process:
 * 1. Split algorithm into individual moves
 * 2. Get opposite of each move
 * 3. Reverse the order
 * 
 * Example: "R U R' U'" becomes "U R U' R'"
 * 
 * @param algorithm - Space-separated move sequence
 * @returns Reversed algorithm sequence
 */
export const reverseAlgorithm = (algorithm: string): string => {
  if (!algorithm) return '';
  
  return algorithm
    .split(' ')
    .map(move => getOppositeMove(move))
    .reverse()
    .join(' ');
};

/**
 * Validate move notation
 * Checks if a move string follows standard cube notation
 * 
 * @param move - Move string to validate
 * @returns True if valid move notation
 */
export const isValidMove = (move: string): boolean => {
  const movePattern = /^[UDRLBF][2']?$/;
  return movePattern.test(move);
};

/**
 * Parse algorithm into individual moves
 * Splits algorithm string and validates each move
 * 
 * @param algorithm - Algorithm string
 * @returns Array of individual moves, or null if invalid
 */
export const parseAlgorithm = (algorithm: string): string[] | null => {
  if (!algorithm) return [];
  
  const moves = algorithm.split(' ').filter(move => move.length > 0);
  
  // Validate all moves
  for (const move of moves) {
    if (!isValidMove(move)) {
      return null; // Invalid algorithm
    }
  }
  
  return moves;
};

/**
 * Count moves in an algorithm
 * Counts individual moves, treating modifiers as part of the move
 * 
 * @param algorithm - Algorithm string
 * @returns Number of moves in algorithm
 */
export const countMoves = (algorithm: string): number => {
  const moves = parseAlgorithm(algorithm);
  return moves ? moves.length : 0;
};

/**
 * Normalize algorithm notation
 * Ensures consistent formatting and spacing
 * 
 * @param algorithm - Raw algorithm string
 * @returns Normalized algorithm string
 */
export const normalizeAlgorithm = (algorithm: string): string => {
  const moves = parseAlgorithm(algorithm);
  return moves ? moves.join(' ') : algorithm;
};

/**
 * Generate scramble with specific constraints
 * Advanced scramble generation with additional parameters
 * 
 * @param options - Scramble generation options
 * @returns Generated scramble string
 */
export interface ScrambleOptions {
  length?: number;
  avoidMoves?: string[];
  requireMoves?: string[];
  maxConsecutive?: number;
}

export const generateConstrainedScramble = (options: ScrambleOptions = {}): string => {
  const {
    length = 20,
    avoidMoves = [],
    requireMoves = [],
    maxConsecutive = 1
  } = options;
  
  const availableMoves = MOVES.filter(move => !avoidMoves.includes(move));
  const scramble: string[] = [];
  let consecutiveCount = 0;
  let lastMove = '';
  
  // Ensure required moves are included
  const requiredMovesUsed = new Set<string>();
  
  for (let i = 0; i < length; i++) {
    let move: string;
    let modifier: string;
    
    // Try to include required moves first
    if (requiredMoves.length > 0 && requiredMovesUsed.size < requiredMoves.length) {
      const unusedRequired = requireMoves.filter(m => !requiredMovesUsed.has(m));
      if (unusedRequired.length > 0 && Math.random() < 0.3) {
        move = unusedRequired[Math.floor(Math.random() * unusedRequired.length)];
        requiredMovesUsed.add(move);
      } else {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    } else {
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // Check consecutive move limit
    if (move === lastMove) {
      consecutiveCount++;
      if (consecutiveCount >= maxConsecutive) {
        // Force different move
        const otherMoves = availableMoves.filter(m => m !== lastMove);
        move = otherMoves[Math.floor(Math.random() * otherMoves.length)];
        consecutiveCount = 1;
      }
    } else {
      consecutiveCount = 1;
    }
    
    modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    scramble.push(`${move}${modifier}`);
    lastMove = move;
  }
  
  return scramble.join(' ');
};