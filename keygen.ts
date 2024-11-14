const { generateRandomKeys } = require("paillier-bigint");
const fs = require("fs");

const keySize = 2048;

(async () => {
  const { publicKey, privateKey } = await generateRandomKeys(keySize);

  const publicKeyData = {
    n: publicKey.n.toString(16),
    g: publicKey.g.toString(16),
  };

  const privateKeyData = {
    lambda: privateKey.lambda.toString(16),
    mu: privateKey.mu.toString(16),
  };

  fs.writeFileSync(
    ".env.public",
    `PUBLIC_KEY_N=${publicKeyData.n}\nPUBLIC_KEY_G=${publicKeyData.g}`
  );

  fs.writeFileSync(
    ".env.private",
    `PRIVATE_KEY_LAMBDA=${privateKeyData.lambda}\nPRIVATE_KEY_MU=${privateKeyData.mu}`
  );

  console.log("Paillier keypair generated successfully.");
})();
