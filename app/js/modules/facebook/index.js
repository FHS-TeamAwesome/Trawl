'use strict';

import $ from 'jquery';
import Model from 'core/model';
import Auth from 'facebook/auth';

module.exports = Model.extend({
    initialize() {
        this.auth = new Auth();
    },

    isAuthenticated() {
        return this.auth.isAuthenticated;
    },

    fetch() {
        // replace following code with real fetch data
        return $.get('/auth/facebook/token').then(function(data) {
        
        }.bind(this));
    }
});
