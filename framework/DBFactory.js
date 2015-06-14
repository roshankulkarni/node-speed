//
// NodeSpeed Framework, MIT Licensed.
// @author Mindstix Labs
// 
// DB Factory:
// Establishes DB Connectivity and Initializes mongoose models during application's bootstrap.
//

// Dependencies
// Dependencies
var log4js = require('log4js');
var path = require('path');
var config = require('config');
var fsWalk = require('fs-walk');
var mongoose = require('mongoose');

// Logger
var logger = log4js.getLogger('DBFactory');

// DB Connection
var connection;

//
// Initialize DB Connectivity and Mongoose Models
//
function initialize(modelPath) {

	// Setup MongoDB Connection
	var host = config.get("database.host");
	var port = config.get("database.port");
	var dbName = config.get("database.name");
	logger.info("Using Database: Host: %s | Port: %s | Name: %s", host, port, dbName);
	connection = mongoose.connect('mongodb://' + host + ':' + port + '/' + dbName);

	// Error Handler
	mongoose.connection.on('error', console.error.bind(console, 'DB Connection Error.'));

	// Connection Success
	mongoose.connection.once('open', function (callback) {
	  logger.info("MongoDB Connection Successful.");
	});

	// Recursively Traverse modelPath to load all Models
	logger.info("Loading Models From: %s", modelPath);
	fsWalk.walkSync(modelPath, function(basedir, file, stat) {

		// Skip directory
		if(stat.isDirectory()) {
			return;
		}

		// Skip if file does not have a Controller.js suffix
		if(file.indexOf("Model.js") == -1) {
			return;
		}

		// Mount the router exposed by each controller.
		var modelFile = path.join(basedir, file)
		var modelName = file.slice(0, file.indexOf("Model.js"));
		logger.info("Processing Model: [%s] %s", modelName, modelFile);

		// Load Model
		model = require(modelFile);

	});

}

//
// Fetch Mongoose Model
// 
function getConnection() {
	return connection;
}

//
// Interface
//
module.exports = {
	initialize: initialize,
	getConnection: getConnection
}