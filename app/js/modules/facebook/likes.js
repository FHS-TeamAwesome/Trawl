'use strict';

import config from 'config';
import Model from 'core/model';

module.exports = Model.extend({
    accessToken: null,

    reqDataType: 'jsonp',

    initialize(accessToken) {
        this.accessToken = accessToken;
    },

    url() {
        return config.get('Client.providers.facebook.api') + '/me/?fields=likes.limit(999)&access_token=' + this.accessToken;
    },

    parse(data) {
        return { likes: data.likes.data };
    },

    getActivities() {
        let activities = [];

        for (let like of data.likes){
            activities.push(like.created_time);
        }

        return activities;
    }
});
