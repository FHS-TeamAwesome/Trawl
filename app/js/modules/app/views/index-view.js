'use strict';

import View from 'core/view';
import HeaderSection from 'app/views/header-section';

export default View.extend({
    initialize() {
        this.sections = [];
        this.ProviderManager = this.getService('ProviderManager');
    },

    postPlaceAt() {
        this.EventDispatcher.on('fetched:twitter:likes', this.createLikesSection.bind(this));
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
    }
});
