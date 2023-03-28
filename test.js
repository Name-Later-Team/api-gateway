const { KeyGenerator, RsaSigner, RsaValidator } = require("@huyleminh/nodejs-sdk");
const { default: axios } = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const data = { name: "hello" };
// const data = {};

// // prepare data to sign the signature
const signSetting = {
	privateKey: process.env.PRIVATE,
	passphrase: process.env.PASS,
	payload: data,
	headers: {
		requestTime: "2023-03-27T12:12:12+08:00",
		httpMethod: "POST",
		clientId: "d5b9492dc8f7df58b43c",
		resourceUri: "/presentation/v1",
	},
};

// console.log(signSetting);

const signer = new RsaSigner(signSetting);
const signature = signer.generateSignature();

// prepare data to validate the signature
const verifySetting = {
	publicKey: process.env.PRESENTI_PUBLIC_KEY,
	payload: data,
	headers: {
		requestTime: "2023-03-27T12:12:12+08:00",
		httpMethod: "POST",
		clientId: "d5b9492dc8f7df58b43c",
		resourceUri: "/presentation/v1",
		xAuthorization: `algorithm=RSA-SHA256, signature=${signature}`,
	},
};

console.log(`algorithm=RSA-SHA256, signature=${signature}`);
const validator = new RsaValidator(verifySetting);
console.log(validator.verifySignature());

axios
	.post("http://localhost:8080/presentation/v1", data, {
		headers: {
			"Content-Type": "application/json+text",
			Signature: `algorithm=RSA-SHA256, signature=${signature}`,
			"Client-Id": "d5b9492dc8f7df58b43c",
			"Request-Time": "2023-03-27T12:12:12+08:00",
			"Resource-Uri": "/presentation/v1",
			"Service-Slug": "presenti",
		},
	})
	.then((res) => console.log(res.data))
	.catch((err) => console.log(err?.response?.data || err));
