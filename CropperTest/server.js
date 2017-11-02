var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;
var Cropper = require('cropperjs');

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

var image = document.getElementById('image');
var cropper = new Cropper(image, {
  aspectRatio: 16 / 9,
  crop: function(e) {
    console.log(e.detail.x);
    console.log(e.detail.y);
    console.log(e.detail.width);
    console.log(e.detail.height);
    console.log(e.detail.rotate);
    console.log(e.detail.scaleX);
    console.log(e.detail.scaleY);
  }
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
