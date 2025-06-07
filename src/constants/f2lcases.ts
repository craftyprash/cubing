// F2L case groups
export const F2LGroups = {
  CONNECTED_PAIRS: {
    id: 'connected_pairs',
    name: 'Connected Pairs',
    maxCases: 10
  },
  CORNER_IN_SLOT: {
    id: 'corner_in_slot',
    name: 'Corner In Slot',
    maxCases: 6
  },
  DISCONNECTED_PAIRS: {
    id: 'disconnected_pairs',
    name: 'Disconnected Pairs',
    maxCases: 10
  },
  EDGE_IN_SLOT: {
    id: 'edge_in_slot',
    name: 'Edge In Slot',
    maxCases: 6
  },
  FREE_PAIRS: {
    id: 'free_pairs',
    name: 'Free Pairs',
    maxCases: 4
  },
  PIECES_IN_SLOT: {
    id: 'pieces_in_slot',
    name: 'Pieces In Slot',
    maxCases: 5
  }
};

// F2L case definitions
export const F2LCases = {
  // Connected Pairs (10 cases)
  "F2L-1": {
    id: "F2L-1",
    name: "F2L 1",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U R' U2 R U2 R'",
    algorithms: {
      main: "U R U' R'",
      alt1: "y' U' R' U R",
      alt2: "U' L' U L"
    }
  },
  "F2L-2": {
    id: "F2L-2",
    name: "F2L 2",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U' R' U2 R U2 R'",
    algorithms: {
      main: "U' R U R'",
      alt1: "y' U R' U' R"
    }
  },
  "F2L-3": {
    id: "F2L-3",
    name: "F2L 3",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U2 R' U' R U R'",
    algorithms: {
      main: "U R U2 R' U' R U R'",
      alt1: "y U' R' U2 R U R' U' R"
    }
  },
  "F2L-4": {
    id: "F2L-4",
    name: "F2L 4",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U2 R' U R U' R'",
    algorithms: {
      main: "U' R U2 R' U R U' R'",
      alt1: "y U R' U2 R U' R' U R"
    }
  },
  "F2L-5": {
    id: "F2L-5",
    name: "F2L 5",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U' R' U R U R'",
    algorithms: {
      main: "R U' R' U R U R'",
      alt1: "y' R' U R U' R' U' R"
    }
  },
  "F2L-6": {
    id: "F2L-6",
    name: "F2L 6",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U R' U' R U' R'",
    algorithms: {
      main: "R U R' U' R U' R'",
      alt1: "y' R' U' R U R' U R"
    }
  },
  "F2L-7": {
    id: "F2L-7",
    name: "F2L 7",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U2 R' U2 R U' R'",
    algorithms: {
      main: "U2 R U2 R' U2 R U' R'",
      alt1: "y U2 R' U2 R U2 R' U R"
    }
  },
  "F2L-8": {
    id: "F2L-8",
    name: "F2L 8",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U2 R' U2 R U R'",
    algorithms: {
      main: "U2 R U2 R' U2 R U R'",
      alt1: "y U2 R' U2 R U2 R' U' R"
    }
  },
  "F2L-9": {
    id: "F2L-9",
    name: "F2L 9",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U R' U' R U2 R'",
    algorithms: {
      main: "R U R' U' R U2 R'",
      alt1: "y' R' U' R U R' U2 R"
    }
  },
  "F2L-10": {
    id: "F2L-10",
    name: "F2L 10",
    group: F2LGroups.CONNECTED_PAIRS.id,
    setupMoves: "R U' R' U R U2 R'",
    algorithms: {
      main: "R U' R' U R U2 R'",
      alt1: "y' R' U R U' R' U2 R"
    }
  },

  // Corner in Slot (6 cases)
  "F2L-11": {
    id: "F2L-11",
    name: "F2L 11",
    group: F2LGroups.CORNER_IN_SLOT.id,
    setupMoves: "R U' R' U2 F' U' F",
    algorithms: {
      main: "R U' R' U2 F' U' F",
      alt1: "y' R' U R U2 B U B'"
    }
  },
  "F2L-12": {
    id: "F2L-12",
    name: "F2L 12",
    group: F2LGroups.CORNER_IN_SLOT.id,
    setupMoves: "R U R' U2 F' U F",
    algorithms: {
      main: "R U R' U2 F' U F",
      alt1: "y' R' U' R U2 B U' B'"
    }
  },
  "F2L-13": {
    id: "F2L-13",
    name: "F2L 13",
    group: F2LGroups.CORNER_IN_SLOT.id,
    setupMoves: "R U2 R' F' U2 F",
    algorithms: {
      main: "R U2 R' F' U2 F",
      alt1: "y' R' U2 R B U2 B'"
    }
  },
  "F2L-14": {
    id: "F2L-14",
    name: "F2L 14",
    group: F2LGroups.CORNER_IN_SLOT.id,
    setupMoves: "F' U2 F R U2 R'",
    algorithms: {
      main: "F' U2 F R U2 R'",
      alt1: "y B U2 B' R' U2 R"
    }
  },
  "F2L-15": {
    id: "F2L-15",
    name: "F2L 15",
    group: F2LGroups.CORNER_IN_SLOT.id,
    setupMoves: "R U R' F' U' F",
    algorithms: {
      main: "R U R' F' U' F",
      alt1: "y' R' U' R B U B'"
    }
  },
  "F2L-16": {
    id: "F2L-16",
    name: "F2L 16",
    group: F2LGroups.CORNER_IN_SLOT.id,
    setupMoves: "R U' R' F' U F",
    algorithms: {
      main: "R U' R' F' U F",
      alt1: "y' R' U R B U' B'"
    }
  },

  // Disconnected Pairs (10 cases)
  "F2L-17": {
    id: "F2L-17",
    name: "F2L 17",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "U R U' R' U' F' U F",
    algorithms: {
      main: "U R U' R' U' F' U F",
      alt1: "y' U' R' U R U B U' B'"
    }
  },
  "F2L-18": {
    id: "F2L-18",
    name: "F2L 18",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "U' R U R' U F' U' F",
    algorithms: {
      main: "U' R U R' U F' U' F",
      alt1: "y' U R' U' R U' B U B'"
    }
  },
  "F2L-19": {
    id: "F2L-19",
    name: "F2L 19",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "U R U2 R' U F' U' F",
    algorithms: {
      main: "U R U2 R' U F' U' F",
      alt1: "y' U' R' U2 R U' B U B'"
    }
  },
  "F2L-20": {
    id: "F2L-20",
    name: "F2L 20",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "U' R U2 R' U' F' U F",
    algorithms: {
      main: "U' R U2 R' U' F' U F",
      alt1: "y' U R' U2 R U B U' B'"
    }
  },
  "F2L-21": {
    id: "F2L-21",
    name: "F2L 21",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "R U R' U' R U R' U' F' U F",
    algorithms: {
      main: "R U R' U' R U R' U' F' U F",
      alt1: "y' R' U' R U R' U' R U B U' B'"
    }
  },
  "F2L-22": {
    id: "F2L-22",
    name: "F2L 22",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "R U' R' U R U' R' U F' U' F",
    algorithms: {
      main: "R U' R' U R U' R' U F' U' F",
      alt1: "y' R' U R U' R' U R U' B U B'"
    }
  },
  "F2L-23": {
    id: "F2L-23",
    name: "F2L 23",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "R U2 R' U' R U R' U' F' U F",
    algorithms: {
      main: "R U2 R' U' R U R' U' F' U F",
      alt1: "y' R' U2 R U R' U' R U B U' B'"
    }
  },
  "F2L-24": {
    id: "F2L-24",
    name: "F2L 24",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "R U2 R' U R U' R' U F' U' F",
    algorithms: {
      main: "R U2 R' U R U' R' U F' U' F",
      alt1: "y' R' U2 R U' R' U R U' B U B'"
    }
  },
  "F2L-25": {
    id: "F2L-25",
    name: "F2L 25",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "F' U F U' R U R'",
    algorithms: {
      main: "F' U F U' R U R'",
      alt1: "y B U' B' U R' U' R"
    }
  },
  "F2L-26": {
    id: "F2L-26",
    name: "F2L 26",
    group: F2LGroups.DISCONNECTED_PAIRS.id,
    setupMoves: "F' U' F U R U' R'",
    algorithms: {
      main: "F' U' F U R U' R'",
      alt1: "y B U B' U' R' U R"
    }
  },

  // Edge in Slot (6 cases)
  "F2L-27": {
    id: "F2L-27",
    name: "F2L 27",
    group: F2LGroups.EDGE_IN_SLOT.id,
    setupMoves: "U R U' R' F' U2 F",
    algorithms: {
      main: "U R U' R' F' U2 F",
      alt1: "y' U' R' U R B U2 B'"
    }
  },
  "F2L-28": {
    id: "F2L-28",
    name: "F2L 28",
    group: F2LGroups.EDGE_IN_SLOT.id,
    setupMoves: "U' R U R' F' U2 F",
    algorithms: {
      main: "U' R U R' F' U2 F",
      alt1: "y' U R' U' R B U2 B'"
    }
  },
  "F2L-29": {
    id: "F2L-29",
    name: "F2L 29",
    group: F2LGroups.EDGE_IN_SLOT.id,
    setupMoves: "R U R' U' F' U2 F",
    algorithms: {
      main: "R U R' U' F' U2 F",
      alt1: "y' R' U' R U B U2 B'"
    }
  },
  "F2L-30": {
    id: "F2L-30",
    name: "F2L 30",
    group: F2LGroups.EDGE_IN_SLOT.id,
    setupMoves: "R U' R' U F' U2 F",
    algorithms: {
      main: "R U' R' U F' U2 F",
      alt1: "y' R' U R U' B U2 B'"
    }
  },
  "F2L-31": {
    id: "F2L-31",
    name: "F2L 31",
    group: F2LGroups.EDGE_IN_SLOT.id,
    setupMoves: "F' U2 F U R U R'",
    algorithms: {
      main: "F' U2 F U R U R'",
      alt1: "y B U2 B' U' R' U' R"
    }
  },
  "F2L-32": {
    id: "F2L-32",
    name: "F2L 32",
    group: F2LGroups.EDGE_IN_SLOT.id,
    setupMoves: "F' U2 F U' R U' R'",
    algorithms: {
      main: "F' U2 F U' R U' R'",
      alt1: "y B U2 B' U R' U R"
    }
  },

  // Free Pairs (4 cases)
  "F2L-33": {
    id: "F2L-33",
    name: "F2L 33",
    group: F2LGroups.FREE_PAIRS.id,
    setupMoves: "R U' R' U2 R U R'",
    algorithms: {
      main: "R U' R' U2 R U R'",
      alt1: "y' R' U R U2 R' U' R"
    }
  },
  "F2L-34": {
    id: "F2L-34",
    name: "F2L 34",
    group: F2LGroups.FREE_PAIRS.id,
    setupMoves: "R U R' U2 R U' R'",
    algorithms: {
      main: "R U R' U2 R U' R'",
      alt1: "y' R' U' R U2 R' U R"
    }
  },
  "F2L-35": {
    id: "F2L-35",
    name: "F2L 35",
    group: F2LGroups.FREE_PAIRS.id,
    setupMoves: "U' R U2 R' U2 R U' R'",
    algorithms: {
      main: "U' R U2 R' U2 R U' R'",
      alt1: "y U R' U2 R U2 R' U R"
    }
  },
  "F2L-36": {
    id: "F2L-36",
    name: "F2L 36",
    group: F2LGroups.FREE_PAIRS.id,
    setupMoves: "U R U2 R' U2 R U R'",
    algorithms: {
      main: "U R U2 R' U2 R U R'",
      alt1: "y U' R' U2 R U2 R' U' R"
    }
  },

  // Pieces in Slot (5 cases)
  "F2L-37": {
    id: "F2L-37",
    name: "F2L 37",
    group: F2LGroups.PIECES_IN_SLOT.id,
    setupMoves: "R U R' U' R U R' U' R U R'",
    algorithms: {
      main: "R U R' U' R U R' U' R U R'",
      alt1: "y' R' U' R U R' U' R U R' U' R"
    }
  },
  "F2L-38": {
    id: "F2L-38",
    name: "F2L 38",
    group: F2LGroups.PIECES_IN_SLOT.id,
    setupMoves: "R U' R' U R U' R' U R U' R'",
    algorithms: {
      main: "R U' R' U R U' R' U R U' R'",
      alt1: "y' R' U R U' R' U R U' R' U R"
    }
  },
  "F2L-39": {
    id: "F2L-39",
    name: "F2L 39",
    group: F2LGroups.PIECES_IN_SLOT.id,
    setupMoves: "R U2 R' U' R U R' U2 R U' R'",
    algorithms: {
      main: "R U2 R' U' R U R' U2 R U' R'",
      alt1: "y' R' U2 R U R' U' R U2 R' U R"
    }
  },
  "F2L-40": {
    id: "F2L-40",
    name: "F2L 40",
    group: F2LGroups.PIECES_IN_SLOT.id,
    setupMoves: "R U R' U' R U2 R' U R U R'",
    algorithms: {
      main: "R U R' U' R U2 R' U R U R'",
      alt1: "y' R' U' R U R' U2 R U' R' U' R"
    }
  },
  "F2L-41": {
    id: "F2L-41",
    name: "F2L 41",
    group: F2LGroups.PIECES_IN_SLOT.id,
    setupMoves: "R U' R' U R U2 R' U' R U' R'",
    algorithms: {
      main: "R U' R' U R U2 R' U' R U' R'",
      alt1: "y' R' U R U' R' U2 R U R' U R"
    }
  }
};