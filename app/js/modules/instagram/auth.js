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
import Backbone from 'backbone';

module.exports = Model.extend({
    isAuthenticated: false,

    accessToken: null,

    authUrl: '/auth/instagram',

    url() {
        return config.get('Client.providers.instagram.api') + '/users/self/?access_token=' + this.accessToken;
    },

    sync : function(method, collection, options) {
        // By setting the dataType to "jsonp", jQuery creates a function
        // and adds it as a callback parameter to the request, e.g.:
        // [url]&callback=jQuery19104472605645155031_1373700330157&q=bananarama
        // If you want another name for the callback, also specify the
        // jsonpCallback option.
        // After this function is called (by the JSONP response), the script tag
        // is removed and the parse method is called, just as it would be
        // when AJAX was used.
        options.dataType = "jsonp";
        return Backbone.sync(method, collection, options);
    },

    getAccessToken() {
        return $.get('/auth/instagram/token').then(function(data) {
            this.accessToken = data.token;
        }.bind(this));
    },

    parse(data) {
        if (!data) return {};

        this.isAuthenticated = !!data.created_at;

        return data;
    }
});
