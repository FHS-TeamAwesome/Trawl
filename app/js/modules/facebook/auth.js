'use strict'

import Model from 'core/model';

module.exports = Model.extend({

    app.get('/auth/facebook',
        passport.authenticate('facebook', { authType: 'rerequest', scope: ['user_friends', 'manage_pages'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
         // Successful authentication, redirect home.
         
         res.redirect('/');
         });return data;
    }
});
