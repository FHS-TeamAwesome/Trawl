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
        this.$el.on('click', '#twitter-login-container:not(.is-loggedin)', this.twitterLoginHandler.bind(this));
        this.$el.on('click', '#facebook-login-container:not(.is-loggedin)', this.facebookLoginHandler.bind(this));
        this.$el.on('click', '#instagram-login-container:not(.is-loggedin)', this.instagramLoginHandler.bind(this));
    },

    postPlaceAt() {
        this.ProviderManager.fetchAuth('twitter').then(this.setBtnStates.bind(this));
        this.ProviderManager.fetchAuth('instagram').then(this.setBtnStates.bind(this));
    },

    setBtnStates() {
        if (this.ProviderManager.get('twitter').isAuthenticated()) {
            this.ProviderManager.get('twitter').fetch();
            this.disableLoginBtn(this.$el.find('#twitter-login-container'));
        }

        // if (this.ProviderManager.get('twitter').isAuthenticated()) {
        //     this.ProviderManager.get('twitter').fetch();
        //     this.disableLoginBtn(this.$el.find('#facebook-avatar-btn'));
        // }

        if (this.ProviderManager.get('instagram').isAuthenticated()) {
            // this.ProviderManager.get('instagram').fetch();
            this.disableLoginBtn(this.$el.find('#instagram-login-container'));
        }
    },

    disableLoginBtn($btnContainer) {
        
        $btnContainer.addClass('is-loggedin');

        let loginCount = 0;

        if (this.ProviderManager.get('twitter').isAuthenticated()) {
            loginCount++;

            $btnContainer.children('btn-loggedin').addClass('btn-twitter','btn');
        }
        /*if (this.ProviderManager.get('facebook').isAuthenticated()) {
            loginCount++;
            $btnContainer.children().addClass('btn-loggedin');
        }*/
        if (this.ProviderManager.get('instagram').isAuthenticated()) {
            loginCount++;
            $btnContainer.children().addClass('btn-instagram','btn');
        }

        if(loginCount == 1) {
            $('.progress-bar').width('33%');
            $('.progress-bar').css("background-color", "#f63a0f");
        }
        else if(loginCount == 2) {
            $('.progress-bar').width('66%');
            $('.progress-bar').css("background-color", "#f2b01e");
        }
        else if(loginCount == 3) {
            $('.progress-bar').width('100%');
            $('.progress-bar').css("background-color", "#86e01e");
        }
    },

    twitterLoginHandler() {
        this.ProviderManager.authenticate('twitter').then(function() {
            this.disableLoginBtn(this.$el.find('#twitter-login-container'));
        }.bind(this));
    },

    facebookLoginHandler() {
        this.ProviderManager.authenticate('facebook').then(function() {
            this.disableLoginBtn(this.$el.find('#facebook-login-container'));
        }.bind(this));
    },
  
    instagramLoginHandler() {
        this.ProviderManager.authenticate('instagram').then(function() {
            this.disableLoginBtn(this.$el.find('#instagram-login-container'));
        }.bind(this));
    }


});
