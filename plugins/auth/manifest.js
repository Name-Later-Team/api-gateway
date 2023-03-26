const introspectPolicy = require("./policies/introspection");
const introspectionV2 = require("./policies/introspection-v2");
const scopePolicy = require("./policies/scope");

module.exports = {
	version: "0.0.1",
	schema: {
		$id: "https://express-gateway.io/schemas/plugins/auth.json",
	},
	init: function (pluginContext) {
		pluginContext.registerPolicy(introspectPolicy);
		pluginContext.registerPolicy(scopePolicy);
		pluginContext.registerPolicy(introspectionV2);
	},
	policies: ["introspection", "scope", "introspection-v2"],
};
