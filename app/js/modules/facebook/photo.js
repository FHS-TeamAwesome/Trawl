'use strict';

import Model from 'core/model';

module.exports = Model.extend({

    defaults: {
        id: null,
        locationName: null,
        latitude: null,
        longitude: null,
        url: null,
        created_time: null,
        hashtags: [],
        provider: 'facebook'
    },

    getCreateDate() {
        return this.get('created_time');
    }

});
