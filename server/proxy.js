var when = require('when');
var config = require('config');
var oauthProxy = require('./oauth-reverse-proxy');

module.exports = function(app) {
    // twitter
    app.use(oauthProxy({
        endpoint: '/api/twitter/',
        target: config.get('providers.twitter.api'),
        provider: function(req) {
            var user = req.user || {};

            return when({
                consumerKey: config.get('providers.twitter.consumerKey'),
                consumerSecret: config.get('providers.twitter.consumerSecret'),
                tokenKey: user.twitterAccessToken,
                tokenSecret: user.twitterAccessTokenSecret
            });
        }
    }));

    app.use(oauthProxy({
        endpoint: '/api/facebook/',
        target: config.get('providers.facebook.api'),
        provider: function(req) {
            var user = req.user || {};

            return when({
                consumerKey: config.get('providers.facebook.consumerKey'),
                consumerSecret: config.get('providers.facebook.consumerSecret'),
                facebookAccessToken: user.facebookAccessToken
            });
        }
    }));
}
