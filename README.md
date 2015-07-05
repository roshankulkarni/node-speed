# NodeSpeed Framework

NodeSpeed is a full stack application framework powered by Node.js. NodeSpeed helps you rapidly build
mature REST APIs or micro-services in Node.js. It brings together the 'best of breed' components
from the NPM community so that you accelerate your development of Node-powered middlewares and REST 
services.

## Framework Structure

Below is the list of capabilities supported by the Node Speed framework:

+ Controllers to Handle Inbound Requests
+ Custom Request Interceptors
+ Services Layer
+ MongoDB Integration
+ Mongoose Based Data Models
+ Configuration Manager with Support for Multiple Environments
+ Logger with Log Rotation
+ Dust Template Integration
+ Delivery of Static Assets
+ Tagging All Inbound Requests
+ Identifying Client Device Types

## Framework Bootstrapping

+ Initialize Configuration Manager
+ Initialize Logger
+ Middlewares:
  + Cookie Parser
  + Body Parser
  + Request Tagger
  + User Agent Identifier
+ Configure DUST Template Engine
+ Instantiate All the Defined Mongo Models
+ Instantiate All Services
+ Mount Interceptors
+ Mount Controllers


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

+ Version Support in Controllers
+ Domain
+ Utility to Validate Recursive JSON
+ Utility to Map Recursive JSON
+ Connectors (Third Party Calls)
+ Front Layer Caching (Redis)
+ HTTP Request Logs / Audit Logs / Log Request
+ Request Stats


## Authors

Roshan Kulkarni, Mindstix Software Labs
