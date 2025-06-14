// OLL case groups
export const OLLGroups = {
  ALL_CORNERS_ORIENTED: {
    id: "all_corners_oriented",
    name: "All Corners Oriented",
    maxCases: 2,
  },
  AWKWARD_SHAPES: {
    id: "awkward_shapes",
    name: "Awkward Shapes",
    maxCases: 4,
  },
  C_SHAPES: {
    id: "c_shapes",
    name: "C Shapes",
    maxCases: 2,
  },
  DOT_CASE: {
    id: "dot_case",
    name: "Dot Case",
    maxCases: 8,
  },
  FISH_SHAPES: {
    id: "fish_shapes",
    name: "Fish Shapes",
    maxCases: 4,
  },
  KNIGHT_MOVE: {
    id: "knight_move",
    name: "Knight Move Shapes",
    maxCases: 4,
  },
  L_SHAPES: {
    id: "l_shapes",
    name: "L Shapes",
    maxCases: 6,
  },
  LIGHTNING: {
    id: "lightning",
    name: "Lightning Shapes",
    maxCases: 6,
  },
  LINE: {
    id: "line",
    name: "Line Shapes",
    maxCases: 4,
  },
  OCLL: {
    id: "ocll",
    name: "OCLL",
    maxCases: 7,
  },
  P_SHAPES: {
    id: "p_shapes",
    name: "P Shapes",
    maxCases: 4,
  },
  SQUARE: {
    id: "square",
    name: "Square Shapes",
    maxCases: 2,
  },
  T_SHAPES: {
    id: "t_shapes",
    name: "T Shapes",
    maxCases: 2,
  },
  W_SHAPES: {
    id: "w_shapes",
    name: "W Shapes",
    maxCases: 2,
  },
};

// OLL case definitions
export const OLLCases = {
  "OLL-1": {
    id: "OLL-1",
    name: "OLL 1 Dot Case",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "F R' F' R U2' F R' F' R2' U2' R'",
    algorithms: {
      main: "R U2' R2' F R F' U2' R' F R F'",
      alt1: "y R U' R2' D' r U' r' D R2 U R'",
      alt2: "f R U R' U' R f' U' r' U' R U M'",
    },
  },
  "OLL-2": {
    id: "OLL-2",
    name: "OLL 2 Dot Case",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "f U R U' R' f' F U R U' R' F'",
    algorithms: {
      main: "y' R U' R2 D' r U r' D R2 U R'",
      alt1: "y2 f U R U' R' S' U R U' R' F'",
      alt2: "F R U R' U' F' f R U R' U' f'",
    },
  },

  "OLL-3": {
    id: "OLL-3",
    name: "OLL 3 Dot Case",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "F U R U' R' F' U f U R U' R' f' y2",
    algorithms: {
      main: "y' f U R U' R' S' R' F' R U R U' R'",
      alt1: "R' F2 R2 U2' R' F R U2' R2' F2 R",
      alt2: "y' r' R2 U R' U r U2' r' U M'",
    },
  },
  "OLL-4": {
    id: "OLL-4",
    name: "OLL 4 Dot Case",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "F U R U' R' F' U' f U R U' R' f' y",
    algorithms: {
      main: "R' F R F' U' S R' U' R U R S'",
      alt1: "y' R' F2 R2 U2' R' F' R U2' R2' F2 R",
      alt2: "y' f R U R' U' f' U F R U R' U' F'",
    },
  },
  "OLL-5": {
    id: "OLL-5",
    name: "Dot 3",
    group: OLLGroups.SQUARE.id,
    setupMoves: "r' U' R U' R' U2' r",
    algorithms: {
      main: "r' U2' R U R' U r",
      alt1: "y2 l' U2 L U L' U l",
      alt2: "y2 R' F2 r U r' F R",
    },
  },
  "OLL-6": {
    id: "OLL-6",
    name: "Dot 4",
    group: OLLGroups.SQUARE.id,
    setupMoves: "r U R' U R U2' r'",
    algorithms: {
      main: "r U2' R' U' R U' r'",
      alt1: "y2 l U2 L' U' L U' l'",
      alt2: "L F2 l' U' l F' L'",
    },
  },
  "OLL-7": {
    id: "OLL-7",
    name: "Dot 5",
    group: OLLGroups.LIGHTNING.id,
    setupMoves: "r U2' R' U' R U' r'",
    algorithms: {
      main: "r U R' U R U2' r'",
      alt1: "L' U2 L U2 L F' L' F",
      alt2: "y2 l U L' U L U2 l'",
    },
  },
  "OLL-8": {
    id: "OLL-8",
    name: "Dot 6",
    group: OLLGroups.LIGHTNING.id,
    setupMoves: "r' U2' R U R' U r y2'",
    algorithms: {
      main: "R' F' r U' r' F2 R",
      alt1: "l' U' L U' L' U2 l",
      alt2: "y2 r' U' R U' R' U2' r",
    },
  },
  "OLL-9": {
    id: "OLL-9",
    name: "Dot 7",
    group: OLLGroups.FISH_SHAPES.id,
    setupMoves: "F U R U' R2' F' R U R U' R' y'",
    algorithms: {
      main: "R U2' R' U' S' R U' R' S",
      alt1: "y R U R' U' R' F R2 U R' U' F'",
    },
  },
  "OLL-10": {
    id: "OLL-10",
    name: "Dot 8",
    group: OLLGroups.FISH_SHAPES.id,
    setupMoves: "R U2' R' F R' F' R U' R U' R'",
    algorithms: {
      main: "y F U F' R' F R U' R' F' R",
      alt1: "y R' U2' R U S' R' U R S",
      alt2: "R U R' U R' F R F' R U2' R'",
    },
  },

  "OLL-11": {
    id: "OLL-11",
    name: "Square 1",
    group: OLLGroups.LIGHTNING.id,
    setupMoves: "M U' R U2' R' U' R U' R2' r",
    algorithms: {
      main: "S R U R' U R U2' R' U2 S'",
    },
  },
  "OLL-12": {
    id: "OLL-12",
    name: "Square 2",
    group: OLLGroups.LIGHTNING.id,
    setupMoves: "F U R U' R' F' U' F U R U' R' F'",
    algorithms: {
      main: "y S' L' U' L U' L' U2 L U2' S",
      alt1: "y' S R' U' R U' R' U2' R U2 S'",
    },
  },

  // Line Cases
  "OLL-13": {
    id: "OLL-13",
    name: "Line 1",
    group: OLLGroups.KNIGHT_MOVE.id,
    setupMoves: "F' U' F r U' r' U r U r'",
    algorithms: {
      main: "F U R U' R2 F' R U R U' R'",
      alt1: "r U' r' U' r U r' F' U F",
      alt2: "F U R U2 R' U' R U R' F'",
    },
  },
  "OLL-14": {
    id: "OLL-14",
    name: "Line 2",
    group: OLLGroups.KNIGHT_MOVE.id,
    setupMoves: "F U F' R' F R U' R' F' R",
    algorithms: {
      main: "R' F R U R' F' R F U' F'",
      alt1: "r' U r U r' U' r y R U' R'",
      alt2: "F' U' L' U2 L U L' U' L F",
    },
  },
  "OLL-15": {
    id: "OLL-15",
    name: "Line 3",
    group: OLLGroups.KNIGHT_MOVE.id,
    setupMoves: "r' U' r U' R' U R r' U r",
    algorithms: {
      main: "r' U' r R' U' R U r' U r",
      alt1: "l' U' l L' U' L U l' U l",
      alt2: "r' U' M' U' R U r' U r",
    },
  },
  "OLL-16": {
    id: "OLL-16",
    name: "Line 4",
    group: OLLGroups.KNIGHT_MOVE.id,
    setupMoves: "r U r' U R U' R' r U' r'",
    algorithms: {
      main: "r U r' R U R' U' r U' r'",
      alt1: "l U l' L U L' U' l U' l'",
      alt2: "r U M U R' U' r U' r'",
    },
  },

  // P Shapes
  "OLL-17": {
    id: "OLL-17",
    name: "P 1",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "F R' F' R U2' F R' F' R U' R U' R'",
    algorithms: {
      main: "F R' F' R2 r' U R U' R' U' M'",
      alt1: "R U R' U R' F R F' U2 R' F R F'",
      alt2: "(R U R' U) (R' F R F') R U2 R'",
    },
  },
  "OLL-18": {
    id: "OLL-18",
    name: "P 2",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "r' U2' R U R' U r2' U2' R' U' R U' r'",
    algorithms: {
      main: "r U R' U R U2 r2 U' R U' R' U2 r",
      alt1: "F R U R' U y' R' U2 R' F R F'",
      alt2: "r' U' R U' R' U2 r2 U R' U R U2 r'",
    },
  },
  "OLL-19": {
    id: "OLL-19",
    name: "P 3",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "F R' F' R M U R U' R' U' M'",
    algorithms: {
      main: "M U R U R' U' M' R' F R F'",
      alt1: "r' R U R U R' U' r R2' F R F'",
      alt2: "r' U2 R U R' U r2 U2 R' U' R U' r'",
    },
  },
  "OLL-20": {
    id: "OLL-20",
    name: "P 4",
    group: OLLGroups.DOT_CASE.id,
    setupMoves: "r U R' U' M2' U R U' R' U' M'",
    algorithms: {
      main: "M' U' R' U' R U M R F' R' F",
      alt1: "r U2 R' U' R U' r2 U2' R U R' U r",
      alt2: "S' L' U' L U L F' L' f",
    },
  },

  "OLL-21": {
    id: "OLL-21",
    name: "W 1",
    group: OLLGroups.OCLL.id,
    setupMoves: "R U R' U R U' R' U R U2' R' y'",
    algorithms: {
      main: "R U2 R' U' R U R' U' R U' R'",
      alt1: "R' U' R U' R' U2 R U R U R'",
      alt2: "r U R' U R U2 r' U' R U' R' U2 R U R'",
    },
  },
  "OLL-22": {
    id: "OLL-22",
    name: "W 2",
    group: OLLGroups.OCLL.id,
    setupMoves: "R' U2' R2' U R2' U R2' U2' R'",
    algorithms: {
      main: "R U2' R2' U' R2 U' R2' U2' R",
      alt1: "R' U2 R2 U R2' U R2 U2' R'",
      alt2: "r U' r' U' r U r' U' r U r'",
    },
  },

  "OLL-23": {
    id: "OLL-23",
    name: "L 1",
    group: OLLGroups.OCLL.id,
    setupMoves: "R U2' R D R' U2' R D' R2'",
    algorithms: {
      main: "R2 D R' U2 R D' R' U2 R'",
      alt1: "y' R2 D' R U2 R' D R U2 R",
      alt2: "R' F' r U R U' r' F",
    },
  },
  "OLL-24": {
    id: "OLL-24",
    name: "L 2",
    group: OLLGroups.OCLL.id,
    setupMoves: "F R' F' r U R U' r'",
    algorithms: {
      main: "r U R' U' r' F R F'",
      alt1: "L F' L' U' L F L' F' U F",
      alt2: "r' U' R U r F R' F'",
    },
  },
  "OLL-25": {
    id: "OLL-25",
    name: "L 3",
    group: OLLGroups.OCLL.id,
    setupMoves: "R' F' r U R U' r' F y'",
    algorithms: {
      main: "F' r U R' U' r' F R",
      alt1: "y' R' F R B' R' F' R B",
      alt2: "R' F' r U' r' F2 R",
    },
  },
  "OLL-26": {
    id: "OLL-26",
    name: "L 4",
    group: OLLGroups.OCLL.id,
    setupMoves: "R U R' U R U2' R' y'",
    algorithms: {
      main: "R U2 R' U' R U' R'",
      alt1: "y R' U' R U' R' U2 R",
      alt2: "y2 L' U' L U' L' U2 L",
    },
  },
  "OLL-27": {
    id: "OLL-27",
    name: "L 5",
    group: OLLGroups.OCLL.id,
    setupMoves: "R U2' R' U' R U' R'",
    algorithms: {
      main: "R U R' U R U2 R'",
      alt1: "L U L' U L U2' L'",
      alt2: "r U R' U R U2 r'",
    },
  },
  "OLL-28": {
    id: "OLL-28",
    name: "L 6",
    group: OLLGroups.ALL_CORNERS_ORIENTED.id,
    setupMoves: "R U R' U' M' U R U' r'",
    algorithms: {
      main: "r U R' U' M U R U' R'",
      alt1: "M' U' M U2 M' U' M",
      alt2: "M' U M U2 M' U M",
    },
  },

  "OLL-29": {
    id: "OLL-29",
    name: "Fish 1",
    group: OLLGroups.AWKWARD_SHAPES.id,
    setupMoves: "M F R' F' R U R U' R' U' M'",
    algorithms: {
      main: "R U R' U' R U' R' F' U' F R U R'",
      alt1: "y2 (M U) R U R' U' M' R' F R F'",
      alt2: "r2 D' r U r' D r2 U' r' U' r",
    },
  },
  "OLL-30": {
    id: "OLL-30",
    name: "Fish 2",
    group: OLLGroups.AWKWARD_SHAPES.id,
    setupMoves: "F U R U2' R' U R U2' R' U' F' y2'",
    algorithms: {
      main: "F R' F R2 U' R' U' R U R' F2",
      alt1: "M U' L' U' L U M' L' U L",
      alt2: "F U R U2 R' U' R U2 R' U' F'",
    },
  },
  "OLL-31": {
    id: "OLL-31",
    name: "Fish 3",
    group: OLLGroups.P_SHAPES.id,
    setupMoves: "R' F R U R' U' F' U R",
    algorithms: {
      main: "R' U' F U R U' R' F' R",
      alt1: "y2 S' L' U L U' L' U' L S",
      alt2: "y' F U' R2 D R' U R D' R2' F'",
    },
  },
  "OLL-32": {
    id: "OLL-32",
    name: "Fish 4",
    group: OLLGroups.P_SHAPES.id,
    setupMoves: "f R' F' R U R U' R' S'",
    algorithms: {
      main: "L U F' U' L' U L F L'",
      alt1: "S R U' R' U R U R' S'",
      alt2: "R U B' U' R' U R B R'",
    },
  },

  "OLL-33": {
    id: "OLL-33",
    name: "Knight 1",
    group: OLLGroups.T_SHAPES.id,
    setupMoves: "F R' F' R U R U' R'",
    algorithms: {
      main: "R U R' U' R' F R F'",
      alt1: "y' R' U' R' F R F' U R",
      alt2: "L' U' L U L F' L' F",
    },
  },
  "OLL-34": {
    id: "OLL-34",
    name: "Knight 2",
    group: OLLGroups.C_SHAPES.id,
    setupMoves: "F U R' U' R' F' R U R2' U' R' y2'",
    algorithms: {
      main: "R U R2 U' R' F R U R U' F'",
      alt1: "f R f' U' r' U' R U M'",
      alt2: "F R U R' U' R U R' U' F'",
    },
  },
  "OLL-35": {
    id: "OLL-35",
    name: "Knight 3",
    group: OLLGroups.FISH_SHAPES.id,
    setupMoves: "R U2' R' F R' F' R2' U2' R'",
    algorithms: {
      main: "R U2 R2 F R F' R U2 R'",
      alt1: "R U2 R' U' R U' R' F R U R' U' F'",
      alt2: "y2 R U2 R' U' y' r' U' R U M'",
    },
  },
  "OLL-36": {
    id: "OLL-36",
    name: "Knight 4",
    group: OLLGroups.W_SHAPES.id,
    setupMoves: "F' L F L' U' L' U' L U L' U L y2'",
    algorithms: {
      main: "L' U' L U' L' U L U L F' L' F",
      alt1: "y R' U' R U' R' U R U R B' R' B",
      alt2: "y' R' U2 R U R' U R F R U R' U' F'",
    },
  },

  "OLL-37": {
    id: "OLL-37",
    name: "Awkward 1",
    group: OLLGroups.FISH_SHAPES.id,
    setupMoves: "F R U' R' U R U R' F'",
    algorithms: {
      main: "F R' F' R U R U' R'",
      alt1: "F R U' R' U' R U R' F'",
      alt2: "y L U' R' U L' U' R",
    },
  },
  "OLL-38": {
    id: "OLL-38",
    name: "Awkward 2",
    group: OLLGroups.W_SHAPES.id,
    setupMoves: "F R' F' R U R U R' U' R U' R'",
    algorithms: {
      main: "R U R' U R U' R' U' R' F R F'",
      alt1: "L' U L U' L' U L U L F' L' F",
      alt2: "R' U2 F R U R' U' F' U R",
    },
  },
  "OLL-39": {
    id: "OLL-39",
    name: "Awkward 3",
    group: OLLGroups.LIGHTNING.id,
    setupMoves: "L U F' U' L' U L F L' y'",
    algorithms: {
      main: "L F' L' U' L U F U' L'",
      alt1: "y' R B' R' U' R U B U' R'",
      alt2: "y R' F R F' U F' U' F R' F' R",
    },
  },
  "OLL-40": {
    id: "OLL-40",
    name: "Awkward 4",
    group: OLLGroups.LIGHTNING.id,
    setupMoves: "R' U' F U R U' R' F' R y'",
    algorithms: {
      main: "R' F R U R' U' F' U R",
      alt1: "y' L' B L U L' U' B' U L",
      alt2: "y F R' F' R U R U' R' F R' F' R",
    },
  },

  "OLL-41": {
    id: "OLL-41",
    name: "C 1",
    group: OLLGroups.AWKWARD_SHAPES.id,
    setupMoves: "F U R U' R' F' R U2' R' U' R U' R' y2'",
    algorithms: {
      main: "R U R' U R U2' R' F R U R' U' F'",
      alt1: "y F U R U' R' F' R U2 R' U' R U' R'",
      alt2: "y2 L F' L' F L F' L' F L F' L'",
    },
  },
  "OLL-42": {
    id: "OLL-42",
    name: "C 2",
    group: OLLGroups.AWKWARD_SHAPES.id,
    setupMoves: "F U R U' R' F' R' U2' R U R' U R",
    algorithms: {
      main: "R' U' R U' R' U2 R F R U R' U' F'",
      alt1: "L' U' L U' L' U2 L y' F R U R' U' F'",
      alt2: "y' F' U' L' U L F L' U2 L U L' U L",
    },
  },

  "OLL-43": {
    id: "OLL-43",
    name: "T 1",
    group: OLLGroups.P_SHAPES.id,
    setupMoves: "f' U' L' U L f",
    algorithms: {
      main: "F' U' L' U L F",
      alt1: "y2 B' U' R' U R B",
      alt2: "R' U' F' U F R",
    },
  },
  "OLL-44": {
    id: "OLL-44",
    name: "T 2",
    group: OLLGroups.P_SHAPES.id,
    setupMoves: "f U R U' R' f'",
    algorithms: {
      main: "F U R U' R' F'",
      alt1: "y2 B U L U' L' B'",
      alt2: "f R U R' U' f'",
    },
  },

  "OLL-45": {
    id: "OLL-45",
    name: "Lightning 1",
    group: OLLGroups.T_SHAPES.id,
    setupMoves: "F U R U' R' F's",
    algorithms: {
      main: "F R U R' U' F'",
      alt1: "y2 f R U R' U' f'",
      alt2: "y' F' L' U' L U F",
    },
  },
  "OLL-46": {
    id: "OLL-46",
    name: "Lightning 2",
    group: OLLGroups.C_SHAPES.id,
    setupMoves: "R' U' F R' F' R U R",
    algorithms: {
      main: "R' U' R' F R F' U R",
      alt1: "y2 L U L F' L' F U' L'",
      alt2: "F' L' U' L U L' U' L U F",
    },
  },
  "OLL-47": {
    id: "OLL-47",
    name: "Lightning 3",
    group: OLLGroups.L_SHAPES.id,
    setupMoves: "F' U' L' U L U' L' U L F",
    algorithms: {
      main: "R' U' R F R' F' R",
      alt1: "F' U' L' U L F",
      alt2: "y2 B' U' R' U R B",
    },
  },
  "OLL-48": {
    id: "OLL-48",
    name: "Lightning 4",
    group: OLLGroups.L_SHAPES.id,
    setupMoves: "F U R U' R' U R U' R' F'",
    algorithms: {
      main: "F R U R' U' R U R' U' F'",
      alt1: "y2 f R U R' U' R U R' U' f'",
      alt2: "F R' F' R U2 R U2 R'",
    },
  },
  "OLL-49": {
    id: "OLL-49",
    name: "Lightning 5",
    group: OLLGroups.L_SHAPES.id,
    setupMoves: "r' U r2' U' r2' U' r2' U r' y2'",
    algorithms: {
      main: "r U' r2 U r2 U r2 U' r",
      alt1: "y2 l U' l2 U l2 U l2 U' l",
      alt2: "R B' R2 F R2 B R2 F' R",
    },
  },
  "OLL-50": {
    id: "OLL-50",
    name: "Lightning 6",
    group: OLLGroups.L_SHAPES.id,
    setupMoves: "r U' r2' U r2' U r2' U' r",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-51": {
    id: "OLL-51",
    name: "Lightning 6",
    group: OLLGroups.LINE.id,
    setupMoves: "f U R U' R' U R U' R' f'",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-52": {
    id: "OLL-52",
    name: "Lightning 6",
    group: OLLGroups.LINE.id,
    setupMoves: "F R U R' d R' U' R U' R'",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-53": {
    id: "OLL-53",
    name: "Lightning 6",
    group: OLLGroups.L_SHAPES.id,
    setupMoves: "r' U2' R U R' U' R U R' U r",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-54": {
    id: "OLL-54",
    name: "Lightning 6",
    group: OLLGroups.L_SHAPES.id,
    setupMoves: "r U2' R' U' R U R' U' R U' r'",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-55": {
    id: "OLL-55",
    name: "Lightning 6",
    group: OLLGroups.LINE.id,
    setupMoves: "F R' F' U2' R U R' U R2' U2' R'",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-56": {
    id: "OLL-56",
    name: "Lightning 6",
    group: OLLGroups.LINE.id,
    setupMoves: "r U r' R U R' U' R U R' U' r U' r'",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
  "OLL-57": {
    id: "OLL-57",
    name: "Lightning 6",
    group: OLLGroups.ALL_CORNERS_ORIENTED.id,
    setupMoves: "r U R' U' M U R U' R'",
    algorithms: {
      main: "r' U r2 U' r2 U' r2 U r'",
      alt1: "y2 l' U l2 U' l2 U' l2 U l'",
      alt2: "R' F R2 B' R2 F' R2 B R'",
    },
  },
};
