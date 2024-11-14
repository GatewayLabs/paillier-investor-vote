import { ethers } from "ethers";
import { contractABI, pizzaToppings } from "@/app/helpers";
import { NextResponse } from "next/server";
import { PrivateKey, PublicKey } from "paillier-bigint";

const decryptAggregatedVotes = async (
  encryptedVotes: { toppingId: number; encryptedValue: string }[],
  privateKey: PrivateKey
) => {
  return encryptedVotes.map((vote) => {
    const encryptedValueBigInt = BigInt(vote.encryptedValue);
    const decryptedVote = privateKey.decrypt(encryptedValueBigInt);
    return {
      toppingId: vote.toppingId,
      votes: Number(decryptedVote),
    };
  });
};

export async function POST(request: Request) {
  // Load public key components
  const publicKeyN = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
  const publicKeyG = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

  // Load private key components
  const privateKeyLambda = BigInt("0x" + process.env.PRIVATE_KEY_LAMBDA);
  const privateKeyMu = BigInt("0x" + process.env.PRIVATE_KEY_MU);

  // Generate keys
  const publicKey = new PublicKey(publicKeyN, publicKeyG);
  const privateKey = new PrivateKey(privateKeyLambda, privateKeyMu, publicKey);

  const provider = new ethers.JsonRpcProvider("https://your_rpc_url");
  const contract = new ethers.Contract(
    process.env.VOTE_CONTRACT_ADDRESS!,
    contractABI,
    provider
  );

  const encryptedVotes = await Promise.all(
    pizzaToppings.map(async (topping) => {
      const encryptedVote = await contract.getEncryptedVote(topping.id);
      return {
        toppingId: topping.id,
        encryptedValue: encryptedVote.value,
      };
    })
  );

  const decryptedVotes = decryptAggregatedVotes(encryptedVotes, privateKey);

  return NextResponse.json({
    results: decryptedVotes,
  });
}
