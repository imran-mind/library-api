/**
 * Created by imran on 16/7/16.
 */
'use strict';
/*
 * @author devendra.rathore@47billion.com
 * The file acts as a part of layer between database and REST layer.
 * Will access/persist the data to mongo or redis on corresponding request.
 * */
require('rootpath')();
var debug = require('debug')('app.route.student'),
    log = require('utils/logger')(module),
    config = require('config'),
    moment = require('moment');

//ObjectId, Collection
var ObjectID, bookCollection;

var Book = {
    //TODO new code here

    add: function (input, callback) {
        log.info('-->addStudent', input);
        var book = {
            _id: new ObjectID().toHexString(),
            isbn: input.isbn,
            name: input.bname,
            author: input.author,
            publisher: input.publisher,
            price: input.price,
            pages: input.pages,
            quantity: input.quantity,
            createdAt: moment().valueOf(),
            updatedAt: moment().valueOf()
        }
        bookCollection.save(book, function (err, result) {
            if (err) {
                callback(err);
            }
            callback(null, result);
        });
    },
    find: function (callback) {
        log.info('findStudents--> ');
        bookCollection.find()
            .toArray(function (err, result) {
                if (err) {
                    callback(err);
                }
                callback(null, result);
            });
    },
    findById: function (id, callback) {
        log.info('-->findById');
        bookCollection.find({_id: id},
            function (err, data) {
                if (err) {
                    callback(err);
                }
                callback(null, data);
            });
    }
};

module.exports = function (oid, db) {
    //ObjectID
    ObjectID = oid;
    //Collection
    bookCollection = db.collection(config.mongo.bookCollection);

    return Book;
};

