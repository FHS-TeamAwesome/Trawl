'use strict';

import Model from 'core/model';
import Auth from 'instagram/auth';
import Photos from 'instagram/photos';

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
        return this.photos.fetch().then(function (){
            this.EventDispatcher.trigger('fetched:instagram:photos');
        }.bind(this));
    }
});
