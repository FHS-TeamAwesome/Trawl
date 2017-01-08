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

        let photoArr = [];

        for (let image in data.data) {
            let photo;

            if (data.data[image].location !== null) {
                photo = new Photo({
                    id: data.data[image].id,
                    locationName: data.data[image].location.name,
                    latitude: data.data[image].location.latitude,
                    longitude: data.data[image].location.longitude,
                    url: data.data[image].images.standard_resolution.url,
                    hashtags: data.data[image].tags
                });
            }
            else {
                photo = new Photo({
                    id: data.data[image].id,
                    locationName: null,
                    latitude: null,
                    longitude: null,
                    url: data.data[image].images.standard_resolution.url,
                    hashtags: data.data[image].tags
                });
            }

            photoArr.push(photo);
        }

        return photoArr;
    },

    getPhotosWithLocation() {
        let photoArr = [];

        for (let photo of this.models) {
            if (photo.get('locationName') !== null) {
                photoArr.push(photo.toJSON());
            }
        }

        return photoArr;
    },

    getHashTags() {
        let hashTagsCountMapping = {};

        for (let photo of this.models) {
            let photoHashtags = photo.get('hashtags');
            if (photoHashtags.length > 0) {
                for(let hashtag of photoHashtags) {
                    if(!hashTagsCountMapping[hashtag.toLowerCase()]) {
                        hashTagsCountMapping[hashtag.toLowerCase()] = {
                            ids: [photo.id],
                            provider: 'instagram',
                            name: hashtag,
                            count: 1
                        };
                    }
                    else {
                        hashTagsCountMapping[hashtag.toLowerCase()].ids.push(photo.id);
                        hashTagsCountMapping[hashtag.toLowerCase()].count++;
                    }
                }
            }
        }

        return Object.values(hashTagsCountMapping);
    }
});
