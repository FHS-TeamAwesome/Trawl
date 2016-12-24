'use strict';

import $ from 'jquery';
import View from 'core/view';
import MapsOverviewDetail from 'app/views/maps-overview-detail-view';

export default View.extend({

    tagName: 'ul',
    mediaObjects: null,
    map: null,

    initialize(data, map) {
        this.$el.addClass('maps-overview-container');
        this.mediaObjects = data;
        this.map = map;
    },

    postRender() {
        for(let i = 0; i < this.mediaObjects.length; i++) {
            this.addMediaDetail(this.mediaObjects[i]);
        }
    },

    addMediaDetail(mediaObject) {
        (new MapsOverviewDetail(mediaObject, this.map)).render().placeAt(this.$el);
    }

});