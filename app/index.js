'use strict';
require('rootpath')();
var express = require('express'),
    app = express();

// max_listeners
process.setMaxListeners(0);

var serving = false;
var http = require('http').Server(app);

http.on('error', function (err) {
    console.log('HTTP Error', err.message);
    console.log(err.stack);
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
require('app/routes')(app);
//require('app/routes')(app);

process.on('message', function (msg) {
    if (msg === 'shutdown') {
        serving = false;
        console.log('=>http.close - ', id);
        http.close(function (err) {
            console.log(process.pid + ': => Worker ' + id + ' is closing...');
        });
    }
});

// Export
exports.start = function (host, port) {
    console.log('HTTP - Starting! server on port - ', port, ' and host - ', host);
    http.listen(port, host, function () {
        serving = true;
        console.log('HTTP - Ready! Listening on port - ', port, ' and host - ', host);
    });
};
