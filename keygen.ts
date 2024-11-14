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

  fs.writeFileSync("publicKey.json", JSON.stringify(publicKeyData));

  fs.writeFileSync("privateKey.json", JSON.stringify(privateKeyData));

  console.log("Paillier keypair generated successfully.");
})();
