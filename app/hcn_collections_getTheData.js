



module.exports = new function() {
	var mysql_queries       = require('./models/mysql_queries_hcn_collections')
    , filename            =  __filename.replace(appRoot, '.');


	/**
	 * return Collections typs
	 * @returns {Object} - Subcat(s)
	 */
    this.getCollectionTypes = function( collections_datas, res ) {
		 mysql_queries.getCollectionTypes( function(datas) {
		    console.log(filename + ":getCollectionBy(): HAS " + datas.length);
	        collections_datas( datas.length > 0 ? datas : { warning: global.MSG.no_results } )
		}, res);
    }
	/**
	 * return Collections typs
	 * @returns {Object} - Subcat(s)
	 */
    this.getAllCollections = function( collections_datas, res ) {
		 mysql_queries.getAllCollections( function(datas) {
		    console.log(filename + ":getAllCollections(): HAS " + datas.length);
	        collections_datas( datas.length > 0 ? datas : { warning: global.MSG.no_results } )
		}, res);
    }

	/**
	 * return Collections if not collections_id passed
	 * @param   {Int} collections_id - Optional Subcategory ID
	 * @returns {Object} - Subcat(s)
	 */
    this.getCollectionBy = function( collections_id, collections_datas, res ) {
		 mysql_queries.getCollectionBy_(collections_id, function(datas) {
		    console.log(filename + ":getCollectionBy(): HAS " + datas.length);
	        collections_datas( datas.length > 0 ? datas : { warning: global.MSG.no_results } )
		}, res);
    }


	/**
	 * return Subcategory with Articles
	 * @param   {Int} subcat_id - Optional Subcategory ID
	 * @returns {Object} - Subcat(s) and Articles associated with the subcat
	 */
    this.getCollectionBy_articles = function( collections_id, collections_datas, res ) {
		this.getCollectionBy(collections_id, function(datas) {
			mysql_queries.getCollectionBy_articles(collections_id, function(datas2) {
		        console.log(filename , "::GET Articles FOR  ID: " + collections_id);
		        console.log(filename , "::Count: " + datas2.length);
		        if( datas.length > 0 ) {
			        datas[0].articles = datas2.length > 0 ? datas2 : { warning: global.MSG.no_results };
			        collections_datas( datas.length > 0 ? datas : { warning: global.MSG.no_results } );
		        } else {
		        	collections_datas( { warning: global.MSG.no_results } )
		        }
			}, res);
		}, res);
    }

}