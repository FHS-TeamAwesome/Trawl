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
        this.$el.on('click', '#twitter-avatar-btn:not(.is-loggedin)', this.twitterLoginHandler.bind(this));
        this.$el.on('click', '#facebook-avatar-btn:not(.is-loggedin)', this.facebookLoginHandler.bind(this));
        this.$el.on('click', '#instagram-avatar-btn:not(.is-loggedin)', this.instagramLoginHandler.bind(this));
    },

    postPlaceAt() {
        this.ProviderManager.fetchAuth('twitter').then(this.setBtnStates.bind(this));
        this.ProviderManager.fetchAuth('instagram').then(this.setBtnStates.bind(this));
    },

    setBtnStates() {
        if (this.ProviderManager.get('twitter').isAuthenticated()) {
            this.ProviderManager.get('twitter').fetch();
            this.disableLoginBtn(this.$el.find('#twitter-avatar-btn'));
        }

        // if (this.ProviderManager.get('twitter').isAuthenticated()) {
        //     this.ProviderManager.get('twitter').fetch();
        //     this.disableLoginBtn(this.$el.find('#facebook-avatar-btn'));
        // }

        if (this.ProviderManager.get('instagram').isAuthenticated()) {
            // this.ProviderManager.get('instagram').fetch();
            this.disableLoginBtn(this.$el.find('#instagram-avatar-btn'));
        }
    },

    disableLoginBtn($btnContainer) {
        $btnContainer.addClass('is-loggedin');

        let loginCount = 0;

        if (this.ProviderManager.get('twitter').isAuthenticated()) {
            loginCount++;
        }
        /*if (this.ProviderManager.get('facebook').isAuthenticated()) {
            loginCount++;
        }*/
        if (this.ProviderManager.get('instagram').isAuthenticated()) {
            loginCount++;
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

    twitterLoginHandler(event) {
        let $btn = $(event.currentTarget);
        
        this.ProviderManager.authenticate('twitter').then(function() {
            this.disableLoginBtn($btn);
        }.bind(this));
    },

    facebookLoginHandler(event) {
        let $btn = $(event.currentTarget);
        
        this.ProviderManager.authenticate('facebook').then(function() {
            this.disableLoginBtn($btn);
        }.bind(this));
    },
  
    instagramLoginHandler(event) {
        let $btn = $(event.currentTarget);
        
        this.ProviderManager.authenticate('instagram').then(function() {
            this.disableLoginBtn($btn);
        }.bind(this));
    }


});
