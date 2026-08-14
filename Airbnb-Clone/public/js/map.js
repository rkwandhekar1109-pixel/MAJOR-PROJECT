mapboxgl.accessToken = mapToken;

const coords = listing.geometry?.coordinates ;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    projection: 'globe',
    zoom: 9,
    center: coords,
});

map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coords)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)
    )
    .addTo(map);



