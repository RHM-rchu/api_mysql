/*
 * SQL transactions for MYSQL
 */
var mysql_connection       = require('./mysql_connector');

module.exports = new function() {
	// var mysql_connection       = require('./mysql_connector')



	// this.getCollectionByID = function(data, collection_name, blocks, onlysponsored, callbackSuccess, callbackErr) {
	this.getCollectionBy_ = function(collection_id, collections_datas, res) {

		var sql_where;
		if(collection_id.match(/^\d+$/)){
		// if (typeof collection_id == "number" && !isNaN(collection_id)) {
			sql_where = `hp.id = ${collection_id}`;
		} else if (typeof collection_id === 'string' || collection_id instanceof String) {
			sql_where = `ualias.alias LIKE '%${collection_id}%'`;
		} else {
	    	res.status(400);
			collections_datas('Bad Request');
		}
		console.log(sql_where)
		var sql = `
SELECT
  (SELECT
            COUNT(*)
        FROM
            thcn_hcn_block_articles hba
        WHERE
            hba.hcn_page_id = hp.id
        GROUP BY hba.hcn_page_id) AS articlecount,
    hp.id as hcn_page_id,
    hp.hcn_type as hcn_page_type,
    seo.hcn_seo_info_id, seo.phase_topic_mapping_id, seo.hcn_seo_title, seo.hcn_seo_desc, seo.hcn_seo_keywords, seo.hcn_twitter_title, seo.hcn_twitter_desc, seo.hcn_facebook_title, seo.hcn_facebook_desc, seo.hcn_ad_tag, seo.hcn_tracking_code, seo.hcn_page_description, seo.hcn_ad_zone, seo.hcn_url_alias_id, seo.show_also_see, seo.leaderboard_header, seo.leaderboard_footer, seo.hcn_right_rail_promo, seo.hcn_show_pagination,
    spons.hcn_sponsor_id, spons.phase_topic_mapping_id, spons.hcn_sponsor_name, spons.hcn_sponsor_condition, spons.hcn_sponsor_display_title, spons.hcn_sponsor_type, spons.hcn_sponsor_logo, spons.hcn_sponsor_link, spons.hcn_sponsor_code, spons.hcn_sponsor_ad_category1, spons.hcn_sponsor_ad_category2, spons.hcn_sponsor_ad_custom_criteria, spons.hcn_right_rail_promo, spons.hcn_sponsor_kw, spons.leaderboard_header, spons.leaderboard_footer,
    DATE_FORMAT(hp.created, '%m-%d-%Y') AS collection_created_date,

    CONCAT('/', ualias.alias) AS url_collection,

    super_category_id,
    t_super.name AS super_category_name,
    category_id,
    t_categ.name AS category_name,
    sub_category_id,
    t_subca.name AS sub_category_name,
    TRIM( LEADING '/' FROM (SELECT legacyurl.field_legecy_url_value FROM thcn_field_data_field_legecy_url legacyurl WHERE legacyurl.entity_id=hc.sub_category_id) ) as legacy_subcat_url,
    phase_id,
    t_phase.name AS phase_name,
    topic_id,
    t_topic.name AS topic_name

FROM
    thcn_hcn_pages hp
      INNER JOIN
    thcn_hcn_categorizations hc ON hc.id=hp.mapping_id
      LEFT JOIN
    thcn_hcn_seo_info seo ON hp.id=seo.hcn_page_id
      LEFT JOIN
    thcn_hcn_sponsor_info spons ON seo.hcn_page_id=spons.hcn_page_id

      INNER JOIN
    thcn_url_alias ualias ON ualias.source = CONCAT('hcn_page/', CAST(hp.id AS CHAR))
    #thcn_url_alias ualias ON ualias.pid = seo.hcn_url_alias_id

        INNER JOIN
    thcn_taxonomy_term_data t_super ON t_super.tid = hc.super_category_id
        INNER JOIN
    thcn_taxonomy_term_data t_categ ON t_categ.tid = hc.category_id
        INNER JOIN
    thcn_taxonomy_term_data t_subca ON t_subca.tid = hc.sub_category_id
        LEFT JOIN
    thcn_taxonomy_term_data t_phase ON t_phase.tid = hc.phase_id
        LEFT JOIN
    thcn_taxonomy_term_data t_topic ON t_topic.tid = hc.topic_id
    WHERE
  ${sql_where}
`;


		mysql_connection.connection.query(sql, function(err, rows, fields) {

			// mysql_connection.end();
			// purgeCache('./mysql_connector');

			// for (var i = 0; i < rows.length; i++) {
			//     console.log('NID: ', rows[i].nid);
			//     console.log('Type: ', rows[i].type);
			//     console.log('Title: ', rows[i].title);
			// }
			if (!err) {
				collections_datas(rows);
			} else {
				console.log('Error while performing Query.');
		    	res.status(500);
				collections_datas('Query Error');
		        // res.json("Query Error");
				// console.log(sql);
				// throw new Error(sql);
			}
		// try{
		// 	...
		// }
		// catch(err) {
		// 	console.log('Error while performing Query.');
		// 	console.log(sql);
		// }

		});
	}


}