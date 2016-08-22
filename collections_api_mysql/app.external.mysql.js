var express    = require("express")
  , mysql      = require('mysql')
  , mysql_connection = require('./app/models/mysql_connector')
  , app         = express()
  // , app = module.exports = express.createServer()
  , port = process.env.PORT || 3000;        // set our port


app.get("/",function(req,res){
mysql_connection.query('SELECT * from thcn_node LIMIT 2', function(err, rows, fields) {
mysql_connection.end();
 if (!err)
   console.log('The solution is: ', rows);
 else
   console.log('Error while performing Query.');
 });
});


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Running on port ' + port);