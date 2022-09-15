mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: roastery.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat(roastery.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
    )
    .addTo(map)
    