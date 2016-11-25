'use strict';

var express = require('express'),
    router = express.Router(),
    user = require('app/db/user').User,
    Admin = require('app/db/user').Admin;

module.exports = function () {

    router.post('/admin', function (req, res, next) {
        var input = req.body;
        var newUser = {
            name: input.name,
            password: input.password,
            email: input.email
        };
        console.log(input);
        Admin.register(input, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(result)
        })
    });


    router.get('/admin/:id', function (req, res, next) {
        console.log(req.params.id);
        Admin.findAdminById(req.params.id, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(result)
        });
    });


    router.get('/admin', function (req, res, next) {
        console.log(req.params.id);
        Admin.findAll(function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(result)
        });
    });


    router.put('/admin/:id', function (req, res, next) {
        console.log(req.params.id);
        Admin.updateById(req.params.id, req.body, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({message: 'update successful'})
        });
    });

    router.delete('/admin/:id', function (req, res, next) {
        console.log(req.params.id);
        Admin.deleteAdminById(req.params.id, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json({message: 'deleted successful'})
        });
    });
    return router;
};


