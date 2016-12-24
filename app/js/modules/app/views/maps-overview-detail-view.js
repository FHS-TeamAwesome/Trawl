'use strict';

import $ from 'jquery';
import View from 'core/view';

let MapsOverviewDetailTpl = require('app/templates/partials/maps-overview-detail.html');

export default View.extend({

    tagName: 'li',
    mediaObject: null,

    initialize(data) {
        this.template = MapsOverviewDetailTpl;
        this.mediaObject = data;
    },

    postPlaceAt() {
        console.log(this.mediaObject);
        this.$el.find('.media-picture').attr('src',this.mediaObject.url);

        let mediaDescription = this.$el.find('.media-description');
        mediaDescription.append('<p>');
        mediaDescription.append('Standort: ' + this.mediaObject.locationName + '<br>');
        mediaDescription.append('Hashtags: ');
        for(let i = 0; i < this.mediaObject.hashtags.length; i++) {
            if(i-1 != this.mediaObject.hashtags.length)
                mediaDescription.append(this.mediaObject.hashtags[i] + ', ');
            else
                mediaDescription.append(this.mediaObject.hashtags[i]);
        }
        mediaDescription.append('</p>');
    }

});