'use strict';

import $ from 'jquery';
import View from 'core/view';

let MapsOverviewDetailTpl = require('app/templates/partials/maps-overview-detail.html');

export default View.extend({

    tagName: 'li',
    mediaObject: null,
    map: null,

    initialize(data, map) {
        this.template = MapsOverviewDetailTpl;
        this.mediaObject = data;
        this.map = map;
    },

    postPlaceAt() {
        this.$el.find('.media-picture').attr('src',this.mediaObject.url);

        let mediaDescription = this.$el.find('.media-description');
        mediaDescription.append('<p>');
        mediaDescription.append('Standort: ' + this.mediaObject.locationName + '<br>');
        mediaDescription.append('Hashtags: ');
        for(let i = 0; i < this.mediaObject.hashtags.length; i++) {
            if(i-1 != this.mediaObject.hashtags.length)
                mediaDescription.append('#' + this.mediaObject.hashtags[i] + ', ');
            else
                mediaDescription.append('#' + this.mediaObject.hashtags[i]);
        }
        mediaDescription.append('</p>');

        this.$el.click(function() {
            this.setLocation();
        }.bind(this));
    },

    setLocation() {
        this.map.setCenter(new google.maps.LatLng(this.mediaObject.latitude, this.mediaObject.longitude));
    }

});