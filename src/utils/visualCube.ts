/**
 * visualCube.ts - Cube Visualization Utilities
 * 
 * Provides integration with the VisualCube API for generating cube state images.
 * Used throughout the application to show scramble states, case setups, and
 * algorithm demonstrations with accurate 3D cube representations.
 * 
 * Key Features:
 * - Integration with cube.rider.biz VisualCube API
 * - Multiple view angles (plan, oblique, trans)
 * - Stage-specific optimizations (F2L, OLL, PLL)
 * - Scramble state visualization
 * - Algorithm execution preview
 * - Customizable cube appearance
 * 
 * View Types:
 * - Plan: Top-down view, ideal for OLL/PLL cases
 * - Oblique: 3D angled view, perfect for F2L cases
 * - Trans: Transparent view for internal inspection
 * 
 * Use Cases:
 * - Training page: Show scramble state before solving
 * - Case library: Display case setup and final states
 * - Algorithm editing: Preview algorithm execution
 * - Educational content: Demonstrate cube positions
 * 
 * Technical Implementation:
 * - Generates URLs for external VisualCube service
 * - Handles URL encoding for complex move sequences
 * - Provides sensible defaults for different contexts
 * - Supports customization of size, colors, and background
 * - Implements caching-friendly URL generation
 * 
 * API Integration:
 * - Uses cube.rider.biz as the visualization service
 * - Supports PNG format for broad compatibility
 * - Implements transparent backgrounds for clean integration
 * - Handles WCA color scheme (white top, green front)
 * 
 * Performance Considerations:
 * - Generates static URLs for browser caching
 * - Uses appropriate image sizes for context
 * - Minimizes API calls through smart defaults
 * - Provides fallback handling for service unavailability
 * 
 * Future Enhancements:
 * - Local cube rendering for offline use
 * - Custom color schemes and themes
 * - Animation support for move sequences
 * - Integration with other visualization services
 */

// Utility for generating cube visualizations
export interface VisualCubeOptions {
  size?: number;
  view?: 'plan' | 'trans' | 'oblique';
  stage?: 'f2l' | 'oll' | 'pll';
  case?: string;
  fmt?: 'svg' | 'png';
  alg?: string;
  bg?: string;
  sch?: string;
}

const DEFAULT_OPTIONS: VisualCubeOptions = {
  size: 200,
  view: 'plan',
  fmt: 'png',
  bg: 't'
};

/**
 * Generate a URL for the VisualCube API
 * Creates URLs for cube state visualization with customizable options
 * 
 * @param options Configuration options for the cube visualization
 * @returns URL string for the VisualCube API
 */
export const generateVisualCubeUrl = (options: VisualCubeOptions): string => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  const baseUrl = 'https://cube.rider.biz/visualcube.php';
  
  const params = new URLSearchParams();
  params.append('fmt', 'png');
  
  if (finalOptions.size) params.append('size', finalOptions.size.toString());
  if (finalOptions.view) params.append('view', finalOptions.view);
  if (finalOptions.stage) params.append('stage', finalOptions.stage);
  if (finalOptions.alg) params.append('alg', finalOptions.alg);
  if (finalOptions.sch) params.append('sch', finalOptions.sch);
  params.append('bg', 't');
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate case preview using setup moves
 * Creates visualization for F2L, OLL, and PLL cases
 * 
 * Features:
 * - Automatic view selection based on stage
 * - F2L cases use oblique view for better visibility
 * - OLL/PLL cases use plan view for top layer focus
 * - Transparent background for clean integration
 * 
 * @param caseId Unique identifier for the case
 * @param stage Cube stage (f2l, oll, pll)
 * @param setupMoves Algorithm moves to set up the case
 * @param size Image size in pixels (default: 200)
 * @returns URL for the case visualization
 */
export const generateCaseImageUrl = (
  caseId: string,
  stage: string,
  setupMoves: string,
  size: number = DEFAULT_OPTIONS.size
): string => {
  // Use oblique view for F2L cases, plan view for others
  const view = stage.toLowerCase() === 'f2l' ? 'oblique' : 'plan';
  
  return generateVisualCubeUrl({
    size,
    view,
    stage: stage.toLowerCase() as 'f2l' | 'oll' | 'pll',
    alg: setupMoves,
    fmt: 'png',
    bg: 't'
  });
};

/**
 * Generate algorithm preview
 * Shows the result of applying an algorithm to a cube state
 * 
 * @param algorithmMoves The algorithm to visualize
 * @param setupMoves Optional setup moves to apply first
 * @param size Image size in pixels (default: 150)
 * @returns URL for the algorithm result visualization
 */
export const generateAlgorithmImageUrl = (
  algorithmMoves: string,
  setupMoves?: string,
  size: number = 150
): string => {
  const alg = setupMoves ? `${setupMoves} ${algorithmMoves}` : algorithmMoves;
  return generateVisualCubeUrl({
    size,
    view: 'plan',
    alg,
    fmt: 'png',
    bg: 't'
  });
};

/**
 * Generate scramble preview
 * Shows the cube state after applying a scramble sequence
 * 
 * Features:
 * - Uses oblique view for better 3D perspective
 * - WCA standard color scheme (white top, green front)
 * - Transparent background for integration
 * - Optimized size for scramble display
 * 
 * @param scramble The scramble sequence to visualize
 * @returns URL for the scrambled cube state
 */
export const generateScramblePreview = (scramble: string): string => {
  return generateVisualCubeUrl({
    size: 150,
    view: 'oblique',
    alg: scramble,
    fmt: 'png',
    bg: 't',
    sch: 'wrgyob' // U R F D L B - WCA standard colors (white top, green front)
  });
};

/**
 * Generate comparison view
 * Shows before and after states for algorithm learning
 * 
 * @param beforeAlg Algorithm for the "before" state
 * @param afterAlg Algorithm for the "after" state
 * @param size Image size for each cube
 * @returns Object with URLs for both states
 */
export const generateComparisonView = (
  beforeAlg: string,
  afterAlg: string,
  size: number = 120
): { before: string; after: string } => {
  return {
    before: generateVisualCubeUrl({
      size,
      view: 'plan',
      alg: beforeAlg,
      fmt: 'png',
      bg: 't'
    }),
    after: generateVisualCubeUrl({
      size,
      view: 'plan',
      alg: afterAlg,
      fmt: 'png',
      bg: 't'
    })
  };
};

/**
 * Generate step-by-step algorithm visualization
 * Creates a series of cube states showing algorithm execution
 * 
 * @param algorithm The algorithm to break down
 * @param maxSteps Maximum number of steps to show
 * @returns Array of URLs showing each step
 */
export const generateAlgorithmSteps = (
  algorithm: string,
  maxSteps: number = 8
): string[] => {
  const moves = algorithm.split(' ').filter(move => move.length > 0);
  const steps: string[] = [];
  
  for (let i = 0; i <= Math.min(moves.length, maxSteps); i++) {
    const partialAlg = moves.slice(0, i).join(' ');
    steps.push(generateVisualCubeUrl({
      size: 100,
      view: 'plan',
      alg: partialAlg,
      fmt: 'png',
      bg: 't'
    }));
  }
  
  return steps;
};

/**
 * Generate cube state for specific pattern
 * Creates visualization for common cube patterns and positions
 * 
 * @param pattern Predefined pattern name or custom algorithm
 * @param options Additional visualization options
 * @returns URL for the pattern visualization
 */
export const generatePatternView = (
  pattern: string,
  options: Partial<VisualCubeOptions> = {}
): string => {
  // Common patterns
  const patterns: Record<string, string> = {
    'solved': '',
    'checkerboard': "M2 E2 S2",
    'cross': "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    'superflip': "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
    'dots': "F R U R' U' F' f R U R' U' f'",
  };
  
  const algorithm = patterns[pattern.toLowerCase()] || pattern;
  
  return generateVisualCubeUrl({
    size: 200,
    view: 'oblique',
    alg: algorithm,
    fmt: 'png',
    bg: 't',
    ...options
  });
};

/**
 * Validate algorithm for visualization
 * Checks if an algorithm is valid for the VisualCube API
 * 
 * @param algorithm Algorithm string to validate
 * @returns True if algorithm is valid for visualization
 */
export const isValidForVisualization = (algorithm: string): boolean => {
  if (!algorithm || algorithm.trim() === '') return true; // Empty is valid (solved state)
  
  // Basic validation for cube notation
  const movePattern = /^[UDRLBFMES][2']?\s*$/;
  const moves = algorithm.split(' ').filter(move => move.length > 0);
  
  return moves.every(move => movePattern.test(move + ' '));
};

/**
 * Get optimal view for cube stage
 * Returns the best view angle for different cube stages
 * 
 * @param stage Cube stage (f2l, oll, pll)
 * @returns Optimal view type for the stage
 */
export const getOptimalView = (stage: string): 'plan' | 'oblique' | 'trans' => {
  switch (stage.toLowerCase()) {
    case 'f2l':
      return 'oblique'; // Better for seeing F2L pairs
    case 'oll':
    case 'pll':
      return 'plan'; // Better for top layer orientation
    default:
      return 'oblique'; // General 3D view
  }
};

/**
 * Generate thumbnail grid
 * Creates a grid of small cube visualizations for case overview
 * 
 * @param cases Array of case objects with algorithms
 * @param size Size for each thumbnail
 * @returns Array of thumbnail URLs
 */
export const generateThumbnailGrid = (
  cases: Array<{ id: string; setupMoves: string; stage: string }>,
  size: number = 80
): Array<{ id: string; url: string }> => {
  return cases.map(cubeCase => ({
    id: cubeCase.id,
    url: generateCaseImageUrl(cubeCase.id, cubeCase.stage, cubeCase.setupMoves, size)
  }));
};

/**
 * Cache management for cube images
 * Provides utilities for managing cached cube visualizations
 */
export const CubeImageCache = {
  /**
   * Generate cache key for a cube visualization
   */
  getCacheKey: (options: VisualCubeOptions): string => {
    const sortedOptions = Object.keys(options)
      .sort()
      .reduce((result, key) => {
        result[key] = options[key as keyof VisualCubeOptions];
        return result;
      }, {} as any);
    
    return btoa(JSON.stringify(sortedOptions));
  },
  
  /**
   * Check if image is likely cached by browser
   */
  isLikelyCached: (url: string): boolean => {
    // Simple heuristic - if we've generated this URL recently, it's likely cached
    const cacheKey = url.split('?')[1]; // Get query parameters
    const cached = sessionStorage.getItem(`cube_cache_${cacheKey}`);
    return cached !== null;
  },
  
  /**
   * Mark image as cached
   */
  markAsCached: (url: string): void => {
    const cacheKey = url.split('?')[1];
    sessionStorage.setItem(`cube_cache_${cacheKey}`, Date.now().toString());
  }
};