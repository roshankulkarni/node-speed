# NodeSpeed Framework

## Framework Structure

Below is the list of capabilities supported by the Node Speed framework:

+ Request Controllers
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


## Framework Dependencies

We've leveraged several popular and proven NPM modules from the community to assemble this framework together.

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

# Configuration of Logger

## Category Levels:
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

# Quick Dev-Debug Cycles

Make your code-run-debug cycles go faster. Use nodemon to auto-restart your app upon code changes.
https://github.com/remy/nodemon

To install nodemon globally:
	$ sudo npm install -g nodemon

To run nodemon for your app:
	$ nodemon app.js

# Authors

Roshan Kulkarni, Mindstix Software Labs
