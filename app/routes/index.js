'use strict'

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');


module.exports = function (app) {
    app
        .use(express.static(path.join(__dirname, '/../../public')))
        //use(require('morgan')('combined', {"stream": logger.stream}))
        //use(express.logger('dev')).
        .use(bodyParser.json({limit: '1 mb'}))
        .use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", '*');
            res.header('Authorization', true);
            res.header('Access-Control-Allow-Credentials', true);
            res.header("Access-Control-Allow-Headers", " Authorization, Origin, X-Requested-With, Content-Type, Accept");
            next();
        })
        .use(bodyParser.urlencoded({extended: false}));

    var dashboardRoute = require('app/routes/dashboard')();

    app
        .use('/api', dashboardRoute);
};
