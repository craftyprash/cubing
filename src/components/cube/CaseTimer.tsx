/**
 * CaseTimer.tsx - Standalone Timer for Individual Case Practice
 * 
 * A simplified timer component specifically designed for practicing individual
 * F2L, OLL, and PLL cases. Unlike the main Timer component, this doesn't include
 * inspection time and focuses on quick, repeated practice of specific algorithms.
 * 
 * Key Features:
 * - Simple hold-to-start, tap-to-stop interface
 * - No inspection time (immediate start)
 * - Precise timing with centisecond accuracy
 * - Keyboard and touch controls
 * - Escape key to cancel without recording
 * - Visual state feedback with color changes
 * 
 * Timer States:
 * - IDLE: Ready to start timing
 * - READY: User holding spacebar/touch (red text)
 * - RUNNING: Timer actively running (green text)
 * - STOPPED: Timer stopped, showing final time (blue text)
 * 
 * Controls:
 * - Spacebar/Touch: Hold 0.25s to start, tap to stop
 * - Escape: Cancel timer without recording solve
 * 
 * Props:
 * - caseId: Identifier for the case being practiced
 * - onComplete: Callback when solve is completed with time in milliseconds
 * 
 * Usage:
 * Used within the CaseLibrary component for practicing specific algorithms.
 * Each case can have multiple algorithms (main, alt1, alt2) and this timer
 * records practice times for the selected algorithm.
 * 
 * Technical Implementation:
 * - Lightweight compared to main Timer (no inspection logic)
 * - Uses same precision timing approach (Date.now() + setInterval)
 * - Implements touch-action: none for mobile compatibility
 * - Prevents event bubbling to avoid conflicts with page scrolling
 * - Uses event capture phase for reliable keyboard handling
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { formatTimeForDisplay } from "../../utils/timeUtils";

interface CaseTimerProps {
  caseId: string;
  onComplete: (time: number) => void;
}

enum TimerState {
  IDLE = "idle",
  READY = "ready",
  RUNNING = "running",
  STOPPED = "stopped",
}

// A standalone timer component for timing individual case solves (Space to start/stop)
const CaseTimer: React.FC<CaseTimerProps> = ({ caseId, onComplete }) => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState<string>("0.00");
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

  // Touch handling refs
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 250; // 250ms hold duration

  const formatDisplayTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  // Starts timer and updates UI every 10ms with formatted time
const startRunningTimer = () => {
    const start = Date.now();
    setStartTime(start);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      setElapsedTime(elapsed);
      setDisplayTime(formatTimeForDisplay(elapsed));
    }, 10);

    setTimerInterval(interval);
  };

  // Stops the timer and calls onComplete with the elapsed time
const stopRunningTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (startTime) {
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      setElapsedTime(elapsed);
      setDisplayTime(formatTimeForDisplay(elapsed));
      onComplete(elapsed);
    }
  };

  // Cancel the timer without recording a solve
  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Reset to idle state without calling onComplete
    setTimerState(TimerState.IDLE);
    setStartTime(null);
    setDisplayTime("0.00");
    setTouchStartTime(null);
  };

  // Called on initial touch/space press
  const handleTouchStart = () => {
    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      setTimerState(TimerState.READY);
      setTouchStartTime(Date.now());
    } else if (timerState === TimerState.RUNNING) {
      setTimerState(TimerState.STOPPED);
      stopRunningTimer();
    }
  };

  // Called when user lifts touch or releases spacebar
  const handleTouchEnd = () => {
    if (!touchStartTime) return;

    const holdDuration = Date.now() - touchStartTime;

    if (holdDuration >= HOLD_DURATION && timerState === TimerState.READY) {
      setTimerState(TimerState.RUNNING);
      startRunningTimer();
    } else if (timerState === TimerState.READY) {
      setTimerState(TimerState.IDLE);
    }

    setTouchStartTime(null);
  };

  // Touch event handlers - only for timer display area
  const handleTimerTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent text selection and scrolling
    e.stopPropagation(); // Prevent event bubbling
    isHoldingRef.current = true;
    handleTouchStart();
  }, [timerState]);

  const handleTimerTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = false;
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    handleTouchEnd();
  }, [timerState, touchStartTime]);

  // Mouse event handlers (for desktop) - only for timer display area
  const handleTimerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = true;
    handleTouchStart();
  }, [timerState]);

  const handleTimerMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = false;
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    handleTouchEnd();
  }, [timerState, touchStartTime]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        handleTouchStart();
      } else if (e.code === "Escape") {
        e.preventDefault();
        if (timerState === TimerState.RUNNING) {
          // Cancel the timer without recording the solve
          cancelTimer();
        } else if (timerState === TimerState.READY) {
          // Cancel ready state and return to idle
          setTimerState(TimerState.IDLE);
          setTouchStartTime(null);
        }
      }
    },
    [timerState],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleTouchEnd();
      }
    },
    [timerState, touchStartTime],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (timerInterval) clearInterval(timerInterval);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getTimerClasses = () => {
    const baseClasses =
      "font-mono text-2xl font-bold transition-colors duration-200 cursor-pointer select-none";

    if (timerState === TimerState.READY) {
      return `${baseClasses} text-red-500`;
    } else if (timerState === TimerState.RUNNING) {
      return `${baseClasses} text-green-500`;
    } else if (timerState === TimerState.STOPPED) {
      return `${baseClasses} text-blue-500`;
    }
    return `${baseClasses} text-white`;
  };

  const getInstructionText = () => {
    if (timerState === TimerState.IDLE) {
      return "Tap timer to start";
    } else if (timerState === TimerState.READY) {
      return "Release to start";
    } else if (timerState === TimerState.RUNNING) {
      return "Tap timer to stop • Esc to cancel";
    } else if (timerState === TimerState.STOPPED) {
      return "Tap timer to retry";
    }
    return "";
  };

  return (
    <div className="text-center">
      <div 
        ref={timerDisplayRef}
        className={getTimerClasses()}
        onTouchStart={handleTimerTouchStart}
        onTouchEnd={handleTimerTouchEnd}
        onMouseDown={handleTimerMouseDown}
        onMouseUp={handleTimerMouseUp}
        style={{ touchAction: 'none' }} // Prevent default touch behaviors
      >
        {displayTime}s
      </div>
      <div className="text-sm text-gray-400 mt-1">
        {getInstructionText()}
      </div>
    </div>
  );
};

export default CaseTimer;