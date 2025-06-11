/**
 * Timer.tsx - Main Timer Component for Full Solve Practice
 * 
 * This is the core timer component that handles full speedcube solve timing with
 * inspection time support, precise timing, and comprehensive state management.
 * 
 * Key Features:
 * - WCA-compliant inspection time (8s, 15s, 30s)
 * - Centisecond precision timing using Date.now()
 * - Multi-input support (keyboard spacebar + touch/mouse)
 * - Visual state feedback with full-screen overlays
 * - Settings integration for inspection configuration
 * - Mobile-optimized touch handling
 * 
 * Timer States:
 * - IDLE: Ready to start, showing last time or 0.00
 * - READY: Holding spacebar/touch, preparing to start
 * - INSPECTION: 15s countdown before solve
 * - INSPECTION_READY: Ready to start after inspection
 * - RUNNING: Timer actively counting
 * - STOPPED: Timer stopped, showing final time
 * 
 * Input Handling:
 * - Spacebar: Hold 0.25s to start, tap to stop
 * - Touch: Hold timer area 0.25s to start, tap to stop
 * - Escape: Cancel timer without recording solve
 * 
 * Visual Feedback:
 * - Gray: Idle state
 * - Red: Ready state (holding to start)
 * - Yellow: Inspection countdown
 * - Green: Timer running
 * - Blue: Timer stopped
 * 
 * Performance Considerations:
 * - 10ms update interval for smooth display
 * - Event capture phase for reliable input
 * - Cleanup of intervals and listeners
 * - Optimized re-renders with useCallback
 * 
 * Mobile Optimizations:
 * - Touch event handling with gesture prevention
 * - Excluded buttons (data-timer-exclude)
 * - Responsive text sizing
 * - Scroll prevention during timing
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Clock, Settings } from "lucide-react";

interface TimerProps {
  onComplete: (time: number) => void;
  inspectionTime?: number;
  useInspection?: boolean;
  isFullSolve?: boolean;
  onTimerStateChange?: (state: TimerState) => void;
  onInspectionToggle?: (useInspection: boolean) => void;
  onInspectionTimeChange?: (inspectionTime: number) => void;
  initialDisplayTime?: string;
}

/**
 * TimerState enum defines the complete lifecycle of timer interaction
 * Each state has specific visual feedback and allowed transitions
 */
enum TimerState {
  IDLE = "idle",                    // Ready to start, showing last time
  READY = "ready",                  // Holding spacebar/touch, preparing to start
  INSPECTION = "inspection",        // Countdown phase before solve
  INSPECTION_READY = "inspection_ready", // Ready to start after inspection
  RUNNING = "running",              // Timer actively counting
  STOPPED = "stopped",              // Timer stopped, showing final time
}

const Timer: React.FC<TimerProps> = ({
  onComplete,
  inspectionTime = 15,
  useInspection: initialUseInspection = false,
  isFullSolve = false,
  onTimerStateChange,
  onInspectionToggle,
  onInspectionTimeChange,
  initialDisplayTime = "0.00",
}) => {
  // Core timer state
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inspectionTimeLeft, setInspectionTimeLeft] = useState<number>(inspectionTime);
  const [displayTime, setDisplayTime] = useState<string>(initialDisplayTime);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Input handling state
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [useInspection, setUseInspection] = useState(initialUseInspection);
  const [showSettings, setShowSettings] = useState(false);

  // Add this state to track if touch is moving
  const [isTouchMoving, setIsTouchMoving] = useState(false);

  // Add this ref to track touch position
  const touchPosRef = useRef({ x: 0, y: 0 });
  
  // Performance and control refs
  const lastStopTimeRef = useRef<number>(0);
  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Timing constants
  const COOLDOWN_PERIOD = 500;  // Prevent accidental restart after stop
  const HOLD_DURATION = 250;    // Required hold time to start timer

  /**
   * Update displayTime when initialDisplayTime prop changes
   * This allows parent components to control the display
   */
  useEffect(() => {
    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      setDisplayTime(initialDisplayTime);
    }
  }, [initialDisplayTime, timerState]);

  /**
   * Sync useInspection state with prop changes
   */
  useEffect(() => {
    setUseInspection(initialUseInspection);
  }, [initialUseInspection]);

  /**
   * Central state management function that updates timer state
   * and notifies parent component of state changes
   */
  const updateTimerState = (newState: TimerState) => {
    setTimerState(newState);
    onTimerStateChange?.(newState);
  };

  /**
   * Get display text based on current timer state
   * Handles different display modes for each state
   */
  const getDisplayText = () => {
    if (timerState === TimerState.IDLE) {
      return displayTime;
    } else if (
      timerState === TimerState.READY ||
      timerState === TimerState.INSPECTION_READY
    ) {
      return "0.00";
    } else if (timerState === TimerState.INSPECTION) {
      return inspectionTimeLeft.toString();
    } else if (
      timerState === TimerState.RUNNING ||
      timerState === TimerState.STOPPED
    ) {
      return displayTime;
    }
    return displayTime;
  };

  /**
   * Format milliseconds to display string with centisecond precision
   * Rounds to nearest centisecond for consistent display
   */
  const formatDisplayTime = (ms: number): string => {
    const roundedMs = Math.round(ms / 10) * 10;
    const seconds = Math.floor(roundedMs / 1000);
    const milliseconds = Math.floor((roundedMs % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  /**
   * Start the running timer with high-frequency updates
   * Uses 10ms intervals for smooth visual feedback
   */
  const startRunningTimer = () => {
    const start = Date.now();
    setStartTime(start);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      setDisplayTime(formatDisplayTime(elapsed));
    }, 10);

    setTimerInterval(interval);
  };

  /**
   * Stop the running timer and record the final time
   * Calls onComplete callback with precise elapsed time
   */
  const stopRunningTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (startTime) {
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      setDisplayTime(formatDisplayTime(elapsed));
      onComplete(elapsed);
      lastStopTimeRef.current = Date.now();
    }
  };

  /**
   * Cancel the timer without recording a solve
   * Used when user presses Escape during timing
   */
  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    updateTimerState(TimerState.IDLE);
    setStartTime(null);
    setDisplayTime(initialDisplayTime);
    setInspectionTimeLeft(inspectionTime);
    setTouchStartTime(null);
    isHoldingRef.current = false;
  };

  /**
   * Handle the start of timer interaction (spacebar down, touch start)
   * Manages state transitions and cooldown periods
   */
  const triggerStartAction = () => {
    // Check cooldown period after stopping
    if (
      timerState === TimerState.STOPPED &&
      Date.now() - lastStopTimeRef.current < COOLDOWN_PERIOD
    ) {
      return;
    }

    if (timerState === TimerState.RUNNING) {
      updateTimerState(TimerState.STOPPED);
      stopRunningTimer();
      return;
    }

    setTouchStartTime(Date.now());

    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      if (useInspection) {
        updateTimerState(TimerState.INSPECTION);
        setInspectionTimeLeft(inspectionTime);
      } else {
        updateTimerState(TimerState.READY);
      }
    } else if (timerState === TimerState.INSPECTION) {
      updateTimerState(TimerState.INSPECTION_READY);
    }
  };

  /**
   * Handle the end of timer interaction (spacebar up, touch end)
   * Validates hold duration and starts timer if appropriate
   */
  const triggerEndAction = () => {
    if (!touchStartTime) return;

    const holdDuration = Date.now() - touchStartTime;

    if (holdDuration >= HOLD_DURATION) {
      if (
        timerState === TimerState.READY ||
        timerState === TimerState.INSPECTION_READY
      ) {
        updateTimerState(TimerState.RUNNING);
        startRunningTimer();
      }
    } else {
      if (timerState === TimerState.READY) {
        updateTimerState(TimerState.IDLE);
      } else if (timerState === TimerState.INSPECTION_READY) {
        updateTimerState(TimerState.INSPECTION);
      }
    }

    setTouchStartTime(null);
  };

  /**
   * Keyboard event handler with input context detection
   * Prevents timer activation when user is typing
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTextInput = activeElement?.tagName === 'INPUT' || 
                         activeElement?.tagName === 'TEXTAREA' ||
                         activeElement?.isContentEditable;

      if (e.code === "Space" && !e.repeat && !isTextInput) {
        e.preventDefault();
        e.stopPropagation();
        if (!isHoldingRef.current) {
          isHoldingRef.current = true;
          triggerStartAction();
        }
      } else if (e.code === "Escape") {
        e.preventDefault();
        if (timerState === TimerState.RUNNING) {
          cancelTimer();
        } else if (
          timerState === TimerState.READY ||
          timerState === TimerState.INSPECTION_READY ||
          timerState === TimerState.INSPECTION
        ) {
          updateTimerState(TimerState.IDLE);
          isHoldingRef.current = false;
        }
      }
    },
    [timerState, useInspection, inspectionTime],
  );

  /**
   * Keyboard release handler
   */
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTextInput = activeElement?.tagName === 'INPUT' || 
                         activeElement?.tagName === 'TEXTAREA' ||
                         activeElement?.isContentEditable;

      if (e.code === "Space" && !isTextInput) {
        e.preventDefault();
        e.stopPropagation();
        if (isHoldingRef.current) {
          isHoldingRef.current = false;
          triggerEndAction();
        }
      }
    },
    [timerState, touchStartTime],
  );

  /**
   * Touch event handlers for mobile devices
   * Includes button exclusion logic for settings
   */
  const handleTimerAreaTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    // Record initial touch position
    const touch = e.touches[0];
    touchPosRef.current = { x: touch.clientX, y: touch.clientY };
    setIsTouchMoving(false);
    isHoldingRef.current = true;
    triggerStartAction();
  }, [timerState, useInspection, inspectionTime]);

  const handleTimerAreaTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    // smaller values will make the timer more sensitive to accidental movements, 
    // while larger values might make it less responsive to actual timer starts
    const moveThreshold = 6; // pixels
    
    // Calculate distance moved
    const dx = Math.abs(touch.clientX - touchPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchPosRef.current.y);
    
    // If movement exceeds threshold, cancel timer start
    if (dx > moveThreshold || dy > moveThreshold) {
      setIsTouchMoving(true);
      if (timerState === TimerState.READY || timerState === TimerState.INSPECTION_READY) {
        updateTimerState(TimerState.IDLE);
      }
      isHoldingRef.current = false;
    }
  }, [timerState]);

  const handleTimerAreaTouchEnd = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton || isTouchMoving) {
      setIsTouchMoving(false);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = false;
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    triggerEndAction();
  }, [timerState, touchStartTime, isTouchMoving]);

  /**
   * Mouse event handlers for desktop devices
   */
  const handleTimerAreaMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = true;
    triggerStartAction();
  }, [timerState, useInspection, inspectionTime]);

  const handleTimerAreaMouseUp = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = false;
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    triggerEndAction();
  }, [timerState, touchStartTime]);

  /**
   * Inspection time countdown effect
   * Automatically transitions to idle when inspection expires
   */
  useEffect(() => {
    let inspectionInterval: NodeJS.Timeout | undefined;

    if (timerState === TimerState.INSPECTION) {
      inspectionInterval = setInterval(() => {
        setInspectionTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(inspectionInterval);
            isHoldingRef.current = false;
            updateTimerState(TimerState.IDLE);
            return inspectionTime;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (inspectionInterval) clearInterval(inspectionInterval);
    };
  }, [timerState, inspectionTime]);

  /**
   * Global event listener setup with capture phase
   * Ensures timer events are captured before other handlers
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
   * Get CSS classes for timer display based on current state
   */
  const getTimerClasses = () => {
    const baseClasses =
      "fixed inset-0 flex flex-col items-center justify-center transition-colors duration-300";

    if (
      timerState === TimerState.READY ||
      timerState === TimerState.INSPECTION_READY
    ) {
      return `${baseClasses} bg-red-500/90`;
    } else if (timerState === TimerState.RUNNING) {
      return `${baseClasses} bg-green-500/90`;
    } else if (timerState === TimerState.INSPECTION) {
      return `${baseClasses} bg-yellow-500/90`;
    } else if (timerState === TimerState.STOPPED) {
      return `${baseClasses} bg-blue-600/90`;
    }
    return `${baseClasses} bg-gray-800/90`;
  };

  /**
   * Settings handlers for inspection configuration
   */
  const handleInspectionToggle = () => {
    const newValue = !useInspection;
    setUseInspection(newValue);
    onInspectionToggle?.(newValue);
  };

  const handleInspectionTimeChange = (newTime: number) => {
    setInspectionTimeLeft(newTime);
    onInspectionTimeChange?.(newTime);
  };

  /**
   * Get contextual instruction text for current timer state
   */
  const getInstructionText = () => {
    if (timerState === TimerState.INSPECTION) {
      return "Hold anywhere for 0.25s to start timer";
    } else if (timerState === TimerState.READY) {
      return "Hold for 0.25s...";
    } else if (timerState === TimerState.INSPECTION_READY) {
      return "Hold for 0.25s...";
    } else if (timerState === TimerState.RUNNING) {
      return "Tap anywhere to stop • Esc to cancel";
    } else if (timerState === TimerState.IDLE) {
      if (useInspection) {
        return "Tap timer area to start inspection";
      } else {
        return "Hold timer area for 0.25s to start";
      }
    } else if (timerState === TimerState.STOPPED) {
      return "Tap timer area to start next solve";
    }
    return "";
  };

  return (
    <>
      {/* Full-screen overlay for active timer states */}
      {timerState === TimerState.RUNNING ||
      timerState === TimerState.INSPECTION ||
      timerState === TimerState.READY ||
      timerState === TimerState.INSPECTION_READY ? (
        <div
          className={getTimerClasses()}
          onTouchStart={handleTimerAreaTouchStart}
          onTouchMove={handleTimerAreaTouchMove}
          onTouchEnd={handleTimerAreaTouchEnd}
          onMouseDown={handleTimerAreaMouseDown}
          onMouseUp={handleTimerAreaMouseUp}
          style={{ touchAction: 'none' }}
        >
          <div className="text-center">
            <div className="font-mono text-6xl md:text-8xl font-bold mb-6 text-white select-none">
              {getDisplayText()}
            </div>
            {/* Hide instruction text on mobile when timer is active */}
            <div className="text-sm text-white/70 hidden md:block">
              {getInstructionText()}
            </div>
          </div>
        </div>
      ) : (
        /* Inline timer display for idle and stopped states */
        <div 
          className="relative min-h-[300px] flex flex-col items-center justify-center bg-gray-800 rounded-xl cursor-pointer select-none"
          onTouchStart={handleTimerAreaTouchStart}
          onTouchEnd={handleTimerAreaTouchEnd}
          onMouseDown={handleTimerAreaMouseDown}
          onMouseUp={handleTimerAreaMouseUp}
          style={{ touchAction: 'none' }}
        >
          {/* Settings panel - excluded from timer events */}
          {timerState !== TimerState.RUNNING && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                data-timer-exclude="true"
                onClick={handleInspectionToggle}
                className={`p-2 rounded-lg transition-colors ${
                  useInspection ? "text-white bg-blue-600" : "text-gray-400 hover:text-white"
                }`}
                title={`Inspection Timer ${useInspection ? "On" : "Off"}`}
              >
                <Clock className="h-6 w-6" />
              </button>
              <button
                data-timer-exclude="true"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Timer Settings"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>
          )}

          {/* Settings dropdown */}
          {showSettings && (
            <div 
              data-timer-exclude="true"
              className="absolute top-16 right-4 bg-gray-700 rounded-lg p-4 shadow-lg z-10"
            >
              <div className="space-y-4 min-w-[200px]">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Inspection Time
                  </label>
                  <select
                    value={inspectionTime}
                    onChange={(e) => handleInspectionTimeChange(Number(e.target.value))}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value={8}>8 seconds</option>
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Enable Inspection</span>
                  <button
                    onClick={handleInspectionToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useInspection ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useInspection ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main timer display */}
          <div className="text-center">
            <div className="font-mono text-5xl md:text-7xl font-bold mb-6 text-white">
              {getDisplayText()}
            </div>
            {/* Hide instruction text on mobile when timer is idle/stopped */}
            <div className="text-sm text-white/70 hidden md:block">
              {getInstructionText()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;