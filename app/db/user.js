var mongoose = require('mongoose');
var objectID = require('mongoose').objectId;
var moment = require('moment');

mongoose.connect('mongodb://localhost:27017/loginapp', function (err, connect) {
    if (err) {
        console.log(err);
    }
    console.log('mongoDB connection established...')
});

var ObjectID = mongoose.ObjectID;
var db = mongoose.connection;
var userCollection = db.collection('users');
var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
});

var User = module.exports.User = mongoose.model('user', userSchema);

module.exports.User = {
    createUser: function (user, callback) {
        User.create(user, callback);
    }
}


module.exports.Admin = {

    register: function (user, callback) {
        user._id = moment().unix();
        userCollection.insert(user, function (err, result) {
            if (err)callback(err);
            console.log(result);
            callback(null, result);
        });
    },

    findAll: function (callback) {
        userCollection.find().toArray(callback);
    },

    findAdminById: function (id, callback) {
        console.log(id);
        userCollection.findOne({_id: id}, function (err, result) {
            console.log(result);
            console.log(err);
            return err ? callback(err) : callback(null, result);
        });
    },

    updateById: function (user, id, callback) {
        userCollection.findOne({_id: id}, function (err, result) {
            if (err)  return callback(err);
            if (!result) return callback(null, null);
            console.log(result);
            if (result) {
                userCollection.updateOne({_id: id}, {$set: user}, function (err, result) {
                    return err ? callback(err) : callback(null, result);
                });
            }
        });
    },

    deleteAdminById: function (id, callback) {
        console.log(id);
        userCollection.remove({_id: id}, function (err, result) {
            console.log(result);
            return err ? callback(err) : callback(null, result);
        });
    }
}
