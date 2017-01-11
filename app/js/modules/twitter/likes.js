'use strict';

import Collection from 'core/collection';
import Tweet from 'twitter/tweet';

module.exports = Collection.extend({
    model: Tweet,

    url() {
        return '/api/twitter/favorites/list.json';
    },

    getActivities() {
        let activities = [];

        for (let tweet of this.models) {
            let activity = {
                id: tweet.id,
                type: 'tweet',
                created_time: tweet.getCreateDate(),
                provider: 'facebook'
            };

            activities.push(activity);
        }

        return activities;
    }
});
