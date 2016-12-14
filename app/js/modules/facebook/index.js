'use strict';

import Model from 'core/model';
import Auth from 'facebook/auth';

module.exports = Model.extend({
    initialize() {
        this.auth = new Auth();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    }
});
