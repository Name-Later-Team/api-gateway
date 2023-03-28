const { PassThrough } = require("stream");
const jsonParser = require("express").json();
const rawParser = require("express").raw();
const urlEncodedParser = require("express").urlencoded({ extended: false });

/**
 * @description
 */
module.exports = {
	name: "body-parser",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/body-parser.json",
	},
	// policy: (actionParams) => {
	// 	return (req, res, next) => {
	// 		req.egContext.requestStream = new PassThrough();
	// 		req.pipe(req.egContext.requestStream);

	// 		return jsonParser(req, res, () => urlEncodedParser(req, res, next));
	// 	};
	// },
	policy: (actionParams) => require("express").raw({ type: () => true }),
};
