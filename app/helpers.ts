import { PublicKey } from "paillier-bigint";

export const investmentFunds = [
  "Tribe Capital",
  "Archetype",
  "Frictionless",
  "Electric",
  "Polychain",
  "Variant",
  "Brevan Howard",
  "Bain Cap Crypto",
  "Dragonfly",
  "Placeholder",
  "Pantera",
  "Haun",
  "Hack VC",
  "a16z",
  "Paradigm",
  "Founders Fund",
  "Blockchain Capital",
  "Binance Labs",
  "Coinbase Ventures",
  "Hashkey Capital",
  "MultiCoin",
  "Coinfund",
  "1kx",
  "DG",
  "Galaxy",
  "Delphi Digital",
  "Sequoia",
  "ABCDE",
  "DCG",
  "Framework",
  "Union Square Ventures",
  "Other",
];

export const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_paillier",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "n",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "g",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "_totalRanges",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "encryptedVoteVector",
        type: "bytes[]",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "encryptedTallies",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEncryptedTallies",
    outputs: [
      {
        internalType: "bytes[]",
        name: "",
        type: "bytes[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paillier",
    outputs: [
      {
        internalType: "contract Paillier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicKey",
    outputs: [
      {
        internalType: "bytes",
        name: "n",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "g",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRanges",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const publicKeyN = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
const publicKeyG = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

export const publicKey = new PublicKey(publicKeyN, publicKeyG);
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
export const SHIELD_TESTNET_CHAIN_ID = "0xa5b5a";
