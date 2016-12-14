'use strict';

import Model from 'core/model';
import Auth from 'instagram/auth';
import Photos from 'instagram/photos';

module.exports = Model.extend({

    userPhotos: null,

    initialize() {
        this.auth = new Auth();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    },

    getPhotos() {
        this.photos = new Photos(this.auth.accessToken);
        this.photos.fetch().then(function (){
            console.log(this.photos);
        });
    }
});
