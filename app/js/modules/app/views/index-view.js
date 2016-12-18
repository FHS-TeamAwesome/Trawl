'use strict';

import View from 'core/view';
import HeaderSection from 'app/views/header-section';
import MapsSection from 'app/views/maps-section';

export default View.extend({
    initialize() {
        this.sections = [];
        this.ProviderManager = this.getService('ProviderManager');
    },

    postPlaceAt() {
        this.EventDispatcher.on('fetched:twitter:likes', this.createLikesSection.bind(this));
        this.EventDispatcher.on('fetched:instagram:photos', this.createMapSection.bind(this));
    },

    addSection(section) {
        section.render().placeAt(this.$el);
        this.sections.push(section);
    },

    postRender() {
        // adding header section first
        this.addSection(new HeaderSection());
    },

    createLikesSection() {
        console.log(this.ProviderManager.get('twitter').likes.toJSON());
    },

    createMapSection() {
        var map = new MapsSection();
        this.addSection(map);

        map.createMap(this.ProviderManager.get('instagram').photos);
    }
});
