var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials.json');
var s3 = new AWS.S3();

var express = require("express");
var server = express();
var bodyParser = require('body-parser');

var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;
server.use(methodOverride());
//server.use(bodyParser());
server.use(bodyParser.urlencoded());

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())

server.use(express.static(__dirname + '/public'));
server.use(errorHandler());

var db = require('mongoskin').db('mongodb://user:pwd@127.0.0.1:27017/gallerydb');

server.get("/", function(req, res) {
           res.redirect("/index.html");
});

server.get("/getGallery", function(req, res) {
        db.collection("gallerydb").find({}).toArray(function(err, result) {
            res.send(JSON.stringify(result))
        });
});

server.get("/getPhoto", function(req, res) {
   var id = req.query.id.toString();
    db.collection("gallerydb").findOne({id:id}, function(err, result) {
        res.send(JSON.stringify(result));
    });
});

server.get("/addGallery", function(req, res) {
    db.collection("gallerydb").insert(req.query, function(err, result) {
        if(err) {
            res.send("Error...");
        }
        else {
            db.collection("gallerydb").find({}).toArray(function(err1, result1){
                res.send(JSON.stringify(result1));
            });
        }
    }
    )
});

server.get("/renameGallery", function(req, res) {
    console.log(req.query);
    var id = req.query.id.toString();
    console.log(id);
    db.collection("gallerydb").update({id:id}, {$set: {title: req.query.newName}, function(err, result) {
        if(err) {
            res.send("error");
        }
        else {
            db.collection("gallerydb").find({}).toArray(
            function(err1, result1) {
                res.send(JSON.stringify(result1));
            });
        }
    }});
});

//server.get("/saveEdited", function(req, res) {
//    var id = req.query.id.toString();
//    
//    db.collection("gallerydb").update({id:id}, {$set: {url: req.query.editedImg}, function(err, result) {
//        if(err) {
//            res.send("error");
//        }
//        else {
//            db.collection("gallerydb").find({}).toArray(
//            function(err1, result1) {
//                res.send(JSON.stringify(result1));
//            });
//        }
//    }});
//});

//server.post('/uploadFile', function(req, res){
//      console.log(req.body);
//        var intname = req.body.fileInput;
//        var filename = req.files.input.name;
//        var fileType =  req.files.input.type;
//        var tmpPath = req.files.input.path;
//        var s3Path = '/' + intname;
//        
//        fs.readFile(tmpPath, function (err, data) {
//            var params = {
//                Bucket:'ame470imageserver',
//                ACL:'public-read',
//                Key:intname,
//                Body: data,
//                ServerSideEncryption : 'AES256'
//            };
//            s3.putObject(params, function(err, data) {
//                console.log(err);
//                res.end("success");
//            });
//        });
//  });

server.post('/uploadFile', function(req, res){
      console.log(req.body);
        var intname = req.body.fileInput;
        var filename = req.files.input.name;
        var fileType =  req.files.input.type;
        var tmpPath = req.files.input.path;
        var s3Path = '/' + intname;
        
        fs.readFile(tmpPath, function (err, data) {
            var params = {
                Bucket:'ame470s2017tg',
                ACL:'public-read',
                Key:intname,
                Body: data,
                ServerSideEncryption : 'AES256'
            };
            s3.putObject(params, function(err, data) {
                res.end("success");
                console.log(err);
            });
        });
  });

server.post('/uploadImage', function(req, res){
        var intname = req.body.fileInput;
        var s3Path = '/' + intname;
        var buf = new Buffer(req.body.data.replace(/^data:image\/\w+;base64,/, ""),'base64')
        var params = {
            Bucket:'ame470imageserver',
            ACL:'public-read',
            Key:intname,
            Body: buf,
            ServerSideEncryption : 'AES256'
        };
        s3.putObject(params, function(err, data) {
            console.log(err);
            res.end("success");
        });
  });



server.get("/deleteGallery", function (req, res) {
   var id = req.query.id.toString();
   console.log(id);
    var name = req.query
   db.collection("gallerydb").remove({id: id}, function(err, result){
     console.log(err);
      if(err){
        res.send("error"); 
      }
      else{
        db.collection("gallerydb").find({}).toArray( function(err1, result1) {
          res.send(JSON.stringify(result1));
        });
      }
   });
});
                                      
server.use(methodOverride());

// parse app`lication/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }));

//server.use(bodyParser());

console.log("Simple static server listening at http://" + hostname + ":" + port);
server.listen(port);