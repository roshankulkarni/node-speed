//
// NodeSpeed Framework, MIT License.
// @author Roshan Kulkarni, Mindstix Labs
//
// Controller Factory:
// Instantiates available controllers and mounts them during application's bootstrap phase.
//

// Dependencies
var log4js = require('log4js');
var fs = require('fs');
var fsWalk = require('fs-walk');
var path = require('path');
var express = require("express");
var stripJsonComments = require('strip-json-comments');
var _ = require('underscore');

// Logger
var logger = log4js.getLogger('ControllerFactory');

// Cache of Controllers References
// [/v1/MyController] => Reference to ControllerModule.function
var controllerMap = {};

// Supported HTTP methods (Add more as needed)
var supportedMethods = ["get", "put", "post", "delete", "head"];

//
// Load and Initialize Controllers from controllerPath directory.
// Also Mount all Controllers into ExpressJS as per the provided routeDefs.
//
function initialize(controllerPath, routeDefinitionPath) {

	//
	// Recursively traverse 'controllerPath' to load and initialize all controller modules.
	//
	logger.info("Loading Controllers From: %s", controllerPath);
	fsWalk.walkSync(controllerPath, function(basedir, file, stat) {

		// Skip directory
		if(stat.isDirectory()) {
			return;
		}

		// Skip if file does not have a Controller.js suffix
		if(file.indexOf("Controller.js") == -1) {
			return;
		}

		// Relative base path of this controller module
		var controllerFile = path.join(basedir, file);
		logger.info("Loading Controller File: %s", controllerFile);

		// Relative controller name [/v1/MyController]
		var startIndex = controllerPath.length;
		var relativeControllerName = controllerFile.substring(startIndex, controllerFile.length);
		var relativeControllerName = relativeControllerName.substring(0, relativeControllerName.indexOf(".js"));
		relativeControllerName = path.join("/", relativeControllerName);

		// Instantiate controller module
		logger.info("Initializing Controller: [%s] %s", relativeControllerName, controllerFile);
		controller = require(controllerFile);

		// Invoke controller init
		if(typeof(controller.init) === 'function') {
			controller.init();
		}

		// Populate controller cache
		controllerMap[relativeControllerName] = controller;

	});

	//
	// Iterate thru all route definition JSON files to mount specified routes.
	//
	logger.info("Loading Route Definitions From: %s", routeDefinitionPath);	
	fsWalk.walkSync(routeDefinitionPath, function(basedir, file, stat) {

		// Skip directory
		if(stat.isDirectory()) {
			return;
		}

		// Skip if file does not have a Controller.js suffix
		if(file.indexOf(".json") === -1) {
			return;
		}

		// Mount this route configuration (comprising of multiple routes)
		var routeConfigFile = basedir + file;
		mountRoutes(routeConfigFile);

	});

}

//
// Mount routes based on the specified route configuration JSON.
// This maps route URIs to specific controller functions.
//
function mountRoutes(routeConfigFile) {

	// Read routes file and attempt to parse JSON
	try {
		var contents = fs.readFileSync(routeConfigFile, 'utf8');
		var routeConfig = JSON.parse(stripJsonComments(contents));
	} catch (e) {
		logger.error("Failed to parse routes JSON file: %s", routeConfigFile);
		return;
	}

	// Validate routeConfig to be not empty
	if(_.isUndefined(routeConfig) || _.isNull(routeConfig) || _.isEmpty(routeConfig)) {
		logger.error("Empty route configuration. Skipping.");
		return;		
	}

	// Validate required elements in the routeConfig
	if(_.isEmpty(routeConfig.config)) {
		logger.error("Bad route configuration. Missing 'config' parameter.");
		return;
	}

	if(_.isEmpty(routeConfig.config.status) || routeConfig.config.status !== "ACTIVE") {
		logger.error("Not an active route definition. Skipping.");
		return;
	}

	if(_.isEmpty(routeConfig.routes)) {
		logger.error("Bad route configuration. Missing 'routes' parameter.");
		return;
	}

	// Extract configuration info
	var uriPrefix = _.isEmpty(routeConfig.config.prefix) ? "" : routeConfig.config.prefix;
	var routeDefs = routeConfig.routes;

	// Mount all routes in this route definition
	for (var i in routeDefs) {

		// Route Definition
		var routeDef = routeDefs[i];
		if(_.isEmpty(routeDef)) {
			logger.error("Empty route definition found in file %s.", routeConfigFile);
			continue;
		}

		// Route URI
		if(_.isEmpty(routeDef.requestUri)) {
			logger.error("Skipping route. Empty 'requestUri' in route: %s", JSON.stringify(routeDef));
			continue;
		}
		var routeUri = uriPrefix + routeDef.requestUri;

		// Validate HTTP method
		var httpMethod = _.isEmpty(routeDef.httpMethod) ? "get" : routeDef.httpMethod;
		if(supportedMethods.indexOf(httpMethod) < 0) {
			logger.error("Skipping route. Unsupported HTTP method %s in %s.", httpMethod, JSON.stringify(routeDef));
			continue;
		}

		// Request handler
		if(_.isEmpty(routeDef.handler)) {
			logger.error("Empty 'handler' in %s. Skipping.", JSON.stringify(routeDef));
			continue;			
		}
		
		var handlerName = routeDef.handler;
		var controllerName = handlerName.slice(0, handlerName.indexOf("."));
		var methodName = handlerName.slice(handlerName.indexOf(".") + 1);

		if(_.isEmpty(controllerName) || _.isEmpty(methodName)) {
			logger.error("Bad handler in %s. Skipping.", JSON.stringify(routeDef));
			continue;			
		}

		// Reference to target method
		var method = controllerMap[controllerName][methodName];

		// Validate function reference before mounting
		if(typeof(method) !== 'function') {
			logger.error("Bad Handler Method: %s", handlerName);
			continue;
		}
 
		// Mount route
		logger.info("Mounting: [%s] [%s] %s", routeUri, httpMethod, handlerName);
		var router = express.Router();
		router[httpMethod](routeUri, method);
		global.app.use(router);

	};

}

//
// Fetch controller with specified name.
// 
function getController(controllerName) {

	// Validation
	if(_.isEmpty(controllerName)) {
		return false;
	}

	// Lookup in the Controller Map
	return controllerMap[controllerName];

}

//
// Interface
//
module.exports = {
	initialize: initialize,
	getController: getController
}
