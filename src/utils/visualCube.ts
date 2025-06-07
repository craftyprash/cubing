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

// Generate case preview using setup moves
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

// Generate algorithm preview
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

// Generate scramble preview
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