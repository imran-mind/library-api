/**
 * Created by imran on 14/7/16.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    config = require('config'),
    debug = require('debug')('app.route.student'),
    log = require('utils/logger')(module);

var ObjectID, Book;
module.exports = function (app) {

    Book = app.get('db').Book;

    router.post('/', function (req, res, next) {
        log.info('-->student ', req.body);
        var input = req.body;
        Book.add(input, function (err, data) {
            if (err) {
                log.error('Book not inserted', err);
                return res.status(500).json({error: "Book not inserted"});
            }
            return res.status(201).json({message: "Book successfully added"})
        });
    });
    router.get('/', function (req, res, next) {
        Book.find(function (err, data) {
            if (err) {
                log.error('Student not found', err);
                return res.status(500).json({error: "Student not found"});
            }
            return res.status(200).json(data);
        });
    });
    router.get('/:id', function (req, res) {
        Book.findById(req.params.id, function (err, data) {
            if (err) {
                log.error('Student not found', err);
                return res.status(500).json({error: "Student not found"});
            }
            return res.status(200).json(data);
        });
    });
    return router;
};
