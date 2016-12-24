'use strict';

import $ from 'jquery';
import View from 'core/view';
import MapsOverviewDetail from 'app/views/maps-overview-detail-view';

export default View.extend({

    tagName: 'ul',
    mediaObjects: null,

    initialize(data) {
        this.$el.addClass('maps-overview-container');
        this.mediaObjects = data;
    },

    postRender() {
        for(let i = 0; i < this.mediaObjects.length; i++) {
            this.addMediaDetail(this.mediaObjects[i]);
        }
    },

    addMediaDetail(mediaObject) {
        (new MapsOverviewDetail(mediaObject)).render().placeAt(this.$el);
    }

});