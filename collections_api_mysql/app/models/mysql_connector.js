
/*
 * Connect to MYSQL pool connection
 */
var mysql      = require('mysql');

var pool = mysql.createPool(global.config.db);

exports.connection = {
    query: function () {
        console.log('1)MYSQL query');
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
                console.log('2)MYSQL CONN');
                var q = conn.query.apply(conn, queryArgs);
                q.on('end', function () {
                    console.log('3)MYSQL END');
                    conn.release();
                });

                events.forEach(function (args) {
                    console.log('3)MYSQL EVENT');
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




