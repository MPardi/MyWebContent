var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

var motion;

app.get("/update", function (req, res) {
    console.log("GET req arrived")
    console.log(req.query);
    motion = req.query.light || motion;
        res.send("1")
});


app.get("/get", function (req, res) {
  var outS = "";
    outS +=  "Motion: " + motion;
    res.send(outS);
});


app.get("/getData", function (req, res) {
  var rObj = {
    "motion": motion || "NA"
  };
  console.log(rObj);
  res.send(JSON.stringify(rObj));
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
