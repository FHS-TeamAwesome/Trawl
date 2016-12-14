/*function getCookie(name) {
var dc = document.cookie;
var prefix = name + "=";
var begin = dc.indexOf("; " + prefix);
if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
}
else
{
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
    end = dc.length;
    }
}
// because unescape has been deprecated, replaced with decodeURI
//return unescape(dc.substring(begin + prefix.length, end));
return decodeURI(dc.substring(begin + prefix.length, end));
} 

var instaCookie = getCookie("instagram_token");

if (instaCookie != null) {
  alert(instaCookie);
}
else
{
document.cookie = "instagram_token=blabla";
}*/

//var token = '1807917319.f1d7893.490b6c25504f41b8a7bd32672c2b5a1c', // learn how to obtain it below
var token = '', // learn how to obtain it below
userid = '', // User ID - get it in source HTML of your Instagram profile or look at the next example :)
num_photos = 30; // how much photos do you want to get
var picture_arr = []

//Fetch access token
if(window.location.hash.substr(1)!=0)
{
  let token_arr = window.location.hash.substr(1).split("=");
  if(token_arr[0] == "access_token")
  {
    token = token_arr[1];
    userid = token_arr[1].split(".")[0];
  }
}

if(token != '') {
  $.ajax({
    url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent', // or /users/self/media/recent for Sandbox
    dataType: 'jsonp',
    type: 'GET',
    data: {access_token: token, count: num_photos},
    success: function(data){
        console.log(data);
        for( x in data.data ){
            $('ul').append('<li><img src="'+data.data[x].images.low_resolution.url+'">');
            if(data.data[x].location != null)
            {
                $('ul').append('Latitude: "'+data.data[x].location.latitude+'<br>');
                $('ul').append('Longitude: "'+data.data[x].location.longitude+'<br>');
                $('ul').append('Name: "'+data.data[x].location.name+'<br>');
                var picture = {name:data.data[x].location.name,lat:data.data[x].location.latitude,lng:data.data[x].location.longitude,pic:data.data[x].images.standard_resolution.url};
                picture_arr.push(picture);
            }
            $('ul').append('</li>'); // data.data[x].images.low_resolution.url - URL of image, 306х306
            // data.data[x].images.thumbnail.url - URL of image 150х150
            // data.data[x].images.standard_resolution.url - URL of image 612х612
            // data.data[x].link - Instagram post URL 
        }
        google.maps.event.addDomListener(window, 'load', initMap(picture_arr));
    },
    error: function(data){
        console.log(data); // send the error notifications to console
    }
  });
}
