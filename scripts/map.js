/**
 * Title: map.js
 * Summary: Initializes a Google Map which is centered at the latitude and longitude of Living Planet HQ.
 *          There are interactive markers for major UK cities that display the air quality data retrieved from the OpenWeatherMap API.
 *          Additionally, there are interactive custom markers that can be added dynamically by clicking on the map which also dynamically updates the weather.
 * Author: Luke Walpole, Kay Rogage (Week 8 and 9)
 */

/**
 * Summary: Initialises and displays a Google Map on the home page with custom markers for certain cities which displays the air quality.
 * Author: Luke Walpole, Kay Rogage (Week 8 and 9)
 */

function initMap() {
    // Living Planet HQ coordinates are used as the center of the map.
    var myLatLng = new google.maps.LatLng(54.977775, -1.604488);

    // Configuration options for setting up the initial map.
    let mapOptions = {
        center: new google.maps.LatLng(myLatLng),
        zoom: 10, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        overviewMapControl: false,
        rotateControl: false,
        scaleControl: false,
        panControl: false,
        mapId: "DEMO_MAP_ID",
    };

    // Creates a new google map and keeps track of the currently opened infowindow.
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    let currentInfoWindow = null;

    // Array of cities within the UK with coordinates.
    const cities = [
        { name: "Newcastle", lat: 54.9778, lng: -1.6129 },
        { name: "London", lat: 51.5074, lng: -0.1278 },
        { name: "Manchester", lat: 53.4808, lng: -2.2426 },
        { name: "Birmingham", lat: 52.4862, lng: -1.8904 },
        { name: "Leeds", lat: 53.8008, lng: -1.5491 },
        // I only added a few major cities to demonstrate how it works, although there are probably better ways of handling this that allow you to add every city.
    ];

    // For loop that goes through the array of cities and calls the function for each one and adding markers to the map.
    cities.forEach(city => {
        addCityAirQualityMarker(city, map);
    });

    /**
     * Summary: Adds an interactive marker for a city on the map to display air quality data.
     *          Creates a marker and an info window that appears on mouse hover.
     *          Also when the user hovers over the marker it displays an infowindow but disappears when the mouse is moved away.
     * @param {Object} city - Contains the name, latitude, and longitude of the city.
     * @param {Object} map - The Google Map that the marker is added to.
     * Author: Luke Walpole, Kay Rogage (Week 8 and 9)
     */

    function addCityAirQualityMarker(city, map) {
        $.getJSON(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lng}&appid=49b4d764a04887a21471a4c49872ca6e`, function(data) {
            var aqi = data.list[0].main.aqi;
            var aqiInfo = determineAirQuality(aqi);

            const markerContent = document.createElement('div');
            markerContent.classList.add('marker-content', `marker-${aqiInfo.status.toLowerCase()}`);
            markerContent.textContent = city.name;

            const cityMarker = new google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(city.lat, city.lng),
                title: `${city.name}: ${aqiInfo.status}`,
                content: markerContent,
                map: map
            });

            const aqiInfoWindow = new google.maps.InfoWindow({
                content: `<div><strong>City:</strong> ${city.name}<br><strong>Air Quality Index:</strong> ${aqi} - ${aqiInfo.description}</div>`
            });

            markerContent.addEventListener('mouseover', () => {
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                aqiInfoWindow.open({
                    anchor: cityMarker,
                    map: map,
                    shouldFocus: false
                });
                currentInfoWindow = aqiInfoWindow;
            });

            markerContent.addEventListener('mouseout', () => {
                aqiInfoWindow.close();
                currentInfoWindow = null;
            });
        });
    }

    // Event listener on the map that handles click events.
    google.maps.event.addListener(map, 'click', function(event) {
        var clickedLat = event.latLng.lat();
        var clickedLng = event.latLng.lng();
        updateWeatherDetails(clickedLat, clickedLng);
        addAirQualityMarker(clickedLat, clickedLng, map);
    });

    // Creates a marker for Living Planet HQ at the correct location.
    const initialMarkerContent = document.createElement('div');
    initialMarkerContent.classList.add('marker-content', 'marker-neutral');
    initialMarkerContent.textContent = "Living Planet HQ";

    const initialMarker = new google.maps.marker.AdvancedMarkerElement({
        position: myLatLng,
        title: "Living Planet HQ",
        content: initialMarkerContent,
        map: map
    });

    // Creates an infowindow which displays information when clicked on.
    const infoWindowContent =
        '<div id="content">' +
        '<h1>Living Planet HQ</h1>' +
        '<p>Living Planet HQ is a charity who are trying to improve air quality within the UK!</p>' +
        '</div>';

    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
    });

    // Event listener for the Living Planet HQ marker.
    google.maps.event.addListener(initialMarker, 'click', function(){
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }
        infoWindow.open({
            anchor: initialMarker,
            map,
        });
        currentInfoWindow = infoWindow;
    });

    /**
     * Summary: Fetches the current weather data from OpenWeatherMap API for the chosen latitude and longitude.
     *          Then it updates with the current weather and location details.
     *
     * @param {number} lat - Latitude to fetch the weather data from.
     * @param {number} lng - Longitude to fetch the weather data from.
     */

    function updateWeatherDetails(lat, lng) {
        $.getJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=49b4d764a04887a21471a4c49872ca6e`, function(data){
            $("#weatherdescription").text(data.weather[0].description);
            $("#weathertemp").text(data.main.temp);
            $("#weatherwind").text(data.wind.speed);
            $("#clouds").text(data.clouds.all);
            $("#humidity").text(data.main.humidity);
            $("#currentCoords").text(`Latitude: ${lat.toFixed(3)}, Longitude: ${lng.toFixed(3)}`);
            $("#currentCity").text(`City: ${data.name}`);
        });
    }

    /**
     * Summary: Adds an air quality marker to the map where ever the map was clicked.
     *          Similar to addCityAirQualityMarker but for dynamic locations.
     *          When the user clicks on the marker it opens up an infowindow and when it is clicked again it disappears. Right click removes the marker.
     * @param {number} lat - Latitude where the marker is added.
     * @param {number} lng - Longitude where the marker is added.
     * @param {Object} map - The Google Map that the marker is added to.
     * Author: Luke Walpole, Kay Rogage (Week 8 and 9)
     */

    function addAirQualityMarker(lat, lng, map){
        $.getJSON(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=49b4d764a04887a21471a4c49872ca6e`, function(data){
            var aqi = data.list[0].main.aqi;
            var aqiInfo = determineAirQuality(aqi);

            const markerContent = document.createElement('div');
            markerContent.classList.add('marker-content', `marker-${aqiInfo.status.toLowerCase()}`);
            markerContent.textContent = `AQI: ${aqi} - ${aqiInfo.status}`;

            const aqiMarker = new google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(lat, lng),
                title: aqiInfo.status,
                content: markerContent,
                map: map
            });

            const aqiInfoWindow = new google.maps.InfoWindow({
                content: `<div><strong>Air Quality Index:</strong> ${aqi} - ${aqiInfo.description}</div>`
            });

            markerContent.addEventListener('mouseover', () => {
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                aqiInfoWindow.open({
                    anchor: aqiMarker,
                    map: map,
                    shouldFocus: false
                });
                currentInfoWindow = aqiInfoWindow;
            });

            markerContent.addEventListener('mouseout', () => {
                aqiInfoWindow.close();
                currentInfoWindow = null;
            });

            markerContent.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                aqiMarker.map = null; 
            });
        });
    }

    /**
     * Summary: If/else statement that determines the air quality based on the AQI value.
     * @param {number} aqi - The air quality index value.
     * Author: Luke Walpole
     */

    function determineAirQuality(aqi){
        if (aqi <= 50) {
            return { status: 'Good', description: 'Air quality is good. There is little or no risk caused by air pollution.'};
        } else if (aqi <= 100) {
            return { status: 'Moderate', description: 'Air quality is okay. However, there may be some risk caused by air pollution.'};
        } else {
            return { status: 'Bad', description: 'Air quality is bad. There are serious risks caused by air pollution.'};
        }
    }
}