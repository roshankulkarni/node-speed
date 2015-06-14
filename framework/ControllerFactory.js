//
// NodeSpeed Framework, MIT License.
// @author Mindstix Labs
//
// Controller Factory:
// Instantiates available controllers and mounts them during application's bootstrap phase.
//

// Dependencies
var log4js = require('log4js');
var path = require('path');
var fsWalk = require('fs-walk');

// Logger
var logger = log4js.getLogger('ControllerFactory');

// Map of Controllers
var controllerMap = {};

//
// Load Available Controllers from controllerPath directory.
//
function initialize(controllerPath) {

	// Recursively Traverse controllerPath to load all controllers
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

		// Mount the router exposed by each controller.
		var controllerFile = path.join(basedir, file)
		var controllerName = file.slice(0, file.indexOf("Controller.js"));
		logger.info("Processing Controller: [%s] %s", controllerName, controllerFile);

		// Each controller returns a Router. Mount that to Express App.
		controller = require(controllerFile);
		global.app.use(controller);

		// Cache
		controllerMap[controllerName] = controller;
	});

}

//
// Fetch controller with specified name.
// 
function getController(controllerName) {

	// Validation
	if(!controllerName) {
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
