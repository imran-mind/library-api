var mongoClient = require('app/db/mongo');


var ObjectID = mongoClient.ObjectID;

module.exports.db = function (cb) {
    mongoClient.getConnection(function (err, db) {
        if (err) {
            return log.error('=>mongoClient.getConnection - ', err);
        }
        var DB = {};
        DB.Student = require('app/db/models/students')(ObjectID, db);
        DB.Book=require('app/db/models/book')(ObjectID,db);
        console.log('*********************',DB);
        cb(null, DB);
    });
};
