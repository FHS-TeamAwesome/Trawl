var config = require('config');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Twitter OAuth login
    passport.use(new TwitterStrategy({
        consumerKey: config.get('providers.twitter.consumerKey'),
        consumerSecret: config.get('providers.twitter.consumerSecret'),
        callbackURL: config.get('providers.twitter.callbackURL')
    }, function(accessToken, accessTokenSecret, profile, done) {
        process.nextTick(function() {
            done(null, {
                twitterId: profile.id,
                twitterAccessToken: accessToken,
                twitterAccessTokenSecret: accessTokenSecret
            });
        }); 
    }));

    // Facebook OAuth login
    passport.use(new FacebookStrategy({
        clientID: config.get('providers.facebook.consumerKey'),    
        clientSecret: config.get('providers.facebook.consumerSecret'),
        callbackURL: config.get('providers.facebook.callbackURL'),
        profileFields: config.get('providers.facebook.profileFields'),
        enableProof: config.get('providers.facebook.enableProof')
    }, function(accessToken, accessTokenSecret, profile, done) {
        process.nextTick(function() {
            done(null, {
                facebookId: profile.id,
                facebookAccessToken: accessToken,
                facebookAccessTokenSecret: accessTokenSecret
            });
        });
    }));
};
