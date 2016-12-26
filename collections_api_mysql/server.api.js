var express     = require("express")
  , app         = express()
  , bodyParser  = require('body-parser')
  , DotEnv = require('dotenv-node')
  , server_port = process.env.PORT || 3000;
new DotEnv();

global.appRoot = __dirname;

var filename =  __filename.replace(appRoot, '.')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', require('./routes/collections'));


// START THE SERVER
// =============================================================================
app.listen(server_port);
console.log(filename , '::Running on port ' + server_port);