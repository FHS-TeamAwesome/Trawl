'use strict';

import $ from 'jquery';
import Model from 'core/model';
import Auth from 'facebook/auth';
import Photos from 'facebook/photos';
import Feed from 'facebook/feed';
import Likes from 'facebook/likes';
import Activities from 'facebook/activities';

module.exports = Model.extend({
    initialize() {
        this.auth = new Auth();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    },

    fetch() {
        return $.when(
            this.fetchPhotos(),
            this.fetchFeed(),
            this.fetchLikes()
        ).then(function () {
            this.activities = new Activities([this.photos, this.feed, this.likes]);
        }.bind(this));
    },

    fetchPhotos() {
        this.photos = new Photos(this.auth.accessToken);
        return this.photos.fetch().then(function () {

        }.bind(this));
    },

    fetchFeed() {
        this.feed = new Feed(this.auth.accessToken);
        return this.feed.fetch().then(function () {
            this.feed.getHashTags();
        }.bind(this));
    },

    fetchLikes() {
        this.likes = new Likes(this.auth.accessToken);
        return this.likes.fetch().then(function () {
            console.log(this.likes);
        }.bind(this));
    }
});
