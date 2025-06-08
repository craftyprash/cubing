import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Star, Edit2, Clock, Hash, RotateCcw } from "lucide-react";
import { CubeCase, CubeStage, Algorithm } from "../types";
import { F2LCases, F2LGroups } from "../constants/f2lcases";
import { OLLCases, OLLGroups } from "../constants/ollcases";
import { PLLCases, PLLGroups } from "../constants/pllcases";
import { generateCaseImageUrl } from "../utils/visualCube";
import EditCaseModal from "../components/cube/EditCaseModal";
import CaseTimer from "../components/cube/CaseTimer";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { formatTimeForDisplay } from "../utils/timeUtils";
import { db } from "../db";

const CaseLibrary: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<CubeStage>("F2L");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [cases, setCases] = useState<CubeCase[]>([]);
  const [editingCase, setEditingCase] = useState<CubeCase | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [activeAlgorithmId, setActiveAlgorithmId] = useState<string | null>(
    null,
  );
  
  // Add refs to track case card elements for focus management
  const caseCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
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

  const favorites = useLiveQuery(() => db.cubeCaseFavorites.toArray()) || [];
  const algorithmStats = useLiveQuery(() => db.algorithmStats.toArray()) || [];

  // Global keydown handler for Cases page
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const activeElement = document.activeElement;
        const isTextInput = activeElement?.tagName === 'INPUT' || 
                           activeElement?.tagName === 'TEXTAREA' ||
                           activeElement?.isContentEditable;
        
        // Don't prevent spacebar if:
        // 1. User is typing in a text input
        // 2. A case timer is active (let CaseTimer handle it)
        // 3. User is editing a case (let modal handle it)
        if (!isTextInput && !activeTimerId && !editingCase) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, [editingCase, activeTimerId]);

  // Mark the page as having input when editing case
  useEffect(() => {
    if (editingCase) {
      document.body.setAttribute('data-input-active', 'true');
    } else {
      document.body.removeAttribute('data-input-active');
    }

    return () => {
      document.body.removeAttribute('data-input-active');
    };
  }, [editingCase]);

  const getGroups = () => {
    switch (selectedStage) {
      case "F2L":
        return Object.values(F2LGroups).map((group) => ({
          id: group.id,
          name: group.name,
          count: cases.filter((c) => c.group === group.id).length,
          maxCases: group.maxCases,
        }));
      case "OLL":
        return Object.values(OLLGroups).map((group) => ({
          id: group.id,
          name: group.name,
          count: cases.filter((c) => c.group === group.id).length,
          maxCases: group.maxCases,
        }));
      case "PLL":
        return Object.values(PLLGroups).map((group) => ({
          id: group.id,
          name: group.name,
          count: cases.filter((c) => c.group === group.id).length,
          maxCases: group.maxCases,
        }));
      default:
        return [];
    }
  };

  const getGroupName = (groupId: string): string => {
    switch (selectedStage) {
      case "F2L":
        return (
          Object.values(F2LGroups).find((g) => g.id === groupId)?.name || ""
        );
      case "OLL":
        return (
          Object.values(OLLGroups).find((g) => g.id === groupId)?.name || ""
        );
      case "PLL":
        return (
          Object.values(PLLGroups).find((g) => g.id === groupId)?.name || ""
        );
      default:
        return "";
    }
  };

  useEffect(() => {
    const loadCases = async () => {
      const allCases =
        selectedStage === "F2L"
          ? Object.values(F2LCases)
          : selectedStage === "OLL"
            ? Object.values(OLLCases)
            : Object.values(PLLCases);

      const favoritesMap = favorites.reduce(
        (map, fav) => {
          map[fav.caseId] = true;
          return map;
        },
        {} as Record<string, boolean>,
      );

      const statsMap = algorithmStats.reduce(
        (map, stat) => {
          map[stat.algorithmId] = stat;
          return map;
        },
        {} as Record<string, any>,
      );

      setCases(
        allCases.map((c) => ({
          id: c.id,
          name: c.name,
          stage: selectedStage,
          group: c.group,
          setupMoves: c.setupMoves,
          algorithms: [
            {
              id: `${c.id}_main`,
              moves: c.algorithms.main,
              isMain: true,
              practiceCount: statsMap[`${c.id}_main`]?.practiceCount || 0,
              bestTime: statsMap[`${c.id}_main`]?.bestTime,
              averageOf5: statsMap[`${c.id}_main`]?.averageOf5,
              averageOf12: statsMap[`${c.id}_main`]?.averageOf12,
              times: statsMap[`${c.id}_main`]?.times || [],
              lastPracticed: statsMap[`${c.id}_main`]?.lastPracticed,
            },
            {
              id: `${c.id}_alt1`,
              moves: c.algorithms.alt1 || "",
              isMain: false,
              practiceCount: statsMap[`${c.id}_alt1`]?.practiceCount || 0,
              bestTime: statsMap[`${c.id}_alt1`]?.bestTime,
              averageOf5: statsMap[`${c.id}_alt1`]?.averageOf5,
              averageOf12: statsMap[`${c.id}_alt1`]?.averageOf12,
              times: statsMap[`${c.id}_alt1`]?.times || [],
              lastPracticed: statsMap[`${c.id}_alt1`]?.lastPracticed,
            },
            {
              id: `${c.id}_alt2`,
              moves: c.algorithms.alt2 || "",
              isMain: false,
              practiceCount: statsMap[`${c.id}_alt2`]?.practiceCount || 0,
              bestTime: statsMap[`${c.id}_alt2`]?.bestTime,
              averageOf5: statsMap[`${c.id}_alt2`]?.averageOf5,
              averageOf12: statsMap[`${c.id}_alt2`]?.averageOf12,
              times: statsMap[`${c.id}_alt2`]?.times || [],
              lastPracticed: statsMap[`${c.id}_alt2`]?.lastPracticed,
            },
          ].filter((alg) => alg.moves),
          isFavorite: favoritesMap[c.id] || false,
        })),
      );
    };

    loadCases();
  }, [selectedStage, favorites, algorithmStats]);

  const getSolveHistoryDisplay = (
    times: number[] = [],
    limit: number = 12,
  ): string => {
    if (!times.length) return "No solves yet";

    const recentTimes = times.slice(-limit);

    return recentTimes.map((t) => formatTimeForDisplay(t)).join(" ");
  };

  const filteredCases = cases.filter((c) => {
    if (showFavorites && !c.isFavorite) return false;
    if (selectedGroup !== "all" && c.group !== selectedGroup) return false;
    return true;
  });

  const handleSaveCase = async (algorithms: Algorithm[]) => {
    if (!editingCase) return;

    setCases(
      cases.map((c) =>
        c.id === editingCase.id
          ? {
              ...c,
              algorithms: algorithms.map((alg) => {
                const existingAlg = c.algorithms.find((a) => a.id === alg.id);
                return {
                  ...alg,
                  practiceCount: existingAlg?.practiceCount || 0,
                  bestTime: existingAlg?.bestTime,
                  averageOf5: existingAlg?.averageOf5,
                  averageOf12: existingAlg?.averageOf12,
                  times: existingAlg?.times || [],
                  lastPracticed: existingAlg?.lastPracticed,
                };
              }),
            }
          : c,
      ),
    );
  };

  const toggleFavorite = async (caseId: string) => {
    setCases(
      cases.map((c) =>
        c.id === caseId ? { ...c, isFavorite: !c.isFavorite } : c,
      ),
    );

    const isFavorite = cases.find((c) => c.id === caseId)?.isFavorite;
    if (isFavorite) {
      await db.cubeCaseFavorites.where("caseId").equals(caseId).delete();
    } else {
      await db.cubeCaseFavorites.add({
        caseId,
        dateAdded: new Date(),
      });
    }
  };

  const calculateAverages = (times: number[]) => {
    const calculateAverage = (count: number) => {
      if (times.length < count) return null;
      const recent = times.slice(-count);
      if (count >= 5) {
        const sorted = [...recent].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, -1);
        return trimmed.reduce((sum, time) => sum + time, 0) / trimmed.length;
      }
      return recent.reduce((sum, time) => sum + time, 0) / recent.length;
    };

    return {
      ao5: calculateAverage(5),
      ao12: calculateAverage(12),
    };
  };

  const showDeleteSolveTimeConfirmation = (caseId: string, algorithmId: string, timeIndex: number, timeValue: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Solve Time',
      message: `Are you sure you want to delete the solve time ${formatTimeForDisplay(timeValue)}s? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: () => {
        handleDeleteSolveTime(caseId, algorithmId, timeIndex);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteSolveTime = async (caseId: string, algorithmId: string, timeIndex: number) => {
    const existingStat = await db.algorithmStats.get(algorithmId);
    if (!existingStat || !existingStat.times || existingStat.times.length === 0) {
      return;
    }

    const times = [...existingStat.times];
    const actualIndex = times.length - 1 - timeIndex;
    times.splice(actualIndex, 1);

    if (times.length === 0) {
      await db.algorithmStats.delete(algorithmId);
      
      setCases(
        cases.map((c) =>
          c.id === caseId
            ? {
                ...c,
                algorithms: c.algorithms.map((alg) =>
                  alg.id === algorithmId
                    ? {
                        ...alg,
                        practiceCount: 0,
                        bestTime: undefined,
                        averageOf5: undefined,
                        averageOf12: undefined,
                        lastPracticed: undefined,
                        times: [],
                      }
                    : alg,
                ),
              }
            : c,
        ),
      );
    } else {
      const bestTime = Math.min(...times);
      const { ao5, ao12 } = calculateAverages(times);

      const statObject = {
        algorithmId,
        caseId,
        times,
        practiceCount: times.length,
        bestTime,
        averageOf5: ao5,
        averageOf12: ao12,
        lastPracticed: existingStat.lastPracticed,
      };

      await db.algorithmStats.update(algorithmId, statObject);

      setCases(
        cases.map((c) =>
          c.id === caseId
            ? {
                ...c,
                algorithms: c.algorithms.map((alg) =>
                  alg.id === algorithmId
                    ? {
                        ...alg,
                        practiceCount: times.length,
                        bestTime,
                        averageOf5: ao5,
                        averageOf12: ao12,
                        times,
                      }
                    : alg,
                ),
              }
            : c,
        ),
      );
    }
  };

  const handleTimerComplete = async (
    caseId: string,
    algorithmId: string,
    time: number,
  ) => {
    const existingStat = await db.algorithmStats.get(algorithmId);
    const times = existingStat ? [...existingStat.times, time] : [time];
    const bestTime = Math.min(...times);
    const { ao5, ao12 } = calculateAverages(times);

    const statObject = {
      algorithmId,
      caseId,
      times,
      practiceCount: times.length,
      bestTime,
      averageOf5: ao5,
      averageOf12: ao12,
      lastPracticed: new Date(),
    };

    if (existingStat) {
      await db.algorithmStats.update(algorithmId, statObject);
    } else {
      await db.algorithmStats.add(statObject);
    }

    setCases(
      cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              algorithms: c.algorithms.map((alg) =>
                alg.id === algorithmId
                  ? {
                      ...alg,
                      practiceCount: times.length,
                      bestTime,
                      averageOf5: ao5,
                      averageOf12: ao12,
                      lastPracticed: new Date(),
                      times,
                    }
                  : alg,
              ),
            }
          : c,
      ),
    );
  };

  const handleAlgorithmChange = (caseId: string, newAlgorithmId: string) => {
    setActiveAlgorithmId(newAlgorithmId);
  };

  const showClearStatsConfirmation = (caseId: string, algorithmId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Algorithm Statistics',
      message: 'Are you sure you want to clear all practice statistics for this algorithm? This action cannot be undone.',
      variant: 'danger',
      onConfirm: () => {
        handleClearStats(caseId, algorithmId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleClearStats = async (caseId: string, algorithmId: string) => {
    await db.algorithmStats.delete(algorithmId);

    setCases(
      cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              algorithms: c.algorithms.map((alg) =>
                alg.id === algorithmId
                  ? {
                      ...alg,
                      practiceCount: 0,
                      bestTime: undefined,
                      averageOf5: undefined,
                      averageOf12: undefined,
                      lastPracticed: undefined,
                      times: [],
                    }
                  : alg,
              ),
            }
          : c,
      ),
    );
  };

  const formatTime = (time: number | undefined): string => {
    return formatTimeForDisplay(time);
  };

  // Handle closing the timer with focus management
  const handleCloseTimer = () => {
    const previousActiveTimerId = activeTimerId;
    
    // Close the timer overlay but keep the case section open
    // We do NOT set activeTimerId to null here - this keeps the case section expanded
    
    // Focus the case card that was previously active
    if (previousActiveTimerId && caseCardRefs.current[previousActiveTimerId]) {
      // Use setTimeout to ensure the timer overlay is fully closed before focusing
      setTimeout(() => {
        const caseCard = caseCardRefs.current[previousActiveTimerId];
        if (caseCard) {
          caseCard.focus();
          // Scroll the case into view if needed
          caseCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  // Function to set case card ref
  const setCaseCardRef = (caseId: string) => (el: HTMLDivElement | null) => {
    caseCardRefs.current[caseId] = el;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedStage("F2L")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStage === "F2L"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            F2L
          </button>
          <button
            onClick={() => setSelectedStage("OLL")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStage === "OLL"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            OLL
          </button>
          <button
            onClick={() => setSelectedStage("PLL")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStage === "PLL"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            PLL
          </button>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showFavorites ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <Star className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedGroup("all")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedGroup === "all"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            All Cases ({cases.length})
          </button>

          {getGroups().map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedGroup === group.id
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {group.name} ({group.maxCases})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((cubeCase) => {
            const activeAlgorithm =
              activeTimerId === cubeCase.id && activeAlgorithmId
                ? cubeCase.algorithms.find(
                    (alg) => alg.id === activeAlgorithmId,
                  )
                : cubeCase.algorithms.find((alg) => alg.isMain) ||
                  cubeCase.algorithms[0];

            const imageUrl = generateCaseImageUrl(
              cubeCase.id,
              cubeCase.stage.toLowerCase(),
              cubeCase.setupMoves,
            );

            const caseNumber = cubeCase.id.split("-")[1] || "";
            const groupName = getGroupName(cubeCase.group);

            return (
              <div 
                key={cubeCase.id} 
                ref={setCaseCardRef(cubeCase.id)}
                className="bg-gray-800 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={-1}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="mb-2">
                      <span className="text-lg font-bold">{caseNumber}</span>
                      <span className="text-lg"> - {groupName}</span>
                    </div>
                    <p className="font-mono text-gray-400 text-sm break-words">
                      {activeAlgorithm?.moves}
                    </p>
                  </div>
                  <img
                    src={imageUrl}
                    alt={cubeCase.name}
                    className="w-24 h-24 rounded-lg p-2"
                  />
                </div>

                {activeTimerId === cubeCase.id && (
                  <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                      {cubeCase.algorithms.map((alg) => (
                        <button
                          key={alg.id}
                          onClick={() =>
                            handleAlgorithmChange(cubeCase.id, alg.id)
                          }
                          className={`flex-1 px-2 py-1 rounded text-sm transition-colors ${
                            activeAlgorithmId === alg.id
                              ? "bg-blue-600"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          {alg.isMain
                            ? "Main"
                            : `Alt ${alg.id.endsWith("alt1") ? "1" : "2"}`}
                        </button>
                      ))}
                    </div>

                    {activeAlgorithmId && (
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <div className="font-mono text-sm text-gray-300 mb-2">
                          {
                            cubeCase.algorithms.find(
                              (alg) => alg.id === activeAlgorithmId,
                            )?.moves
                          }
                        </div>

                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-1">
                            Recent solves (click to delete):
                          </div>
                          <div className="bg-gray-800 rounded p-2 overflow-x-auto">
                            {cubeCase.algorithms.find(
                              (alg) => alg.id === activeAlgorithmId,
                            )?.times?.length ? (
                              <div className="flex gap-2 flex-wrap">
                                {cubeCase.algorithms
                                  .find((alg) => alg.id === activeAlgorithmId)
                                  ?.times?.slice(-10)
                                  .reverse()
                                  .map((time, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => showDeleteSolveTimeConfirmation(
                                        cubeCase.id, 
                                        activeAlgorithmId, 
                                        idx, 
                                        time
                                      )}
                                      className={`inline-block px-2 py-1 text-xs rounded transition-colors hover:bg-red-600 hover:text-white
                                                ${idx === 0 ? "bg-blue-800 text-white" : "bg-gray-700 text-gray-300"}`}
                                      title={`Click to delete this solve: ${formatTimeForDisplay(time)}s`}
                                    >
                                      {formatTimeForDisplay(time)}
                                    </button>
                                  ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No solves yet
                              </span>
                            )}
                          </div>
                        </div>
                        <CaseTimer
                          key={`${cubeCase.id}_${activeAlgorithmId}`}
                          caseId={cubeCase.id}
                          onComplete={(time) =>
                            handleTimerComplete(
                              cubeCase.id,
                              activeAlgorithmId,
                              time,
                            )
                          }
                          onClose={handleCloseTimer}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400">Best</div>
                    <div className="font-mono">
                      {formatTimeForDisplay(activeAlgorithm?.bestTime)}s
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">ao5</div>
                    <div className="font-mono">
                      {formatTimeForDisplay(activeAlgorithm?.averageOf5)}s
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">ao12</div>
                    <div className="font-mono">
                      {formatTimeForDisplay(activeAlgorithm?.averageOf12)}s
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Count</div>
                    <div className="font-mono flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {activeAlgorithm?.practiceCount || 0}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (activeTimerId === cubeCase.id) {
                        // Close the timer but keep the case section open
                        setActiveTimerId(null);
                        setActiveAlgorithmId(null);
                      } else {
                        setActiveTimerId(cubeCase.id);
                        setActiveAlgorithmId(activeAlgorithm?.id);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg flex-grow flex items-center justify-center gap-2 transition-colors ${
                      activeTimerId === cubeCase.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {activeTimerId === cubeCase.id
                        ? "Hide Timer"
                        : "Practice"}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(cubeCase.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      cubeCase.isFavorite
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <Star
                      className="w-4 h-4"
                      fill={cubeCase.isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => setEditingCase(cubeCase)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      showClearStatsConfirmation(cubeCase.id, activeAlgorithm?.id || "")
                    }
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Clear stats"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingCase && (
        <EditCaseModal
          cubeCase={editingCase}
          onClose={() => setEditingCase(null)}
          onSave={handleSaveCase}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default CaseLibrary;