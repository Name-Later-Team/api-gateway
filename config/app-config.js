const dotenv = require("dotenv");
dotenv.config();

const APP_CONFIG = {
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	authz: {
		baseUrl: process.env.AUTHZ_URL,
		endpoints: {
			introspect: process.env.AUTHZ_ENDPOINT_INTROSPECT,
		},
	},

	logLevel: process.env.LOG_LEVEL || "debug",
	logDriver: process.env.LOG_DRIVER || "console",

	presentoClientId: process.env.PRESENTO_CLIENT_ID,
	presentoClientSecret: process.env.PRESENTO_CLIENT_SECRET,
};

module.exports = { APP_CONFIG };
