var config = require('config');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    function extendSessionData(sessionObj, data) {
        sessionObj = sessionObj || {};
        
        return Object.assign(sessionObj, data);
    }

    // Twitter OAuth login
    passport.use(new TwitterStrategy({
        consumerKey: config.get('Client.providers.twitter.consumerKey'),
        consumerSecret: config.get('Client.providers.twitter.consumerSecret'),
        callbackURL: config.get('Client.providers.twitter.callbackURL'),
        passReqToCallback: true
    }, function(req, accessToken, accessTokenSecret, profile, done) {
        process.nextTick(function() {
            done(null, extendSessionData(req.user, {
                twitterId: profile.id,
                twitterAccessToken: accessToken,
                twitterAccessTokenSecret: accessTokenSecret
            }));
        }); 
    }));

    // Facebook OAuth login
    passport.use(new FacebookStrategy({
        clientID: config.get('Client.providers.facebook.consumerKey'),    
        clientSecret: config.get('Client.providers.facebook.consumerSecret'),
        callbackURL: config.get('Client.providers.facebook.callbackURL'),
        profileFields: config.get('Client.providers.facebook.profileFields'),
        enableProof: config.get('Client.providers.facebook.enableProof'),
        passReqToCallback: true
    }, function(req, accessToken, accessTokenSecret, profile, done) {
        process.nextTick(function() {
            done(null, extendSessionData(req.user, {
                facebookId: profile.id,
                facebookAccessToken: accessToken,
                facebookAccessTokenSecret: accessTokenSecret
            }));
        });
    }));

    // Instagram OAuth login
    passport.use(new InstagramStrategy({
        clientID: config.get('Client.providers.instagram.consumerKey'),
        clientSecret: config.get('Client.providers.instagram.consumerSecret'),
        callbackURL: config.get('Client.providers.instagram.callbackURL'),
        passReqToCallback: true
    }, function(req, accessToken, accessTokenSecret, profile, done) {
        process.nextTick(function() {
            done(null, extendSessionData(req.user, {
                instagramId: profile.id,
                instagramAccessToken: accessToken,
                instagramAccessTokenSecret: accessTokenSecret
            }));
        });
    }));
};
