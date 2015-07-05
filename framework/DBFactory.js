//
// NodeSpeed Framework, MIT Licensed.
// @author Roshan Kulkarni, Mindstix Labs
// 
// DB Factory:
// Establishes DB Connectivity and Initializes mongoose models during application's bootstrap.
//

// Dependencies
var log4js = require('log4js');
var path = require('path');
var config = require('config');
var fsWalk = require('fs-walk');
var mongoose = require('mongoose');
var _ = require('underscore');

// Logger
var logger = log4js.getLogger('DBFactory');

// DB Connection
var connection;

//
// Initialize DB Connectivity and Mongoose Models
//
function initialize(modelPath) {

	// DB Enanbled?
	var databaseConfig = config.get("database");
	var status = config.get("database.status");

	// DB Config Not Found?
	if(_.isEmpty(databaseConfig)) {
		logger.info("DB configuration not specfiied. Skipping MongoDB connection.");
		return;
	}

	// DB Connectivity Not Active?
	if(status !== "ACTIVE") {
		logger.info("DB connectivity disabled. Skipping MongoDB connection.");
		return;
	}

	// Setup MongoDB Connection
	var host = config.get("database.host");
	var port = config.get("database.port");
	var dbName = config.get("database.name");
	logger.info("Using Database: Host: %s | Port: %s | Name: %s", host, port, dbName);
	connection = mongoose.connect('mongodb://' + host + ':' + port + '/' + dbName);

	// Error Handler
	mongoose.connection.on('error', console.error.bind(console, 'DB connection error.'));

	// Connection Success
	mongoose.connection.once('open', function (callback) {
	  logger.info("MongoDB connection successful.");
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
// Fetch Mongoose Connection
// 
function getConnection() {
	return connection;
}

//
// Fetch Mongoose model of the specified name
// 
function getModel(modelName) {

	// Bad or unspecified model name?
	if(_.isEmpty(modelName)) {
		logger.info("Model name not specified. ");
		return null;
	}

	// Connection exists?
	if(_.isEmpty(connection)) {
		logger.info("DB connection does not exist. Check MongoDB configuration.");
		return null;		
	}

	var model = connection.model(modelName);

	// Failed to obtain model?
	if(_.isEmpty(model)) {
		logger.info("Could not obtain model: %s", modelName);
		return null;		
	}

	return model;

}

//
// Interface
//
module.exports = {
	initialize: initialize,
	getConnection: getConnection,
	getModel: getModel
}