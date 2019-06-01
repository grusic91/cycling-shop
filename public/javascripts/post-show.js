mapboxgl.accessToken = 'pk.eyJ1IjoiZ3J1c2ljOTEiLCJhIjoiY2p3N2hzZngyMmV6cTRhcXFuZzkxZHlrMCJ9.vhqtpj8nL-230Dtp7kk4Kw';

var map = new mapboxgl.Map({
  container: 'map', //that map is attached to id in div with map id
  style: 'mapbox://styles/mapbox/light-v10',
  center: post.geometry.coordinates,
  zoom: 5
});

// create a HTML element for post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for location and add to the map
new mapboxgl.Marker(el)
  .setLngLat(post.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
  .addTo(map);

  // toggle edit review form
  $('.toggle-edit-form').on('click', function(){
    // toggle the edit button text on click
    $(this).text() === 'Edit' ? $(this).text('Canel') : $(this).text('Edit');
    // toggle visibility of the edit reviw form
    $(this).siblings('.edit-review-form').toggle();
  });

  // Add click listener for clearing of rating from edit/new form
  $('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
  });
