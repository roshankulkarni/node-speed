//
// User Service Example
// @author Roshan
//

// Dependencies
var log4js = require('log4js'); 
var config = require('config');

// Logger
var logger = log4js.getLogger('UserService');

// Models
var connection = app.db.getConnection();
var UserModel = connection.model('User');

//
// Create New User
//
function createUser() {

	// New User
	var data = {
		fName: 'John',
		lName: 'Doe'
	};
	logger.debug("Creating New User: %s", JSON.stringify(data));

	// Persist a User
	var user = new UserModel(user);
	user.save();
	return user;

}

//
// Fetch All Users
//
function fetchAllUsers(cb) {
	logger.debug("Fetching all users.");
	UserModel.find(function(err, users) {
		logger.debug("User Data: %s", JSON.stringify(users));
		cb(users);
	});
	return true;	
}

// Interface
module.exports = {
	createUser: createUser,
	fetchAllUsers: fetchAllUsers
}
