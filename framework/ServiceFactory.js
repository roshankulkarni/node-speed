//
// NodeSpeed Framework, MIT License.
// @author Mindstix Labs
//
// Service Factory:
// Instantiates available services during application's bootstrap.
//

// Dependencies
var log4js = require('log4js'); 
var path = require('path');
var fsWalk = require('fs-walk');

// Logger
var logger = log4js.getLogger('ServiceFactory');

// Map of Services
var servicesMap = {};

//
// Load Available Services from servicePath directory.
//
function initialize(servicePath) {

	logger.info("Loading Services From: %s", servicePath);

	// Recursively Traverse servicePath to load all services
	fsWalk.walkSync(servicePath, function(basedir, file, stat) {

		// Skip directory
		if(stat.isDirectory()) {
			return;
		}

		// Skip if file does not have a Service.js suffix
		if(file.indexOf("Service.js") == -1) {
			return;
		}

		// Mount the router exposed by each controller.
		var serviceFile = path.join(basedir, file)
		var serviceName = file.slice(0, file.indexOf("Service.js"));
		logger.info("Processing Service: [%s] %s", serviceName, serviceFile);

		// Instantiate and Cache Reference to Service
		service = require(serviceFile);
		servicesMap[serviceName] = service;
	});

}

//
// Fetch service with specified name.
// 
function getService(serviceName) {

	// Validation
	if(!serviceName) {
		return false;
	}

	// Lookup in the Service Map
	return servicesMap[serviceName];

}

//
// Interface
//
module.exports = {
	initialize: initialize,
	getService: getService
}
