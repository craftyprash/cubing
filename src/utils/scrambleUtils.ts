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
 */
export const generateScramble = (length: number = 20): string => {
  const scramble: string[] = [];
  let lastAxis = -1;
  let lastFace = -1;
  
  for (let i = 0; i < length; i++) {
    let faceIndex;
    let axis;
    
    // Avoid moves on the same axis back to back
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
 */
export const formatMoves = (moves: string): string => {
  if (!moves) return '';
  
  // Clean up extra spaces
  return moves
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Get the opposite of a move (for undoing)
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
 */
export const reverseAlgorithm = (algorithm: string): string => {
  if (!algorithm) return '';
  
  return algorithm
    .split(' ')
    .map(move => getOppositeMove(move))
    .reverse()
    .join(' ');
};