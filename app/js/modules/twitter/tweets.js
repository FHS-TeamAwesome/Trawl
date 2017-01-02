'use strict';

import Collection from 'core/collection';
import Tweet from 'twitter/tweet';

module.exports = Collection.extend({
    model: Tweet,

    url() {
        return '/api/twitter/statuses/user_timeline.json';
    },

    getHashTags() {
        let hashTagsCountMapping = {};

        for (let tweet of this.models) {
            for (let hashtag of tweet.getHashTags()) {
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

        return Object.values(hashTagsCountMapping);
    },

    getPhotosWithLocation() {
        let mediaEntries = [];

        for (let tweet of this.models) {
            if (tweet.getLocation()) {
                mediaEntries = mediaEntries.concat(tweet.getMediaEntries());
            }
        }

        return mediaEntries;
    }
});
