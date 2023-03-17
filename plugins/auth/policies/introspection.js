const axios = require("axios").default;
const { APP_CONFIG } = require("../../../config/app-config");
const queryString = require("query-string");
const { Logger } = require("../../../common/utils/logger");

module.exports = {
	name: "introspection",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/introspection.json",
		type: "object",
		properties: {
			requestTimeHeader: { type: "string", default: "X-Request-Time" },
			serviceSlug: { type: "string" },
		},
	},
	policy: (actionParams) => {
		return async (req, res, next) => {
			const tokenScheme = req.headers.authorization || "";

			// const signature = tokenScheme.split(" ")[0];
			const token = tokenScheme.split(" ")[1];

			if (!tokenScheme || !tokenScheme.trim() || !token || !token.trim()) {
				res.status(401).json({
					code: 401,
					message: "Unauthorized",
				});
				return;
			}

			// call Casdoor introspection endpoint to check token valid
			const url = `${APP_CONFIG.authz.baseUrl}${APP_CONFIG.authz.endpoints.introspect}`;
			const payload = {
				token_type_hint: "access_token",
				token,
				client_id: APP_CONFIG.presentoClientId,
				client_secret: APP_CONFIG.presentoClientSecret,
			};

			try {
				Logger.info("Introspect Policy - Calling IAM...");
				const introspectResult = await axios.post(url, queryString.stringify(payload), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				});
				Logger.info("Introspect Policy - Obtaining result...");

				const data = introspectResult.data;

				// patch data to req object and pass to the next policy
				// * NOTE: create req.introspectResult
				if (data.active) {
					req.introspectResult = data;
					return next();
				}

				return res.status(401).json({
					code: 401,
					message: "Unauthorized",
				});
			} catch (error) {
				if (error.response) {
					Logger.error("Introspect Policy Error", error.response.data);

					return res.status(401).json({
						code: 401,
						message: "Unauthorized",
						data: error.response.data,
					});
				}

				Logger.error("Introspect Policy Error", error);
				return res.status(502).json({
					code: 502,
					message: "Bad Gateway",
				});
			}
		};
	},
};
