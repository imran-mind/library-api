'use strict'; // Always keep it strict!
/**
 * @author imran.shaikh@47billion.com
 * The entry point for the gateway server. Invokes the app module to initialize the
 * api endpoints(routes).
 */

//To refer different modules irrespective of where we are.
require('rootpath')();
// Banner
require('banner').print('config/banner.txt');
//Setting max listeners to infinite.
process.setMaxListeners(0);
var app = require('./app'),
    argh = require('argh').argv,
    config = require('config');

// uncaught exception
process.on('uncaughtException', function (err) {
    console.log('uncaughtException:', err.message);
    console.log(err.stack);
});


var port = +argh.port || config.app.port, //PORT
    host = +argh.host || config.app.host; //HOST
//Not calling  - it's working via script in package.json
app.start(host, port);
