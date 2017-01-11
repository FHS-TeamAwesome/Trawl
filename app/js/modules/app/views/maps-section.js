'use strict';

import $ from 'jquery';
import View from 'core/view';
import GoogleMapsLoader from 'google-maps';
import MapsOverviewContainer from 'app/views/maps-overview-container-view';

let MapsTpl = require('app/templates/partials/maps.html');

export default View.extend({

    overlay: [],
    map: null,
    google: null,
    zoomLevel: 9,
    photos: null,
    isCenterSet: false,
    mapsOverviewContainer: null,
    key: 'AIzaSyAh-kj7TyOmyZqhXADnBJOQGP3iDlVu85E',

    initialize() {
        this.template = MapsTpl;

        this.DataManager = this.getService('DataManager');

        this.ScrollManager = this.getService('ScrollManager');

        if(this.DataManager.hasPhotos()) {
            this.photos = this.DataManager.getPhotos();
        }

        GoogleMapsLoader.KEY = this.key;
        GoogleMapsLoader.LANGUAGE = 'de';

        GoogleMapsLoader.load(function(google) {

            var options = {
                zoom: this.zoomLevel,
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                mapTypeId: google.maps.MapTypeId.MAP
            };

            this.google = google;
            this.map = new google.maps.Map($('.map')[0], options);
            this.map.setCenter({lat: 47.72412, lng: 13.08633});

            this.map.setOptions({styles: this.styles});

            this.USGSOverlay.prototype = new google.maps.OverlayView();

            this.USGSOverlay.prototype.onAdd = this.USGSOverlayOnAdd;
            this.USGSOverlay.prototype.draw = this.USGSOverlayDraw;
            this.USGSOverlay.prototype.onRemove = this.USGSOverlayOnRemove;

            this.map.addListener('zoom_changed', this.changeSize.bind(this));

            this.addData();

        }.bind(this));
    },

    addData() {
        var bounds = [];
        var srcImage = [];

        if(this.DataManager.hasPhotos())
            this.photos = this.DataManager.getPhotos();

        if(!this.photos)
            return;

        if(this.isCenterSet === false) {
            this.isCenterSet = true;

            this.map.setCenter({lat: this.photos.total[0].latitude, lng: this.photos.total[0].longitude});
        }

        for(var i = 0; i < this.photos.total.length; i++) {

            bounds.push(new this.google.maps.LatLngBounds(
                new this.google.maps.LatLng(this.photos.total[i].latitude - 0.065, this.photos.total[i].longitude - 0.1),
                new this.google.maps.LatLng(this.photos.total[i].latitude + 0.065, this.photos.total[i].longitude + 0.1)));

            srcImage.push(this.photos.total[i].url);

            this.overlay.push(new this.USGSOverlay(bounds[i], srcImage[i], this.map));
        }

        this.createMapOverview(this.photos.total);
    },

    postPlaceAt() {
        window.addEventListener('resize', this.changeSize.bind(this));

        this.ScrollManager.add(this.$el, this.onScrollEnter.bind(this));
    },

    postRender() {
        this.EventDispatcher.on('provider:fetch:complete', this.addPhotosHandler.bind(this));
    },

    onScrollEnter() {
        this.$el.find('.map').addClass('is-presented');
        this.getService('Textillate').shuffle(this.$el.find('.page-section-description'));
    },

    addPhotosHandler() {
        this.resetData();
    },

    resetData() {
        for(let o of this.overlay) {
            o.setMap(null);
        }
        this.overlay = [];
        this.isCenterSet = false;
        this.addData();
    },

    createMapOverview(data) {
        let dataMapsObj = {
            data: data,
            map: this.map
        };

        if(this.mapsOverviewContainer === null) {
            this.mapsOverviewContainer = new MapsOverviewContainer();
            this.mapsOverviewContainer.addData(dataMapsObj);
            this.mapsOverviewContainer.render().placeAt(this.$el.find('.map-overview'));
        }
        else {
            this.mapsOverviewContainer.resetData();
            this.mapsOverviewContainer.addData(dataMapsObj);
            this.mapsOverviewContainer.renderData();
        }
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
        var name = 'photo';
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
    },

    styles: [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#181818"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1b1b1b"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#2c2c2c"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8a8a8a"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#373737"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#3c3c3c"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#4e4e4e"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#3d3d3d"
                }
            ]
        }
    ]
});
