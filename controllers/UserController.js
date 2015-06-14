//
// User Controller
//

// Dependencies
var log4js = require('log4js'); 
var express = require("express");
var path = require('path');
var util = require('util');

// Logger
var logger = log4js.getLogger('UserController');

// Service Dependencies
var userService = global.app.services.getService("User");

// Exposed Routes
var router = express.Router();
router.get("/user/create", createUser);
router.get("/user/fetch", fetchAllUsers);
router.get("/user/render2", renderAllUsers);

//
// REST API: Create User
//
function createUser(req, res, next) {

	// Request Trace
	logger.debug("Sign Up: Req UUID: " + req.uuid);
	logger.debug("Sign Up: Device Type" + JSON.stringify(req.device));
	logger.debug("Cookies: " + util.inspect(req.cookies));
	logger.debug("Body: " + util.inspect(req.body));

	// Delegate to Service
	userService.createUser();

	// Generate REST Response
	res.json({
		"fName": "John",
		"lName": "Doe"
	});
	return;
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
module.exports = router;
