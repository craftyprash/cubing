import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import ReactConfetti from "react-confetti";
import {
  RotateCcw,
  Trophy,
  Clock,
  Trash2,
  Copy,
  Edit2,
  Check,
  Eraser,
  RefreshCw,
  MessageSquare,
  Edit,
} from "lucide-react";
import Timer from "../components/timer/Timer";
import SessionManager from "../components/timer/SessionManager";
import SolveDetailsModal from "../components/timer/SolveDetailsModal";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { generateScramble } from "../utils/scrambleUtils";
import { generateScramblePreview } from "../utils/visualCube";
import { calculateSessionStats, formatTime } from "../utils/timeUtils";
import { db } from "../db";
import { Session, Solve, PersonalBest } from "../types";

const Training: React.FC = () => {
  const [currentScramble, setCurrentScramble] = useState("");
  const [editingScramble, setEditingScramble] = useState(false);
  const [tempScramble, setTempScramble] = useState("");
  const [showScramble, setShowScramble] = useState(true);
  const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newRecord, setNewRecord] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const scrambleInputRef = useRef<HTMLInputElement>(null);
  const scrambleContainerRef = useRef<HTMLDivElement>(null);

  const justAddedSolveRef = useRef(false);
  const prevAllSolvesCountRef = useRef(0);

  const timerContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const sessions = useLiveQuery(() => db.sessions.toArray()) || [];
  const currentSession = useLiveQuery(() => db.getCurrentSession());
  const userSettings = useLiveQuery(() => db.userSettings.get(1));
  const allSolves = useLiveQuery(() => db.solves.toArray()) || [];
  const personalBests = useLiveQuery(() => db.personalBests.toArray()) || [];
  
  const solves =
    useLiveQuery(
      () =>
        currentSession
          ? db.solves
              .where("sessionId")
              .equals(currentSession.id)
              .reverse()
              .toArray()
          : Promise.resolve([]),
      [currentSession?.id],
    ) || [];

  // Mark scramble container as having active input when editing
  useEffect(() => {
    if (scrambleContainerRef.current) {
      if (editingScramble) {
        scrambleContainerRef.current.setAttribute('data-input-active', 'true');
      } else {
        scrambleContainerRef.current.removeAttribute('data-input-active');
      }
    }
  }, [editingScramble]);

  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Global keydown handler for Training page
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only prevent spacebar when:
      // 1. It's a space key press
      // 2. We're not editing scramble
      // 3. No text input is focused
      if (e.code === "Space") {
        const activeElement = document.activeElement;
        const isTextInput = activeElement?.tagName === 'INPUT' || 
                           activeElement?.tagName === 'TEXTAREA' ||
                           activeElement?.isContentEditable;
        
        if (!editingScramble && !isTextInput) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, [editingScramble]);

  const getInspectionSettings = () => {
    if (!currentSession || !userSettings) {
      return { useInspection: true, inspectionTime: 15 };
    }

    return {
      useInspection: currentSession.useInspection ?? userSettings.useInspectionTime,
      inspectionTime: currentSession.inspectionTime ?? userSettings.inspectionTime,
    };
  };

  const { useInspection, inspectionTime } = getInspectionSettings();

  const getDisplayTime = (solve: Solve): string => {
    if (solve.penalty === "DNF") return "DNF";
    const time = solve.penalty === "+2" ? solve.time + 2000 : solve.time;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const getFormattedSolveTime = (solve: Solve | null): string => {
    if (!solve) return "0.00";
    if (solve.penalty === "DNF") return "DNF";
    const time = solve.penalty === "+2" ? solve.time + 2000 : solve.time;
    return `${(time / 1000).toFixed(2)}`;
  };

  const lastSolveTime = useMemo(() => {
    return solves.length > 0 ? getFormattedSolveTime(solves[0]) : "0.00";
  }, [solves]);

  const currentStats = calculateSessionStats(solves, allSolves);

  const bestSingleSolve = useMemo(() => {
    if (!currentStats.bestSingle || !allSolves.length) return null;
    
    return allSolves.find(solve => {
      const adjustedTime = solve.penalty === "+2" ? solve.time + 2000 : solve.time;
      return solve.penalty !== "DNF" && adjustedTime === currentStats.bestSingle;
    }) || null;
  }, [currentStats.bestSingle, allSolves]);

  const getSessionName = (sessionId: string): string => {
    const session = sessions.find(s => s.id === sessionId);
    return session?.name || "Unknown Session";
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentLength = allSolves?.length || 0;

    if (prevAllSolvesCountRef.current < currentLength) {
      justAddedSolveRef.current = true;
    } else {
      justAddedSolveRef.current = false;
    }
    prevAllSolvesCountRef.current = currentLength;
  }, [allSolves]);

  useEffect(() => {
    if (!justAddedSolveRef.current || !allSolves || allSolves.length === 0)
      return;

    const checkForNewRecord = async () => {
      const solveCount = allSolves.length;
      const currentPersonalBests = await db.personalBests.toArray();

      const currentPBs: Record<string, number> = {};
      currentPersonalBests.forEach((pb) => {
        if (!currentPBs[pb.type] || pb.time < currentPBs[pb.type]) {
          currentPBs[pb.type] = pb.time;
        }
      });

      const newRecords = [];

      if (
        solveCount >= 5 &&
        currentStats.bestSingle &&
        (!currentPBs["single"] ||
          currentStats.bestSingle < currentPBs["single"])
      ) {
        newRecords.push("Single");
        await savePersonalBest("single", currentStats.bestSingle);
      }

      if (
        solveCount >= 5 &&
        currentStats.bestAo5 &&
        (!currentPBs["ao5"] || currentStats.bestAo5 < currentPBs["ao5"])
      ) {
        newRecords.push("Average of 5");
        await savePersonalBest("ao5", currentStats.bestAo5);
      }

      if (
        solveCount >= 12 &&
        currentStats.bestAo12 &&
        (!currentPBs["ao12"] || currentStats.bestAo12 < currentPBs["ao12"])
      ) {
        newRecords.push("Average of 12");
        await savePersonalBest("ao12", currentStats.bestAo12);
      }

      if (
        solveCount >= 50 &&
        currentStats.bestAo50 &&
        (!currentPBs["ao50"] || currentStats.bestAo50 < currentPBs["ao50"])
      ) {
        newRecords.push("Average of 50");
        await savePersonalBest("ao50", currentStats.bestAo50);
      }

      if (
        solveCount >= 100 &&
        currentStats.bestAo100 &&
        (!currentPBs["ao100"] || currentStats.bestAo100 < currentPBs["ao100"])
      ) {
        newRecords.push("Average of 100");
        await savePersonalBest("ao100", currentStats.bestAo100);
      }

      if (newRecords.length > 0) {
        setNewRecord(newRecords.join(", "));
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setNewRecord(null);
        }, 5000);
      }
    };

    checkForNewRecord();
    justAddedSolveRef.current = false;
  }, [currentStats, allSolves]);

  const savePersonalBest = async (type: string, time: number) => {
    if (!currentSession) return;

    const pb: PersonalBest = {
      type: type as any,
      time,
      date: new Date(),
      sessionId: currentSession.id,
      solveIds: solves
        .slice(
          0,
          type === "single"
            ? 1
            : type === "ao5"
              ? 5
              : type === "ao12"
                ? 12
                : type === "ao50"
                  ? 50
                  : 100,
        )
        .map((s) => s.id!)
        .filter((id) => id !== undefined),
    };

    await db.personalBests.add(pb);
  };

  const generateNewScramble = () => {
    setCurrentScramble(generateScramble());
    setShowScramble(true);
    setEditingScramble(false);
  };

  const getSolveCount = (): string => {
    const dnfCount = solves.filter( (s: Solve) => s.penalty === "DNF").length;
    if (dnfCount > 0) {
      return `${(solves.length - dnfCount)}/${solves.length}`;
    }
    return `${solves.length}`;
  };

  const handleSessionChange = async (sessionId: string) => {
    try {
      await db.setCurrentSession(sessionId);
    } catch (err) {
      console.error("Failed to switch session:", err);
    }
  };

  const createNewSession = async (name: string) => {
    if (!userSettings) return;

    const sessionId = `session_${Date.now()}`;
    const newSession: Session = {
      id: sessionId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      solveCount: 0,
      useInspection: userSettings.useInspectionTime,
      inspectionTime: userSettings.inspectionTime,
    };

    await db.sessions.put(newSession);
    await handleSessionChange(sessionId);
  };

  const showDeleteSessionConfirmation = (sessionId: string, sessionName: string) => {
    if (sessions.length <= 1) {
      setConfirmModal({
        isOpen: true,
        title: 'Cannot Delete Session',
        message: 'You cannot delete the last remaining session. At least one session must exist.',
        variant: 'info',
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Session',
      message: `Are you sure you want to delete "${sessionName}" and all its solves? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: () => {
        handleDeleteSession(sessionId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      if (currentSession?.id === sessionId) {
        console.log("Switching to default session before deletion");
        await db.setCurrentSession("default");
      }

      console.log("Deleting session:", sessionId);
      await db.transaction("rw", db.sessions, db.solves, async () => {
        await db.solves.where("sessionId").equals(sessionId).delete();
        await db.sessions.delete(sessionId);
      });

      console.log("Session deleted successfully");
    } catch (err) {
      console.error("Failed to delete session:", err);
      setConfirmModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete session. Please try again.',
        variant: 'danger',
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
      });
    }
  };

  const handleCopyScramble = async () => {
    try {
      await navigator.clipboard.writeText(currentScramble);
      setShowCopyConfirm(true);
      setTimeout(() => setShowCopyConfirm(false), 2000);
    } catch (err) {
      console.error("Failed to copy scramble:", err);
    }
  };

  const handleEditScramble = () => {
    setEditingScramble(true);
    setTempScramble(currentScramble);
    setTimeout(() => {
      scrambleInputRef.current?.focus();
    }, 100);
  };

  const handleSaveScramble = () => {
    if (tempScramble.trim()) {
      setCurrentScramble(tempScramble.trim());
    }
    setEditingScramble(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveScramble();
    } else if (e.key === "Escape") {
      setEditingScramble(false);
      setTempScramble(currentScramble);
    }
  };

  const handleRetrySolve = (solve: Solve) => {
    setCurrentScramble(solve.scramble);
    setShowScramble(true);
    setEditingScramble(false);
  };

  const handleSolveComplete = async (time: number) => {
    if (!currentSession) return;

    const roundedTime = Math.round(time / 10) * 10;

    const newSolve: Solve = {
      sessionId: currentSession.id,
      time: roundedTime,
      scramble: currentScramble,
      date: new Date(),
    };

    try {
      await db.transaction("rw", db.solves, db.sessions, async () => {
        await db.solves.add(newSolve);

        await db.sessions.update(currentSession.id, {
          solveCount: (currentSession.solveCount || 0) + 1,
          updatedAt: new Date(),
        });
      });

      justAddedSolveRef.current = true;
    } catch (error) {
      console.error("Failed to save solve:", error);
    }

    generateNewScramble();
  };

  const showDeleteSolveConfirmation = (solveId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Solve',
      message: 'Are you sure you want to delete this solve? This action cannot be undone.',
      variant: 'danger',
      onConfirm: () => {
        handleDeleteSolve(solveId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteSolve = async (solveId: number) => {
    if (!currentSession) return;

    await db.transaction("rw", db.solves, db.sessions, async () => {
      await db.solves.delete(solveId);
      await db.sessions.update(currentSession.id, {
        solveCount: Math.max(0, (currentSession.solveCount || 0) - 1),
        updatedAt: new Date(),
      });
    });
  };

  const showClearAllSolvesConfirmation = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Solves',
      message: 'Are you sure you want to clear all solves in this session? This action cannot be undone.',
      variant: 'danger',
      onConfirm: () => {
        handleClearAllSolves();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearAllSolves = async () => {
    if (!currentSession) return;

    await db.transaction("rw", db.solves, db.sessions, async () => {
      await db.solves.where("sessionId").equals(currentSession.id).delete();
      await db.sessions.update(currentSession.id, {
        solveCount: 0,
        updatedAt: new Date(),
      });
    });
  };

  const handleUpdateNotes = async (solveId: number, notes: string) => {
    await db.solves.update(solveId, { notes });
  };

  const handleUpdatePenalty = async (
    solveId: number,
    penalty: "DNF" | "+2" | undefined,
  ) => {
    await db.solves.update(solveId, { penalty });
  };

  const handleBestSingleClick = () => {
    if (bestSingleSolve) {
      setSelectedSolve(bestSingleSolve);
    }
  };

  const handleInspectionToggle = async (newUseInspection: boolean) => {
    if (!currentSession) return;

    await db.sessions.update(currentSession.id, {
      useInspection: newUseInspection,
      updatedAt: new Date(),
    });
  };

  const handleInspectionTimeChange = async (newInspectionTime: number) => {
    if (!currentSession) return;

    await db.sessions.update(currentSession.id, {
      inspectionTime: newInspectionTime,
      updatedAt: new Date(),
    });
  };

  useEffect(() => {
    generateNewScramble();
  }, []);

  useEffect(() => {
    console.log("Session changed or solves updated:", {
      sessionId: currentSession?.id,
      solvesCount: solves.length,
      lastSolveTime,
    });
  }, [currentSession?.id, solves.length, lastSolveTime]);

  const latestSingle =
    solves.length > 0
      ? solves[0].penalty === "DNF"
        ? null
        : solves[0].penalty === "+2"
          ? solves[0].time + 2000
          : solves[0].time
      : null;

  if (!currentSession || !sessions.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg">Loading session data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ReactConfetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
          <div className="absolute inset-x-0 top-10 flex justify-center">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              New record! {newRecord}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {showScramble && (
            <div className="space-y-6">
              <SessionManager
                sessions={sessions}
                currentSession={currentSession}
                onSessionChange={handleSessionChange}
                onCreateSession={createNewSession}
                onDeleteSession={(sessionId) => {
                  const session = sessions.find(s => s.id === sessionId);
                  showDeleteSessionConfirmation(sessionId, session?.name || 'Unknown Session');
                }}
              />

              <div className="bg-gray-800 rounded-lg p-6" ref={scrambleContainerRef}>
                {/* Hide scramble label on mobile */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Scramble</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyScramble}
                      className={`text-gray-400 hover:text-white transition-colors ${showCopyConfirm ? "text-green-500" : ""}`}
                      title="Copy scramble"
                    >
                      {showCopyConfirm ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={handleEditScramble}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Edit scramble"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={generateNewScramble}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="New scramble"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="w-full">
                    {editingScramble ? (
                      <input
                        ref={scrambleInputRef}
                        type="text"
                        value={tempScramble}
                        onChange={(e) => setTempScramble(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveScramble}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-lg md:text-2xl font-['Menlo'] text-center"
                        placeholder="Enter scramble..."
                      />
                    ) : (
                      <>
                        <div className="text-lg md:text-2xl font-['Menlo'] text-center break-words mb-4 md:mb-6">
                          {currentScramble}
                        </div>
                        
                        {/* Mobile scramble controls - below scramble text */}
                        <div className="md:hidden flex justify-center items-center gap-4 mb-4">
                          <button
                            onClick={handleCopyScramble}
                            className={`p-3 rounded-lg transition-colors ${showCopyConfirm ? "text-green-500 bg-green-500/20" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                            title="Copy scramble"
                          >
                            {showCopyConfirm ? (
                              <Check className="h-6 w-6" />
                            ) : (
                              <Copy className="h-6 w-6" />
                            )}
                          </button>
                          <button
                            onClick={generateNewScramble}
                            className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                            title="New scramble"
                          >
                            <RotateCcw className="h-6 w-6" />
                          </button>
                        </div>
                      </>
                    )}
                    
                    <div className="hidden md:flex justify-center">
                      <img
                        src={generateScramblePreview(currentScramble)}
                        alt="Cube state"
                        className="w-[150px] h-[150px] rounded-lg p-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6" ref={timerContainerRef}>
            <Timer
              key={`timer-${currentSession?.id}-${useInspection}-${inspectionTime}`}
              onComplete={handleSolveComplete}
              inspectionTime={inspectionTime}
              useInspection={useInspection}
              isFullSolve={true}
              onTimerStateChange={(state) =>
                setShowScramble(state === "idle" || state === "stopped")
              }
              onInspectionToggle={handleInspectionToggle}
              onInspectionTimeChange={handleInspectionTimeChange}
              initialDisplayTime={lastSolveTime}
            />
          </div>
        </div>

        {showScramble && (
          <div className="space-y-4">
            {/* Desktop Stats - Keep original layout */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-gray-700">
                  <h2 className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Current Session
                  </h2>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Single</div>
                    <div className="font-mono text-xl">
                      {currentStats.currentSingle === null
                        ? "0.00"
                        : formatTime(currentStats.currentSingle)}
                      s
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-gray-400">ao5</div>
                      <div className="font-mono">
                        {currentStats.ao5 === null
                          ? "0.00"
                          : formatTime(currentStats.ao5)}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ao12</div>
                      <div className="font-mono">
                        {currentStats.ao12 === null
                          ? "0.00"
                          : formatTime(currentStats.ao12)}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ao50</div>
                      <div className="font-mono">
                        {currentStats.ao50 === null
                          ? "0.00"
                          : formatTime(currentStats.ao50)}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ao100</div>
                      <div className="font-mono">
                        {currentStats.ao100 === null
                          ? "0.00"
                          : formatTime(currentStats.ao100)}
                        s
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-gray-700">
                  <h2 className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    All-Time Best
                  </h2>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Single</div>
                    <div 
                      className={`font-mono text-xl ${bestSingleSolve ? 'cursor-pointer hover:text-blue-400 transition-colors' : ''}`}
                      onClick={bestSingleSolve ? handleBestSingleClick : undefined}
                      title={bestSingleSolve ? 'Click to view solve details' : undefined}
                    >
                      {currentStats.bestSingle === null
                        ? "0.00"
                        : formatTime(currentStats.bestSingle)}
                      s
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-gray-400">ao5</div>
                      <div className="font-mono">
                        {currentStats.bestAo5 === null
                          ? "0.00"
                          : formatTime(currentStats.bestAo5)}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ao12</div>
                      <div className="font-mono">
                        {currentStats.bestAo12 === null
                          ? "0.00"
                          : formatTime(currentStats.bestAo12)}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ao50</div>
                      <div className="font-mono">
                        {currentStats.bestAo50 === null
                          ? "0.00"
                          : formatTime(currentStats.bestAo50)}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ao100</div>
                      <div className="font-mono">
                        {currentStats.bestAo100 === null
                          ? "0.00"
                          : formatTime(currentStats.bestAo100)}
                        s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Compact Stats */}
            <div className="md:hidden bg-gray-800 rounded-lg p-4">
              {/* Current Session Row */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Current Session</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-400">Single</div>
                    <div className="font-mono text-sm">
                      {currentStats.currentSingle === null
                        ? "0.00"
                        : formatTime(currentStats.currentSingle)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao5</div>
                    <div className="font-mono text-sm">
                      {currentStats.ao5 === null
                        ? "0.00"
                        : formatTime(currentStats.ao5)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao12</div>
                    <div className="font-mono text-sm">
                      {currentStats.ao12 === null
                        ? "0.00"
                        : formatTime(currentStats.ao12)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao50</div>
                    <div className="font-mono text-sm">
                      {currentStats.ao50 === null
                        ? "0.00"
                        : formatTime(currentStats.ao50)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao100</div>
                    <div className="font-mono text-sm">
                      {currentStats.ao100 === null
                        ? "0.00"
                        : formatTime(currentStats.ao100)}
                    </div>
                  </div>
                </div>
              </div>

              {/* All-Time Best Row */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">All-Time Best</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-400">Single</div>
                    <div 
                      className={`font-mono text-sm ${bestSingleSolve ? 'cursor-pointer hover:text-blue-400 transition-colors' : ''}`}
                      onClick={bestSingleSolve ? handleBestSingleClick : undefined}
                      title={bestSingleSolve ? 'Tap to view details' : undefined}
                    >
                      {currentStats.bestSingle === null
                        ? "0.00"
                        : formatTime(currentStats.bestSingle)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao5</div>
                    <div className="font-mono text-sm">
                      {currentStats.bestAo5 === null
                        ? "0.00"
                        : formatTime(currentStats.bestAo5)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao12</div>
                    <div className="font-mono text-sm">
                      {currentStats.bestAo12 === null
                        ? "0.00"
                        : formatTime(currentStats.bestAo12)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao50</div>
                    <div className="font-mono text-sm">
                      {currentStats.bestAo50 === null
                        ? "0.00"
                        : formatTime(currentStats.bestAo50)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ao100</div>
                    <div className="font-mono text-sm">
                      {currentStats.bestAo100 === null
                        ? "0.00"
                        : formatTime(currentStats.bestAo100)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-gray-700 flex justify-between items-center">
                <h2 className="text-sm font-medium">Solve History ( {getSolveCount()} )</h2>
                {solves.length > 0 && (
                  <button
                    onClick={showClearAllSolvesConfirmation}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                    title="Clear all solves"
                  >
                    <Eraser className="h-4 w-4" />
                    <span className="hidden md:inline">Clear All</span>
                  </button>
                )}
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                {solves.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No solves yet. Start solving to see your history!
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead className="bg-gray-800 sticky top-0">
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-400">
                              #
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-400">
                              Time
                            </th>
                            <th className="px-2 py-2 text-right text-xs font-medium text-gray-400"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {solves.map((solve, index) => (
                            <tr
                              key={solve.id}
                              className="hover:bg-gray-700 transition-colors cursor-pointer"
                              onClick={() => setSelectedSolve(solve)}
                            >
                              <td className="px-2 py-1.5 text-sm">
                                {solves.length - index}
                              </td>
                              <td
                                className={`px-2 py-1.5 font-mono text-sm ${
                                  solve.penalty === "DNF"
                                    ? "text-red-500"
                                    : solve.penalty === "+2"
                                      ? "text-yellow-500"
                                      : ""
                                }`}
                              >
                                {getDisplayTime(solve)}
                              </td>
                              <td className="px-2 py-1.5 text-right">
                                <div className="flex items-center gap-1">
                                  {solve.notes && solve.notes.trim() && (
                                    <MessageSquare className="h-3.5 w-3.5 text-blue-400\" title="Has notes" />
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRetrySolve(solve);
                                    }}
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                    title="Retry with this scramble"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      solve.id && showDeleteSolveConfirmation(solve.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete solve"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-700">
                      {solves.map((solve, index) => (
                        <div
                          key={solve.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
                        >
                          {/* Time Display - Large and tappable for delete */}
                          <div className="flex-1">
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Delete Solve',
                                  message: `Are you sure you want to delete this solve (${getDisplayTime(solve)})? This action cannot be undone.`,
                                  variant: 'danger',
                                  onConfirm: () => {
                                    solve.id && handleDeleteSolve(solve.id);
                                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                  },
                                });
                              }}
                              className={`font-mono text-xl text-left w-full ${
                                solve.penalty === "DNF"
                                  ? "text-red-500"
                                  : solve.penalty === "+2"
                                    ? "text-yellow-500"
                                    : "text-white"
                              } hover:text-red-400 transition-colors`}
                            >
                              {getDisplayTime(solve)}
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3">
                            {solve.notes && solve.notes.trim() && (
                              <button
                                onClick={() => setSelectedSolve(solve)}
                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-lg"
                                title="View notes"
                              >
                                <MessageSquare className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedSolve(solve)}
                              className="p-3 text-gray-400 hover:text-blue-500 transition-colors rounded-lg bg-gray-700 hover:bg-gray-600"
                              title="Edit solve details"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRetrySolve(solve)}
                              className="p-3 text-gray-400 hover:text-blue-500 transition-colors rounded-lg bg-gray-700 hover:bg-gray-600"
                              title="Retry with this scramble"
                            >
                              <RefreshCw className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedSolve && (
        <SolveDetailsModal
          solve={selectedSolve}
          sessionName={getSessionName(selectedSolve.sessionId)}
          onClose={() => setSelectedSolve(null)}
          onDelete={() => {
            handleDeleteSolve(selectedSolve.id!);
            setSelectedSolve(null);
          }}
          onUpdateNotes={(id, notes) => handleUpdateNotes(Number(id), notes)}
          onUpdatePenalty={(id, penalty) =>
            handleUpdatePenalty(Number(id), penalty)
          }
        />
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText={confirmModal.variant === 'danger' ? 'Delete' : 'OK'}
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Training;