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

    addSection(section) {
        section.render().placeAt(this.$el);
        this.sections.push(section);
    },

    postRender() {
        // adding header section first
        this.addSection(new HeaderSection());
        
        this.addSection(new ChartView());
        this.addSection(new MapsSection());
    }
});
