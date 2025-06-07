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

enum TimerState {
  IDLE = "idle",
  READY = "ready",
  INSPECTION = "inspection",
  INSPECTION_READY = "inspection_ready",
  RUNNING = "running",
  STOPPED = "stopped",
}

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
  const COOLDOWN_PERIOD = 500;
  const HOLD_DURATION = 250;

  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      setDisplayTime(initialDisplayTime);
    }
  }, [initialDisplayTime, timerState]);

  useEffect(() => {
    setUseInspection(initialUseInspection);
  }, [initialUseInspection]);

  const updateTimerState = (newState: TimerState) => {
    setTimerState(newState);
    onTimerStateChange?.(newState);
  };

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

  const formatDisplayTime = (ms: number): string => {
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
      lastStopTimeRef.current = Date.now();
    }
  };

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

  // Unified trigger functions
  const triggerStartAction = () => {
    // Check cooldown period
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

  const handleTimerAreaTouchStart = useCallback((e: React.TouchEvent) => {
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

  const handleTimerAreaTouchEnd = useCallback((e: React.TouchEvent) => {
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

  useEffect(() => {
    let inspectionInterval: NodeJS.Timeout | undefined;

    if (timerState === TimerState.INSPECTION) {
      inspectionInterval = setInterval(() => {
        setInspectionTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(inspectionInterval);
            isHoldingRef.current = false; // Reset holding state
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
    // Use capture phase to intercept events before they reach other handlers
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
          style={{ touchAction: 'none' }}
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
          style={{ touchAction: 'none' }}
        >
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