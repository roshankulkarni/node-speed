//
// Factory that returns a validation middleware. This middleware invokes the 'Joi' framework 
// at runtime and applies the validation rules based on the Joi schema definition. (Joi is 
// a powerful 'Object Schema Validation' framework.)
//
// Refer this for the supported schema definitions:
// https://github.com/hapijs/joi
//
// @author Roshan Kulkarni, Mindstix Labs
//

// Dependencies
var log4js = require('log4js');
var path = require('path');
var _ = require('underscore');
var joi = require('joi');

// Logger
var logger = log4js.getLogger('ValidatorFactory');

//
// Factory method to return a Express middleware method. This 'closure' pattern 
// helps us access the validationRule within the express middleware at runtime.
//
function getValidator(routeDef) {

	return function(req, res, next) {

		// Route definition exists?
		if(_.isUndefined(routeDef) || _.isNull(routeDef) || _.isEmpty(routeDef)) {
			logger.error("Empty routeDef configuration. Skipping validation.");
			next();
			return;		
		}

		// Validation schema defined?
		var validatorSchema = routeDef.validatorSchema;
		if(_.isUndefined(validatorSchema) || _.isNull(validatorSchema) || _.isEmpty(validatorSchema)) {
			logger.error("Empty validatorSchema configuration. Skipping validation.");
			next();
			return;
		}

		// Load schema definition
		logger.debug("Using validation schema: %s", validatorSchema);
		var fileName = path.join(global.appRoot, "/application/validators/", validatorSchema);
		var schema = require(fileName);

		// Object to be validated
		var masterObj = {};

		// Named-params from URI segments (Express supports this out-of-the-box)
		masterObj.params = req.params;

		// Query strings
		masterObj.query = req.query

		// Cookies from the Request (Using the cookie-parser middleware)
		masterObj.cookies = req.cookies;

		// Request body (Using the body-parser and multer middleware)
		masterObj.body = req.body;

		// Invoke validator
		logger.debug("Object to be validated: %s", JSON.stringify(masterObj));
		logger.debug("Applying validation rules: %s", JSON.stringify(schema));
		var validationResponse = joi.validate(masterObj, schema, {"allowUnknown": true, "abortEarly": false});
		logger.debug("Validation response: %s", JSON.stringify(validationResponse));

		// Success
		if(_.isNull(validationResponse.error)) {
			logger.debug("Validation successful for [%s]", routeDef.requestUri);
			next();
			return;
		}

		// Validation failed
		logger.error("Validation Failed For [%s]. Error: %s", routeDef.requestUri, JSON.stringify(validationResponse.error));
		res.status(500);
		res.setHeader('content-type', 'text/plain');
		res.end("Validation error.");
		return;

	}

}

module.exports = {
	getValidator: getValidator
}