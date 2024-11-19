"use server";

import { ethers } from "ethers";
import { PrivateKey, PublicKey } from "paillier-bigint";
import { contractABI, investmentFunds } from "./helpers";

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

  // Fetch the total number of ranges from the contract
  const totalRanges = Number(await contract.totalRanges());

  // Fetch encrypted tallies
  const encryptedTallies = await contract.getEncryptedTallies();

  // Ensure we have the correct number of encrypted tallies
  if (encryptedTallies.length !== totalRanges) {
    console.error(
      `Unexpected number of encrypted tallies: expected ${totalRanges}, got ${encryptedTallies.length}`
    );
    throw new Error("Mismatch in total ranges and encrypted tallies length");
  }

  // Decrypt aggregated votes
  const decryptedVotes = encryptedTallies.map(
    (encryptedValueHex: any, index: number) => {
      let encryptedValue = encryptedValueHex;

      if (
        !encryptedValue ||
        encryptedValue === "0x" ||
        encryptedValue === "0x0"
      ) {
        console.log(`No encrypted value at index ${index}, setting to zero`);
        encryptedValue = "0x0";
      }

      // Convert encrypted value to BigInt
      const encryptedValueBigInt = BigInt(encryptedValue);

      // Decrypt the encrypted tally
      const decryptedValue = privateKey.decrypt(encryptedValueBigInt);

      return decryptedValue.toString();
    }
  );

  return decryptedVotes;
}
