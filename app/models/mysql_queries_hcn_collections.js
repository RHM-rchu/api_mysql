/*
 * SQL transactions for MYSQL
 */
var mysql_connection       = require('./mysql_connector');

module.exports = new function() {
	// var mysql_connection       = require('./mysql_connector')
    var filename =  __filename.replace(appRoot, '.')


    this.getCollectionTypes = function( collections_datas ) {

        var sql = `
SELECT hp.hcn_type AS type from thcn_hcn_pages hp GROUP BY hp.hcn_type;
`;
        mysql_connection.connection.query(sql, function(err, rows, fields) {

            if (!err) {
                collections_datas(rows);
            } else {
                console.log('Error while performing Query.');
                console.log(err);
                res.status(500);
                collections_datas('Query Error');
            }

        });
    }
	// this.getCollectionByID = function(data, collection_name, blocks, onlysponsored, callbackSuccess, callbackErr) {
    this.getCollectionBy_ = function(collection_id, collections_datas, res) {

        var sql_where;
        if(typeof collection_id != "undefined" && collection_id.match(/^\d+$/)){
        // if (typeof collection_id == "number" && !isNaN(collection_id)) {
            sql_where = `hp.id = ${collection_id}`;
        } else if (typeof collection_id === 'string' || collection_id instanceof String) {
            switch (collection_id)
            {
                case 'lbln':
                    sql_where = `hp.hcn_type = 'lbln'`;
                    break;
                case 'st':
                    sql_where = `hp.hcn_type = 'st'`;
                    break;
                case 'ct':
                    sql_where = `hp.hcn_type = 'ct'`;
                    break;
                case 'mm':
                    sql_where = `hp.hcn_type = 'mm'`;
                    break;
                case 'default':
                    sql_where = `hp.hcn_type = 'default'`;
                    break;
                default:
                    sql_where = `ualias.alias LIKE '%${collection_id}%'`;
                    break;
            }

        }
        console.log(filename , "::sql_where: " + sql_where)
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


    CASE
        WHEN hp.hcn_type = 'lbln'
        THEN CONCAT(
            'cm.ver.lbln',
            IF( spons.hcn_sponsor_ad_category1 = '' || spons.hcn_sponsor_ad_category1 IS NULL, (SELECT field_ad_site_subcategory_value FROM thcn_field_data_field_ad_site_subcategory t1 WHERE t1.bundle='sub_categories' AND t1.entity_id=t_subca.tid LIMIT 1), spons.hcn_sponsor_ad_category1 )
            )
        WHEN hp.hcn_type = 'st' THEN 'cm.own.tcc'
        WHEN hp.hcn_type = 'ct' THEN 'cm.ver.dacprs'
        ELSE CONCAT(
            'cm.ver.',
            IF( spons.hcn_sponsor_ad_category1 = '' || spons.hcn_sponsor_ad_category1 IS NULL, (SELECT field_ad_site_subcategory_value FROM thcn_field_data_field_ad_site_subcategory t1 WHERE t1.bundle='sub_categories' AND t1.entity_id=t_subca.tid LIMIT 1), spons.hcn_sponsor_ad_category1 )
            )
    END AS ad_tag,

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
    thcn_hcn_sponsor_info spons ON hp.id=spons.hcn_page_id

      INNER JOIN
    thcn_url_alias ualias ON ualias.source = CONCAT('hcn_page/', CAST(hp.id AS CHAR))
    #thcn_url_alias ualias ON ualias.pid = seo.hcn_url_alias_id

        LEFT JOIN
    thcn_taxonomy_term_data t_super ON t_super.tid = hc.super_category_id
        LEFT JOIN
    thcn_taxonomy_term_data t_categ ON t_categ.tid = hc.category_id
        LEFT JOIN
    thcn_taxonomy_term_data t_subca ON t_subca.tid = hc.sub_category_id
        LEFT JOIN
    thcn_taxonomy_term_data t_phase ON t_phase.tid = hc.phase_id
        LEFT JOIN
    thcn_taxonomy_term_data t_topic ON t_topic.tid = hc.topic_id
  ${ typeof sql_where != "undefined" && " WHERE " + sql_where || "" }
`;

        mysql_connection.connection.query(sql, function(err, rows, fields) {


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
        //  ...
        // }
        // catch(err) {
        //  console.log('Error while performing Query.');
        //  console.log(sql);
        // }

        });
    }


	this.getCollectionBy_articles = function(collection_id, collections_datas, res) {

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
		console.log(filename , "::sql_where: " + sql_where)
		var sql = `

SELECT
    SUBSTRING(n.title, 1, 42) AS title,
    n.nid,
    n.uid,
    n.type as pagetype,
#    cs.field_configured_subcategories_value AS subcat,
    hcn_b.block_name AS bname,
    hcn_b.block_machine_name AS bm_name,
    a.hcn_block_id,
    a.hcn_page_id,
    a.flat_display_order,
    a.start_date, a.end_date,
    SUBSTRING(pt.field_page_type_value,
        1,
        5) AS page_type,
   li.field_legacy_id_value AS legacy_id,
    hp.hcn_type,
    hp.id as cid,

    FROM_UNIXTIME(a.start_date, '%m-%d-%Y') AS s_date,
    FROM_UNIXTIME(a.end_date, '%m-%d-%Y') AS e_date,

    subcat.field_pri_subcategory_term_id_value as subcategory_id,
    t_subca.name AS sub_category_name,
    phase.field_pri_phase_term_id_value as phase_id,
    t_phase.name AS phase_name,
    topic.field_pri_topic_term_id_value as topic_id,
    t_topic.name AS topic_name,

    ud.field_display_name_value as auth_display_name,

    promo_title.field_override_title_value AS ptitle,
    promo_type.field_override_type_value AS ptype,
    (SELECT authpromo.field_override_title_value FROM thcn_field_data_field_override_title authpromo WHERE authpromo.entity_id=n.uid AND authpromo.bundle = 'user') as pauth_display_name,
    #(SELECT img.field_crop_images_value FROM thcn_field_data_field_crop_images img WHERE img.entity_id=a.nid) as image,
    (SELECT promo_descript.field_override_description_value FROM thcn_field_data_field_override_description promo_descript WHERE promo_descript.entity_id=a.nid AND promo_descript.bundle=n.type) as pdescription,
    (SELECT legacyurl.field_legecy_url_value FROM thcn_field_data_field_legecy_url legacyurl WHERE legacyurl.entity_id=subcat.field_pri_subcategory_term_id_value) as legacy_subcat_url,

    #(SELECT oi.field_override_image_width, oi.field_override_image_height, fm.fid, fm.type, fm.filename, fm.filemime, fm.filesize FROM thcn_field_data_field_override_image oi INNER JOIN thcn_file_managed fm on fm.fid=oi.field_override_image_fid WHERE oi.entity_id=n.nid AND oi.entity_type='node' AND fm.type='image' AND fm.status=1 LIMIT 1) as promo_image_src
    (SELECT fm.filename FROM thcn_field_data_field_upload_image ui INNER JOIN thcn_file_managed fm on fm.fid=ui.field_upload_image_fid WHERE ui.entity_id=n.nid AND ui.entity_type='node' AND fm.type='image' AND fm.status=1 LIMIT 1) as image_main_src,
    (SELECT fm.filename FROM thcn_field_data_field_override_image oi INNER JOIN thcn_file_managed fm on fm.fid=oi.field_override_image_fid WHERE oi.entity_id=n.nid AND oi.entity_type='node' AND fm.type='image' AND fm.status=1 LIMIT 1) as image_promo_src,
    (SELECT fm.filename FROM thcn_field_data_field_override_image_rr oirr INNER JOIN thcn_file_managed fm on fm.fid=oirr.field_override_image_rr_fid WHERE oirr.entity_id=n.nid AND oirr.entity_type='node' AND fm.type='image' AND fm.status=1 LIMIT 1) as image_promorr_src,

    CASE
        WHEN n.type = 'sharepost_feeds' THEN (SELECT field_legacy_url_value FROM thcn_field_data_field_legacy_url WHERE bundle='sharepost_feeds' AND entity_id=a.nid)
        ELSE (SELECT a.alias FROM thcn_url_alias a WHERE a.source=concat('node/',a.nid) order by pid DESC limit 1)
    END as url,

    ex_col.field_exclude_from_collection_value as exclude_from_collection


FROM
    thcn_hcn_block_articles a
        LEFT JOIN
    thcn_node n ON n.nid = a.nid
        LEFT JOIN
    thcn_field_data_field_override_title as promo_title ON (promo_title.entity_id=a.nid AND promo_title.bundle != 'user')
        LEFT JOIN
    thcn_field_data_field_override_type as promo_type ON (promo_type.entity_id=a.nid)
        LEFT JOIN
    thcn_field_data_field_page_type pt ON a.nid = pt.entity_id
        LEFT JOIN
   thcn_field_data_field_legacy_id li ON a.nid = li.entity_id
       LEFT JOIN
    thcn_field_data_field_configured_subcategories cs ON a.nid = cs.entity_id
        LEFT JOIN
    thcn_hcn_blocks hcn_b ON hcn_b.hcn_block_id = a.hcn_block_id
      LEFT JOIN
    thcn_field_data_field_exclude_from_collection ex_col ON ex_col.entity_id=a.nid

        LEFT JOIN
    thcn_hcn_pages hp ON hp.id=a.hcn_page_id
      LEFT JOIN
    thcn_field_data_field_pri_subcategory_term_id subcat ON (subcat.entity_id=n.nid AND subcat.entity_type='node')
      LEFT JOIN
    thcn_taxonomy_term_data t_subca ON t_subca.tid = subcat.field_pri_subcategory_term_id_value
      LEFT JOIN
    thcn_field_data_field_pri_phase_term_id phase ON (phase.entity_id=n.nid AND phase.entity_type='node')
      LEFT JOIN
    thcn_taxonomy_term_data t_phase ON t_phase.tid = phase.field_pri_phase_term_id_value
      LEFT JOIN
    thcn_field_data_field_pri_topic_term_id topic ON (topic.entity_id=n.nid AND topic.entity_type='node')
      LEFT JOIN
    thcn_taxonomy_term_data t_topic ON t_topic.tid = topic.field_pri_topic_term_id_value

    INNER JOIN thcn_users u ON u.uid=n.uid
    LEFT JOIN thcn_field_data_field_display_name ud ON ( u.uid=ud.entity_id AND ud.bundle='user' )


WHERE
  ${sql_where}
;
`;

		mysql_connection.connection.query(sql, function(err, rows, fields) {

			if (!err) {
				collections_datas(rows);
			} else {
                console.log('Error while performing Query.');
				console.log(err);
		    	res.status(500);
				collections_datas('Query Error');
			}

		});
	}


}