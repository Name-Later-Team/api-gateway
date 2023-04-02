const { Logger } = require("../../../common/utils/logger");
const moment = require("moment");

/**
 * @description Vefiry required headers
 */
module.exports = {
	name: "header-verification",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/header-verification.json",
		type: "object",
		properties: {},
	},
	policy: () => {
		return (req, res, next) => {
			Logger.info("--------- Header Verification Policy - Checking");

			try {
				// Get request header information
				const requestTime = req.header("Request-Time");
				const clientId = req.header("Client-Id");
				const resourceUri = req.header("Resource-Uri");

				// Check request time format
				const timeToCheck = moment(requestTime, "YYYY-MM-DDTHH:mm:ss+0000");
				if (!timeToCheck.isValid()) {
					throw new Error("Request time format is incorrect");
				}

                if (!clientId) {
                    throw new Error("Missing client id");
                }

				// Check whethe resource uri match req.path or not
                if (resourceUri !== req.path) {
                    throw new Error("Request resource uri and path are incompatible");
                }

				Logger.info("--------- Header Verification Policy - Passed");

				next();
			} catch (error) {
				Logger.error("--------- Header Verification Policy - Failed");
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
