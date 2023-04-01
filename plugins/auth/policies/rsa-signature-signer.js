const { RsaSigner } = require("@huyleminh/nodejs-sdk");
const { Logger } = require("../../../common/utils/logger");
const { SERVICE_CONFIG_FACTORY } = require("../../../config/app-config");

/**
 * @description Create RSA signature and attach to request and send to downstream services
 * - This policy must be placed after rsa-signature-validation policy or introspection/introspection-v2 policy
 */
module.exports = {
	name: "rsa-signature-signer",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/rsa-signature-signer.json",
		type: "object",
		properties: {},
	},
	policy: () => {
		return (req, res, next) => {
			Logger.info("--------- RSA Signer Policy - Signing");

			try {
				// get information from incoming request
				const requestTime = req.header("Request-Time");
				const resourceUri = req.header("Resource-Uri");
				const httpMethod = req.method;

				const path = req.path;
				// get downstream service's name
				const serviceName = path.split("/")[1];

				Logger.info(`Signing signature for service - ${serviceName}`);

				// get service config by service name
				const config = SERVICE_CONFIG_FACTORY[serviceName];
				if (!config) {
					throw new Error("Service name is incorrect");
				}

				// create signing setting
				// body is Buffer
				const payload = httpMethod !== "GET" ? req.body.toString() : undefined;
				const replacedResourceUri = resourceUri.replace(`/${serviceName}`, "");

				const signSetting = {
					privateKey: config.rsaPrivateKey,
					passphrase: config.rsaPassphrase,
					payload,
					headers: { requestTime, httpMethod, clientId: config.clientId, resourceUri: replacedResourceUri || "/" },
				};

				const signer = new RsaSigner(signSetting);
				const signature = signer.generateSignature();

				// append to header
				req.headers["Client-Id"] = config.clientId;
				req.headers["Signature"] = `algorithm=RSA-SHA256, signature=${signature}`;
				req.headers["Resource-Uri"] = replacedResourceUri;

				// remove unused headers
				delete req.headers["service-slug"];
				delete req.headers["client-id"];
				delete req.headers["resource-uri"];
				delete req.headers["signature"];

				next();
			} catch (error) {
				Logger.error("RSA Signer Policy - Failed");
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
