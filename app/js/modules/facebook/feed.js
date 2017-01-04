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
    }
});
