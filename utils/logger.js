/**
 * @author devendra.rathore@47billion.com
 */
'use strict';

var config = require('config'),
    os = require("os"),
    moment = require('moment'),
    winston = require('winston');

winston.emitErrs = true;

module.exports = function (_module) {
    var node = os.hostname() + '-' + process.pid + ' ';

    // Return the last folder name in the path and the calling module's filename.
    var getLabel = function (_module) {
        var parts = _module.filename.split('/');
        return parts[parts.length - 2] + '/' + parts.pop();
    };

    var transports = [];
    //Logging to console only in case not prod or staging
    if (['production', 'stage'].indexOf(process.env.NODE_ENV) < 0) {
        transports.push(new winston.transports.Console({
            label: getLabel(_module),
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            colorize: true
        }));
    } else {
        transports.push(new winston.transports.File({
            label: getLabel(_module),
            level: config.logger.level,
            filename: config.logger.filename,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            maxsize: 10000000, // 5MB
            maxFiles: 10,
            colorize: false,
            timestamp: function () {
                return node + moment().format();
            }
        }));
    }


    return new winston.Logger({
        transports: transports, exitOnError: false
    });
};
