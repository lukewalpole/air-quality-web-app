/**
 * Title: weather.js
 * Summary: Fetches the current weather and air pollution data for the initial latitude and longitude location.
 *          OpenWeatherMap API is used to fetch the data and then update the HTML to display data.
 *          The script only executes when the DOM is fully loaded to avoid runtime errors. 
 * Author: Luke Walpole, Kay Rogage (Week 8 - Altered to suit my needs)
 * Resource: https://openweathermap.org/api 
 */

/**
 * Summary: Sets initial latitude and longitude coordinates to Living Planet HQ (NE1 8ST).
 *          Fetches current weather and air pollution data then displays it.
 * Author: Luke Walpole, Kay Rogage (Week 8 - Altered to suit my needs)
 */

$(document).ready(function(){  

    var initLat = 54.977775;
    var initLng = -1.604488;
	
	getCurrentWeather(initLat, initLng);
	getAirPollution(initLat, initLng);
	
});	

/**
 * Summary: Fetches the current weather data from OpenWeatherMap API for the chosen latitude and longitude.
 *          Then it updates with the current weather and location details.
 * @param {number} lat - Latitude to fetch the weather data from.
 * @param {number} lng - Longitude to fetch the weather data from.
 * Author: Luke Walpole, Kay Rogage (Week 8 - Altered to suit my needs)
 */

function getCurrentWeather(lat, lng){
			
    $.getJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=49b4d764a04887a21471a4c49872ca6e`, function(data){
        displayCurrentWeather(data);
        $("#currentCoords").text(`Latitude: ${lat.toFixed(3)}, Longitude: ${lng.toFixed(3)}`);
        $("#currentCity").text(`City: ${data.name}`);
    });
}

/**
 * Summary: Updates the HTML with the weather data fetched from the API.
 *          Displays weather parameters: description, temperature, wind speed, cloudiness, and humidity.
 * @param {Object} data - Weather data received from the API.
 * Author: Kay Rogage (Week 8)
 */

function displayCurrentWeather(data){
	$("#weatherdescription").text(data.weather[0].description);
	$("#weathertemp").text(data.main.temp);
	$("#weatherwind").text(data.wind.speed);
	$("#clouds").text(data.clouds.all);
	$("#humidity").text(data.main.humidity);
	
}

/**
 * Summary: Fetches air pollution data from OpenWeatherMap API for the chosen latitude and longitude.
 *          Then it updates with the current air quality index.
 * @param {number} lat - Latitude to fetch the weather data from.
 * @param {number} lng - Longitude to fetch the weather data from.
 * Author: Luke Walpole, Kay Rogage (Week 8 - Altered to suit my needs)
 */

function getAirPollution(lat, lng){

    $.getJSON(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=49b4d764a04887a21471a4c49872ca6e`, function(data){
        displayAirPollution(data);
    });
}

/**
 * Summary: Displays air pollution data by updating the HTML with the air quality index.
 * @param {Object} data - Air pollution data received from the API.
 * Author: Kay Rogage (Week 8)
 */

function displayAirPollution(data){
	var aqi = data.list[0].main.aqi;
	$("#airpollution").text(aqi);
}