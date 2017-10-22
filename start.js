const fs           = require('fs');
const path         = require('path');
const storage      = require('node-persist');
const contentTypes = require('./utils/content-types');
const sysInfo      = require('./utils/sys-info');
var   env          = process.env;
var   http         = require('http');
var   request      = require('request');
var   util         = require('util');
//var   util         = require('morgan');
var express = require('express'),
    app     = express();

//Object.assign=require('object-assign');

//app.engine('html', require('ejs').renderFile);
//app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
    //mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    //mongoURLLabel = "";

//if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
//  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
//      mongoUser = process.env[mongoServiceName + '_USER'];
//
//  if (mongoHost && mongoPort && mongoDatabase) {
//    mongoURLLabel = mongoURL = 'mongodb://';
//    if (mongoUser && mongoPassword) {
//      mongoURL += mongoUser + ':' + mongoPassword + '@';
//    }
//    // Provide UI label that excludes user id and pw
//    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//
//  }
//}

//var db = null,
//    dbDetails = new Object();
//
//var initDb = function(callback) {
//  if (mongoURL == null) return;
//
//  var mongodb = require('mongodb');
//  if (mongodb == null) return;
//
//  mongodb.connect(mongoURL, function(err, conn) {
//    if (err) {
//      callback(err);
//      return;
//    }
//
//    db = conn;
//    dbDetails.databaseName = db.databaseName;
//    dbDetails.url = mongoURLLabel;
//    dbDetails.type = 'MongoDB';
//
//    console.log('Connected to MongoDB at: %s', mongoURL);
//  });
//};

//http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

app.get('/fvp', function (req, res) {
  res.send('Hello Frank.');
});

app.get('/draw', function (req, res) {
  console.log('Secret Santa List Draw starting...');
  //var ids = req.param('ids').replace(/^\s+|\s+$/g,'');
  var ids = JSON.parse(req.param.ids);

  var myDraw = new SecretSanta(ids);
  console.log(myDraw.result);
  var myDraw = new SecretSanta(['Ryan', 'Lauren', 'Harley', 'Adrian', 'Deborah']);
  console.log(myDraw.result);
  // Object {Deborah: "Harley", Adrian: "Ryan", Harley: "Lauren", Lauren: "Adrian", Ryan: "Deborah"}

  //var myReceiverWish = req.param('MyReceiverWish').replace(/^\s+|\s+$/g,'');
  //var qUri = "https://au1.qualtrics.com/API/v3/directories/POOL_eYe5HRuyGLfM1WR/contacts/"+cid;
  //var qToken = "7Ao37qRRex9xhf6xW1gEWjNTWqhg0NaSud5JDEIm";
  //console.log('CID=',cid);
  //console.log('myReceiverWish=',myReceiverWish);
  //console.log('qUri=',qUri);
  //var reqresp = request({
      //uri: qUri,
      //method: "PUT",
      //headers: "{ X-API-TOKEN: qToken , Content-Type: application/json}",
      //json: {"embeddedData": {"SSMyReceiverWish": myReceiverWish}}
  //});
  //console.log(reqresp);
  console.log('Secret Santa List Draw done');
  res.send(myDraw.result);
});


app.get('/set', function (req, res) {
  // SurveyID: SV_bODYygLhu74X2sJ
  // RecipientID: MLRP_8kylKmkNBlrDvPn
  // PanelID: ML_9XiG06XbK9HiZDv
  console.log('Persisting...');
  var SurveyID = req.query.SurveyID;
  var PanelID = req.query.PanelID;
  var RecipientID = req.query.RecipientID;
  var SPR = SurveyID+PanelID+RecipientID;
  var name  = req.query.name;
  var value = req.query.value;                  // Value (of name-value-pair)
  console.log(SPR, ': ', name,' = ',value);
  //var yep = decodeURIComponent(escape(req.param('yep').replace(/(\r\n|\n|\r|\'|\")/gm," ").replace(/^\s+|\s+$/g,'')));

  storage.init( { dir:'NameValuePairs/'+SPR } ).then(function() {
    //then start using it
    storage.setItem(name, value)
    .then(function() {
      return storage.getItem(name)
    })
    .then(function(fvalue) {
      console.log(fvalue);
    })
  });

  console.log('Persisted.');
  res.send('Done');
});

app.get('/get', function (req, res) {
  console.log('Retrieving...');
  var SurveyID = req.query.SurveyID;
  var PanelID = req.query.PanelID;
  var RecipientID = req.query.RecipientID;
  var SPR = SurveyID+PanelID+RecipientID;
  var name  = req.query.name;
  console.log('name=',name);
  //you must first call storage.initSync
  storage.initSync({ dir:'NameValuePairs/'+SPR });
  //then start using it
  var value = storage.getItemSync(name);
  console.log('Retrieved value=',value);
  console.log('Retrieved.');
  res.send({ value:value });
});

app.get('/getJSON', function (req, res) {
  console.log('Retrieving...');
  var SurveyID = req.query.SurveyID;
  var PanelID = req.query.PanelID;
  var RecipientID = req.query.RecipientID;
  var SPR = SurveyID+PanelID+RecipientID;
  var name  = req.query.name;
  console.log('name=',name);
  //you must first call storage.initSync
  storage.initSync({ dir:'NameValuePairs/'+SPR });
  //then start using it
  var value = storage.getItemSync(name);
  console.log('Retrieved JSON: ',value);
  console.log('Retrieved.');
  res.send(value);
});


app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});

app.get('/info/gen', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
});

app.get('/info/poll', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});


// Secret Santa Code from http://ryanknights.co.uk/javascript-secret-santa/
function SecretSanta (participants) {
        this.participants = participants;
        this.copy         = this.participants.slice(),
        this.result       = {};
        this.equal        = true;
        this.draw();
}

SecretSanta.prototype.listsEqual = function () {
        for (var i = this.participants.length; i--;) {
            if (this.participants[i] === this.copy[i]) {
                return true;
            }
        }
        return false;
}

SecretSanta.prototype.shuffle = function (array) {
        var counter = array.length, temp, index;
        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }   
        return array;
}   

SecretSanta.prototype.draw = function () {
        while (this.equal) {
            this.shuffle(this.copy);
            this.equal  = this.listsEqual();
        }
        for (var i = this.participants.length; i--;) {
            this.result[this.participants[i]] = this.copy[i];
        }
}


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

//initDb(function(err){
//  console.log('Error connecting to Mongo. Message:\n'+err);
//});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;

