'use strict';

import $ from 'jquery';
import View from 'core/view';

let HeaderTpl = require('app/templates/partials/header.html');

export default View.extend({
    initialize() {
        this.template = HeaderTpl;
        this.ProviderManager = this.getService('ProviderManager');
    },

    postRender() {
        this.$el.on('click', '#twitter-login:not(.is-loggedin)', this.twitterLoginHandler.bind(this));
        this.$el.on('click', '#facebook-login:not(.is-loggedin)', this.facebookLoginHandler.bind(this));
        this.$el.on('click', '#instagram-login:not(.is-loggedin)', this.instagramLoginHandler.bind(this));
    },

    postPlaceAt() {
        this.setBtnStates();
    },

    setBtnStates() {
        if (this.ProviderManager.get('twitter').isAuthenticated()) {
            this.ProviderManager.get('twitter').tweets.getHashTags();
            this.disableLoginBtn(this.$el.find('#twitter-login-container'));
        }

        if (this.ProviderManager.get('facebook').isAuthenticated()) {
            this.disableLoginBtn(this.$el.find('#facebook-login-container'));
        }

        if (this.ProviderManager.get('instagram').isAuthenticated()) {
            this.disableLoginBtn(this.$el.find('#instagram-login-container'));
        }

        this.updateProgressBar();
    },

    disableLoginBtn($btnContainer) {
        $btnContainer.addClass('is-loggedin');
    },

    twitterLoginHandler() {
        this.ProviderManager.authenticate('twitter').then(function() {
            this.disableLoginBtn(this.$el.find('#twitter-login-container'));
            this.updateProgressBar();
        }.bind(this));
    },

    facebookLoginHandler() {
        this.ProviderManager.authenticate('facebook').then(function() {
            this.disableLoginBtn(this.$el.find('#facebook-login-container'));
            this.updateProgressBar();
        }.bind(this));
    },
  
    instagramLoginHandler() {
        this.ProviderManager.authenticate('instagram').then(function() {
            this.disableLoginBtn(this.$el.find('#instagram-login-container'));
            this.updateProgressBar();
        }.bind(this));
    },

    updateProgressBar() {
        this.$el.find('.progress-bar').width(this.ProviderManager.getProgress() + '%');
    }
});
