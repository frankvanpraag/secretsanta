var http = require('http');
var request = require('request');
var express = require('express');
var app = express();
var util = require('util');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/fvp', function (req, res) {
  res.send('Hello Frank!');
});

app.get('/create', function (req, res) {
  console.log('Secret Santa List Creator starting...');
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
  console.log('Secret Santa List Creator done');
  res.send(myDraw.result);
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


