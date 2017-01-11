'use strict';

import $ from 'jquery';
import Model from 'core/model';
import Auth from 'instagram/auth';
import Photos from 'instagram/photos';
import Likes from 'instagram/likes';
import Activities from 'instagram/activities';

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
            this.fetchLikes()
        ).then(function () {
            this.activities = new Activities([this.likes]);
        }.bind(this));
    },

    fetchPhotos() {
        this.photos = new Photos(this.auth.accessToken);
        return this.photos.fetch().then(function (){
            this.EventDispatcher.trigger('fetched:instagram:photos');
        }.bind(this));
    },

    fetchLikes() {
        this.likes = new Likes(this.auth.accessToken);
        return this.likes.fetch().then(function () {

        }.bind(this));
    }
});
