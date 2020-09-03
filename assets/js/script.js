var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var searchHistoryEl = document.querySelector("#search-history");

var createSearchHistory = function(event) {
    event.preventDefault();

    var pastSearch = document.createElement("a");
    var city = cityInputEl.value.trim();

    pastSearch.setAttribute("data-city", city);

    pastSearch.textContent = city;
    cityInputEl.value = "";

    searchHistoryEl.appendChild(pastSearch);
};

var createPastSearch = function(event) {
    var city = event.target.getAttribute("data-city");

    if(city) {
        getCurrentConditions(city);
    };
};

searchFormEl.addEventListener("submit", createSearchHistory);
searchHistoryEl.addEventListener("click", createPastSearch);