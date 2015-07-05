//
// My Test Interceptor
//

// Dependencies
var log4js = require('log4js'); 

// Logger
var logger = log4js.getLogger('MyInterceptor');

//
// Lifecycle Init Handler
//
function init() {
	logger.info("Initialize...");
}

//
// Actual Interception Work
//
function doInterception(req, res, next) {
	logger.info("Do Interception...");
	next();
}

// Interface
module.exports = {
	"init": init,
	"doInterception": doInterception
}
