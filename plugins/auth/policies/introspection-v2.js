const axios = require("axios").default;
const { APP_CONFIG } = require("../../../config/app-config");
const { Logger } = require("../../../common/utils/logger");
const jwt = require("jsonwebtoken");

module.exports = {
	name: "introspection-v2",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/introspection-v2.json",
		type: "object",
		properties: {},
	},
	policy: () => {
		return async (req, res, next) => {
			const tokenScheme = req.headers.authorization || "";
			const token = tokenScheme.split(" ")[1];

			if (!tokenScheme || !tokenScheme.trim() || !token || !token.trim()) {
				res.status(401).json({
					code: 401,
					message: "Unauthorized",
				});
				return;
			}

			// call Casdoor userinfo endpoint to check token expiration
			const url = `${APP_CONFIG.authz.baseUrl}${APP_CONFIG.authz.endpoints.userinfo}`;

			try {
				Logger.info("Introspect Policy v2 - Calling IAM...");

				const response = await axios.get(url, { headers: { Authorization: tokenScheme } });

				Logger.info("Introspect Policy v2 - Obtaining result...");

				const data = response.data;
				// token expired
				if (data.status && data.status === "error") {
					Logger.debug("Introspect Policy v2 - expired token");
					res.status(401).json({
						code: 401,
						message: "Unauthorized",
					});
					return;
				}

				// patch data to req object and pass to the next policy
				// * NOTE: create req.introspectResult
				const tokenPayload = jwt.decode(token);
				req.introspectResult = {
					scope: tokenPayload["scope"],
				};

				next();
			} catch (error) {
				if (error.response) {
					Logger.error("Introspect Policy v2 Error", error.response.data);
					res.status(401).json({
						code: 401,
						message: "Unauthorized",
					});
					return;
				}

				Logger.error("Introspect Policy v2 Error", error);
				return res.status(502).json({
					code: 502,
					message: "Bad Gateway",
				});
			}
		};
	},
};
