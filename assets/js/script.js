// HTML selectors & empty array for localStorage
var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var currentConditionsEl = document.querySelector("#current-conditions");
var forecastEl = document.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistoryArr = [];

// makes api call for the current conditions of a city
var getCurrentConditions = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bbf3bd1040e46074ce9631e1da42c4dd"

    fetch(apiUrl)
    .then(function(currentConditionsResponse) {
        return currentConditionsResponse.json();
    })
    // makes a nested api call for the uv index
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

// makes api call for the 5-day forecast
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

// displays the current weather conditions of a city
var displayCurrentConditions = function(data) {   
    // empties out any previous conditions
    currentConditionsEl.textContent = "";

    // sets variables and their attributes
    var currentConditionsTitle = document.createElement("div");
    var date = moment().format("ddd, MMMM Do, YYYY");
    var cityName = data.name;
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

    // displays the city's name, the date, and an icon
    currentConditionsTitle.innerHTML = "<h2>" + cityName + "</h2><h4>" + date + "</h4>";
    currentConditionsTitle.appendChild(weatherIcon);
    currentConditionsEl.appendChild(currentConditionsTitle);

    // sets the temp, humidity, and windspeed vars
    var currentConditionsStats = document.createElement("div");
    var temperature = document.createElement("p")
    temperature.textContent = "Temperature: " + data.main.temp + "°F";

    var humidity = document.createElement("p")
    humidity.textContent = "Humidity: " + data.main.humidity + "%";

    var windSpeed = document.createElement("p")
    windSpeed.textContent = "Wind Speed: " + data.wind.speed + " mph";    
    
    // displays the temp, humidity, and windspeed
    currentConditionsStats.appendChild(temperature);
    currentConditionsStats.appendChild(humidity);
    currentConditionsStats.appendChild(windSpeed);

    // display the current conditions together
    currentConditionsEl.appendChild(currentConditionsStats);
    currentConditionsEl.classList = "p-2 border border-secondary rounded";
};

// displays the current uv index for the city
var displayCurrentUv = function(data) {
    // define vars and their text content
    var uvi = document.createElement("p");
    var uviSpan = document.createElement("span");
    uviSpan.textContent = data.value;
    uvi.textContent = "UV Index: ";
    uvi.appendChild(uviSpan);

    // displays a color background depending on the uv index
    if (data.value <= 5) {
        uviSpan.className = "bg-success";
    } else if (data.value < 7) {
        uviSpan.className = "bg-warning";
    } else {
        uviSpan.className = "bg-danger";
    };

    // appends the uvi to the current conditions
    currentConditionsEl.appendChild(uvi);
};

// diplays the 5 day forecast
var displayForecast = function(data) {
    // empties out any previous forecast
    forecastEl.textContent = "";
    // sets the starting index of the returned array at 6
    var desiredObject = 6;

    for (var i = 0; i < 5; i++) {
        // creates a card for each day
        var forecastCard = document.createElement("div");
        forecastCard.classList = "card col-4 col-md-2 bg-primary m-3 ";

        // defines the vars for the card
        var time = moment.unix(data.list[desiredObject].dt).format("ddd, MMMM Do, YYYY");
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[desiredObject].weather[0].icon + "@2x.png");
        var temperature = data.list[desiredObject].main.temp;
        var humidity = data.list[desiredObject].main.humidity;

        // sets the title of the card
        forecastTitle = document.createElement('h4');
        forecastTitle.className = "card-title";
        forecastTitle.textContent = time;

        // sets the body of the card
        forecastBodyEl = document.createElement('p');
        forecastBodyEl.className = "card-text";
        forecastBodyEl.innerHTML = "Temperature: " + temperature + "°F </br> Humidity: " + humidity + "%";

        // appends the title, icon, and body to the card
        forecastCard.appendChild(forecastTitle);
        forecastCard.appendChild(weatherIcon);
        forecastCard.appendChild(forecastBodyEl);

        // appends the card to the html
        forecastEl.appendChild(forecastCard);

        // skips over 8 indexes to grab the next day's forecast
        desiredObject = (desiredObject + 8);
    };
};

// saves an individual search in localStorage
var saveSearch = function(city) {
    // determines if a city is already in localStorage
    if (!searchHistoryArr.includes(city)) {
        searchHistoryArr.push(city);
    };

    localStorage.setItem("cities", searchHistoryArr);
};

// loads search history from localStorage
var loadSearches = function() {
    var returnedCities = localStorage.getItem("cities");
    
    if (returnedCities) {
        returnedCities = returnedCities.split(",");
    } else {
        returnedCities = [];
    };

    // creates an individual element in the search history for each returned item
    for (var i = 0; i < returnedCities.length; i++) {
    var pastSearch = document.createElement("h5");

    pastSearch.setAttribute("data-city", returnedCities[i]);

    pastSearch.textContent = returnedCities[i].toUpperCase();
    pastSearch.classList = "border-bottom border-secondary";

    searchHistoryEl.appendChild(pastSearch);

    searchHistoryArr.push(returnedCities[i]);
    };
};

// creates an item in the search history after a successful call
var createSearchHistory = function(event) {
    // prevents the page from reloading
    event.preventDefault();
    
    // grabs the user input and sets it as an <h5>
    var pastSearch = document.createElement("h5");
    var city = cityInputEl.value.trim();

    // determines if that city has already been searched for
    if (!searchHistoryArr.includes(city)) {
        pastSearch.setAttribute("data-city", city);

        pastSearch.textContent = city.toUpperCase();
        pastSearch.classList = "border-bottom border-secondary";

        searchHistoryEl.appendChild(pastSearch);
    };

    cityInputEl.value = "";
    getCurrentConditions(city);
    getForecast(city);
    saveSearch(city);
};

// generates weather elements when user clicks on a past search
var createPastSearchConditions = function(event) {
    var city = event.target.getAttribute("data-city");

    if(city) {
        getCurrentConditions(city);
        getForecast(city);
    };
};

// event listeners for search submission, and past search click
searchFormEl.addEventListener("submit", createSearchHistory);
searchHistoryEl.addEventListener("click", createPastSearchConditions);

// loads search history when the page is first loaded
loadSearches();