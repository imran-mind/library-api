/**
 * Created by imran on 14/7/16.
 */

'use strict';

var express = require('express'),
    router = express.Router();


//models


module.exports = function (app) {
    app.get('/', function (req, res, next) {
        res.status(200).json({message:'All students comming soon from MONGO'})
    });
    return router;
};


