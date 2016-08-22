// npm install should winston supertest assert mocha describe mocha-clean --save-dev
var should = require('should'),
  prev = should.extend('must', Object.prototype),
  assert = require('assert'),
  request = require('supertest');

//=======================================
//=======================================
// var express = require('express'),
//     ROOT_DIR = __dirname + '/../..',
//     config = require('../configs/configs.json'),
//     bodyParser = require('body-parser'),
//     app = express();
//  // all environments
//  app.use(bodyParser.urlencoded({
//      extended: true
//  }));
//  app.use(bodyParser.json());
exports.hexToRgb = function(hex) {

  var red = parseInt(hex.substring(0, 2), 16);
  var green = parseInt(hex.substring(2, 4), 16);
  var blue = parseInt(hex.substring(4, 6), 16);

  return [red, green, blue];

};

// exports.check_catch = function( done, f ) {
//   try {
//     f();
//     done();
//   } catch( e ) {
//     done( e );
//     // done(new Error('Acutal: ['+ e.actual + '] Expected [' + e.operator + ']'));
//   }

// };


function check_catch(done, f) {
  setTimeout(function() {
      try {
        f();
        done();
      } catch (e) {
        done(e);
        // done(new Error('Acutal: ['+ e.actual + '] Expected [' + e.operator + ']'));
      }
    }
    , 1000);
}
var http = require("http");
var url = require("url");
function get_path_name_last( the_url, callback ) {
  var pathname = url.parse('http://localhost/collections/1988/?test=bac&test1=123').pathname;
  return callback( pathname.split('/').filter(function (s) { return !!s }).pop() );
}
//=======================================
//=======================================



describe('Routing', function() {
  var url = 'http://localhost:3000';
  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  //  before(function(done) {
  //    // In our tests we use the test db
  //    // mongoose.connect(config.db.mongodb);
  //    done();
  //  });

  //    beforeEach(function(){
  //    // Done to prevent any server side console logs from the routes
  //    // to appear on the console when running tests
  //        console.log=function(){};
  //
  //    });


  // use describe to give a title to your test suite, in this case the tile is "Account"
  // and then specify a function in which we are going to declare all the tests
  // we want to run. Each test starts with the function it() and as a first argument
  // we have to provide a meaningful title for it, whereas as the second argument we
  // specify a function that takes a single parameter, "done", that we will use
  // to specify when our test is completed, and that's what makes easy
  // to perform async test!
  describe('Collections', function() {
    var ths_uri = '/api/collections/1988';
    it('should GET collection: ' + ths_uri, function(done) {
      this.slow(20);
      this.timeout(500);
      var profile = {
        //    firstName: 'ron',
        //    lastName: 'chu'
      };
      // once we have specified the info we want to send to the server via POST verb,
      // we need to actually perform the action on the resource, in this case we want to
      // POST on /api/profiles and we want to send some info
      // We do this using the request object, requiring supertest!
      request(url)
        .get(ths_uri)
        .send(profile)
        // end handles the response
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(200);
          done();
        });
    });
    it('should not DELETE collection: ' + ths_uri, function(done) {
      this.slow(10);
      this.timeout(500);
      request(url)
        .delete(ths_uri)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(401);
          done();
        });
    });
    it('should not PUT collection: ' + ths_uri, function(done) {
      this.slow(10);
      this.timeout(500);
      request(url)
        .delete(ths_uri)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(401);
          done();
        });
    });
    it('should POST collection: ' + ths_uri, function(done) {
      this.slow(10);
      this.timeout(500);
      request(url)
        .post(ths_uri)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.be.equal(200);
          done();
        });
    });

    var ths_uri = '/api/collections/living-with-crohns';
    it('should correctly return JSON for ' + get_path_name_last(ths_uri, function(slug){return slug}), function(done) {
      this.slow(25);
      this.timeout(1500);
      var body = {
        //    firstName: 'ron',
        //    lastName: 'chu'
      };
      request(url)
        .get(ths_uri)
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200) //Status code
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          // HTTP status should be 200
          // res.status.should.equal(200);
          //----> https://shouldjs.github.io/#assertion-containdeep
          // https://mochajs.org/
          // Should.js fluent syntax applied
          check_catch(done, function() {
            res.body[0].should.have.property('hcn_page_id').which.is.a.Number(); //.be.a.String();
            'foobar'.should.match(/^foo/);
            //      res.body[0].hcn_page_id.should.equal(1898);
            res.body[0].hcn_page_id.should.match(/^[0-9]{4}/);
            res.body[0].hcn_page_type.should.match(/^(st|lblna|default)$/);
            res.body[0].hcn_sponsor_ad_category1.should.not.equal(null);
            //      res.body[0].hcn_sponsor_display_title.must.startWith('Living');
            res.body[0].hcn_sponsor_display_title.should.match(/^living/i);
          // done();
          });
        });
    });


    it('Force ERROR catch test: ' + ths_uri, function(done) {
      this.slow(10);
      // this.timeout(500);
      request(url)
        .get(ths_uri)
        .end(function(err, res) {

          check_catch(done, function() {
            // res.body[0].hcn_page_type.should.match(/^(st|xlbln|default)$/);
            res.body[0].hcn_sponsor_display_title.must.startWith('living');
          });

          // try {
          //     res.body[0].hcn_page_type.should.match(/^(st|xlbln|default)$/);
          //     done();
          // }
          // catch (err) {
          //   console.log(err)
          //   // done(err.actual + '==' + err.operator);
          //   done(err);
          // }

        });
    });


  });
});