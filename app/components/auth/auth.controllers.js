const config = require('config');
const User = require('../../models/Users');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const crypto = require("crypto");

module.exports = {

    sendNewSessionId: (req, res, next) => {
        // res.setHeader('user-session-id',  );
        res.json(crypto.randomBytes(16).toString("hex"));
    },

    authenticate: expressJwt({
        secret: config.get('jwt_secret'),
        getToken: (req) => {
            if (req.headers['x-auth-token']) {
                return req.headers['x-auth-token'];
            }
            return null;
        }
    }),

    generateToken: (req, res, next) => {
        req.token = jwt.sign({id: req.user.id}, config.get('jwt_secret'), {expiresIn: 60 * 120 * 1000});
        next();
    },

    sendToken: (req, res, next) => {
        res.setHeader('x-auth-token', req.token);
        res.redirect(303, req.headers.referer)
        // res.status(200).send(req.token);
    },

    getCurrentUser: (req, res, next) => {
        User.findById(req.user.id, (err, user) => {
            if (err) next(err);

            req.user = user;
            next();
        });
    },

    getOne: (req, res) => {
        res.json(req.user.toObject())
    },

};
