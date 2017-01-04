'use strict';

import View from 'core/view';
import HeaderSection from 'app/views/header-section';
import MapsSection from 'app/views/maps-section';
import ChartView from 'app/views/chart-view';

export default View.extend({
    initialize() {
        this.sections = [];
        this.ProviderManager = this.getService('ProviderManager');
    },

    postPlaceAt() {
        this.EventDispatcher.on('fetched:instagram:photos', this.createMapSection.bind(this));
    },

    addSection(section) {
        section.render().placeAt(this.$el);
        this.sections.push(section);
    },

    postRender() {
        // adding header section first
        this.addSection(new HeaderSection());

        if (this.ProviderManager.get('instagram').isAuthenticated() ||
            this.ProviderManager.get('twitter').isAuthenticated() ||
            this.ProviderManager.get('facebook').isAuthenticated()) {
            this.createMapSection();
            this.addSection(new ChartView());
        }
    },

    createMapSection() {
        var map = new MapsSection();
        this.addSection(map);

        var mediaObj = [];
        var photos  = [];

        photos = this.ProviderManager.get('twitter').tweets.getPhotosWithLocation();
        for(let photo of photos) {
            mediaObj.push(photo);
        }

        photos = this.ProviderManager.get('instagram').photos.getPhotosWithLocation();
        for(let photo of photos) {
            mediaObj.push(photo);
        }

        console.log(mediaObj);

        /*
        photos = this.ProviderManager.get('facebook').photos.getPhotosWithLocation();
        for(let photo of photos) {
            mediaObj.push(photo);
        }*/

        map.createMap();
        //map.addData();
    }
});
