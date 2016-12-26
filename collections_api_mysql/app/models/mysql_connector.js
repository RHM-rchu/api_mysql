
/*
 * Connect to MYSQL pool connection
 */
var mysql      = require('mysql')
  , pool = mysql.createPool(global.config.db)
  , filename =  __filename.replace(appRoot, '.');

exports.connection = {
    query: function () {
        console.log(filename , '::1)MYSQL query');
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
                console.log(filename , '::2)MYSQL CONN');
                var q = conn.query.apply(conn, queryArgs);
                q.on('end', function () {
                    console.log(filename , '::3)MYSQL END');
                    conn.release();
                });

                events.forEach(function (args) {
                    console.log(filename , '::3)MYSQL EVENT');
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




