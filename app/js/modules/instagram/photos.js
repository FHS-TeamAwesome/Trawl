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

    initialize(accessToken) {
        this.accessToken = accessToken;
    },

    url() {
        return config.get('Client.providers.instagram.api') + '/users/self/media/recent/?access_token=' + this.accessToken;
    },

    sync : function(method, collection, options) {
        // By setting the dataType to "jsonp", jQuery creates a function
        // and adds it as a callback parameter to the request, e.g.:
        // [url]&callback=jQuery19104472605645155031_1373700330157&q=bananarama
        // If you want another name for the callback, also specify the
        // jsonpCallback option.
        // After this function is called (by the JSONP response), the script tag
        // is removed and the parse method is called, just as it would be
        // when AJAX was used.
        options.dataType = "jsonp";
        return Backbone.sync(method, collection, options);
    },

    parse(data) {
        if (!data) return {};

        //console.log(data);
        let photoArr = [];

        for(let x in data.data ){
            if(data.data[x].location !== null) {
                let photo = new Photo({
                    locationName: data.data[x].location.name,
                    latitude: data.data[x].location.latitude,
                    longitude: data.data[x].location.longitude,
                    url: data.data[x].images.standard_resolution.url
                });
                photoArr.push(photo);
            }
        }
        //console.log(photoArr);
        return data;
    }
});