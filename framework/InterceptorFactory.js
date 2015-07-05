//
// NodeSpeed Framework, MIT License.
// @author Roshan Kulkarni, Mindstix Labs
//
// Interceptor Factory:
// Instantiates available interceptors and mounts them during application's bootstrap.
//

// Dependencies
var log4js = require('log4js');
var path = require('path');
var fsWalk = require('fs-walk');
var express = require("express");
var fs = require('fs');
var _ = require('underscore');

// Logger
var logger = log4js.getLogger('InterceptorFactory');

// Cache of Interceptors References
var interceptorMap = {};

//
// Load available interceptors from interceptorPath directory.
//
function initialize(interceptorPath, interceptorRoutesPath) {

	//
	// Recursively Traverse 'interceptorPath' to load and initialize all interceptors.
	//
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
		var interceptorFile = path.join(basedir, file);
		logger.info("Loading Interceptor File: %s", interceptorFile);

		// Relative interceptor name [/MyInterceptor]
		startIndex = interceptorPath.length;
		var relativeInterceptorName = interceptorFile.substring(startIndex, interceptorFile.length);
		relativeInterceptorName = relativeInterceptorName.substring(0, relativeInterceptorName.indexOf(".js"));
		relativeInterceptorName = path.join("/", relativeInterceptorName);
		logger.info("Initializing Interceptor: [%s] %s", relativeInterceptorName, interceptorFile);

		// Instantiate interceptor module
		interceptor = require(interceptorFile);

		// Invoke interceptor init
		if(typeof(interceptor.init) == 'function') {
			interceptor.init();
		}

		// Populate interceptor cache
		interceptorMap[relativeInterceptorName] = interceptor;
	});

	//
	// Iterate thru all route definition JSON files to mount specified routes.
	//
	logger.info("Loading Interceptor Definitions From: %s", interceptorRoutesPath);	
	fsWalk.walkSync(interceptorRoutesPath, function(basedir, file, stat) {

		// Skip directory
		if(stat.isDirectory()) {
			return;
		}

		// Skip if file does not have a Controller.js suffix
		if(file.indexOf(".json") == -1) {
			return;
		}

		// Mount this route configuration (comprising of multiple routes)
		var routeConfigFile = basedir + file;
		mountRoutes(routeConfigFile);

	});
}

//
// Mount routes based on the specified configuration JSON.
// This maps route URIs to specific interceptor functions.
//
function mountRoutes(routeConfigFile) {

	// Parse route file contents
	var contents = fs.readFileSync(routeConfigFile);
	var routeDefs = JSON.parse(contents);

	for (var i in routeDefs.interceptors) {

		// Interceptor Definition
		var interceptorDef = routeDefs.interceptors[i];

		// Determine module and method for this route
		var interceptorUri = interceptorDef.requestUri;
		var httpMethod = _.isEmpty(interceptorDef.httpMethod) ? "get" : interceptorDef.httpMethod;		
		var handlerName = interceptorDef.handler;
		var interceptorName = handlerName.slice(0, handlerName.indexOf("."));
		var methodName = handlerName.slice(handlerName.indexOf(".") + 1);

		// Reference to target method
		var method = interceptorMap[interceptorName][methodName];

		// Validate method reference before mounting
		if(typeof(method) !== 'function') {
			logger.error("Bad Handler Method: %s", handlerName);			
			continue;
		}

		// Mount route
		logger.info("Mounting: [%s] [%s] %s", interceptorUri, httpMethod, handlerName);
		var router = express.Router();
		router[httpMethod](interceptorUri, method);
		global.app.use(router);

	}

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
