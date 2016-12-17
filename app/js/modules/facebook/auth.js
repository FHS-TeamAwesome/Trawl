'use strict';

import $ from 'jquery';
import config from 'config';
import Model from 'core/model';

module.exports = Model.extend({
    isAuthenticated: false,
    
    accessToken: null,

    authUrl: '/auth/facebook',

    reqDataType: 'jsonp',

    url() {
        return config.get('Client.providers.facebook.api') + '/me?access_token=' + this.accessToken;
    },

    getAccessToken() {
        return $.get('/auth/facebook/token').then(function(data) {
            this.accessToken = data.token;
        }.bind(this));
    },

    fetch() {
        let originalfetch = Model.prototype.fetch;

        if (!this.accessToken) {
            return this.getAccessToken().then(function() {
                return originalfetch.call(this);
            }.bind(this));
        }

        return originalfetch.call(this);
    },

    parse(data) {
        if (!data) return {};

        this.isAuthenticated = !!data.id;

        return data;
    }
});
