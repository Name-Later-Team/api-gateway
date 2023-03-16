const crypto = require("crypto");

// get passphrase from commadline
const args = process.argv.slice(2);

const passphrase = args[0];

if (!passphrase) {
	throw new Error("passphrase is required as first argument");
}

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: "spki",
		format: "pem",
	},
	privateKeyEncoding: {
		type: "pkcs8",
		format: "pem",
		cipher: "aes-256-cbc",
		passphrase,
	},
});

const formatPrivateKey = privateKey.replace(/(\r\n|\n|\r)/gm, "");
const formatPublicKey = publicKey.replace(/(\r\n|\n|\r)/gm, "");

console.log(formatPrivateKey, "\n");
console.log(formatPublicKey);
