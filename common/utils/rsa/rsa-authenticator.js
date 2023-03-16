const crypto = require("crypto");

module.exports = class RsaAuthenticator {
	constructor(privateKey, publicKey, passphrase, payload) {
		this._privateKey = privateKey;
		this._publicKey = publicKey;
		this._passphrase = passphrase;
		this._payload = payload;
	}

	generateSignature() {
		const signer = crypto.createSign("RSA-SHA256");
		signer.update(this._payload);
		const signature = signer.sign({ key: this._privateKey, passphrase: this._passphrase }, "HEX");

		return signature.toString("base64");
	}

	verifySignature(signature) {
		const verifier = crypto.createVerify("RSA-SHA256");
		verifier.update(this._payload);
		const result = verifier.verify(this._publicKey, signature, "HEX");

		return result;
	}
};
