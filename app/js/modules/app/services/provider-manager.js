'use strict';

import $ from 'jquery';
import ServiceLocator from 'core/service-locator';
import core from 'core';

ServiceLocator.create('ProviderManager', class ProviderManager {
    constructor() {
        this.providers = [];
        this.providersByName = {};
        this.EventDispatcher = core.EventDispatcher;
    }

    add(name, provider) {
        this.providersByName[name] = provider;
        this.providers.push(provider);

        return this;
    }

    get(name) {
        return this.providersByName[name];
    }

    getProgress() {
        let progress = 0;

        for (let provider of this.providers) {
            if (provider.isAuthenticated()) {
                progress += 100 / this.providers.length;
            }
        }

        return progress;
    }

    authenticate(name) {
        let provider = this.get(name);

        return this.openPopup(provider.auth.authUrl).then(function() {
            return this.fetchAuth(name);
        }.bind(this));
    }

    fetchAuth(name) {
        let provider = this.get(name);

        return provider.auth.fetch().then(function() {
            return provider.fetch().then(function() {
                this.EventDispatcher.trigger('provider:fetch:complete', { provider });
            }.bind(this));
        }.bind(this));
    }

    openPopup(authUrl) {
        var dfd = $.Deferred();
        let address = 'http://' + window.location.host + authUrl;
        let target = '_blank';
        let settings = 'toolbar=yes,scrollbars=yes,resizable=yes,top=250,left=500,width=900,height=700';

        window.OAUTH_REQUEST = { 
            successHandler: dfd.resolve,
            failHandler: dfd.reject
        };

        window.open(address, target, settings);

        return dfd.promise();
    }
});
