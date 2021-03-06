'use strict';

import $ from 'jquery';
import View from 'core/view';
import MapsOverviewDetail from 'app/views/maps-overview-detail-view';

export default View.extend({

    tagName: 'ul',
    mediaObjects: null,
    map: null,

    initialize() {
        this.$el.addClass('maps-overview-container');
    },

    postRender() {
        this.renderData();
    },

    addData(data) {
        this.mediaObjects = data.data;
        this.map = data.map;
    },

    renderData() {
        for(let i = 0; i < this.mediaObjects.length; i++) {
            this.addMediaDetail(this.mediaObjects[i]);
        }
    },

    resetData() {
        this.$el.empty();
    },

    addMediaDetail(mediaObject) {
        let dataMapsObj = {
            mediaObject: mediaObject,
            map: this.map
        };

        (new MapsOverviewDetail(dataMapsObj)).render().placeAt(this.$el);
    }

});