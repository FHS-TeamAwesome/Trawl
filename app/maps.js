// [START region_initialization]
// This example creates a custom overlay called USGSOverlay, containing
// a U.S. Geological Survey (USGS) image of the relevant area on the map.

// Set the custom overlay object's prototype to a new instance
// of OverlayView. In effect, this will subclass the overlay class therefore
// it's simpler to load the API synchronously, using
// google.maps.event.addDomListener().
// Note that we set the prototype to an instance, rather than the
// parent class itself, because we do not wish to modify the parent class.
var overlay = [];
var map;
var zoomLevel = 9;
USGSOverlay.prototype = new google.maps.OverlayView();
// Initialize the map and the custom overlay.

function initMap(picture_arr) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoomLevel,
    center: {lat: picture_arr[0].lat, lng: picture_arr[0].lng},
    mapTypeId: google.maps.MapTypeId.MAP
  });

  map.addListener('zoom_changed', onZoom);

  var bounds = [];
  var srcImage = [];

  for(var i = 0; i < picture_arr.length; i++) 
  {
    bounds.push(new google.maps.LatLngBounds(
      new google.maps.LatLng(picture_arr[i].lat-0.065, picture_arr[i].lng-0.1),
      new google.maps.LatLng(picture_arr[i].lat+0.065, picture_arr[i].lng+0.1)));

    srcImage.push(picture_arr[i].pic);

    overlay.push(new USGSOverlay(bounds[i],srcImage[i],map));

  }


}
// [END region_initialization]

// [START region_constructor]
/** @constructor */
function USGSOverlay(bounds, image, map) {

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
}
// [END region_constructor]

// [START region_attachment]
/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
USGSOverlay.prototype.onAdd = function() {

  var a = document.createElement('a');
  a.href = this.image_;
  a.setAttribute("data-lightbox","image-1");
  a.setAttribute("data-title","Blabla");

  var div = document.createElement('div');
  var name = "insta_photo";
  div.setAttribute("class", name);
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';

  // Create the img element and attach it to the div.
  var img = document.createElement('img');
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
  google.maps.event.addDomListener(div, 'onmouseover', function(){  });
};
// [END region_attachment]

// [START region_drawing]
USGSOverlay.prototype.draw = function() {

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
};
// [END region_drawing]

// [START region_removal]
// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
USGSOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};



function onZoom() {
  var width = (map.getBounds().b.f - map.getBounds().b.b)/8;
  var height = (map.getBounds().f.b - map.getBounds().f.f)/8;

  for(var i = 0; i < overlay.length; i++)
  {
    var widthOfPicture = overlay[i].bounds_.b.f - overlay[i].bounds_.b.b;
    var heightOfPicture = overlay[i].bounds_.f.b - overlay[i].bounds_.f.f;

    if(map.getZoom() > zoomLevel) {
      var widthDifference = (widthOfPicture - width)/2;
      var heightDifference = (heightOfPicture - height)/2;
      overlay[i].bounds_.f.f += heightDifference;
      overlay[i].bounds_.b.b += widthDifference;

      overlay[i].bounds_.b.f -= widthDifference;
      overlay[i].bounds_.f.b -= heightDifference;

      overlay[i].draw();
    }
    else {
      var widthDifference = (width - widthOfPicture)/2;
      var heightDifference = (height - heightOfPicture)/2;
      overlay[i].bounds_.f.f -= heightDifference;
      overlay[i].bounds_.b.b -= widthDifference;

      overlay[i].bounds_.b.f += widthDifference;
      overlay[i].bounds_.f.b += heightDifference;
      
      overlay[i].draw();
    }
  }

  zoomLevel = map.getZoom();
}



