'use strict';

import $ from 'jquery';
import ServiceLocator from 'core/service-locator';
import ProviderManager from 'app/services/provider-manager';

ServiceLocator.create('DataProcessor', class DataProcessor {
    constructor() {
        this.ProviderManager = ServiceLocator.get('ProviderManager');
    }

    getHashtags() {
        let hashtags = [];

        if (this.ProviderManager.get('twitter').isAuthenticated() && this.ProviderManager.get('twitter').getHashtags) {
            this.ProviderManager.get('twitter').getHashtags();
        }
        if (this.ProviderManager.get('instagram').isAuthenticated() && this.ProviderManager.get('instagram').photos.getHashtags()) {
            //console.log(this.ProviderManager.get('instagram').photos.getPhotosWithLocation());
            //console.log(this.ProviderManager.get('instagram').photos.toJSON());
            this.ProviderManager.get('instagram').photos.getHashtags();
        }
        if (this.ProviderManager.get('facebook').isAuthenticated() && this.ProviderManager.get('facebook').getHashtags) {
            this.ProviderManager.get('facebook').getHashtags();
        }

        //create total

        return {
            instagram: [],
            twitter: [],
            facebook: [],
            total: []
        };
    }

});