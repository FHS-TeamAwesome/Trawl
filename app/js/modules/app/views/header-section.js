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
        this.$twitterLoginContainer = this.$el.find('#twitter-login-container');
        this.$facebookLoginContainer = this.$el.find('#facebook-login-container');
        this.$instagramLoginContainer = this.$el.find('#instagram-login-container');

        this.setBtnStates();
        this.updateProgressBar();
    },

    setBtnStates() {
        if (this.ProviderManager.get('twitter').isAuthenticated()) {
            this.disableLoginBtn(this.$twitterLoginContainer);
            this.setAuthData(this.ProviderManager.get('twitter').auth, this.$twitterLoginContainer);
        }

        if (this.ProviderManager.get('facebook').isAuthenticated()) {
            console.log(this.ProviderManager.get('facebook').auth);
            this.disableLoginBtn(this.$facebookLoginContainer);
            this.setAuthData(this.ProviderManager.get('facebook').auth, this.$facebookLoginContainer);
        }

        if (this.ProviderManager.get('instagram').isAuthenticated()) {
            this.disableLoginBtn(this.$instagramLoginContainer);
            this.setAuthData(this.ProviderManager.get('instagram').auth, this.$instagramLoginContainer);
        }
    },

    setAuthData(auth, $loginContainer) {
        let $btnLoggedin = $loginContainer.find('.btn-loggedin');

        $btnLoggedin.find('.btn-loggedin-name').html(auth.getName());
        $btnLoggedin.find('.btn-loggedin-avatar img').attr('src', auth.getAvatar());
    },

    disableLoginBtn($btnContainer) {
        $btnContainer.addClass('is-loggedin');
    },

    twitterLoginHandler() {
        this.ProviderManager.authenticate('twitter').then(function() {
            this.disableLoginBtn(this.$twitterLoginContainer);
            this.setAuthData(this.ProviderManager.get('twitter').auth, this.$twitterLoginContainer);
            this.updateProgressBar();
        }.bind(this));
    },

    facebookLoginHandler() {
        this.ProviderManager.authenticate('facebook').then(function() {
            this.disableLoginBtn(this.$facebookLoginContainer);
            this.setAuthData(this.ProviderManager.get('facebook').auth, this.$facebookLoginContainer);
            this.updateProgressBar();
        }.bind(this));
    },
  
    instagramLoginHandler() {
        this.ProviderManager.authenticate('instagram').then(function() {
            this.disableLoginBtn(this.$instagramLoginContainer);
            this.setAuthData(this.ProviderManager.get('instagram').auth, this.$instagramLoginContainer);
            this.updateProgressBar();
        }.bind(this));
    },

    updateProgressBar() {
        this.$el.find('.progress-bar').width(this.ProviderManager.getProgress() + '%');
    }
});
