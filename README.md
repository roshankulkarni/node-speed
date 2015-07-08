# Welcome to NodeSpeed!

NodeSpeed is a full stack application framework (powered by Node.js) that helps you rapidly build
enterprise-grade REST APIs or micro services in Node.js. It brings together the 'best of breed' components
from the NPM community so that you accelerate your development of Node-powered middlewares and REST 
services.


## Features

NodeSpeed supports the following powerful set of features:

+ Controllers to Handle Inbound Requests (Route Mappings to Controllers)
+ A Powerful Request Validation Framework
+ Custom Request Interceptors
+ Services Layer (To Encapsulate Your Business Logic)
+ MongoDB Integration
+ Mongoose Based Data Models
+ Configuration Manager with Support for Multiple Environments
+ Logger with Log Rotation
+ Dust Template Integration
+ Delivery of Static Assets
+ Tagging All Inbound Requests
+ Identifying Client Device Types


## Application Structure

Directory                     | Purpose
------------------------------|----------------------------
/application/config/          | Config files.                           
/application/routes/          | Route definitions for controllers and interceptors.                           
/application/interceptors/    | Request interceptors.
/application/validators/      | Request validation schema files.
/application/controllers/     | Controller files.
/application/services/        | Services to encapsulate your business logic.                           
/application/models/          | Mongoose schema and model definitions.                           
/application/views/           | Dust template views.
/application/public/          | Public static assets (CSS, JS, Images).
				

## Framework Bootstrapping Process

+ Initialize Configuration Manager
+ Initialize Logger
+ Create Express App
+ Mount Middlewares:
  + Domain Handler Middleware (Async errors during request processing)
  + Cookie Parser
  + Body Parser
  + Request Tagger
  + User Agent Identifier
  + Catch-all error handling middleware (Sync errors during request processing)
+ Configure DUST Template Engine
+ Instantiate All the Defined Mongo Models
+ Instantiate All Service Layer Modules
+ Mount Request Interceptors (Based on Interceptor Definitions)
+ Mount Validation Middleware (Based on Route Definitions)
+ Mount Controllers (Based on Route Definitions)


## Route Definition

Route definition specifies how an inbound request should be mapped to a specific controller. Routes are
defined in the /application/routes/controllers/ directory and a typical route definition looks like this:

	{
		"requestUri": "/user/fetchAll",
		"httpMethod": "get",
		"handler": "/MyController.fetchAllUsers",
		"validatorSchema": "/fetchAllUsers"
	}

Key                 | Purpose
------------------------------|----------------------------
requestUri          | Inbound request URI to be matched.
httpMethod          | HTTP method (GET, POST, PUT, DELETE etc.)
handler          	| Name of the controller module and method in /application/controllers
validatorSchema     | Name of the validator file in /application/validators/


## Request Validation Framework

'Front Validation' is a powerful tactic for defensive programming which helps you write robust web services. 
NodeSpeed strongly encourages you to define validation rules for each REST API that you implement. 

For each route defined in your application, you can specify a bunch of validation rules which are to be applied 
when the HTTP request hits the framework. Validation rules are specified using a 'Object Schema Definition'. We use the powerful 
Joi framework which offer Object-schema based validations.

Validation rules (schemas) can be put in this directory:

	application/validators/

Each such schema file specifies the validation rules using the Joi schema format. For example:

	var Joi = require('joi');
	module.exports = {
		cookies: {
			myCustomCookie: Joi.string().valid("someValue")
		}
	};

Once you create the validation schema file, you can associate this validation rule with a route by specifying the
"validatorSchema" key in the route definition:

	"routes": [
		{
			"requestUri": "/user/fetchAll",
			"httpMethod": "get",
			"handler": "/MyController.fetchAllUsers",
			"validatorSchema": "/fetchAllUsers"
		}
	]

This validation framework allows you to validate several parts of the inbound request as given below:

Keys in the Validation Schema  | Purpose
-------------------------------|----------------------------
params 						   | Validate contents of named URI segments
query 						   | Validate contents of query string parameters
cookie 						   | Validate contents of cookies
body 						   | Validate contents of request body


## Framework Dependencies

We've stitched together several popular and proven NPM modules from the community to assemble this framework.

###1. Logger:
https://github.com/nomiddlename/log4js-node
Apache 2.0 License

###2. Configuration Manager:
https://github.com/lorenwest/node-config
MIT License

###3. Express JS:
http://expressjs.com/

###4. Underscore JS:
http://underscorejs.org/

##5. Joi Object Schema Validation Framework:
https://github.com/hapijs/joi

###5. Adaro for Dust Templates:
https://github.com/krakenjs/adaro

## Configuration of Logger

### Category Levels:
https://github.com/nomiddlename/log4js-node/wiki/Category-levels

### Supported Levels:
+ ALL
+ TRACE
+ DEBUG
+ INFO
+ WARN
+ ERROR
+ FATAL
+ OFF

## Quick Dev-Debug Cycles

Make your code-run-debug cycles go faster. Use nodemon to auto-restart your app upon code changes.
https://github.com/remy/nodemon

To install nodemon globally:

	$ sudo npm install -g nodemon

To run nodemon for your app:

	$ nodemon app.js


## Backlog Features and Wishlist

+ Front Layer Caching (Redis)
+ HTTP Request Logs / Audit Logs / Log Request
+ Utility to Map Recursive JSON
+ File Management APIs
+ Role Based Access Control
+ Request Stats Tracking
+ Audit Logs
+ Business Object Caching
+ Service Orchestration
+ Connectors (Third Party Calls):
  + SOAP
  + REST
  + Email
  + AD


## Authors

Roshan Kulkarni, Mindstix Software Labs
