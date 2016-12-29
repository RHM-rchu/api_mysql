
/*
 * Connect to MYSQL pool connection
 */
var mysql      = require('mysql')
  , pool = mysql.createPool({
        "connectionLimit" : process.env.DB_CONNECTIONLIMIT,
        "host"     : process.env.DB_HOST,
        "user"     : process.env.DB_USER,
        "password" : process.env.DB_PASSWD,
        "database" : process.env.DB_DATABASE,
        // "debug"    : process.env.DB_DEBUG
    })
  , filename =  __filename.replace(appRoot, '.');

exports.connection = {
    query: function () {

        console.time("mysql_connector")
        console.log(filename , ' 1) MYSQL BEGIN');
        var queryArgs = Array.prototype.slice.call(arguments),
            events = [],
            eventNameIndex = {};

        pool.getConnection(function (err, conn) {
            if (err) {
                if (eventNameIndex.error) {
                    eventNameIndex.error();
                }
            }
            if (conn) {
                console.log(filename , ' 2) MYSQL CONN');
                var q = conn.query.apply(conn, queryArgs);
                q.on('end', function () {
                    console.log(filename , ' 3) MYSQL END');
                    console.timeEnd("mysql_connector")
                    conn.release();
                });

                events.forEach(function (args) {
                    console.log(filename , ' 3) MYSQL EVENT');
                    q.on.apply(q, args);
                });
            }
        });

        return {
            on: function (eventName, callback) {
                events.push(Array.prototype.slice.call(arguments));
                eventNameIndex[eventName] = callback;
                return this;
            }
        };
    }
};




