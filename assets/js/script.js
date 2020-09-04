var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var currentConditionsEl = document.querySelector("#current-conditions");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistoryArr = [];


var getCurrentConditions = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bbf3bd1040e46074ce9631e1da42c4dd"

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            getCurrentUvi(data);
            displayCurrentConditions(data);
        });
    });
};

var getCurrentUvi = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=bbf3bd1040e46074ce9631e1da42c4dd&lat=" + city.coord.lat + "&lon=" + city.coord.lon;
    
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayCurrentUvi(data);
        });
    });
};

var displayCurrentConditions = function(data) {
    console.log(data);
    
    currentConditionsEl.textContent = "";
    var currentConditionsTitle = document.createElement("div");
    var date = moment().format("ddd, MMMM Do, YYYY");
    var cityName = data.name;
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

    currentConditionsTitle.innerHTML = "<h3>" + cityName + "</h3><h4>" + date + "</h4>";
    currentConditionsTitle.appendChild(weatherIcon);
    currentConditionsEl.appendChild(currentConditionsTitle);

    var currentConditionsStats = document.createElement("div");
    var temperature = "Temperature: " + data.main.temp + "°F";
    var humidity = "Humidity: " + data.main.humidity + "%";
    var windSpeed = "Wind Speed: " + data.wind.speed + " mph";    
};

var displayCurrentUvi = function(data) {
    console.log(data);
    var uviContainer = document.createElement("div");
    var uvi = document.createElement("h3");
    uvi.textContent = data.value;

    uviContainer.appendChild(uvi);
    currentConditionsEl.appendChild(uviContainer);
};

var saveSearch = function() {
    localStorage.setItem("cities", searchHistoryArr);
};

var loadSearches = function() {
    var cities = localStorage.getItem("cities").split(",");

    for (var i = 0; i < cities.length; i++) {
    var pastSearch = document.createElement("a");

    pastSearch.setAttribute("data-city", cities[i]);

    pastSearch.textContent = cities[i];

    searchHistoryEl.appendChild(pastSearch);
    };
};

var createSearchHistory = function(event) {
    event.preventDefault();

    var pastSearch = document.createElement("a");
    var city = cityInputEl.value.trim();

    pastSearch.setAttribute("data-city", city);

    pastSearch.textContent = city;
    cityInputEl.value = "";

    searchHistoryEl.appendChild(pastSearch);

    searchHistoryArr.push(city);

    getCurrentConditions(city);

    saveSearch(city);
};

var createPastSearch = function(event) {
    var city = event.target.getAttribute("data-city");

    if(city) {
        getCurrentConditions(city);
    };
};

searchFormEl.addEventListener("submit", createSearchHistory);
searchHistoryEl.addEventListener("click", createPastSearch);

loadSearches();