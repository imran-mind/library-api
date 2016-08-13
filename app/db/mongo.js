'use strict';
/*
 * @author devendra.rathore@47billion.com
 * The module provides you a mongodb instance. We will be reusing the same across
 * the whole application.
 * */
require('rootpath')();
var config = require('config'),
    log = require('utils/logger')(module),
    debug = require('debug')('app.db.mongo'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;

//The database instance. We will keep a single database instance and will return the same everytime.
var db;


//Will return the newly created instance if present otherwise will wait for the connection to get initialized.
function _getConnection(callback) {
    if (db) {
        return callback(null, db);
    }
    // Connect DB
    MongoClient.connect(config.mongo.url, function (err, database) {
        if (err) {
            log.error('Failed to grab a new database instance! Exiting!');
            process.exit(1);
        }

        //Double checking if we have already created a database instance.
        if (db) {
            //Closing the instance as it is already grabbed.
            log.info('Closing the newly created database instance as it is already grabbed!');
            database.close();
            log.info('-->Reusing already created database instance.');
            return callback(null, db);
        }

        log.info("Connected correctly to server");
        db = database;
        debug('-->Got a new database instance. Returning!');
        return callback(null, db);
    });
}

module.exports.ObjectID = ObjectID;
module.exports.getConnection = _getConnection;
