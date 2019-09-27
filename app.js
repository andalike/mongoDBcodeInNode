
//External Files/Libs
const request = require('request');
var moment = require('moment');

//Express Params
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.set('port', process.env.PORT || 7879);

//Mongo Params
var mongoose = require('mongoose');
mongoURL = 'Give the URL Here'

//Models
var alexaLog = require('./models/alexaLog');

//Mongo DB connect
mongoose.connect(mongoURL, { useNewUrlParser: true }, function (err, connect) {
  if (err) {
    console.log("Mongodb not Connected")
  } else {
    console.log("Mongodb Connected")

  }
});

app.post('/alexaRequest', function (req, res) {
  var resAlexaRequest={};
  var input = req.body.input;
  var output = req.body.output;
  var timestmp = moment();
  saveDataInMongo(input, output, timestmp);
  resAlexaRequest.status='success';
  res.json(resAlexaRequest);
});


app.post('/alexaLogs', function (req, res) {
  var resAlexaLogs={};
  var alexaLogQuery = alexaLog.find({
  })
  alexaLogQuery.exec().then(res2 => {
    resAlexaLogs.status='success';
    resAlexaLogs.logs=res2;
    res.json(resAlexaLogs)
  })
    .catch(err => {
      console.log("Error in Fetch Alexa Logs" + err);
      resAlexaLogs.status=err;
      res.json(resAlexaLogs)
    })
});

app.post('/alexaSpecificLog', function (req, res) {
  var timestmp=req.body.timestmp;
  var resAlexaLogs={};
  var alexaLogQuery = alexaLog.findOne({
    timestmp:timestmp
  })
  alexaLogQuery.exec().then(res2 => {
    if(res2==null){
      resAlexaLogs.status='No Record Found';
      resAlexaLogs.logs=res2;
      res.json(resAlexaLogs);
    }
    else{
      resAlexaLogs.status='success';
      resAlexaLogs.logs=res2;
      res.json(resAlexaLogs);
    }

  })
    .catch(err => {
      console.log("Error in Fetch Alexa Logs" + err);
      resAlexaLogs.status=err;
      res.json(resAlexaLogs)
    })
});

function saveDataInMongo(input, output, timestmp) {
  var alexaLogObj = new alexaLog({
    input: input,
    output: output,
    timestmp: timestmp,
  });
  alexaLogObj.save(function (error) {
    if (error) {
      console.error("Error in Saving Data->" + error);
    }
    else {
    }
  })
}


app.listen(app.get('port'));