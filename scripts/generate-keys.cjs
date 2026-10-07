// Generate RSA keys for mock-server JWT (test only). Uses Node crypto, no openssl needed.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '..', 'keys');
if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

fs.writeFileSync(path.join(keysDir, 'private-key.pem'), privateKey);
fs.writeFileSync(path.join(keysDir, 'public-key.pem'), publicKey);
console.log('Generated keys/private-key.pem and keys/public-key.pem');
