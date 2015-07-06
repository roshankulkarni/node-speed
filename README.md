# Welcome to NodeSpeed!

NodeSpeed is a full stack application framework (powered by Node.js) that helps you rapidly build
enterprise-grade REST APIs or micro services in Node.js. It brings together the 'best of breed' components
from the NPM community so that you accelerate your development of Node-powered middlewares and REST 
services.

## Framework Structure

Below is the list of capabilities supported by the Node Speed framework:

+ Controllers to Handle Inbound Requests (Route Mappings to Controllers)
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

Directory                       | Purpose
-------------------------------|----------------------------
/application/config/          | Config files.                           
/application/routes/          | Route definitions for controllers and interceptors.                           
/application/controllers/     | Controllers.                           
/application/interceptors/    | Request interceptors.
/application/services/        | Services to encapsulate business logic.                           
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
+ Instantiate All Services
+ Mount Interceptors (Based on Route Definitions)
+ Mount Controllers (Based on Route Definitions)


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


## Wishlist

+ Wrapping Requests in Domain
+ Utility to Validate Recursive JSON
+ Front Validation Strategies for Inbound Requests
+ Connectors (Third Party Calls)
+ Front Layer Caching (Redis)
+ HTTP Request Logs / Audit Logs / Log Request
+ Request Stats
+ Utility to Map Recursive JSON


## Authors

Roshan Kulkarni, Mindstix Software Labs
