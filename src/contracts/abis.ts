export const cryptoAntsABI = [
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "buyEggs",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "createAnt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_antId", type: "uint256" }],
    name: "sellAnt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_antId", type: "uint256" }],
    name: "layEggs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAntsCreated",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "antsMetadata",
    outputs: [
      { internalType: "uint40", name: "lastEggLayBlock", type: "uint40" },
      { internalType: "uint16", name: "totalEggsLaid", type: "uint16" },
      { internalType: "bool", name: "isAlive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eggPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

export const eggABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

// ✅ AUDITED & SECURE - Sepolia Testnet Deployment
export const EGG_ADDRESS = "0x9b9f9965F2C3a8E4870B532d972634F7FC3D73A2" as const;
export const CRYPTO_ANTS_ADDRESS = "0x314A85646A7676d0Ad683013F6a835E0E5F522aA" as const; 
