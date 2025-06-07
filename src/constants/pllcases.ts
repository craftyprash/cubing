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
    },
  },
  "PLL-Ab": {
    id: "PLL-Ab",
    name: "A Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "x R' U R' D2' R U' R' D2' R2' x'",
    algorithms: {
      main: "x R2 D2 R U R' D2 R U' R x'",
    },
  },
  // E Perm
  "PLL-E": {
    id: "PLL-E",
    name: "E Permutation",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'",
    algorithms: {
      main: "y x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    },
  },
  // F Perm
  "PLL-F": {
    id: "PLL-F",
    name: "F Permutation",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'",
    algorithms: {
      main: "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    },
  },
  // G Perms
  "PLL-Ga": {
    id: "PLL-Ga",
    name: "G Permutation a",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    algorithms: {
      main: "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    },
  },
  "PLL-Gb": {
    id: "PLL-Gb",
    name: "G Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    algorithms: {
      main: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    },
  },
  "PLL-Gc": {
    id: "PLL-Gc",
    name: "G Permutation c",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    algorithms: {
      main: "R2 U' R U' R U R' U R2 D' U R U' R' D",
    },
  },
  "PLL-Gd": {
    id: "PLL-Gd",
    name: "G Permutation d",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R2 U' R U' R U R' U R2 D' U R U' R' D",
    algorithms: {
      main: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
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
    setupMoves: "L' R' U2' R U R' U2' L U' R y'",
    algorithms: {
      main: "y2 x R2 F R F' R U2 r' U r U2 x'",
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
      main: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    },
  },
  "PLL-Nb": {
    id: "PLL-Nb",
    name: "N Permutation b",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "F r' F' r U r U' r2' D' F r U r' F' D r",
    algorithms: {
      main: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    },
  },
  // R Perms
  "PLL-Ra": {
    id: "PLL-Ra",
    name: "R Permutation a",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R U2' R D R' U R D' R' U' R' U R U R' y'",
    algorithms: {
      main: "y R U' R' U' R U R D R' U' R D' R' U2 R'",
    },
  },
  "PLL-Rb": {
    id: "PLL-Rb",
    name: "R Permutation b",
    group: PLLGroups.ADJ_SWAP.id,
    setupMoves: "R' U R U R' U' R' D' R U R' D R U2' R",
    algorithms: {
      main: "R' U2 R U2 R' F R U R' U' R' F' R2",
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
    },
  },
  // U Perms
  "PLL-Ua": {
    id: "PLL-Ua",
    name: "U Permutation a",
    group: PLLGroups.EPLL.id,
    setupMoves: "M2' U' M' U2' M U' M2'",
    algorithms: {
      main: "y2 M2 U M U2 M' U M2",
    },
  },
  "PLL-Ub": {
    id: "PLL-Ub",
    name: "U Permutation b",
    group: PLLGroups.EPLL.id,
    setupMoves: "M2' U M' U2' M U M2'",
    algorithms: {
      main: "y2 M2 U' M U2 M' U' M2",
    },
  },
  // V Perm
  "PLL-V": {
    id: "PLL-V",
    name: "V Permutation",
    group: PLLGroups.OPP_SWAP.id,
    setupMoves: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
    algorithms: {
      main: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
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
    },
  },
  // Z Perm
  "PLL-Z": {
    id: "PLL-Z",
    name: "Z Permutation",
    group: PLLGroups.EPLL.id,
    setupMoves: "M U2' M2' U2' M U' M2' U' M2'",
    algorithms: {
      main: "M' U' M2 U' M2 U' M' U2 M2",
    },
  },
};
