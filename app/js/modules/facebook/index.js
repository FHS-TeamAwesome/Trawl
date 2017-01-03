'use strict';

import $ from 'jquery';
import Model from 'core/model';
import Auth from 'facebook/auth';
import Photos from 'facebook/photos';

module.exports = Model.extend({
    initialize() {
        this.auth = new Auth();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    },

    fetch() {
        return this.fetchPhotos();
    },

    fetchPhotos() {
        this.photos = new Photos(this.auth.accessToken);
        return this.photos.fetch();
    }
});
