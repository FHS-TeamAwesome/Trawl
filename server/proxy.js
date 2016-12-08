var when = require('when');
var config = require('config');
var oauthProxy = require('./oauth-reverse-proxy');

module.exports = function(app) {
    // twitter
    app.use(oauthProxy({
        endpoint: '/api/twitter/',
        target: config.get('Client.providers.twitter.api'),
        provider: function(req) {
            var user = req.user || {};

            return when({
                consumerKey: config.get('Client.providers.twitter.consumerKey'),
                consumerSecret: config.get('Client.providers.twitter.consumerSecret'),
                tokenKey: user.twitterAccessToken,
                tokenSecret: user.twitterAccessTokenSecret
            });
        }
    }));
}
