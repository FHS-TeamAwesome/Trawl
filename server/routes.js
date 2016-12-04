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
        scope: config.get('providers.facebook.permissions')
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/auth/success',
        failureRedirect : '/auth/fail'
    }));

    app.get('/auth/facebook/token', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ token: req.user.facebookAccessToken }));
    });
};
