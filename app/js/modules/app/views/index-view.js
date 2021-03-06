'use strict';

import View from 'core/view';
import HeaderSection from 'app/views/header-section';
import MapsSection from 'app/views/maps-section';
import ActivitySection from 'app/views/activity-section';
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
        
        this.addSectionHandler();
    },

    addSectionHandler() {
        if (this.DataManager.hasHashTags() && !this.checkSectionExist(TagsSection)) {
            this.addTagSection();
        }

        if (this.DataManager.hasPhotos() && !this.checkSectionExist(MapsSection)) {
            this.addMapSection();
        }

        if (this.DataManager.hasActivities() && !this.checkSectionExist(ActivitySection)) {
            this.addActivitySection();
        }

    },

    checkSectionExist(SectionInstance) {
        for (let section of this.sections) {
            if (section instanceof SectionInstance) {
                return true;
            }
        }
    },

    addActivitySection() {
        this.addSection(new ActivitySection());
    },

    addTagSection() {
        this.addSection(new TagsSection());
    },

    addMapSection() {
        this.addSection(new MapsSection());
    }
});
