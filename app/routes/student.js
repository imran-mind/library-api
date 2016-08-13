/**
 * Created by imran on 14/7/16.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    config = require('config'),
    debug = require('debug')('app.route.student'),
    log = require('utils/logger')(module);

var ObjectID, Student;
module.exports = function (app) {

    Student = app.get('db').Student;

    router.post('/', function (req, res, next) {
        log.info('-->student ', req.body);
        var input = req.body;
        Student.add(input, function (err, data) {
            if (err) {
                log.error('Student not inserted', err);
                return res.status(500).json({error: "Student not inserted"});
            }
            return res.status(201).json({message: "Student successfully inserted"})
        });
    });
    router.get('/', function (req, res, next) {
        Student.find(function (err, data) {
            if (err) {
                log.error('Student not found', err);
                return res.status(500).json({error: "Student not found"});
            }
            return res.status(200).json(data);
        });
    });
    router.get('/:id', function (req, res,next) {
        Student.findById(req.params.id, function (err, data) {
            if (err) {
                log.error('Student not found', err);
                return res.status(500).json({error: "Student not found"});
            }
            return res.status(200).json(data);
        });
    });
    return router;
};
