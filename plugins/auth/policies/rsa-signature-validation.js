const { RsaValidator } = require("@huyleminh/nodejs-sdk");
const { Logger } = require("../../../common/utils/logger");
const { SERVICE_CONFIG_FACTORY } = require("../../../config/app-config");

/**
 * @description Vefiry request signature using RSA
 */
module.exports = {
	name: "rsa-signature-validation",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/rsa-signature-validation.json",
		type: "object",
		properties: {},
	},
	policy: () => {
		return (req, res, next) => {
			Logger.info("RSA Policy - Starting Authentication...");

			try {
				// Get request header information
				const requestTime = req.header("Request-Time");
				const clientId = req.header("Client-Id");
				const xAuthorization = req.header("Signature");
				const resourceUri = req.header("Resource-Uri");
				const httpMethod = req.method;
				const serviceSlug = req.header("Service-Slug");

				// validate client-id
				const config = SERVICE_CONFIG_FACTORY[serviceSlug];
				if (!config || clientId !== config.clientId) {
					throw new Error("Service slug or client id is incorrect");
				}

				// req.body is a raw Buffer -> must be converted to string
				const payload = httpMethod !== "GET" ? req.body.toString() : undefined;

				const verifySetting = {
					publicKey: config.rsaPublicKey,
					payload,
					headers: { requestTime, httpMethod, clientId, resourceUri, xAuthorization },
				};

				const validator = new RsaValidator(verifySetting);
				if (!validator.verifySignature()) {
					throw new Error("Invalid signature");
				}

				Logger.info("RSA Policy - Authentication Completed...");

				next();
			} catch (error) {
				Logger.error("RSA Policy - Authenication Failed");
				Logger.error(error.message || error);

				res.status(401).json({
					code: 401,
					message: "Unauthorized",
				});
				return;
			}
		};
	},
};
