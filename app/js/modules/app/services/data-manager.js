'use strict';

import $ from 'jquery';
import ServiceLocator from 'core/service-locator';
import ProviderManager from 'app/services/provider-manager';

ServiceLocator.create('DataManager', class DataManager {
    constructor() {
        this.ProviderManager = ServiceLocator.get('ProviderManager');
    }

    getHashTags() {
        let twitterHashTags = [];
        let facebookHashTags = [];
        let instagramHashTags = [];
        let total = [];

        if (
            this.ProviderManager.get('twitter').isAuthenticated() && 
            this.ProviderManager.get('twitter').tweets.getHashTags
        ) {
            twitterHashTags = this.ProviderManager.get('twitter').tweets.getHashTags();
        }

        if (
            this.ProviderManager.get('instagram').isAuthenticated() && 
            this.ProviderManager.get('instagram').photos.getHashTags()
        ) {
            instagramHashTags = this.ProviderManager.get('instagram').photos.getHashTags();
        }

        if (
            this.ProviderManager.get('facebook').isAuthenticated() && 
            this.ProviderManager.get('facebook').feed.getHashTags
        ) {
            facebookHashTags = this.ProviderManager.get('facebook').feed.getHashTags();
        }

        //create total
        return {
            instagram: instagramHashTags,
            twitter: twitterHashTags,
            facebook: facebookHashTags,
            total: total.concat(twitterHashTags, instagramHashTags, facebookHashTags)
        };
    }

    hasHashTags() {
        return this.getHashTags().total.length > 0;
    }

});
