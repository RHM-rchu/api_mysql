/*
 * Routes for Collecctions API
 */
// import article from './healthcommunities_getTheData'



const getTheData = require('../../app/healthcommunities_getTheData')

module.exports = (function() {
	var express           = require('express')        // call express
	// ROUTES FOR OUR API
	// get an instance of the express Router
	, router              = express.Router()
    , filename            =  __filename.replace(appRoot, '.')


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
	// on routes that end in /subcat
	// ----------------------------------------------------
	router.route('/subcat')

	    // get all the collections (accessed at GET http://localhost:port/api/subcat)
	    .get(function(req, res) {
			 getTheData.getAllSubcategories(req.params.subcat_id, function(subcat_datas) {
		        res.json(subcat_datas);
			}, res);
	    })
	    .post(function(req, res) {
	    	//nothing
	    });

	router.route('/subcat/:subcat_id')
		.get(function(req, res) {
			 getTheData.getSubcategory_articles(req.params.subcat_id, function(subcat_articles) {
		        res.json(subcat_articles);
			}, res);
	    })
	    .post(function(req, res) {
	        console.log(filename , "::Insert ID: " + req.params.subcat_id);
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




	router.route('/collections')
		.get(function(req, res) {
			 getTheData.getAllCollections(req.params.collection_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    })
	    .post(function(req, res) {
	        console.log(filename , "::Insert ID: " + req.params.collection_id);
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

	router.route('/collections/:collection_id')
		.get(function(req, res) {
			var collection_id = req.params.collection_id;
			getTheData.getAllCollections(collection_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    });
	router.route('/collections/:collection_id/articles')
		.get(function(req, res) {
			var collection_id = req.params.collection_id;
			getTheData.getCollection_articles(collection_id, function(collections_datas) {
		        res.json(collections_datas);
			}, res);
	    });


	return router;

})();

// module.exports = router
