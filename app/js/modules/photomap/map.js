'use strict';

import Model from 'core/model';

module.exports = Model.extend({

    overlay: [],
    map: null,
    zoomLevel: 9,
    //USGSOverlay.prototype: new google.maps.OverlayView();

    initialize(userPhotos) {
        /*map = new google.maps.Map(document.getElementById('map'), {
            zoom: zoomLevel,
            center: {lat: userPhotos[0].lat, lng: userPhotos[0].lng},
            mapTypeId: google.maps.MapTypeId.MAP
        });

        map.addListener('zoom_changed', onZoom);

        var bounds = [];
        var srcImage = [];

        for(var i = 0; i < userPhotos.length; i++)
        {
            bounds.push(new google.maps.LatLngBounds(
                new google.maps.LatLng(userPhotos[i].lat-0.065, userPhotos[i].lng-0.1),
                new google.maps.LatLng(userPhotos[i].lat+0.065, userPhotos[i].lng+0.1)));

            srcImage.push(userPhotos[i].pic);

            overlay.push(new USGSOverlay(bounds[i],srcImage[i],map));

        }*/
    }

});
