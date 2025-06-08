// PLL case groups
export const PLLGroups = {
  ADJ_SWAP: {
    id: "adj_swap",
    name: "Adjacent Corner Swap",
    maxCases: 12,
  },
  EPLL: {
    id: "epll",
    name: "Edge Permutation",
    maxCases: 4,
  },
  OPP_SWAP: {
    id: "opp_swap",
    name: "Opposite Corner Swap",
    maxCases: 5,
  },
};

// PLL case definitions
export const PLLCases = {
  // A Perms (Adjacent Corner Swap)
  "PLL-Aa": {
    id: "PLL-Aa",
    name: "A Permutation a",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "x R2' D2' R U R' D2' R U' R x'",
    algorithms: {
      main: "x R' U R' D2 R U' R' D2 R2 x'",
      alt1: "y' (R U R' F') (r U R' U') r' F (R2 U' R')",
      alt2: "y x' R2 D2 R' U' R D2 R' U R'",
    },
  },
  "PLL-Ab": {
    id: "PLL-Ab",
    name: "A Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "x R' U R' D2' R U' R' D2' R2' x'",
    algorithms: {
      main: "x R2' D2 R U R' D2 R U' R x'",
      alt1: "y2 (R' D' R) U2 (R' D R) U (R' D' R) U (R' D R)",
      alt2: "y x' R U' R D2 R' U R D2 R2'",
    },
  },
  // E Perm
  "PLL-E": {
    id: "PLL-E",
    name: "E Permutation",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "x' D R U R' D' R U' R' D R U' R' D' R U R' x",
    algorithms: {
      main: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    },
  },
  // F Perm
  "PLL-F": {
    id: "PLL-F",
    name: "F Permutation",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R' U' R U' R' U R U R2' F' R U R U' R' F U R",
    algorithms: {
      main: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
      alt1: "R' F R f' R' F R2 U R' U' R' F' R2 U R' S",
      alt2: "y' R' U R U' R2' F' U' F U R F R' F' R2",
    },
  },
  // G Perms
  "PLL-Ga": {
    id: "PLL-Ga",
    name: "G Permutation a",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    algorithms: {
      main: "R2 U R' U R' U' R U' R2 (D U') R' U R D'",
    },
  },
  "PLL-Gb": {
    id: "PLL-Gb",
    name: "G Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    algorithms: {
      main: "R' U' R (U D') R2 U R' U R U' R U' R2 D",
      alt1: "R' d' F R2 u R' U R U' R u' R2'",
      alt2: "y F' U' F R2 u R' U R U' R u' R2'",
    },
  },
  "PLL-Gc": {
    id: "PLL-Gc",
    name: "G Permutation c",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    algorithms: {
      main: "R2' u' R U' R U R' u R2 f R' f'",
      alt1: "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
      alt2: "R2 U' R U' R U R' U R2 D' U R U' R' D",
    },
  },
  "PLL-Gd": {
    id: "PLL-Gd",
    name: "G Permutation d",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R2 U' R U' R U R' U R2 D' U R U' R' D",
    algorithms: {
      main: "R U R' (U' D) R2 U' R U' R' U R' U R2 D'",
    },
  },
  // H Perm
  "PLL-H": {
    id: "PLL-H",
    name: "H Permutation",
    group: PLLGroups.EPLL.id,
    setupMoves: "M2 U M2 U2 M2 U M2",
    algorithms: {
      main: "M2 U M2 U2 M2 U M2",
    },
  },
  // J Perms
  "PLL-Ja": {
    id: "PLL-Ja",
    name: "J Permutation a",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "L' R' U2' R U R' U2' L U' R y",
    algorithms: {
      main: "x R2 F R F' R U2 r' U r U2 x'",
      alt1: "y2 L' U' L F L' U' L U L F' L2 U L",
    },
  },
  "PLL-Jb": {
    id: "PLL-Jb",
    name: "J Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R U R2' F' R U R U' R' F R U' R'",
    algorithms: {
      main: "R U R' F' R U R' U' R' F R2 U' R'",
    },
  },
  // N Perms
  "PLL-Na": {
    id: "PLL-Na",
    name: "N Permutation a",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
    algorithms: {
      main: "R F U' R' U R U F' R2' F' R U R U' R' F",
      alt1: "F' R U R' U' R' F R2 F U' R' U' R U F' R'",
      alt2: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    },
  },
  "PLL-Nb": {
    id: "PLL-Nb",
    name: "N Permutation b",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "F r' F' r U r U' r2' D' F r U r' F' D r",
    algorithms: {
      main: "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
      alt1: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    },
  },
  // R Perms
  "PLL-Ra": {
    id: "PLL-Ra",
    name: "R Permutation a",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R U2' R D R' U R D' R' U' R' U R U R'",
    algorithms: {
      main: "R U' R' U' R U R D R' U' R D' R' U2 R'",
      alt1: "y L U2 L' U2 L F' L' U' L U L F L2",
    },
  },
  "PLL-Rb": {
    id: "PLL-Rb",
    name: "R Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R' U R U R' U' R' D' R U R' D R U2' R",
    algorithms: {
      main: "(R' U2' R U2') R' F (R U R' U') R' F' R2",
      alt1: "R' U2 R' D' R U' R' D R U R U' R' U' R",
      alt2: "y R2' F R U R U' R' F' R U2' R' U2 R",
    },
  },
  // T Perm
  "PLL-T": {
    id: "PLL-T",
    name: "T Permutation",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "F R U' R' U R U R2' F' R U R U' R'",
    algorithms: {
      main: "R U R' U' R' F R2 U' R' U' R U R' F'",
      alt1: "y2 L' U' L U L F' L2 U L U L' U' L F",
      alt2: "R U R' U' R' F R2 U' R' U F' L' U L",
    },
  },
  // U Perms
  "PLL-Ua": {
    id: "PLL-Ua",
    name: "U Permutation a",
    group: PLLGroups.EPLL.id,
    setupMoves: "M2' U' M' U2' M U' M2'",
    algorithms: {
      main: "(R U R' U R') U' R2 U' (R' U R' U R)",
      alt1: "y2 M2' U M U2 M' U M2'",
      alt2: "y R2 U' S' U2' S U' R2",
    },
  },
  "PLL-Ub": {
    id: "PLL-Ub",
    name: "U Permutation b",
    group: PLLGroups.EPLL.id,
    setupMoves: "M2' U M' U2' M U M2'",
    algorithms: {
      main: "R' U R' U' R' U' R' U R U R2'",
      alt1: "y2 M2 U' M U2 M' U' M2",
    },
  },
  // V Perm
  "PLL-V": {
    id: "PLL-V",
    name: "V Permutation",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
    algorithms: {
      main: "R' U R' U' R D' R' D R' (U D') R2 U' R2 D R2",
      alt1: "R' U R' d' R' F' R2 U' R' U R' F R F",
      alt2: "R U' R U R' D R D' R U' D R2 U R2 D' R2"
    },
  },
  // Y Perm
  "PLL-Y": {
    id: "PLL-Y",
    name: "Y Permutation",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "F R' F' R U R U' R' F R U' R' U R U R' F'",
    algorithms: {
      main: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
      alt1: "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
    },
  },
  // Z Perm
  "PLL-Z": {
    id: "PLL-Z",
    name: "Z Permutation",
    group: PLLGroups.EPLL.id,
    setupMoves: "M U2' M2' U2' M U' M2' U' M2'",
    algorithms: {
      main: "M2' U M2' U M' U2 M2' U2 M' U2",
    },
  },
};
