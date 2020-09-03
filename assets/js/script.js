var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistoryArr = [];

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