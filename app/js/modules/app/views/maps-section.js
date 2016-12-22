'use strict';

import $ from 'jquery';
import View from 'core/view';
import GoogleMapsLoader from 'google-maps';

let MapsTpl = require('app/templates/partials/maps.html');

export default View.extend({

    overlay: [],
    map: null,
    zoomLevel: 9,

    initialize() {
        this.template = MapsTpl;

        GoogleMapsLoader.KEY = "AIzaSyAh-kj7TyOmyZqhXADnBJOQGP3iDlVu85E";
        GoogleMapsLoader.LANGUAGE = 'de';
    },

    postPlaceAt() {
        window.addEventListener('resize', this.changeSize.bind(this));
    },

    createMap(data) {
        if(!data || data.length < 1)
            return;

        GoogleMapsLoader.load(function(google) {

            var options = {
                zoom: this.zoomLevel,
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                center: {lat: data.models[0].attributes.latitude, lng: data.models[0].attributes.longitude},
                mapTypeId: google.maps.MapTypeId.MAP
            };

            this.map = new google.maps.Map($('.map')[0], options);
            this.USGSOverlay.prototype = new google.maps.OverlayView();

            this.USGSOverlay.prototype.onAdd = this.USGSOverlayOnAdd;
            this.USGSOverlay.prototype.draw = this.USGSOverlayDraw;
            this.USGSOverlay.prototype.onRemove = this.USGSOverlayOnRemove;

            this.map.addListener('zoom_changed', this.changeSize.bind(this));

            var bounds = [];
            var srcImage = [];

            for(var i = 0; i < data.length; i++) {
                bounds.push(new google.maps.LatLngBounds(
                    new google.maps.LatLng(data.models[i].attributes.latitude - 0.065, data.models[i].attributes.longitude - 0.1),
                    new google.maps.LatLng(data.models[i].attributes.latitude + 0.065, data.models[i].attributes.longitude + 0.1)));

                srcImage.push(data.models[i].attributes.url);

                this.overlay.push(new this.USGSOverlay(bounds[i], srcImage[i], this.map));
            }

            //this.changeSize();

        }.bind(this));
    },

    USGSOverlay(bounds, image, map) {

        // Initialize all properties.
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay.
        this.setMap(map);
    },

    USGSOverlayOnAdd() {
        var a = document.createElement('a');
        a.href = this.image_;

        var div = document.createElement('div');
        var name = "photo";
        div.setAttribute("class", name);
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.classList.add('lightbox-target');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';

        a.appendChild(img);

        div.appendChild(a);

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);

        panes.overlayMouseTarget.appendChild(div); // this.marker = my dom el
        //google.maps.event.addDomListener(div, 'onmouseover', function(){  });
    },

    USGSOverlayDraw() {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
    },

    USGSOverlayOnRemove() {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    },

    changeSize() {
        var width = (this.map.getBounds().b.f - this.map.getBounds().b.b)/8;
        var height = (this.map.getBounds().f.b - this.map.getBounds().f.f)/(8/(this.$el.find('.map').width()/this.$el.find('.map').height()));
        var widthDifference = 0, heightDifference = 0;

        for(var i = 0; i < this.overlay.length; i++)
        {
            var widthOfPicture = this.overlay[i].bounds_.b.f - this.overlay[i].bounds_.b.b;
            var heightOfPicture = this.overlay[i].bounds_.f.b - this.overlay[i].bounds_.f.f;

            if(this.map.getZoom() > this.zoomLevel) {
                widthDifference = (widthOfPicture - width)/2;
                heightDifference = (heightOfPicture - height)/2;
                this.overlay[i].bounds_.f.f += heightDifference;
                this.overlay[i].bounds_.b.b += widthDifference;

                this.overlay[i].bounds_.b.f -= widthDifference;
                this.overlay[i].bounds_.f.b -= heightDifference;

                this.overlay[i].draw();
            }
            else {
                widthDifference = (width - widthOfPicture)/2;
                heightDifference = (height - heightOfPicture)/2;
                this.overlay[i].bounds_.f.f -= heightDifference;
                this.overlay[i].bounds_.b.b -= widthDifference;

                this.overlay[i].bounds_.b.f += widthDifference;
                this.overlay[i].bounds_.f.b += heightDifference;

                this.overlay[i].draw();
            }
        }

        this.zoomLevel = this.map.getZoom();
    }
});
