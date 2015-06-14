//
// NodeSpeed Framework, MIT License.
// @author Mindstix Labs
//
// Interceptor Factory:
// Instantiates available interceptors and mounts them during application's bootstrap.
//

// Dependencies
var log4js = require('log4js');
var path = require('path');
var fsWalk = require('fs-walk');

// Logger
var logger = log4js.getLogger('InterceptorFactory');

// Map of Interceptors
var interceptorMap = {};

//
// Load Available Interceptors from interceptorPath directory.
//
function initialize(interceptorPath) {

	// Recursively Traverse interceptorPath to load all interceptors
	logger.info("Loading Interceptors From: %s", interceptorPath);
	fsWalk.walkSync(interceptorPath, function(basedir, file, stat) {

		// Skip directory
		if(stat.isDirectory()) {
			return;
		}

		// Skip if file does not have a Interceptor.js suffix
		if(file.indexOf("Interceptor.js") == -1) {
			return;
		}

		// Mount the router exposed by each interceptor.
		var interceptorFile = path.join(basedir, file)
		var interceptorName = file.slice(0, file.indexOf("Interceptor.js"));
		logger.info("Processing Interceptor: [%s] %s", interceptorName, interceptorFile);

		// Each interceptor returns a Express Router. Mount that to Express App.
		interceptor = require(interceptorFile);
		global.app.use(interceptor);

		// Cache
		interceptorMap[interceptorName] = interceptor;
	});


}

//
// Fetch interceptor with specified name.
// 
function getInterceptor(interceptorName) {

	// Validation
	if(!interceptorName) {
		return false;
	}

	// Lookup in the Interceptor Map
	return interceptorMap[interceptorName];

}

//
// Interface
//
module.exports = {
	initialize: initialize,
	getInterceptor: getInterceptor
}
