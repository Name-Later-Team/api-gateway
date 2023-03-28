const bodyParser = require("./policies/body-parser");

module.exports = {
	version: "0.0.1",
	schema: {
		$id: "https://express-gateway.io/schemas/plugins/parser.json",
	},
	init: function (pluginContext) {
		pluginContext.registerPolicy(bodyParser);
	},
	policies: ["body-parser"],
};
