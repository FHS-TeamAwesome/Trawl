'use strict';

import Model from 'core/model';
import Auth from 'twitter/auth';
import Tweets from 'twitter/tweets';
import Likes from 'twitter/likes';
import Activities from 'twitter/activities';
import $ from 'jquery';

module.exports = Model.extend({
    initialize() {
        this.auth = new Auth();
        this.tweets = new Tweets();
        this.likes = new Likes();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    },

    fetch() {
        return $.when(
            this.tweets.fetch(),
            this.likes.fetch()
        ).then(function() {
            this.activities = new Activities([this.tweets, this.likes]);
        }.bind(this));
    }
});
