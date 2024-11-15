import { PublicKey } from "paillier-bigint";

export const positiveValueRange = [
  { id: 0, name: "100,000+", displayName: "$100,000+" },
  { id: 1, name: "75,000 - 100,000", displayName: "$75,000 - $100,000" },
  { id: 2, name: "25,000 - 75,000", displayName: "$25,000 - $75,000" },
  { id: 3, name: "10,000 - 25,000", displayName: "$10,000 - $25,000" },
  { id: 4, name: "5,000 - 10,000", displayName: "$5,000 - $10,000" },
  { id: 5, name: "1,000 - 5,000", displayName: "$1,000 - $5,000" },
  { id: 6, name: "0 - 1,000", displayName: "$0 - $1,000" },
];

export const negativeValueRange = [
  { id: 7, name: "0 - 1,000", displayName: "$0 - $1,000" },
  { id: 8, name: "1,000 - 5,000", displayName: "$1,000 - $5,000" },
  { id: 9, name: "5,000 - 10,000", displayName: "$5,000 - $10,000" },
  { id: 10, name: "10,000 - 25,000", displayName: "$10,000 - $25,000" },
  { id: 11, name: "25,000 - 75,000", displayName: "$25,000 - $75,000" },
  { id: 12, name: "75,000 - 100,000", displayName: "$75,000 - $100,000" },
  { id: 13, name: "100,000+", displayName: "$100,000+" },
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
