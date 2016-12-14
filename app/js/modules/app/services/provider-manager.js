'use strict';

import $ from 'jquery';
import ServiceLocator from 'core/service-locator';

ServiceLocator.create('ProviderManager', class ProviderManager {
    constructor() {
        this.providers = {};
    }

    add(name, provider) {
        this.providers[name] = provider;

        return this;
    }

    get(name) {
        return this.providers[name];
    }

    authenticate(name) {
        let provider = this.get(name);

        return this.openPopup(provider.auth.authUrl).then(function() {
            //For instagram and facebook
            if (provider.auth.getAccessToken) {
                return provider.auth.getAccessToken().then(function() {
                    provider.auth.fetch().then(function() {
                        console.log(provider.auth);

                        if(provider.getPhotos){
                            provider.getPhotos();
                        }

                    });
                });
            }
            //For twitter
            return provider.auth.fetch();
        }.bind(this));
    }

    fetchAuth(name) {
        let provider = this.get(name);

        return provider.auth.fetch();
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
