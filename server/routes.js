var path = require('path');
var config = require('config');

module.exports = function(app, passport) {
    var rootPath = path.join(__dirname, config.get('http.rootPath'));

    app.get('/', function(req, res) {
        res.sendFile('./index.html', { root: rootPath });
    });

    app.get('/auth/success', function(req, res) {
        res.sendFile('./templates/success.html', { root: './server' });
    });

    app.get('/auth/fail', function(req, res) {
        res.sendFile('./templates/fail.html', { root: './server' });
    });

    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/auth/success',
        failureRedirect : '/auth/fail'
    }));

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        authType: 'rerequest',
        scope: config.get('Client.providers.facebook.permissions')
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/auth/success',
        failureRedirect : '/auth/fail'
    }));

    function getTokenHandler(req, res, tokenKey) {
        var user = req.user || {};

        res.setHeader('Content-Type', 'application/json');

        if (!user[tokenKey]) {
            res.send(401, JSON.stringify({ 
                error: {
                    message: 'Unauthorized!'
                } 
            }));
            return;
        }

        res.send(200, JSON.stringify({ token: req.user[tokenKey] }));
    }

    app.get('/auth/twitter/token', function(req, res) {
        getTokenHandler(req, res, 'twitterAccessToken');
    });

    app.get('/auth/facebook/token', function(req, res) {
        getTokenHandler(req, res, 'facebookAccessToken');
    });

    // route for instagram authentication and login
    app.get('/auth/instagram', passport.authenticate('instagram', {
        scope: config.get('Client.providers.instagram.scope'),
        failureRedirect: '/signup',
        session: false
    }));

    // handle the callback after instagram has authenticated the user
    app.get('/auth/instagram/callback', passport.authenticate('instagram', { 
        successRedirect : '/auth/success',
        failureRedirect : '/auth/fail'
    }));

    app.get('/auth/instagram/token', function(req, res) {
        getTokenHandler(req, res, 'instagramAccessToken');
    });
};
