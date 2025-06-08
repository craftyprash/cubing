/**
 * CaseTimer.tsx - Simplified Timer for Algorithm Practice
 * 
 * A streamlined timer component optimized for rapid algorithm practice cycles.
 * Unlike the main Timer component, this focuses on quick, repetitive timing
 * without inspection time or complex state management.
 * 
 * Key Features:
 * - Simplified state machine (IDLE → READY → RUNNING → STOPPED)
 * - No inspection time (immediate start capability)
 * - Full-screen overlay for active timing
 * - Quick reset and retry functionality
 * - Algorithm-focused workflow
 * 
 * Design Philosophy:
 * - Optimized for repetitive practice
 * - Minimal UI friction
 * - Fast cycle times
 * - Clear visual feedback
 * 
 * Usage Context:
 * - Case library algorithm practice
 * - Individual algorithm timing
 * - Rapid improvement cycles
 * - Muscle memory development
 * 
 * State Flow:
 * IDLE → (hold) → READY → (release) → RUNNING → (tap) → STOPPED → (tap) → IDLE
 * 
 * Visual States:
 * - IDLE: Gray background, shows "0.00s"
 * - READY: Red background, preparing to start
 * - RUNNING: Green background, timer active
 * - STOPPED: Blue background, shows final time
 * 
 * Input Methods:
 * - Keyboard: Spacebar hold/release and tap
 * - Touch: Touch and hold timer area
 * - Mouse: Click and hold (desktop)
 * 
 * Performance Features:
 * - 10ms update intervals for smooth display
 * - Efficient event handling
 * - Minimal re-renders
 * - Clean state management
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { formatTimeForDisplay } from "../../utils/timeUtils";

interface CaseTimerProps {
  caseId: string;
  onComplete: (time: number) => void;
  onClose?: () => void;
}

/**
 * Simplified timer states for algorithm practice
 * Removes inspection-related states for streamlined workflow
 */
enum TimerState {
  IDLE = "idle",        // Ready to start, showing 0.00
  READY = "ready",      // Holding to start
  RUNNING = "running",  // Timer active
  STOPPED = "stopped",  // Timer stopped, showing result
}

const CaseTimer: React.FC<CaseTimerProps> = ({ caseId, onComplete, onClose }) => {
  // Core timer state
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState<string>("0.00");
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

  // Performance and control refs
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 250;

  /**
   * Format display time with consistent precision
   * Always shows centiseconds for algorithm practice
   */
  const formatDisplayTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  /**
   * Start the running timer with high-frequency updates
   * Uses formatTimeForDisplay for consistency with main timer
   */
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

  /**
   * Stop the running timer and record the result
   * Calls onComplete with precise elapsed time
   */
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

  /**
   * Cancel timer without recording result
   * Resets to idle state with clean display
   */
  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setTimerState(TimerState.IDLE);
    setStartTime(null);
    setDisplayTime("0.00");
    setTouchStartTime(null);
    isHoldingRef.current = false;
  };

  /**
   * Close the full-screen overlay and return focus
   * Cancels any active timing and calls onClose callback
   */
  const closeFullScreenOverlay = () => {
    cancelTimer();
    if (onClose) {
      onClose();
    }
  };

  /**
   * Handle start of timer interaction
   * Manages state transitions and display updates
   */
  const triggerStartAction = () => {
    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      setTimerState(TimerState.READY);
      setTouchStartTime(Date.now());
      // Reset display to 0.00s when starting a new solve attempt
      setDisplayTime("0.00");
    } else if (timerState === TimerState.RUNNING) {
      setTimerState(TimerState.STOPPED);
      stopRunningTimer();
    }
  };

  /**
   * Handle end of timer interaction
   * Validates hold duration and starts timer if appropriate
   */
  const triggerEndAction = () => {
    if (!touchStartTime) return;

    const holdDuration = Date.now() - touchStartTime;

    if (holdDuration >= HOLD_DURATION && timerState === TimerState.READY) {
      setTimerState(TimerState.RUNNING);
      startRunningTimer();
    } else if (timerState === TimerState.READY) {
      setTimerState(TimerState.IDLE);
      // Reset display back to 0.00s if hold wasn't long enough
      setDisplayTime("0.00");
    }

    setTouchStartTime(null);
  };

  /**
   * Touch event handlers for full-screen overlay
   * Includes close button exclusion logic
   */
  const handleFullScreenTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isCloseButton = target.closest('[data-close-button]');
    
    if (isCloseButton) {
      return; // Don't trigger timer for close button
    }

    e.preventDefault();
    e.stopPropagation();
    if (!isHoldingRef.current) {
      isHoldingRef.current = true;
      triggerStartAction();
    }
  }, [timerState]);

  const handleFullScreenTouchEnd = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isCloseButton = target.closest('[data-close-button]');
    
    if (isCloseButton) {
      return; // Don't trigger timer for close button
    }

    e.preventDefault();
    e.stopPropagation();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      triggerEndAction();
    }
  }, [timerState, touchStartTime]);

  /**
   * Mouse event handlers for desktop full-screen overlay
   */
  const handleFullScreenMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isCloseButton = target.closest('[data-close-button]');
    
    if (isCloseButton) {
      return; // Don't trigger timer for close button
    }

    e.preventDefault();
    e.stopPropagation();
    if (!isHoldingRef.current) {
      isHoldingRef.current = true;
      triggerStartAction();
    }
  }, [timerState]);

  const handleFullScreenMouseUp = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isCloseButton = target.closest('[data-close-button]');
    
    if (isCloseButton) {
      return; // Don't trigger timer for close button
    }

    e.preventDefault();
    e.stopPropagation();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      triggerEndAction();
    }
  }, [timerState, touchStartTime]);

  /**
   * Touch event handlers for inline timer display
   */
  const handleTimerTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isHoldingRef.current) {
      isHoldingRef.current = true;
      triggerStartAction();
    }
  }, [timerState]);

  const handleTimerTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      triggerEndAction();
    }
  }, [timerState, touchStartTime]);

  /**
   * Mouse event handlers for inline timer display
   */
  const handleTimerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isHoldingRef.current) {
      isHoldingRef.current = true;
      triggerStartAction();
    }
  }, [timerState]);

  const handleTimerMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      triggerEndAction();
    }
  }, [timerState, touchStartTime]);

  /**
   * Keyboard event handler with comprehensive state management
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && !isHoldingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        isHoldingRef.current = true;
        triggerStartAction();
      } else if (e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (timerState === TimerState.RUNNING) {
          cancelTimer();
        } else if (timerState === TimerState.READY) {
          setTimerState(TimerState.IDLE);
          setDisplayTime("0.00"); // Reset display when canceling
          setTouchStartTime(null);
          isHoldingRef.current = false;
        } else if (timerState === TimerState.READY || timerState === TimerState.STOPPED) {
          // Close full-screen overlay when pressing Escape
          closeFullScreenOverlay();
        }
      }
    },
    [timerState],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && isHoldingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        isHoldingRef.current = false;
        triggerEndAction();
      }
    },
    [timerState, touchStartTime],
  );

  /**
   * Global event listener setup with capture phase
   */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      if (timerInterval) clearInterval(timerInterval);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, [handleKeyDown, handleKeyUp]);

  /**
   * Get CSS classes for inline timer display
   */
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

  /**
   * Get CSS classes for full-screen overlay
   */
  const getFullScreenClasses = () => {
    const baseClasses =
      "fixed inset-0 flex flex-col items-center justify-center transition-colors duration-300";

    if (timerState === TimerState.READY) {
      return `${baseClasses} bg-red-500/90`;
    } else if (timerState === TimerState.RUNNING) {
      return `${baseClasses} bg-green-500/90`;
    } else if (timerState === TimerState.STOPPED) {
      return `${baseClasses} bg-blue-600/90`;
    }
    return `${baseClasses} bg-gray-800/90`;
  };

  /**
   * Get contextual instruction text
   */
  const getInstructionText = () => {
    if (timerState === TimerState.IDLE) {
      return "Tap timer to start";
    } else if (timerState === TimerState.READY) {
      return "Release to start";
    } else if (timerState === TimerState.RUNNING) {
      return "Tap anywhere to stop • Esc to close";
    } else if (timerState === TimerState.STOPPED) {
      return "Tap anywhere to retry • Esc to close";
    }
    return "";
  };

  // Show full-screen overlay when timer is active
  if (timerState === TimerState.READY || timerState === TimerState.RUNNING || timerState === TimerState.STOPPED) {
    return (
      <div
        className={getFullScreenClasses()}
        onTouchStart={handleFullScreenTouchStart}
        onTouchEnd={handleFullScreenTouchEnd}
        onMouseDown={handleFullScreenMouseDown}
        onMouseUp={handleFullScreenMouseUp}
        style={{ touchAction: 'none' }}
      >
        {/* Close button in top-right corner */}
        <button
          data-close-button="true"
          onClick={closeFullScreenOverlay}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
          title="Close timer overlay (Esc)"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="font-mono text-6xl md:text-8xl font-bold mb-6 text-white select-none">
            {displayTime}s
          </div>
          {/* Hide instruction text on mobile when timer is active */}
          <div className="text-sm text-white/70 hidden md:block">
            {getInstructionText()}
          </div>
        </div>
      </div>
    );
  }

  // Show inline timer when idle
  return (
    <div className="text-center">
      <div 
        ref={timerDisplayRef}
        className={getTimerClasses()}
        onTouchStart={handleTimerTouchStart}
        onTouchEnd={handleTimerTouchEnd}
        onMouseDown={handleTimerMouseDown}
        onMouseUp={handleTimerMouseUp}
        style={{ touchAction: 'none' }}
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