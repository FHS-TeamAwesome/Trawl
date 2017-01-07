'use strict';

import config from 'config';
import Collection from 'core/collection';
import Post from 'facebook/post';

module.exports = Collection.extend({
    model: Post,

    accessToken: null,

    reqDataType: 'jsonp',

    initialize(accessToken) {
        this.accessToken = accessToken;
    },

    url() {
        return config.get('Client.providers.facebook.api') + '/me?fields=feed.limit(500)&access_token=' + this.accessToken;
    },

    parse(data) {
        if (!data.feed) return {};

        console.log(data);

        let feedArr = [];

        for (let post of data.feed.data){

            let feedData = {
                id: post.id,
                created_time: post.created_time,
                message: post.message,
                story: post.story
            };

           feedArr.push(new Post(feedData));
        }

        return feedArr;
    },

    getHashTags() {
        let hashTagsCountMapping = {};

        for (let post of this.models) {
            for (let hashtag of post.getHashTags()) {
                if (!hashTagsCountMapping[hashtag.toLowerCase()]) {
                    hashTagsCountMapping[hashtag.toLowerCase()] = {
                        id: post.id,
                        provider: 'facebook',
                        name: hashtag,
                        count: 1
                    };
                }
                else {
                    hashTagsCountMapping[hashtag.toLowerCase()].count++;
                }
            }
        }

        return Object.values(hashTagsCountMapping);
    },

    getActivities() {
        let activities = [];

        for (let post of this.models) {

            activities.push(post.getCreateDate());

        }

        return activities;
    }
});
