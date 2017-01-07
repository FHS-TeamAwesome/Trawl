'use strict';

import Collection from 'core/collection';
import Tweet from 'twitter/tweet';

module.exports = Collection.extend({
    model: Tweet,

    url() {
        return '/api/twitter/statuses/user_timeline.json?count=200&include_rts=1';
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
            if (tweet.getLocation() && tweet.getMediaEntries()[0].media_url) {
                for(let i = 0; i < tweet.getMediaEntries().length; i++) {

                    let mediaEntry = {
                        locationName: tweet.getLocation().name,
                        latitude: (tweet.getLocation().bounding_box.coordinates[0][0][1] + tweet.getLocation().bounding_box.coordinates[0][2][1])/2,
                        longitude: (tweet.getLocation().bounding_box.coordinates[0][0][0] + tweet.getLocation().bounding_box.coordinates[0][1][0])/2,
                        url: tweet.getMediaEntries()[i].media_url,
                        hashtags: []
                    };

                    let tweetHashTags = tweet.getHashTags();
                    for(let j = 0; j < tweetHashTags.length; j++) {
                        mediaEntry.hashtags.push(tweetHashTags[j].text);
                    }

                    mediaEntries.push(mediaEntry);
                }
            }
        }

        return mediaEntries;
    }
});
