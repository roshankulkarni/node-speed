//
// UserModel
//

// Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema Definition
var userSchema = new Schema({
	fName: String,
	lName: String,
	isActive: Boolean,
	notes: [{note: String, date: Date}]
});

// Model
mongoose.model('User', userSchema);
