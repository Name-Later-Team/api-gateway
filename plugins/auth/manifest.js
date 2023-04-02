const headerVerification = require("./policies/header-verification");
const introspectPolicy = require("./policies/introspection");
const introspectionV2 = require("./policies/introspection-v2");
const rsaSignatureSigner = require("./policies/rsa-signature-signer");
const rsaSignatureValidation = require("./policies/rsa-signature-validation");
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
		pluginContext.registerPolicy(rsaSignatureValidation);
		pluginContext.registerPolicy(rsaSignatureSigner);
		pluginContext.registerPolicy(headerVerification);
	},
	policies: [
		"introspection",
		"scope",
		"introspection-v2",
		"rsa-signature-validation",
		"rsa-signature-signer",
		"header-verification",
	],
};
