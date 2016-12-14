'use strict';
import config from 'config';
import $ from 'jquery';
import Model from 'core/model';

module.exports = Model.extend({
    accessToken: null,

    authUrl: '/auth/facebook',

    url() {
        return config.get('providers.facebook.api')+'/me?access_token=' + this.accessToken;
    },

    getAccessToken() {
        return $.get('/auth/facebook/token').then(function(data) {
            this.accessToken = data.token;
        });
    }
});
