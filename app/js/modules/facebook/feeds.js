'use strict';

import Collection from 'core/collection';
import Feed from 'facebook/feed';
import config from 'config';

module.exports = Collection.extend({
    model: Feed,

    url() {
        return config.get('Client.providers.facebook.api') + '/me/?fields=feed&access_token=' + this.accessToken;
    },

    getHashTags() {
        let hashTagsCountMapping = {};

        for (let feed of this.models) {
            for (let hashtag of feed.get('data').message) {
                if (!hashTagsCountMapping[hashtag.text.toLowerCase()]) {
                    hashTagsCountMapping[hashtag.text.toLowerCase()] = {
                        name: hashtag.text,
                        count: 1
                    };
                }
                else {
                    hashTagsCountMapping[hashtag.text.toLowerCase()].count++;
                }
            }
        }
        
        console.log(Object.values(hashTagsCountMapping));

        return Object.values(hashTagsCountMapping);
    }
});
