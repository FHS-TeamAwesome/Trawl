'use strict';

import Model from 'core/model';
import Auth from 'twitter/auth';
import Likes from 'twitter/likes';

module.exports = Model.extend({
    initialize() {
        this.auth = new Auth();
        this.likes = new Likes();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    },

    fetch() {
        return this.likes.fetch();
    }
});
