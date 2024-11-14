import { PublicKey } from "paillier-bigint";

export const pizzaToppings = [
  { id: 0, name: "Pepperoni" },
  { id: 1, name: "Italian sausage" },
  { id: 2, name: "Mushrooms" },
  { id: 3, name: "Green peppers" },
  { id: 4, name: "Onions" },
  { id: 5, name: "Black olives" },
  { id: 6, name: "Spinach" },
  { id: 7, name: "Tomatoes" },
  { id: 8, name: "Artichoke hearts" },
  { id: 9, name: "Jalapeños" },
  { id: 10, name: "Eggplant" },
  { id: 11, name: "Broccoli" },
  { id: 12, name: "Sun-dried tomatoes" },
  { id: 13, name: "Pineapple" },
  { id: 14, name: "Buffalo chicken" },
  { id: 15, name: "BBQ sauce" },
  { id: 16, name: "Goat cheese" },
  { id: 17, name: "Fresh basil" },
  { id: 18, name: "Caramelized onions" },
  { id: 19, name: "Roasted red peppers" },
  { id: 20, name: "Feta cheese" },
  { id: 21, name: "Ricotta" },
];

export const contractABI = [
  {
    inputs: [
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
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "b",
        type: "tuple",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "add",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "add_const",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newTotalToppings",
        type: "uint256",
      },
    ],
    name: "changeTotalToppings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "encValue",
        type: "tuple",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "lambda",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "mu",
            type: "bytes",
          },
        ],
        internalType: "struct PrivateKey",
        name: "privateKey",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "sigma",
        type: "bytes",
      },
    ],
    name: "decrypt",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "div_const",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "rnd",
        type: "bytes",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "encrypt",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "rnd",
        type: "bytes",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "encryptZero",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
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
    name: "encryptedVoteSums",
    outputs: [
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "mul_const",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "b",
        type: "tuple",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "sub",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        internalType: "int256",
        name: "b",
        type: "int256",
      },
      {
        components: [
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
        internalType: "struct PublicKey",
        name: "publicKey",
        type: "tuple",
      },
    ],
    name: "sub_const",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "val",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "neg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "bitlen",
            type: "uint256",
          },
        ],
        internalType: "struct BigNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalToppings",
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
];

const publicKeyN = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
const publicKeyG = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

export const publicKey = new PublicKey(publicKeyN, publicKeyG);
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
export const SHIELD_TESTNET_CHAIN_ID = "0xa5b5a";
