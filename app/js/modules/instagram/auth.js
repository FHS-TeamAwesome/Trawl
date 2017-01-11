'use strict';

/**
 * Auth Schema
 * 
{
    "data": {
        "id": "1574083",
        "username": "snoopdogg",
        "full_name": "Snoop Dogg",
        "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg",
        "bio": "This is my bio",
        "website": "http://snoopdogg.com",
        "counts": {
            "media": 1320,
            "follows": 420,
            "followed_by": 3410
        }
    }
}
**/

import $ from 'jquery';
import config from 'config';
import Model from 'core/model';

module.exports = Model.extend({
    isAuthenticated: false,

    accessToken: null,

    authUrl: '/auth/instagram',

    reqDataType: 'jsonp',

    url() {
        return config.get('Client.providers.instagram.api') + '/users/self/?access_token=' + this.accessToken;
    },

    getAccessToken() {
        return $.get('/auth/instagram/token').then(function(data) {
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

        this.isAuthenticated = !!data.data.id;

        return data;
    },

    getName() {
        return this.get('data').username;
    },

    getAvatar() {
        return this.get('data').profile_picture;
    }
});
