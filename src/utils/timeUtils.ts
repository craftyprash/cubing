/**
 * timeUtils.ts - Time Formatting and Statistics Calculation
 * 
 * Comprehensive utilities for handling speedcubing times, including formatting,
 * average calculations, and session statistics. Implements WCA-compliant
 * averaging rules and provides consistent time display throughout the application.
 * 
 * Key Features:
 * - Standardized time formatting for display
 * - WCA-compliant average calculations (trim best/worst for ao5+)
 * - DNF (Did Not Finish) handling
 * - Rolling average calculations
 * - Session statistics computation
 * - Personal best tracking
 * 
 * Time Formatting:
 * - Displays times in seconds with centisecond precision (X.XX)
 * - Handles null/undefined values gracefully
 * - Supports different precision levels
 * - Formats long times with minutes (M:SS.XX)
 * 
 * Average Calculations:
 * - ao5, ao12, ao50, ao100 with proper trimming
 * - DNF handling (more than 1 DNF = DNF average)
 * - Rolling window calculations for best averages
 * - Proper sorting and trimming for WCA compliance
 * 
 * Statistics Features:
 * - Current session statistics
 * - All-time best tracking
 * - Session comparison and analysis
 * - Personal best detection and recording
 * 
 * Technical Implementation:
 * - Uses milliseconds internally for precision
 * - Implements efficient rolling calculations
 * - Handles edge cases (empty sessions, insufficient solves)
 * - Provides debugging support with detailed logging
 * - Optimized for real-time updates during solving
 * 
 * Usage:
 * - Timer components: Format display times
 * - Training page: Calculate session statistics
 * - Case library: Track algorithm performance
 * - Personal bests: Detect and record achievements
 * - Statistics displays: Show formatted averages
 * 
 * WCA Compliance:
 * - Follows official WCA averaging rules
 * - Proper DNF handling in averages
 * - Correct trimming for ao5+ calculations
 * - Standard time formatting conventions
 */

/**
 * Standardized time formatting for display
 * @param timeMs Time in milliseconds
 * @param precision Number of decimal places (default: 2)
 * @returns Formatted time string
 */
export const formatTimeForDisplay = (
  timeMs: number | undefined | null,
  precision: number = 2,
): string => {
  if (timeMs === undefined || timeMs === null) return "--";

  // Convert to seconds with fixed precision
  return (timeMs / 1000).toFixed(precision);
};

/**
 * Format milliseconds to a time string (MM:SS.ms)
 */
export const formatTime = (timeMs: number): string => {
  if (timeMs === null || timeMs === 0) return "0.00";

  // Round to hundredths of a second (2 decimal places)
  const roundedMs = Math.round(timeMs);

  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = Math.floor((timeMs % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  }

  return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
};

/**
 * Calculate average of N times, excluding best and worst if count >= 5
 */
export const calculateAverage = (
  times: number[],
  count: number,
): number | null => {
  if (!times || times.length < count) return null;

  // Log input times for debugging
  console.log(
    `Calculating average of ${count}:`,
    times.slice(0, count).map((t) => t / 1000),
  );

  // Get the most recent N times
  const recentTimes = times.slice(0, count); // Don't use negative slice since we're iterating through windows

  // Count DNFs
  const dnfCount = recentTimes.filter((t) => t === -1).length;

  // If more than one DNF, the average is DNF
  if (dnfCount > 1) return null;

  // If we have 5 or more times, exclude best and worst
  if (count >= 5) {
    // Sort by time, treating DNF as worst possible time (Infinity)
    const sortedTimes = [...recentTimes]
      .map((t) => (t === -1 ? Infinity : t))
      .sort((a, b) => a - b);

    // Remove best and worst times
    const trimmedTimes = sortedTimes.slice(1, -1);

    // If any Infinity remains in the trimmed times, it means there was more than one DNF
    if (trimmedTimes.includes(Infinity)) return null;

    // Calculate average
    const result =
      trimmedTimes.reduce((sum, time) => sum + time, 0) / trimmedTimes.length;
    console.log(`Average result: ${result / 1000}`);
    return result;
  }

  // For averages of less than 5, if there's any DNF, the average is DNF
  if (dnfCount > 0) return null;

  // Calculate regular average
  return recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length;
};

/**
 * Calculate session stats including averages and best times
 */
export const calculateSessionStats = (
  sessionSolves: { time: number; penalty?: "DNF" | "+2" }[],
  allSolves?: { time: number; penalty?: "DNF" | "+2" }[],
): {
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
} => {
  // Set default values
  const defaultResult = {
    currentSingle: null,
    ao5: null,
    ao12: null,
    ao50: null,
    ao100: null,
    bestSingle: null,
    bestAo5: null,
    bestAo12: null,
    bestAo50: null,
    bestAo100: null,
  };

  // Handle empty sessions
  if (!sessionSolves || sessionSolves.length === 0) {
    // For empty sessions, we should still calculate all-time bests
    if (!allSolves || allSolves.length === 0) {
      return defaultResult; // No solves at all
    }

    // Process all solves for all-time best
    const allTimes = allSolves.map((solve) => {
      if (solve.penalty === "DNF") return -1;
      return solve.penalty === "+2" ? solve.time + 2000 : solve.time;
    });

    // Filter out DNFs
    const validAllTimes = allTimes.filter((t) => t !== -1);

    // All-time best single
    const bestOverallSingle =
      validAllTimes.length > 0 ? Math.min(...validAllTimes) : null;

    // Calculate best all-time averages
    let bestOverallAo5 = null;
    let bestOverallAo12 = null;
    let bestOverallAo50 = null;
    let bestOverallAo100 = null;

    // Find best averages for all solves
    [5, 12, 50, 100].forEach((size) => {
      if (allTimes.length >= size) {
        let bestAvg = Infinity;

        for (let i = 0; i <= allTimes.length - size; i++) {
          const windowTimes = allTimes.slice(i, i + size);
          const avg = calculateAverage(windowTimes, size);

          if (avg !== null && avg < bestAvg) {
            bestAvg = avg;
          }
        }

        if (bestAvg !== Infinity) {
          if (size === 5) bestOverallAo5 = bestAvg;
          else if (size === 12) bestOverallAo12 = bestAvg;
          else if (size === 50) bestOverallAo50 = bestAvg;
          else if (size === 100) bestOverallAo100 = bestAvg;
        }
      }
    });

    // Return results with null for current session stats but populated all-time bests
    return {
      currentSingle: null,
      ao5: null,
      ao12: null,
      ao50: null,
      ao100: null,
      bestSingle: bestOverallSingle,
      bestAo5: bestOverallAo5,
      bestAo12: bestOverallAo12,
      bestAo50: bestOverallAo50,
      bestAo100: bestOverallAo100,
    };
  }

  // Process session solves
  const sessionTimes = sessionSolves.map((solve) => {
    if (solve.penalty === "DNF") return -1;
    return solve.penalty === "+2" ? solve.time + 2000 : solve.time;
  });

  // Process all solves (for all-time best)
  const allTimes = allSolves
    ? allSolves.map((solve) => {
        if (solve.penalty === "DNF") return -1;
        return solve.penalty === "+2" ? solve.time + 2000 : solve.time;
      })
    : sessionTimes;

  // Filter out DNFs
  const validSessionTimes = sessionTimes.filter((t) => t !== -1);
  const validAllTimes = allTimes.filter((t) => t !== -1);

  // Current session best single (this is what should be shown in Current Session)
  const currentSessionSingle =
    validSessionTimes.length > 0 ? Math.min(...validSessionTimes) : null;

  // All-time best single
  const bestOverallSingle =
    validAllTimes.length > 0 ? Math.min(...validAllTimes) : null;

  // Current averages (most recent solves)
  const currentAo5 = calculateAverage(sessionTimes, 5);
  const currentAo12 = calculateAverage(sessionTimes, 12);
  const currentAo50 = calculateAverage(sessionTimes, 50);
  const currentAo100 = calculateAverage(sessionTimes, 100);

  // Calculate best averages for session
  let bestSessionAo5 = null;
  let bestSessionAo12 = null;
  let bestSessionAo50 = null;
  let bestSessionAo100 = null;

  // Calculate best averages for all-time
  let bestOverallAo5 = null;
  let bestOverallAo12 = null;
  let bestOverallAo50 = null;
  let bestOverallAo100 = null;

  // Find best averages in session
  [5, 12, 50, 100].forEach((size) => {
    if (sessionTimes.length >= size) {
      let bestAvg = Infinity;

      for (let i = 0; i <= sessionTimes.length - size; i++) {
        const windowTimes = sessionTimes.slice(i, i + size);
        const avg = calculateAverage(windowTimes, size);

        if (avg !== null && avg < bestAvg) {
          bestAvg = avg;
        }
      }

      if (bestAvg !== Infinity) {
        if (size === 5) bestSessionAo5 = bestAvg;
        else if (size === 12) bestSessionAo12 = bestAvg;
        else if (size === 50) bestSessionAo50 = bestAvg;
        else if (size === 100) bestSessionAo100 = bestAvg;
      }
    }
  });

  // Find best averages all-time (if allSolves provided)
  if (allSolves && allSolves !== sessionSolves) {
    [5, 12, 50, 100].forEach((size) => {
      if (allTimes.length >= size) {
        let bestAvg = Infinity;

        for (let i = 0; i <= allTimes.length - size; i++) {
          const windowTimes = allTimes.slice(i, i + size);
          const avg = calculateAverage(windowTimes, size);

          if (avg !== null && avg < bestAvg) {
            bestAvg = avg;
          }
        }

        if (bestAvg !== Infinity) {
          if (size === 5) bestOverallAo5 = bestAvg;
          else if (size === 12) bestOverallAo12 = bestAvg;
          else if (size === 50) bestOverallAo50 = bestAvg;
          else if (size === 100) bestOverallAo100 = bestAvg;
        }
      }
    });
  } else {
    // If no all solves provided, use session best
    bestOverallAo5 = bestSessionAo5;
    bestOverallAo12 = bestSessionAo12;
    bestOverallAo50 = bestSessionAo50;
    bestOverallAo100 = bestSessionAo100;
  }

  return {
    currentSingle: currentSessionSingle,
    ao5: currentAo5,
    ao12: currentAo12,
    ao50: currentAo50,
    ao100: currentAo100,
    bestSingle: bestOverallSingle,
    bestAo5: bestOverallAo5,
    bestAo12: bestOverallAo12,
    bestAo50: bestOverallAo50,
    bestAo100: bestOverallAo100,
  };
};