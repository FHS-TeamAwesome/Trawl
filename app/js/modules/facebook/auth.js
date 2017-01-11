'use strict';

/**
 * Auth Schema
 * 
{
  "name": "Theresa Elisa",
  "picture": {
    "data": {
      "is_silhouette": false,
      "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.6.50.50/p50x50/11742627_136514453350307_5089959247089710753_n.jpg?oh=1e251004ad02e1a11b8bf226bdae141c&oe=58E0DFB3"
    }
  },
  "id": "181533942181691"
}
**/

import $ from 'jquery';
import config from 'config';
import Model from 'core/model';

module.exports = Model.extend({
    isAuthenticated: false,
    
    accessToken: null,

    authUrl: '/auth/facebook',

    reqDataType: 'jsonp',

    url() {
        return config.get('Client.providers.facebook.api') + '/me/?fields=name,picture,id&access_token=' + this.accessToken;
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
    },

    getAvatar() {
        return this.get('picture').data.url;
    },

    getName() {
        return this.get('name');
    }
});
