//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test1');
// Mongoose Schema definition
var Schema = mongoose.Schema;

var JsonSchema = new Schema({
    name: String
});

app
    .use('/', function (req, res, next) {
        if (!serving) {
            res.writeHead(503, {
                'connection': 'close'
            });
            res.end({message: 'instance going down - can\'t accept more requests!'});
            return;
        }
        return next();
    });
// Mongoose Model definition
var Json = mongoose.model('JString', JsonSchema, 'product');

//Lets define a port we want to listen to
const PORT = 8080;

//Create a server
var server = http.createServer();

//Lets start our server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});


// routes/index.js
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

/* GET json data. */
router.post('/mapjson', function (req, res) {
    if (req.params.name) {
        Json.save({name: req.params.name}, {}, function (err, docs) {
            res.json(docs);
        });
    }
});

