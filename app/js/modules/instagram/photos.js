'use strict';

import $ from 'jquery';
import config from 'config';
import Model from 'core/model';
import Backbone from 'backbone';

import Collection from 'core/collection';
import Photo from 'instagram/photo';

module.exports = Collection.extend({
    model: Photo,

    accessToken: null,

    reqDataType: 'jsonp',

    initialize(accessToken) {
        this.accessToken = accessToken;
    },

    url() {
        return config.get('Client.providers.instagram.api') + '/users/self/media/recent/?access_token=' + this.accessToken;
    },

    parse(data) {
        if (!data) return {};

        //console.log(data);
        let photoArr = [];

        for(let image in data.data ) {
            if (data.data[image].location !== null) {
                let photo = new Photo({
                    locationName: data.data[image].location.name,
                    latitude: data.data[image].location.latitude,
                    longitude: data.data[image].location.longitude,
                    url: data.data[image].images.standard_resolution.url
                });
                photoArr.push(photo);
            }
        }

        return photoArr;
    }
});
