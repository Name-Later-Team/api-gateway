const dotenv = require("dotenv");
dotenv.config();

const APP_CONFIG = {
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	authz: {
		baseUrl: process.env.AUTHZ_URL,
		endpoints: {
			introspect: process.env.AUTHZ_ENDPOINT_INTROSPECT,
			userinfo: process.env.AUTHZ_ENDPOINT_USERINFO,
		},
	},

	logLevel: process.env.LOG_LEVEL || "debug",
	logDriver: process.env.LOG_DRIVER || "console",

	presentoClientId: process.env.PRESENTO_CLIENT_ID,
	presentoClientSecret: process.env.PRESENTO_CLIENT_SECRET,
};

const SERVICE_CONFIG_FACTORY = {
	// client
	presenti: {
		clientId: process.env.PRESENTI_CLIENT_ID,
		clientSecret: process.env.PRESENTI_CLIENT_SECRET,
		rsaPublicKey: process.env.PRESENTI_PUBLIC_KEY,
	},
	presento: {
		clientId: process.env.PRESENTO_CLIENT_ID,
		clientSecret: process.env.PRESENTO_CLIENT_SECRET,
		rsaPublicKey: process.env.PRESENTO_PUBLIC_KEY,
	},

	// services
	presentation: {
		clientId: process.env.PRESENTATION_SERVICE_CLIENT_ID,
		clientSecret: process.env.PRESENTATION_SERVICE_CLIENT_SECRET,
		rsaPrivateKey: process.env.PRESENTATION_SERVICE_PRIVATE_KEY,
		rsaPassphrase: process.env.PRESENTATION_SERVICE_PASSPHRASE,
	},
};

module.exports = { APP_CONFIG, SERVICE_CONFIG_FACTORY };
