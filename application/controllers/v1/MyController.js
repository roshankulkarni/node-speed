//
// My Test Controller
//

// Dependencies
var log4js = require('log4js'); 
var path = require('path');
var util = require('util');

// Logger
var logger = log4js.getLogger('UserController');

// Service Dependencies
var userService = global.app.services.getService("User");

//
// Lifecycle Init Handler
//
function init() {
	logger.debug("V1 Controller Initialization");
}

//
// REST API: Fetch All Users
//
function fetchAllUsers(req, res, next) {

	// Request Trace
	logger.debug("Sign Up: Req UUID: " + req.uuid);
	logger.debug("Sign Up: Device Type" + JSON.stringify(req.device));
	logger.debug("Cookies: " + util.inspect(req.cookies));
	logger.debug("Body: " + util.inspect(req.body));

	// Delegate to Service
	userService.fetchAllUsers(function cb(users){

		// Generate REST Response
		res.json(users);
		return;		

	});

}

//
// Render View: All Users
//
function renderAllUsers(req, res, next) {

	// Request Trace
	logger.debug("Sign Up: Req UUID: " + req.uuid);
	logger.debug("Sign Up: Device Type" + JSON.stringify(req.device));
	logger.debug("Cookies: " + util.inspect(req.cookies));
	logger.debug("Body: " + util.inspect(req.body));

	// Delegate to Service
	userService.fetchAllUsers(function cb(users) {

		// Render view
		res.render("users", {"userList": users});
		return;		

	});

}


// Interface
module.exports = {
	"init": init,
	"fetchAllUsers": fetchAllUsers,
	"renderAllUsers": renderAllUsers
}
