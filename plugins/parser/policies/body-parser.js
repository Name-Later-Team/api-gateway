/**
 * @description
 */
module.exports = {
	name: "body-parser",
	schema: {
		$id: "http://express-gateway.io/schemas/policies/body-parser.json",
	},
	policy: (actionParams) => require("express").raw({ type: () => true }),
};
