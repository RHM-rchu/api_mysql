var express     = require("express")
  , app         = express()
  , bodyParser  = require('body-parser')
  , DotEnv = require('dotenv-node')
  , fs = require('fs')
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
// fs.stat(appRoot + '/routes/' + process.env.THEAPP + '.js', function(err, stat) {
//     if(err == null) {
//         console.log('File exists');
//         app.use('/api', require('./routes/' + process.env.THEAPP));
//     } else if(err.code == 'ENOENT') {
//         // file does not exist
//         console.log("Couldn't open %s", './routes/' + process.env.THEAPP)
//     } else {
//         console.log('Some other error: ', err.code);
//         app.use('/api', require('./routes/collections'));
//     }
// });
try {
    stats = fs.lstatSync(appRoot + '/routes/' + process.env.THEAPP + '.js');
    // if (stats.isDirectory()) {
    if (stats.isFile()) {
        app.use('/api', require('./routes/' + process.env.THEAPP));
    } else {
    	app.use('/api', require('./routes/collections'));
    }
}
catch (e) {
	console.log(e)
    console.log("Couldn't open %s", './routes/' + process.env.THEAPP)
}



// switch (process.env.THEAPP)
// {
//    case "healthcommunities":
//        app.use('/api', require('./routes/' + process.env.THEAPP));
//        break;
//    case "collections":
//    default:
//        app.use('/api', require('./routes/collections'));
//        break;
// }


// START THE SERVER
// =============================================================================
app.listen(server_port);
console.log(filename , '::Running on port ' + server_port);