var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var currentConditionsEl = document.querySelector("#current-conditions");
var forecastEl = document.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistoryArr = [];


var getCurrentConditions = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bbf3bd1040e46074ce9631e1da42c4dd"

    fetch(apiUrl)
    .then(function(currentConditionsResponse) {
        return currentConditionsResponse.json();
    })
    .then(function(currentConditionsResponse) {
        uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=bbf3bd1040e46074ce9631e1da42c4dd&lat="
         + currentConditionsResponse.coord.lat + "&lon=" + currentConditionsResponse.coord.lon;

        displayCurrentConditions(currentConditionsResponse);
        
        return fetch(uvUrl);
    })
    .then(function(uvResponse) {
        return uvResponse.json();
    })
    .then (function(uvResponse) {
        displayCurrentUv(uvResponse);
    });
};

var getForecast = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bbf3bd1040e46074ce9631e1da42c4dd";

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        displayForecast(data);
    })
};

var displayCurrentConditions = function(data) {   
    currentConditionsEl.textContent = "";
    var currentConditionsTitle = document.createElement("div");
    var date = moment().format("ddd, MMMM Do, YYYY");
    var cityName = data.name;
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

    currentConditionsTitle.innerHTML = "<h2>" + cityName + "</h2><h4>" + date + "</h4>";
    currentConditionsTitle.appendChild(weatherIcon);
    currentConditionsEl.appendChild(currentConditionsTitle);

    var currentConditionsStats = document.createElement("div");
    var temperature = document.createElement("p")
    temperature.textContent = "Temperature: " + data.main.temp + "°F";

    var humidity = document.createElement("p")
    humidity.textContent = "Humidity: " + data.main.humidity + "%";

    var windSpeed = document.createElement("p")
    windSpeed.textContent = "Wind Speed: " + data.wind.speed + " mph";    
    
    currentConditionsStats.appendChild(temperature);
    currentConditionsStats.appendChild(humidity);
    currentConditionsStats.appendChild(windSpeed);

    currentConditionsEl.appendChild(currentConditionsStats);
};

var displayCurrentUv = function(data) {
    var uvi = document.createElement("p");
    var uviSpan = document.createElement("span");
    uviSpan.textContent = data.value;
    uvi.textContent = "UV Index: ";
    uvi.appendChild(uviSpan);

    if (data.value <= 5) {
        uviSpan.className = "bg-success";
    } else if (data.value < 7) {
        uviSpan.className = "bg-warning";
    } else {
        uviSpan.className = "bg-danger";
    };

    currentConditionsEl.appendChild(uvi);
};

var displayForecast = function(data) {
    var desiredObject = 7;
    for (var i = 0; i < 5; i++) {
        var forecastCard = document.createElement("div");
        forecastCard.classList = "card col-12 col-md-2 bg-primary mx-3";

        var time = moment.unix(data.list[desiredObject].dt).format("ddd, MMMM Do, YYYY");
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[desiredObject].weather[0].icon + "@2x.png");
        var temperature = data.list[desiredObject].main.temp;
        var humidity = data.list[desiredObject].main.humidity;

        forecastTitle = document.createElement('h4');
        forecastTitle.className = "card-title";
        forecastTitle.textContent = time;

        forecastBodyEl = document.createElement('p');
        forecastBodyEl.className = "card-text";
        forecastBodyEl.innerHTML = "Temperature: " + temperature + "°F </br> Humidity: " + humidity + "%";

        forecastCard.appendChild(forecastTitle);
        forecastCard.appendChild(weatherIcon);
        forecastCard.appendChild(forecastBodyEl);

        forecastEl.appendChild(forecastCard);

        desiredObject = (desiredObject + 8);
    };
};

var saveSearch = function(city) {
    searchHistoryArr.push(city);

    localStorage.setItem("cities", searchHistoryArr);
};

var loadSearches = function() {
    var returnedCities = localStorage.getItem("cities");
    
    if (returnedCities) {
        returnedCities = returnedCities.split(",");
    } else {
        returnedCities = [];
    };

    for (var i = 0; i < returnedCities.length; i++) {
    var pastSearch = document.createElement("a");

    pastSearch.setAttribute("data-city", returnedCities[i]);

    pastSearch.textContent = returnedCities[i];

    searchHistoryEl.appendChild(pastSearch);

    searchHistoryArr.push(returnedCities[i]);
    };
};

var createSearchHistory = function(event) {
    event.preventDefault();

    var pastSearch = document.createElement("a");
    var city = cityInputEl.value.trim();

    if (!searchHistoryArr.includes(city)) {
        pastSearch.setAttribute("data-city", city);

        pastSearch.textContent = city;

        searchHistoryEl.appendChild(pastSearch);
    };
    
    cityInputEl.value = "";
    getCurrentConditions(city);
    getForecast(city);
    saveSearch(city);
};

var createPastSearchConditions = function(event) {
    var city = event.target.getAttribute("data-city");

    if(city) {
        getCurrentConditions(city);
        getForecast(city);
    };
};

searchFormEl.addEventListener("submit", createSearchHistory);
searchHistoryEl.addEventListener("click", createPastSearchConditions);

loadSearches();