'use strict';

import View from 'core/view';
import HeaderSection from 'app/views/header-section';
import MapsSection from 'app/views/maps-section';
import ChartView from 'app/views/chart-view';
import TagsSection from 'app/views/tags-section';

export default View.extend({
    initialize() {
        this.sections = [];
        this.DataManager = this.getService('DataManager');
        this.ProviderManager = this.getService('ProviderManager');
    },

    postDestroy() {
        this.EventDispatcher.off('provider:fetch:complete');
    },

    postPlaceAt() {
        // this.EventDispatcher.on('fetched:instagram:photos', this.createMapSection.bind(this));

        this.EventDispatcher.on('provider:fetch:complete', this.addSectionHandler.bind(this));
    },

    addSection(section) {
        section.render().placeAt(this.$el);
        this.sections.push(section);

        if (this.sections.length > 1) {
            this.EventDispatcher.trigger('scrolling:enable');
        }
    },

    postRender() {
        // adding header section first
        this.addSection(new HeaderSection());

        // if (this.ProviderManager.get('instagram').isAuthenticated()) {
        //     this.createMapSection();
        // }

        // if (this.ProviderManager.get('instagram').isAuthenticated() ||
        //     this.ProviderManager.get('twitter').isAuthenticated() ||
        //     this.ProviderManager.get('facebook').isAuthenticated()) {
        //     this.addSection(new ChartView());
        // }
        
        this.addSectionHandler();
    },

    addSectionHandler() {
        if (this.DataManager.hasHashTags() && !this.checkSectionExist(TagsSection)) {
            this.addTagSection();
        }
    },

    checkSectionExist(SectionInstance) {
        for (let section of this.sections) {
            if (section instanceof SectionInstance) {
                return true;
            }
        }
    },

    addTagSection() {
        this.addSection(new TagsSection());
    },

    createMapSection() {
        var map = new MapsSection();
        this.addSection(map);

        map.createMap(this.ProviderManager.get('instagram').photos.getPhotosWithLocation());
    }
});
