const { PassThrough } = require("stream");
const rawParser = require("express").raw({ type: () => true });

/**
 * @description
 */
module.exports = {
	name: "body-parser",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/body-parser.json",
	},
	policy: (actionParams) => {
		return (req, res, next) => {
			req.egContext.requestStream = new PassThrough();
			req.pipe(req.egContext.requestStream);

			return rawParser(req, res, next);
		};
	},
};
