//
// Middleware to wrap requests in domain and to ensure solid error handling.
// In case of uncaught exceptions or domain errors, the recommended way is to 
// initiate a graceful shutdown of this process. And then, Forever, PM2 or something else
// will respawn a new process worker process using the cluster module.
//
// @author Roshan Kulkarni, Mindstix Labs
//

// Dependencies
var log4js = require('log4js');
var domain = require('domain');
var util = require('util');

// Logger
var logger = log4js.getLogger('ApplicationBootstrap');

//
// Middleware: This middleware function wraps each request within a domain.
// The domain's "on error" handler gets invoked only when errors occur asynchronously.
//
function domainWrappingMiddleware(req, res, next) {

	// Create a new domain to wrap each inbound request.
	var reqDomain = domain.create();

	// Add req and res to the domain since these objects were created before this domain was created.
	reqDomain.add(req);
	reqDomain.add(res);

	// Error handler for this domain.
	reqDomain.on('error', function(err) {
		logger.error("Fatal domain error occured. Triggering a graceful shutdown: %s", util.inspect(err));
		gracefulExit(err, req, res, next);
		return;
	});

	// Continue our processing chain within this domain (Invoke the next middleware or route).
	reqDomain.run(next);

}

//
// Middleware: Catch-all error handler for express. This is where the buck stops!
// Gets invoked only when errors occur synchronously.
//
function errorHandlingMiddleware(err, req, res, next) {

	// Log error object
	logger.error("Fatal error occured. Triggering a graceful shutdown: %s", util.inspect(err));
	gracefulExit(err, req, res, next);
	return;
}

//
// Uncaught exceptions from express (Sync) as well as domain errors (Async) eventually get funneled here.
// We send an error response to the client and then initiate a graceful bounce of this worker process.
// (it would be unhealthy to continue running this process after this fatal error.)
//
function gracefulExit(err, req, res, next) {

	// Give time for in-flight requests to complete before killing this process.
    var killtimer = setTimeout(function() {
          logger.error("Killing worker process.");
          process.exit(1);
    }, 10000);

    // But don't keep this process open just for that!
    killtimer.unref();

    //
    // Attempt to send error response to the client.
    //

	// XHR Request? Send JSON error response.
	if (req.xhr) {
		logger.error(err);
		res.status(500).send({ error: 'Internal Error Occured.' });
		return;
	}

	// Not a XHR Request? Render our standard error view to the client.
	res.status(500);
	res.setHeader('content-type', 'text/plain');
	res.end("Internal server error.");

	// Note: No need to invoke next() as the buck stops here.
	return;

}

// Interface
module.exports = {
	domainWrappingMiddleware: domainWrappingMiddleware,
	errorHandlingMiddleware: errorHandlingMiddleware
}