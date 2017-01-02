



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
	        collections_datas( datas )
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
	        collections_datas( datas )
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
		        datas[0].articles = datas2;
		        collections_datas( datas );
			}, res);
		}, res);
    }

}