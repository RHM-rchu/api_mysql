/*
 * Routes for Collecctions API
 */


const getTheData = require('../app/hcn_collections_getTheData')

module.exports = (function() {
	var express    = require('express')        // call express
	// ROUTES FOR OUR API
	// get an instance of the express Router
	, router = express.Router()
    , filename =  __filename.replace(appRoot, '.')


	// middleware to use for all requests
	router.use(function(req, res, next) {
	    // do logging
	    console.log(filename , "::", (new Date).toUTCString() + '===>API Call made:' + req.method);
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
			 getTheData.getCollectionBy(req.params.collections_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    });



	router.route('/collections/types')
		.get(function(req, res) {
			 getTheData.getCollectionTypes( function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    });

	router.route('/collections/:collections_id([a-z]{1,4})')
		.get(function(req, res) {
			 getTheData.getCollectionBy(req.params.collections_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    })
	    .post(function(req, res) {
	        console.log(filename , "::Insert ID: " + req.params.collections_id);
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

	router.route('/collections/:collections_id([0-9]{1,4})')
		.get(function(req, res) {
			 getTheData.getCollectionBy(req.params.collections_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    })
	    .post(function(req, res) {
	        console.log(filename , "::Insert ID: " + req.params.collections_id);
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

	router.route('/collections/:collections_id([0-9]{1,4})/articles')
		.get(function(req, res) {
			 getTheData.getCollectionBy_articles(req.params.collections_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    })
	    .post(function(req, res) {
	        console.log(filename , "::Insert ID: " + req.params.collections_id);
	        res.json("Insert Something");
	    })
	    .put(function(req, res) {
	    	res.status(401);
	        res.json("UPDATES NOT ALLOWED");
	    })
	    .delete(function(req, res) {
	    	res.status(401);
	        res.json("DELETES NOT ALLOWED");
	    })
	    ;
	return router;

})();

// module.exports = router
