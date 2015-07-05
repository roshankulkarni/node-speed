//
// User Interceptor
//

// Dependencies
var log4js = require('log4js'); 
var express = require("express");

// Logger
var logger = log4js.getLogger('UserInterceptor');

// Exposed Routes
var router = express.Router();
router.get("/user/render*", userInterceptor);

//
// Request Interceptor: For User Requests
//
function userInterceptor(req, res, next) {

	// Request Trace
	logger.debug("Invoked User Interceptor");
	next();

}

// Interface
module.exports = router;
