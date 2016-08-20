/*
 * Routes for Collecctions API
 */

module.exports = (function() {
	var express    = require('express')        // call express
	// , mysql_connection       = require('../app/models/mysql_connector_export')
	, mysql_queries       = require('../app/models/mysql_queries')
	// ROUTES FOR OUR API
	// get an instance of the express Router
	, router = express.Router();


	// middleware to use for all requests
	router.use(function(req, res, next) {
	    // do logging
	    console.log((new Date).toUTCString() + '===>API Call made:' + req.method);
	    next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
	    res.json({ message: 'This is the Collections API!' });
	});


	// more routes for our API will happen here
	// on routes that end in /collections
	// ----------------------------------------------------
	router.route('/collections')
	    // get all the collections (accessed at GET http://localhost:port/api/collections)
	    .get(function(req, res) {
			 mysql_queries.getCollectionBy_(req.params.collections_id, function(collections_datas) {
		        console.log("GET ID: " + req.params.collections_id);
		        console.log("Count: " + collections_datas.length);
		        res.json(collections_datas);
			}, res);
	    })
	    .post(function(req, res) {
			mysql_connection.query('SELECT * from thcn_node LIMIT 2', function(err, rows, fields) {
				mysql_connection.end();
				if (!err) {
					console.log('Insert Something: ', rows.length);
	            	res.json("Insert Something");
				} else {
					console.log('Error while performing Query.');
				}
			});
	    });



	router.route('/collections/:collections_id')
		.get(function(req, res) {
			 mysql_queries.getCollectionBy_(req.params.collections_id, function(collections_datas) {
		        console.log("GET ID: " + req.params.collections_id);
		        console.log("Count: " + collections_datas.length);
		        res.json(collections_datas);
			}, res);
	    })
	    .post(function(req, res) {
	        console.log("Insert ID: " + req.params.collections_id);
	        res.json("Insert Something");
	    })
	    .put(function(req, res) {
	    	res.status(401);
	        res.json("UPDATES NOT ALLOWED");
	    })
	    .delete(function(req, res) {
	    	res.status(401);
	        res.json("DELETES NOT ALLOWED");
	    });
	return router;

})();

// module.exports = router