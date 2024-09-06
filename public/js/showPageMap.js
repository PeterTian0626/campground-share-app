maptilersdk.config.apiKey = mapToken;
console.dir(camp.geometry)
const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: camp.geometry.coordinates,
  zoom: 7,
  // causes pan & zoom handlers not to be applied, similar to
  // .dragging.disable() and other handler .disable() funtions in Leaflet.
  // interactive: false,
  // navigationControl: false,
  // geolocateControl: false
});

const marker = new maptilersdk.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`<h3>${camp.title} </h3>`))
  .addTo(map);