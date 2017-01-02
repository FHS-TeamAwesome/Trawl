'use strict';

import Collection from 'core/collection';
import Feed from 'facebook/feed';

module.exports = Collection.extend({
    model: Feed,

    url() {
        return config.get('Client.providers.facebook.api') + '/me/?fields=feed&access_token=' + this.accessToken;
    },

    getHashTags() {
        
    }
});
