/*

require('rootpath')();
var config = require('config'),
    debug = require('debug')('helpers.auth'),
    moment = require('moment'),
    log = require('utils/logger')(module),
    jwt = require('jwt-simple');

var AppConfig, App, User, Application, Vendor;

var auth = {
    decodeToken: function (authorization, callback) {
        var token = authorization.split(' ')[1];
        try {
            var payload = jwt.decode(token, config.token.secret);
            callback(null, payload);
        } catch (err) {
            callback({message: err.message});
        }
    },
    */
/*Generate JSON Web Token*//*

    createJWT: function (user, callback) {
        var payload = {
            id: user.id,
            username: user.username,
            password: user.password,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(config.token.expiry, 'seconds').unix()
        };
        debug('--->JWT Payload - ', payload);
        try {
            var token = jwt.encode(payload, config.token.secret);
            return callback(null, token);
        } catch (err) {
            debug('--->Failed to generate encoded access token.');
            return callback({message: err.message});
        }
        //return jwt.encode(payload, config.token.secret);
    },
    createGMSJWT: function (user, callback) {
        var payload = {
            _id: user._id,
            user_email: user.user_email,
            user_full_name: user.user_full_name,
            user_role: user.user_role,
            iat: moment().unix(),
            exp: moment().add(config.token.expiry, 'seconds').unix()
        };
        debug('--->JWT Payload - ', payload);
        try {
            var token = jwt.encode(payload, config.token.secret);
            return callback(null, token);
        } catch (err) {
            debug('--->Failed to generate encoded access token.');
            return callback({message: err.message});
        }
    },
    */
/*Authentication interceptor*//*

    ensureGMSAuthenticated: function (req, res, next) {
        debug("header details", req.headers);
        if (!req.headers.authorization) {
            log.error('--->token not present');
            return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
        }
        if (!req.headers['x-nazara-app-secret-key']) {
            log.error('--->app secret key not present');
            return res.status(401).send({message: 'Please make sure your request has an x-nazara-app-secret-key header'});
        }
        var tokenDetail;
        if (tokenDetail = req.headers.authorization.split(' ').length !== 2) {
            log.error('--->Invalid token');
            return res.status(401).json({error: "Invalid token"});
        }
        auth.decodeToken(req.headers.authorization, function (err, payload) {
            if (err) {
                log.error('--->Invalid token', err);
                return res.status(401).json({error: "Invalid token"});
            }
            req.userInfo = payload;
            return next();
        });
    },
    */
/*Authentication interceptor*//*

    ensureAuthenticated: function (req, res, next) {
        debug("header details", req.headers);
        if (!req.headers.authorization) {
            log.error('--->token not present');
            return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
        }
        */
/* if (!req.headers['x-nazara-app-secret-key']) {
         log.error('--->app secret key not present');
         return res.status(401).send({message: 'Please make sure your request has an x-nazara-app-secret-key header'});
         }*//*

        var tokenDetail;
        if (tokenDetail = req.headers.authorization.split(' ').length !== 2) {
            log.error('--->Invalid token');
            return res.status(401).json({error: "=>Invalid token"});
        }
        auth.decodeToken(req.headers.authorization, function (err, payload) {
            if (err) {
                log.error('--->Invalid token', err);
                return res.status(401).json({error: "Invalid token"});
            }
            debug(">>> req.application and payload", payload);
            */
/*if (req.application._id !== payload.app) {
             return res.status(401).json({error: "Invalid app secret key"});
             }*//*

            req.userInfo = payload;
            return next();
        });
    },
    */
/*App secret validator*//*

    validateAppSecret: function (req, res, next) {
        var appSecret = req.headers['x-nazara-app-secret-key'];
        if (!appSecret) {
            return res.status(401).send({message: 'Please make sure your request has an x-nazara-app-secret-key header'});
        }
        debug('--->Retrieving app info by secret key - ', appSecret);
        App.getAppBySecret(appSecret, function (err, data) {
            if (err) {
                log.error('--->Failed to retrieve application info by secret', err);
                return res.status(401).json({error: "Failed to retrieve application details"});
            }
            if (!data) {
                log.error('--->Invalid application secret');
                return res.status(401).json({error: "Invalid application secret"});
            }
            debug('--->Got app info - ', data._id, ' -->For secret - ', appSecret);
            if (data.name.toLowerCase() === 'cms') {
                log.error('--->Cms app secret is used');
                return res.status(401).json({error: "Invalid application secret"});
            }
            data.appId = data._id;
            req.application = data;
            return next();
        });
    },
    */
/*App secret validator*//*

    validateCmsAppSecret: function (req, res, next) {
        var appSecret = req.headers['x-nazara-app-secret-key'];
        if (!appSecret) {
            log.error('Request withoud app secret invoked');
            return res.status(401).send({message: 'Please make sure your request has an x-nazara-app-secret-key header'});
        }
        debug('--->Retrieving cms app info by secret key - ', appSecret);
        AppConfig.getAppBySecret(appSecret, function (err, data) {
            if (err) {
                log.error('--->Failed to retrieve cms application info by secret', err);
                return res.status(401).json({code: 401, error: "Failed to retrieve application details"});
            }
            debug('--->Got app info - ', data, ' -->For secret - ', appSecret);
            if (!data) {
                log.error('--->Invalid application secret');
                return res.status(401).json({code: 401, error: "Invalid application secret"});
            }
            if (data.name_lower !== 'cms') {
                //hard coded since its not gonna change
                return res.status(401).json({code: 401, error: "Invalid application secret"});
            }
            return next();
        });
    },
    getLoginMode: function (req, res, next) {
        log.info('_getLoginMode--> nazara--', req.userInfo.sub, '--app--', req.userInfo.app);

        var vendor = req.application.services.playblazer ? 'playblazer' : req.application.services.google ? 'google' : 'default';
        switch (vendor) {
            case 'playblazer':
                log.info('get playblazer login mode');
                Vendor.getLoginMode(req.userInfo.sub, vendor, req.userInfo.app, function (err, result) {
                    if (err) {
                        log.error('failed to find playblazer login mode', err);
                        return res.status(500).json({code: 500, message: 'Failed to find login mode'});
                    }
                    if (!result) {
                        log.error('Login mode absent for playblazer for user', req.userInfo.sub);
                        return res.status(500).json({code: 500, message: 'Login mode absent'});
                    }

                    req.loginMode = result.playblazer[0];
                    return next();
                });
                break;
            case 'google':
                log.info('get google login mode');
                Vendor.getLoginMode(req.userInfo.sub, vendor, req.userInfo.app, function (err, result) {
                    if (err) {
                        log.error('failed to find google access token', err);
                        return res.status(500).json({code: 500, message: 'Failed to find token'});
                    }
                    if (!result) {
                        log.error('google access token absent for user', req.userInfo.sub);
                        return res.status(500).json({code: 500, message: 'Invalid access token'});
                    }

                    req.token = result.google[0];
                    delete req.token.app;
                    if (req.token.expiry_date) {
                        delete req.token.expiry_date;
                    }
                    return next();
                });
                break;
            default:
                log.error('Invalid backend configuration for app for user', req.userInfo.sub);
                return res.status(500).json({code: 500, error: 'Login mode absent'});
        }
    }
};

module.exports = function (DB) {

    User = DB.User;
    AppConfig = DB.AppConfig;
    App = DB.App
    Application = DB.Application;
    Vendor = DB.Vendor;
    return auth;
};
*/
