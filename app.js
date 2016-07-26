var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = require('express')();
var http = require('http').Server(app);

var url = "mongodb://squiva:kalaloch@ds029725.mlab.com:29725/db_sm_two";
var dta = [];

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var insert = function(data, db, callback) {
   db.collection('blogLoginNew').insertOne(data, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};
var findPosts = function(db, callback) {
   var cursor =db.collection('blogLoginNew').find( );
   var i = 0;
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      i++;
      if (doc != null) {
         console.log(doc);
         dta[i] = doc;
      } else {
         callback();
      }
   });
};
app.get('/main', function(req, res) {
   MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected!");
  
      console.log("Inserted");
      findPosts(db, function() {
          db.close();
      });
    console.log("Done!");
  });
  console.log(dta);
  res.send(dta);
});
app.post('/post', function(req, res){
  var obj = {};
  console.log(req.body);
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected!");
    insert(req.body, db, function() {
          db.close();
      });
    });
    console.log("Done!");
    res.send(req.body);
});
app.get('/index.html', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/style.css');
});
/*http.listen(port, function() {
  console.log("Listening on port 3000");
});*/
http.listen(app.get('port'), function() {
  console.log("Listening on port " + app.get('port'));
});
