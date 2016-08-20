var express     = require("express")
  , app         = express()
  , bodyParser  = require('body-parser')
  , config  = require('./configs/configs.json')		//Load configs for this app
  , server_port = process.env.PORT || 3000;

global.config = config;


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
console.log('Running on port ' + server_port);