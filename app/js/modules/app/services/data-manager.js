'use strict';

import $ from 'jquery';
import _ from 'underscore';
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

    getHashTagContent(ids, providerName) {
        let entries = [];
        let providerCollection = {
            'twitter': this.ProviderManager.get('twitter').tweets,
            'facebook': this.ProviderManager.get('facebook').feed,
            'instagram': this.ProviderManager.get('instagram').photos
        };

        entries = _.map(ids, function(id) {
            let entry = providerCollection[providerName].get(id);

            return {
                url: entry.getUrl(),
                text: entry.getText(),
                thumbnail: entry.getThumbnail()
            };
        });

        return entries;
    }

    getPhotos() {
        let twitterPhotos = [];
        let facebookPhotos = [];
        let instagramPhotos = [];
        let total = [];

        if (
            this.ProviderManager.get('twitter').isAuthenticated() &&
            this.ProviderManager.get('twitter').tweets.getPhotosWithLocation
        ) {
            twitterPhotos = this.ProviderManager.get('twitter').tweets.getPhotosWithLocation();
        }

        if (
            this.ProviderManager.get('instagram').isAuthenticated() &&
            this.ProviderManager.get('instagram').photos.getPhotosWithLocation()
        ) {
            instagramPhotos = this.ProviderManager.get('instagram').photos.getPhotosWithLocation();
        }

        if (
            this.ProviderManager.get('facebook').isAuthenticated() &&
            this.ProviderManager.get('facebook').photos.getPhotosWithLocation
        ) {
            facebookPhotos = this.ProviderManager.get('facebook').photos.getPhotosWithLocation();
        }

        //create total
        return {
            instagram: instagramPhotos,
            twitter: twitterPhotos,
            facebook: facebookPhotos,
            total: total.concat(twitterPhotos, instagramPhotos, facebookPhotos)
        };
    }

    hasPhotos() {
        return this.getPhotos().total.length > 0;
    }

    getActivities() {
        let twitterActivities = [];
        let facebookActivities = [];
        let instagramActivities = [];
        let total = [];

        if (
            this.ProviderManager.get('twitter').isAuthenticated() &&
            this.ProviderManager.get('twitter').activities.get('activities')
        ) {
            twitterActivities = this.ProviderManager.get('twitter').activities.get('activities');
        }

        if (
            this.ProviderManager.get('instagram').isAuthenticated() &&
            this.ProviderManager.get('instagram').activities.get('activities')
        ) {
            instagramActivities = this.ProviderManager.get('instagram').activities.get('activities');
        }

        if (
            this.ProviderManager.get('facebook').isAuthenticated() &&
            this.ProviderManager.get('facebook').activities.get('activities')

        ) {
            facebookActivities = this.ProviderManager.get('facebook').activities.get('activities');
        }

        //create total
        return {
            instagram: instagramActivities,
            twitter: twitterActivities,
            facebook: facebookActivities,
            total: total.concat(twitterActivities, instagramActivities, facebookActivities)
        };
    }

    hasActivities() {
        return this.getActivities().total.length > 0;
    }
});
