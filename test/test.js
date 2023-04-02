const { RsaSigner, RsaValidator } = require("@huyleminh/nodejs-sdk");
const { default: axios } = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const data = { name: "hello" };

// // prepare data to sign the signature
const signSetting = {
	privateKey: process.env.PRESENTI_PRIVATE_KEY,
	passphrase: process.env.PRESENTI_PASSPHRASE,
	payload: data,
	headers: {
		requestTime: "2023-03-27T12:12:12+08:00",
		httpMethod: "POST",
		clientId: process.env.PRESENTI_CLIENT_ID,
		resourceUri: "/presentation/v1/audience",
	},
};

const signer = new RsaSigner(signSetting);
const signature = signer.generateSignature();

console.log(`algorithm=RSA-SHA256, signature=${signature}`);

// prepare data to validate the signature
const verifySetting = {
	publicKey: process.env.PRESENTI_PUBLIC_KEY,
	payload: data,
	headers: {
		requestTime: "2023-03-27T12:12:12+08:00",
		httpMethod: "POST",
		clientId: process.env.PRESENTI_CLIENT_ID,
		resourceUri: "/presentation/v1/audience",
		xAuthorization: `algorithm=RSA-SHA256, signature=${signature}`,
	},
};


const validator = new RsaValidator(verifySetting);
console.log(validator.verifySignature());

axios
	.post("http://localhost:8080/presentation/v1/audience", data, {
		headers: {
			"Content-Type": "application/json+text",
			Signature: `algorithm=RSA-SHA256, signature=${signature}`,
			"Client-Id": process.env.PRESENTI_CLIENT_ID,
			"Request-Time": "2023-03-27T12:12:12+08:00",
			"Resource-Uri": "/presentation/v1/audience",
			"Service-Slug": "presenti",
		},
	})
	.then((res) => console.log(res.data))
	.catch((err) => console.log(err?.response?.data || err));
