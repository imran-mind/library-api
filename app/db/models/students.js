'use strict';
/*
 * @author imran.shaikh@47billion.com
 * The file acts as a part of layer between database and REST layer.
 * Will access/persist the data to mongo or redis on corresponding request.
 * */
require('rootpath')();
var debug = require('debug')('app.route.student'),
    log = require('utils/logger')(module),
    config = require('config'),
    moment = require('moment');

//ObjectId, Collection
var ObjectID, studentCollection;

var Student = {
    //TODO new code here

    add: function (input, callback) {
        log.info('-->addStudent', input);
        var student = {
            _id: new ObjectID().toHexString(),
            rollNo: input.rollNo,
            name: input.name,
            mobile: input.mobile,
            email : input.email,
            imagePath: input.imagePath,
            branch: input.branch,
            sem: input.sem,
            books: input.books ? input.books :'',
            booksCount: input.booksCount?input.booksCount : 0,
            createdAt: moment().valueOf(),
            updatedAt: moment().valueOf()
        }
        studentCollection.save(student, function (err, result) {
            if (err) {
                callback(err);
            }
            callback(null, result);
        });
    },
    find: function (callback) {
        log.info('findStudents--> ');
        studentCollection.find().toArray(callback);
    },
    findById: function (id, callback) {
        log.info('-->findById');
        studentCollection.findOne({_id: id}, {_id: 0, createdAt: 0, updatedAt: 0},
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
    studentCollection = db.collection(config.mongo.studentCollection);

    return Student;
};

