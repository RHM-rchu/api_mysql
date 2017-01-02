/*
 * SQL transactions for MYSQL
 */
var mysql_connection       = require('./mysql_connector');

module.exports = new function() {
	// var mysql_connection       = require('./mysql_connector')
    var filename =  __filename.replace(appRoot, '.')


	// List subcategories
    this.getAllSubcategories = function(subcat_id, subcat_datas, res) {

        var sql_where ='';
        if(subcat_id !== undefined){
            if(subcat_id.match(/^\d+$/)){
                sql_where = ` AND cc.cat_ID = ${subcat_id}`;
            }
        }
        console.log(filename , "::sql_where: " + sql_where)
        var sql = `
SELECT
    cs.content_specialties_id as specialties_id,
    cs.specialty,
    cs.meta_title as spec_seo_title,
    cs.meta_description as spec_seo_description,
    cc.cat_id,
    cc.cat_name,
    cc.category_description,
    cc.channel,
    cc.directory
FROM
    content_categories cc
        LEFT JOIN
    content_specialties cs ON cc.specialty=cs.content_specialties_id
WHERE
    cc.category_parent = 4 ${sql_where}
ORDER BY cc.category_parent , cc.cat_name;
`;

        mysql_connection.connection.query(sql, function(err, rows, fields) {

        if (!err) {
            subcat_datas(rows);
        } else {
            console.log('Error while performing Query.');
            console.log(err);
            res.status(500);
            subcat_datas('Query Error');
        }

        });
    }


	this.getSubcategory_articles = function(this_id, subcat_articles, res) {
        var sql_where;
        if( typeof this_id === "undefined" ) {
            res.status(400);
            subcat_articles('Bad Request');
        } else if( typeof this_id === "string" ) {
            sql_where = "cp.ID IN ( " + this_id + " )";
        } else if( typeof this_id === "object"  && Object.keys(this_id).length > 0 ) {
            var iterator = Object.keys(this_id);
            sql_where = "cp.ID IN ( " + iterator.toString() + " )";
        } else if( this_id > 0 ){
            sql_where = "content_post2cat.category_id = '" + this_id + "'";
        } else {
            res.status(400);
            subcat_articles('Bad Request');
        }
        console.log(filename , "::this_id: " + this_id);
// (SELECT clc.category_id, cc.cat_name, cc.category_nicename, cc.specialty as specialty_id, cs.specialty, cs.slug FROM content_livingguide_category clc INNER JOIN content_categories cc ON cc.cat_ID=clc.category_id  LEFT JOIN content_specialties cs ON cc.specialty=cs.content_specialties_id WHERE clc.is_primary=1 AND clc.lg_id=cp.ID)
        var sql = `
SELECT
    cp.ID AS post_id,
    cp.post_title,
    #cp.post_content,
    max(CASE WHEN cpm.meta_key ='rc_content_basic_page_header' THEN cpm.meta_value ELSE null END) as subheader,
    max(CASE WHEN cpm.meta_key ='rc_content_basic_originally_published' THEN cpm.meta_value ELSE null END) as url,
    max(CASE WHEN cpm.meta_key ='rc_content_basic_bucket' THEN cpm.meta_value ELSE null END) as bucket,
    max(CASE WHEN cpm.meta_key ='rc_content_basic_reviewed_by' THEN cpm.meta_value ELSE null END) as reviewed_by,
    from_unixtime(max(CASE WHEN cpm.meta_key ='rc_content_basic_last_reviewed_on' THEN cpm.meta_value ELSE null END)) as reviewed_on,
    from_unixtime(max(CASE WHEN cpm.meta_key ='rc_lastmodified' THEN cpm.meta_value ELSE null END)) as lastmodified,
    max(CASE WHEN cpm.meta_key ='rc_content_basic_outside_source' THEN cpm.meta_value ELSE null END) as source,
    max(CASE WHEN cpm.meta_key ='rc_content_template_override_select_template' THEN cpm.meta_value ELSE null END) as template,
    max(CASE WHEN cpm.meta_key ='rc_title_metatags_additional_seo_metatags' THEN cpm.meta_value ELSE null END) as seo_metatags,
    max(CASE WHEN cpm.meta_key ='rc_title_metatags_meta_description' THEN cpm.meta_value ELSE null END) as seo_description,
    max(CASE WHEN cpm.meta_key ='rc_title_metatags_title' THEN cpm.meta_value ELSE null END) as seo_title,
    max(CASE WHEN cpm.meta_key ='rc_content_zones_zone' THEN cpm.meta_value ELSE null END) as zone,
    max(CASE WHEN cpm.meta_key ='rc_content_zones_sub_zone' THEN cpm.meta_value ELSE null END) as subzone
FROM
    content_posts cp
        LEFT JOIN
    content_post2cat ON cp.ID = content_post2cat.post_id
        LEFT JOIN
    content_postmeta cpm ON cpm.post_id=cp.ID
WHERE
    ${sql_where}
GROUP BY post_id
;
`;

		mysql_connection.connection.query(sql, function(err, rows, fields) {

			if (!err) {
				subcat_articles(rows);
			} else {
                console.log('Error while performing Query.');
				console.log(err);
		    	res.status(500);
				subcat_articles('Query Error');
			}

		});
	}



    // List Collections
    this.getAllCollections = function(collection_id, subcat_datas, res) {

        var sql_where ='';
        if(collection_id !== undefined){
            if(collection_id.match(/^\d+$/)){
                sql_where = ` AND content_livingguide_keyword.id = ${collection_id}`;
            }
        }
        console.log(filename , "::sql_where: " + sql_where)
        var sql = `
SELECT
    content_livingguide_keyword.*,
    content_livingguide_brand.brandname
FROM
    content_livingguide_keyword
        LEFT JOIN
    content_livingguide_brand ON content_livingguide_keyword.branding = content_livingguide_brand.id
WHERE
    content_livingguide_keyword.is_active >= '1'
        AND content_livingguide_keyword.is_deleted = '0'
        ${sql_where}
;
`;
        mysql_connection.connection.query(sql, function(err, rows, fields) {

        if (!err) {
            subcat_datas(rows);
        } else {
            console.log('Error while performing Query.');
            console.log(err);
            res.status(500);
            subcat_datas('Query Error');
        }

        });
    }
    this.getCollection_articles = function(collection_id, subcat_articles, res) {
        if(collection_id < 1 ){
            res.status(400);
            subcat_articles('Bad Request');
        }
        console.log(filename , "::collection_id: " + collection_id)
        var sql = `
SELECT
    content_livingguide_tabs.*
FROM
    content_livingguide_tabs
WHERE
    content_livingguide_tabs.livingguide_id = ${collection_id}
ORDER BY content_livingguide_tabs.tab_order;
;
`;

        mysql_connection.connection.query(sql, function(err, rows, fields) {

            if (!err) {
                subcat_articles(rows);
            } else {
                console.log('Error while performing Query.');
                console.log(err);
                res.status(500);
                subcat_articles('Query Error');
            }

        });
    }
    this.getCollection_promos = function(collection_id, subcat_articles, res) {
        if(collection_id < 1 ){
            subcat_articles('');
        }
        console.log(filename , "::collection_id: " + collection_id)
        var sql = `
SELECT
    cf.id, cf.article_order, cf.title, cf.description, cf.photo, cf.overridelgimage, cf.date_create, cf.date_modified,
    cf.post_id, cf.linktitle, cf.linkurl, cf.livingguide_id,
    cf.pagetype, cf.articletype, cf.template
FROM
    content_featuredarticle cf
WHERE
    cf.is_active='1' AND is_deleted='0' AND cf.livingguide_id='${collection_id}'
ORDER BY article_order ASC;
;
`;

        mysql_connection.connection.query(sql, function(err, rows, fields) {

            if (!err) {
                subcat_articles(rows);
            } else {
                console.log('Error while performing Query.');
                console.log(err);
                res.status(500);
                subcat_articles('Query Error');
            }

        });
    }





}