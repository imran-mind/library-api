'use strict';
/**
 * @author devendra.rathore@47billion.com
 */

require('rootpath')();
var fs = require("fs"),
    colors = require('colors'),
    logger = require('utils/logger')(module);

exports.print = function (bFile) {
    if (!fs.existsSync(bFile)) {
        return;
    }
    // print
    var txt = fs.readFileSync(bFile).toString();
    logger.info('\n', txt.rainbow.bold, '\n');
};
