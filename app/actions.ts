"use server";

import { ethers } from "ethers";
import { PrivateKey, PublicKey } from "paillier-bigint";
import { contractABI, negativeValueRange, positiveValueRange } from "./helpers";

export async function decryptVotes() {
  // Load public key components
  const publicKeyN = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_N);
  const publicKeyG = BigInt("0x" + process.env.NEXT_PUBLIC_PUBLIC_KEY_G);

  // Load private key components
  const privateKeyLambda = BigInt("0x" + process.env.PRIVATE_KEY_LAMBDA);
  const privateKeyMu = BigInt("0x" + process.env.PRIVATE_KEY_MU);

  // Generate keys
  const publicKey = new PublicKey(publicKeyN, publicKeyG);
  const privateKey = new PrivateKey(privateKeyLambda, privateKeyMu, publicKey);

  const provider = new ethers.JsonRpcProvider(
    "https://gateway-shield-testnet.rpc.caldera.xyz/http"
  );
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    contractABI,
    provider
  );

  // Fetch encrypted vote sums
  const encryptedVoteSums = await Promise.all(
    positiveValueRange.concat(negativeValueRange).map(async (range, index) => {
      const encryptedVoteStruct = await contract.encryptedVoteSums(index);
      let encryptedValueHex;

      if (typeof encryptedVoteStruct === "string") {
        // If the contract returns a bytes value directly
        encryptedValueHex = encryptedVoteStruct;
      } else if (encryptedVoteStruct && encryptedVoteStruct.value) {
        // If the contract returns a struct with a 'value' field
        encryptedValueHex = encryptedVoteStruct.value;
      } else {
        console.log(`No encrypted vote sum for topping index ${index}`);
        encryptedValueHex = "0x0";
      }

      if (!encryptedValueHex || encryptedValueHex === "0x") {
        console.log(`No encrypted value at index ${index}, setting to zero`);
        encryptedValueHex = "0x0";
      }

      const encryptedValueBigInt = BigInt(encryptedValueHex);

      return {
        rangeId: range.id,
        encryptedValue: encryptedValueBigInt,
      };
    })
  );

  // Decrypt aggregated votes
  const decryptedVotes = encryptedVoteSums.map((vote) => {
    const decryptedValue = privateKey.decrypt(vote.encryptedValue);
    return {
      rangeId: vote.rangeId,
      votes: decryptedValue.toString(),
    };
  });

  return decryptedVotes;
}
