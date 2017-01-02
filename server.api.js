var express     = require("express")
  , app         = express()
  , bodyParser  = require('body-parser')
  , DotEnv = require('dotenv-node')
  , fs = require('fs')
  , server_port = process.env.PORT || 3000
;
new DotEnv();
var THEAPP = ( typeof process.env.THEAPP === "string" ) ? process.env.THEAPP : "hcn_collections"
global.appRoot = __dirname;
var filename =  __filename.replace(appRoot, '.');
global.MSG    = require('./config/lang.system.json');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


try {
  stats = fs.lstatSync(appRoot + '/routes/api/' + THEAPP + '.js');
  if ( stats.isFile() ) {
      app.use('/api', require('./routes/api/' + THEAPP));
  } else {
  	app.use('/api', require('./routes/api/hcn_collections'));
  }
}
catch (e) {
	console.log(e)
    console.log("Couldn't open %s", './routes/api/' + THEAPP + '.js')
}



// START THE SERVER
// =============================================================================
app.listen(server_port);
console.log(filename , '::Running on port ' + server_port);