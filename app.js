//
// Entry point into the NodeSpeed Framework.
// @author Roshan Kulkarni, Mindstix Labs
//

// Dependencies
var log4js = require('log4js'); 
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var uuid = require('uuid');
var device = require("express-device");
var fsWalk = require('fs-walk');
var adaro = require('adaro');


//
// Application Root
//
global.appRoot = __dirname;
console.log("Application Root: %s", global.appRoot);


//
// Directory Paths (Framework's Convention)
//
var configPath = path.join(global.appRoot, "/application/config/");
var controllerPath = path.join(global.appRoot, "/application/controllers/");
var controllerRoutesPath = path.join(global.appRoot, "/application/routes/controllers/");
var interceptorPath = path.join(global.appRoot, "/application/interceptors/");
var interceptorRoutesPath = path.join(global.appRoot, "/application/routes/interceptors/");
var modelPath = path.join(global.appRoot, "/application/models/");
var servicePath = path.join(global.appRoot, "/application/services/");
var publicResourcesPath = path.join(global.appRoot, "/application/public/");
var viewsPath = path.join(global.appRoot, "/application/views/");


//
// Current Runtime Environment:
// Config module uses NODE_ENV variable to determine the configuration file to be loaded from the /config directory.
//
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
} 
console.log("Runtime Environment: %s", process.env.NODE_ENV);


//
// App Configuration:
// node-config module uses the process.env.NODE_CONFIG_DIR to determine the config directory.
//
if (!process.env.NODE_CONFIG_DIR) {
    process.env.NODE_CONFIG_DIR = configPath;
} 
console.log("Configuration Directory: %s", process.env.NODE_CONFIG_DIR);
var config = require('config');
console.log("Config Base: " + config.util.getEnv('NODE_CONFIG_DIR'));
console.log("Config File: " + config.util.getEnv('NODE_ENV'));


//
// Logger Initialization
//
var loggerConfig = config.get("logger");
log4js.configure(loggerConfig);


//
// Framework Components
//
var dbFactory = require('./framework/DBFactory');
var serviceFactory = require('./framework/ServiceFactory');
var interceptorFactory = require('./framework/InterceptorFactory');
var controllerFactory = require('./framework/ControllerFactory');


//
// Dump Environment Information
//
var logger = log4js.getLogger('ApplicationBootstrap');
logger.info("Environment: %s", process.env.NODE_ENV);
logger.info("AppRoot: %s", global.appRoot);
logger.info("Config Base: %s", config.util.getEnv('NODE_CONFIG_DIR'));
logger.info("Current Environment: %s", config.util.getEnv('NODE_ENV'));
logger.info("Controllers: %s", controllerPath);
logger.info("Interceptors: %s", interceptorPath);
logger.info("Models: %s", modelPath);
logger.info("Services: %s", servicePath);
logger.info("Public Resources: %s", publicResourcesPath);

//
// Instantiate Express Framework
//
var app = express();
global.app = app;


//
// Middleware: Cookie Parser.
// Parses the HTTP Header Cookies and populates the 'req.cookies' having name-value pairs.
// {cookieName: cookieValue, ...}
//
app.use(cookieParser());


//
// Middleware: Body Parser.
// Parses the HTTP Body and populates the req.body.
//
app.use(bodyParser.json());


//
// Middleware: Tagging Each Request with Unique Id.
// Useful to debug or trace requests in the log files.
// Access using req.uuid in the rest of the code.
// https://www.npmjs.com/package/uuid
//
app.use(function(req, res, next) {
	req.uuid = uuid.v4()
	logger.info("Request UUID: %s", req.uuid);
	next();
});


//
// Middleware: Identify Request Channel (User Agent: desktop, phone, tablet, tv)
// Inserts the client's device type in req.device = {"type": "desktop"}
// https://github.com/rguerreiro/express-device
//
app.use(device.capture());


//
// Middeware: Deliver Static Resources under '/public/'
// http://expressjs.com/guide/using-middleware.html#middleware.built-in
// 
var options = {
	dotfiles: 'deny',
	etag: true,
	index: false,
	lastModified: true,
	redirect: false
};
app.use('/public', express.static(publicResourcesPath, options));


//
// View Rendering Engine
//
app.engine('dust', adaro.dust());
app.set('views', viewsPath);
app.set('view engine', 'dust');


//
// Initialize DB Connection and Models.
// global.app.db: Is a reference to the DB Factory.
//
app.db = dbFactory;
app.db.initialize(modelPath);


//
// Instantiate All Services.
// global.app.services: Is a reference to the Service Factory.
//
app.services = serviceFactory;
app.services.initialize(servicePath);


//
// Mount All Request Interceptors.
// global.app.interceptors: Is a reference to the Interceptor Factory.
//
app.interceptors = interceptorFactory;
app.interceptors.initialize(interceptorPath, interceptorRoutesPath);


//
// Initialize All Controllers. Mount All Routes to Respective Controller Methods.
// global.app.controllers: Is a reference to the Controller Factory.
//
app.controllers = controllerFactory;
app.controllers.initialize(controllerPath, controllerRoutesPath);


//
// Health Check Endpoint
//
app.get("/sys/health/ping", function(req, res) {
	res.send("Ok.");
	return;
});


//
// Middleware: Catch-All Error Handler.
// So that we log errors, but don't leak internal error details to the client.
//
app.use(errorHandler);

function errorHandler(err, req, res, next) {

	// XHR Request?
	if (req.xhr) {
		logger.error(err);
		res.status(500).send({ error: 'Internal Error Occured.' });
		return;
	}

	// Not a XHR Request.
	logger.error(err);
	res.status(500);
	res.render('framework/error', { error: "Internal Server Error." });

	// Note: No need to call next() as the buck stops here.
	return;
	
}


//
// Bind HTTP Server
//
var port = config.get("server.port");
var server = app.listen(port, function() {
	logger.info("Listening on Port: %d", port);
});

