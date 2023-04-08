const { Logger } = require("../../../common/utils/logger");

/**
 * @description Vefiry if user's token scope includes target service scope. This policy must be placed after introspection policy
 * ie:
 * - user scope: openid presentation
 * - service scope: presentation
 * - result: scope matched
 */
module.exports = {
	name: "scope",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/scope.json",
		type: "object",
		properties: {
			scope: { type: "string" },
		},
	},
	policy: (actionParams) => {
		return (req, res, next) => {
			Logger.info("--------- Scope Policy - Checking");

			const scope = actionParams.scope;

			// introspection result object: https://datatracker.ietf.org/doc/html/rfc7662#section-2.2
			const introspectResult = req.introspectResult;

			if (!introspectResult) {
				res.status(401).json({
					code: 401,
					message: "Unauthorized",
				});
				return;
			}

			const userScope = introspectResult.scope || "";

			if (!userScope || !userScope.trim() || !userScope.includes(scope)) {
				Logger.error("--------- Scope Policy - Failed");
				Logger.error(`User scope and service scope - ${scope} are incompatible`);

				res.status(403).json({
					code: 4031,
					message: "The user cannot access service",
				});
				return;
			}

			Logger.info("--------- Scope Policy - Passed");
			next();
		};
	},
};
