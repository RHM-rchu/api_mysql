



module.exports = new function() {
	var mysql_queries       = require('./models/mysql_queries_healthcommunities')
    , filename            =  __filename.replace(appRoot, '.');


	/**
	 * return Subcategories if not subcat_id passed
	 * @param   {Int} subcat_id - Optional Subcategory ID
	 * @returns {Object} - Subcat(s)
	 */
    this.getAllSubcategories = function( subcat_id, subcat_datas ) {
		 mysql_queries.getAllSubcategories(subcat_id, function(datas) {
		    console.log(filename + ":getAllSubcategories(): HAS " + datas.length);
	        subcat_datas( datas )
		});
    }

	/**
	 * return Subcategory with Articles
	 * @param   {Int} subcat_id - Optional Subcategory ID
	 * @returns {Object} - Subcat(s) and Articles associated with the subcat
	 */
    this.getSubcategory_articles = function( subcat_id, subcat_articles ) {
    	this.getAllSubcategories( subcat_id, function( subcat_datas ) {
			mysql_queries.getSubcategory_articles( subcat_datas[0].cat_id, function(subcat_article) {
				console.log(filename , ":getAllSubcategories():GET Subcat ID:" + subcat_datas[0].cat_id);
				console.log(filename , ":getAllSubcategories():Count: " + subcat_article.length);
				if(subcat_article.length > 0){
					subcat_datas[0].articles = subcat_article;
				}
    			subcat_articles( subcat_datas )
			});
    	});
    }



	/**
	 * return Subcategories if not subcat_id passed
	 * @param   {Int} subcat_id - Optional Subcategory ID
	 * @returns {Object} - Subcat(s)
	 */
    this.getAllCollections = function( collection_id, coll_datas ) {
		mysql_queries.getAllCollections(collection_id, function(datas) {
	        console.log(filename , "::GET COLLECTTION ID: " + collection_id);
	        console.log(filename , "::Count: " + datas.length);
	        coll_datas( datas );
		});
    }

	/**
	 * return Subcategories if not subcat_id passed
	 * @param   {Int} subcat_id - Optional Subcategory ID
	 * @returns {Object} - Subcat(s)
	 */
    this.getCollection_articles = function( collection_id, coll_datas ) {
    	this.getAllCollections( collection_id, function( collections_datas ) {
	        console.log(filename , "::GET ID: " + collection_id);
	        console.log(filename , "::Count: " + collections_datas.length);
	        if(collections_datas.length == 1){
	        	console.log("FOUND id: %d", collections_datas[0].id);
				mysql_queries.getCollection_articles(collections_datas[0].id, function(collection_articles) {
					console.log(filename , "::GET articles ID: " + collections_datas[0].id);
					console.log(filename , "::Count: " + collection_articles.length);
					if(collection_articles.length > 0){
						/*
						 * Get articles for each tab and promo titles
						 *
						 * Set Variables
						 * @query_str     (String) set mysql query for IN cluase
						 * @promoTitleIDs (Array) array of post_id and promo titles
						 */
						var promoTitleIDs = {};
						var query_str='';
						for (var tabID in collection_articles) {
						    var str = collection_articles[tabID].override_title;
						    var arr = str.toString().split("|\=\=|");
							var theArticals = [];
						    for (var key2 in arr) {
							    var str2 = arr[key2];
							    var arr2 = str2.toString().split("|::|");
							    var theID = (arr2[0] != "undefined" ? arr2[0] : 0);
							    var theTitle = (arr2[1] != "undefined" ? decodeURI( arr2[1].replace(/\+/g, ' ').trim() ) : "");
								theArticals[key2] = { post_id : theID, title : theTitle };
							    query_str += (query_str != "" ? ", " + theID : (theID > 0 ? theID : '') );
							}
							promoTitleIDs[tabID]=theArticals;
						}


						mysql_queries.getSubcategory_articles(query_str, function(_article_datas) {
							console.log(filename , "::GET Articles IDs " );
							console.log(filename , "::Count: " + _article_datas.length);
							/*
							 * store ojected elements in array has using post_id as key
							 */
							var article_datas = _article_datas.reduce(function(map, obj) {
							    map[ obj.post_id ] = obj;
							    return map;
							}, {});
								for( var tab in promoTitleIDs ) {
									if( typeof collection_articles[tab] != "undefined") {
										collection_articles[tab].articles=[];
										delete collection_articles[tab].override_title;
										for( var key in promoTitleIDs[tab] ) {
											article_datas[promoTitleIDs[tab][key].post_id].promotitle = promoTitleIDs[tab][key].title;
											collection_articles[tab].articles.push(article_datas[promoTitleIDs[tab][key].post_id]);
										}
									}
								}
								mysql_queries.getCollection_promos(collection_id, function(collection_promos) {
									var promoUnits = {};
									for (var tabID in collection_promos) {
										var articletype = collection_promos[tabID].articletype;
										if( ! promoUnits.hasOwnProperty(articletype) ) {
											promoUnits[articletype] = [];
										}
										promoUnits[articletype].push( collection_promos[tabID] );
									}
									collections_datas[0].tabs = collection_articles;
									collections_datas[0].promos = promoUnits;
									coll_datas( collections_datas );
								});
						});
					} else {
					}
				});
			}
		});
    }



}