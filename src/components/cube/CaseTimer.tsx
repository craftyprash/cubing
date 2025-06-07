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
  const HOLD_DURATION = 250;

  const formatDisplayTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

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

  // Unified trigger functions
  const triggerStartAction = () => {
    if (timerState === TimerState.IDLE || timerState === TimerState.STOPPED) {
      setTimerState(TimerState.READY);
      setTouchStartTime(Date.now());
    } else if (timerState === TimerState.RUNNING) {
      setTimerState(TimerState.STOPPED);
      stopRunningTimer();
    }
  };

  const triggerEndAction = () => {
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

  // Mouse event handlers (for desktop) - only for timer display area
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && !isHoldingRef.current) {
        e.preventDefault();
        isHoldingRef.current = true;
        triggerStartAction();
      } else if (e.code === "Escape") {
        e.preventDefault();
        if (timerState === TimerState.RUNNING) {
          cancelTimer();
        } else if (timerState === TimerState.READY) {
          setTimerState(TimerState.IDLE);
          setTouchStartTime(null);
          isHoldingRef.current = false;
        }
      }
    },
    [timerState],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && isHoldingRef.current) {
        e.preventDefault();
        isHoldingRef.current = false;
        triggerEndAction();
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