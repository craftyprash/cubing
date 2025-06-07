/**
 * Timer.tsx - Main Timer Component for Full Solve Practice
 * 
 * This is the core timer component used for full speedcube solve practice.
 * It handles inspection time, precise timing, keyboard/touch controls, and
 * integrates with session management and statistics tracking.
 * 
 * Key Features:
 * - Inspection time support (8s, 15s, 30s)
 * - Precise timing with centisecond accuracy
 * - Keyboard (spacebar) and touch controls
 * - Anti-accidental stop protection
 * - Visual state feedback
 * - Settings panel for customization
 * 
 * Timer States:
 * - IDLE: Initial state, ready to start
 * - READY: User holding spacebar/touch (red background)
 * - INSPECTION: 15s inspection countdown (yellow background)
 * - INSPECTION_READY: Ready to start after inspection (red background)
 * - RUNNING: Timer actively running (green background)
 * - STOPPED: Timer stopped, showing final time (blue background)
 * 
 * Controls:
 * - Spacebar/Touch: Hold 0.25s to start, tap to stop
 * - Escape: Cancel timer without recording solve
 * - Settings button: Configure inspection time and enable/disable inspection
 * 
 * Props:
 * - onComplete: Callback when solve is completed with time in milliseconds
 * - inspectionTime: Inspection duration in seconds (8, 15, or 30)
 * - useInspection: Whether inspection is enabled
 * - isFullSolve: Flag indicating this is for full solve practice
 * - onTimerStateChange: Callback for timer state changes
 * - onInspectionToggle: Callback when inspection is toggled
 * - onInspectionTimeChange: Callback when inspection time changes
 * - initialDisplayTime: Initial time to display (for showing last solve)
 * 
 * Technical Implementation:
 * - Uses React hooks for state management
 * - Implements precise timing with Date.now() and setInterval
 * - Prevents default browser behaviors (scrolling, text selection)
 * - Uses event capture phase to intercept keyboard events
 * - Implements touch-action: none for mobile compatibility
 * - Excludes settings buttons from timer touch events using data attributes
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

// TimerState enum defines various states of the timer UI and logic lifecycle
enum TimerState {
  IDLE = "idle",
  READY = "ready",
  INSPECTION = "inspection",
  INSPECTION_READY = "inspection_ready",
  RUNNING = "running",
  STOPPED = "stopped",
}

// Main Timer component for holding, inspection, running, stopping, and cooldown logic
const Timer: React.FC<TimerProps> = ({
  onComplete,
  inspectionTime = 15,
  useInspection: initialUseInspection = true,
  isFullSolve = false,
  onTimerStateChange,
  onInspectionToggle,
  onInspectionTimeChange,
  initialDisplayTime = "0.00",
}) => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inspectionTimeLeft, setInspectionTimeLeft] =
    useState<number>(inspectionTime);
  const [displayTime, setDisplayTime] = useState<string>(initialDisplayTime);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [useInspection, setUseInspection] = useState(initialUseInspection);
  const [showSettings, setShowSettings] = useState(false);
  const lastStopTimeRef = useRef<number>(0);
  const COOLDOWN_PERIOD = 500; // 500ms cooldown after stopping
  const HOLD_DURATION = 250; // Changed from 500ms to 250ms

  // Touch handling refs
  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add useEffect to update displayTime when initialDisplayTime changes
  useEffect(() => {
    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      setDisplayTime(initialDisplayTime);
    }
  }, [initialDisplayTime, timerState]);

  // Update useInspection when prop changes
  useEffect(() => {
    setUseInspection(initialUseInspection);
  }, [initialUseInspection]);

  // Central method to update timer state and inform parent via callback
const updateTimerState = (newState: TimerState) => {
    setTimerState(newState);
    onTimerStateChange?.(newState);
  };

  const getDisplayText = () => {
    if (timerState === TimerState.IDLE) {
      return displayTime; // Use displayTime instead of hardcoded "0.00"
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
    return displayTime; // Use displayTime as default
  };

  const formatDisplayTime = (ms: number): string => {
    // Round to 2 decimal places (centiseconds)
    const roundedMs = Math.round(ms / 10) * 10;
    const seconds = Math.floor(roundedMs / 1000);
    const milliseconds = Math.floor((roundedMs % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

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
      lastStopTimeRef.current = Date.now(); // Record when we stopped
    }
  };

  // New function to cancel the timer without recording
  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Reset to idle state without calling onComplete
    updateTimerState(TimerState.IDLE);
    setStartTime(null);
    setDisplayTime(initialDisplayTime);
    setInspectionTimeLeft(inspectionTime);
  };

  // Called on initial touch/space press, handles transitions into inspection or ready state
const handleTouchStart = () => {
    // Check if we're within the cooldown period after stopping
    if (
      timerState === TimerState.STOPPED &&
      Date.now() - lastStopTimeRef.current < COOLDOWN_PERIOD
    ) {
      return; // Ignore input during cooldown
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

  // Called when user lifts touch or releases spacebar, confirms if hold was long enough to begin
const handleTouchEnd = () => {
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

  // Touch event handlers for the entire timer area
  const handleTimerAreaTouchStart = useCallback((e: React.TouchEvent) => {
    // Check if the touch target is one of the excluded buttons
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return; // Don't handle timer events for excluded buttons
    }

    e.preventDefault(); // Prevent text selection and scrolling
    e.stopPropagation(); // Prevent event bubbling
    isHoldingRef.current = true;
    handleTouchStart();
  }, [timerState, useInspection, inspectionTime]);

  const handleTimerAreaTouchEnd = useCallback((e: React.TouchEvent) => {
    // Check if the touch target is one of the excluded buttons
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return; // Don't handle timer events for excluded buttons
    }

    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = false;
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    handleTouchEnd();
  }, [timerState, touchStartTime]);

  // Mouse event handlers for the entire timer area (for desktop)
  const handleTimerAreaMouseDown = useCallback((e: React.MouseEvent) => {
    // Check if the mouse target is one of the excluded buttons
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return; // Don't handle timer events for excluded buttons
    }

    e.preventDefault();
    e.stopPropagation();
    isHoldingRef.current = true;
    handleTouchStart();
  }, [timerState, useInspection, inspectionTime]);

  const handleTimerAreaMouseUp = useCallback((e: React.MouseEvent) => {
    // Check if the mouse target is one of the excluded buttons
    const target = e.target as HTMLElement;
    const isExcludedButton = target.closest('[data-timer-exclude]');
    
    if (isExcludedButton) {
      return; // Don't handle timer events for excluded buttons
    }

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
        e.preventDefault(); // Prevent default spacebar behavior (scrolling)
        e.stopPropagation(); // Stop event from bubbling up
        handleTouchStart();
      } else if (e.code === "Escape") {
        e.preventDefault();
        if (timerState === TimerState.RUNNING) {
          // Cancel the timer without recording the solve
          cancelTimer();
        } else if (
          timerState === TimerState.READY ||
          timerState === TimerState.INSPECTION_READY ||
          timerState === TimerState.INSPECTION
        ) {
          updateTimerState(TimerState.IDLE);
        }
      }
    },
    [timerState, useInspection, inspectionTime, initialDisplayTime],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent default spacebar behavior
        e.stopPropagation(); // Stop event from bubbling up
        handleTouchEnd();
      }
    },
    [timerState, touchStartTime],
  );

  useEffect(() => {
    let inspectionInterval: NodeJS.Timeout | undefined;

    if (timerState === TimerState.INSPECTION) {
      inspectionInterval = setInterval(() => {
        setInspectionTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(inspectionInterval);
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

  useEffect(() => {
    // Use capture phase to intercept events before they reach other elements
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      if (timerInterval) clearInterval(timerInterval);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, [handleKeyDown, handleKeyUp]);

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

  const handleInspectionToggle = () => {
    const newValue = !useInspection;
    setUseInspection(newValue);
    onInspectionToggle?.(newValue);
  };

  const handleInspectionTimeChange = (newTime: number) => {
    setInspectionTimeLeft(newTime);
    onInspectionTimeChange?.(newTime);
  };

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
      {timerState === TimerState.RUNNING ||
      timerState === TimerState.INSPECTION ||
      timerState === TimerState.READY ||
      timerState === TimerState.INSPECTION_READY ? (
        <div
          className={getTimerClasses()}
          onTouchStart={handleTimerAreaTouchStart}
          onTouchEnd={handleTimerAreaTouchEnd}
          onMouseDown={handleTimerAreaMouseDown}
          onMouseUp={handleTimerAreaMouseUp}
          style={{ touchAction: 'none' }} // Prevent default touch behaviors
        >
          <div className="text-center">
            <div className="font-mono text-6xl md:text-8xl font-bold mb-6 text-white select-none">
              {getDisplayText()}
            </div>
            <div className="text-sm text-white/70">
              {getInstructionText()}
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="relative min-h-[300px] flex flex-col items-center justify-center bg-gray-800 rounded-xl cursor-pointer select-none"
          onTouchStart={handleTimerAreaTouchStart}
          onTouchEnd={handleTimerAreaTouchEnd}
          onMouseDown={handleTimerAreaMouseDown}
          onMouseUp={handleTimerAreaMouseUp}
          style={{ touchAction: 'none' }} // Prevent default touch behaviors
        >
          {timerState !== TimerState.RUNNING && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                data-timer-exclude="true" // Mark as excluded from timer events
                onClick={handleInspectionToggle}
                className={`p-2 rounded-lg transition-colors ${
                  useInspection ? "text-white bg-blue-600" : "text-gray-400 hover:text-white"
                }`}
                title={`Inspection Timer ${useInspection ? "On" : "Off"}`}
              >
                <Clock className="h-6 w-6" />
              </button>
              <button
                data-timer-exclude="true" // Mark as excluded from timer events
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Timer Settings"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>
          )}

          {showSettings && (
            <div 
              data-timer-exclude="true" // Mark as excluded from timer events
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

          <div className="text-center">
            <div className="font-mono text-5xl md:text-7xl font-bold mb-6 text-white">
              {getDisplayText()}
            </div>
            <div className="text-sm text-white/70">
              {getInstructionText()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;