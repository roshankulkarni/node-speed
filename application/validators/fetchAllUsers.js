//
// Validation Rules
//
var Joi = require('joi');

module.exports = {
	cookies: {
		asgardTheme: Joi.string().valid("UX1")
	}
};
