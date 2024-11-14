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
  { id: 22, name: "Hot honey" },
];

export const contractABI = [
  "function vote(bytes[] calldata encryptedVoteValues, uint256[] calldata toppingIds) external",
  "function getVotes() public view returns (uint256[])",
];

const publicKeyN = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
const publicKeyG = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

export const publicKey = new PublicKey(publicKeyN, publicKeyG);
