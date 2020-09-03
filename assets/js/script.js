var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");
var searchHistoryEl = document.querySelector("#search-history");

var createSearchHistory = function(event) {
    event.preventDefault();

    var pastSearch = document.createElement("a");
    var city = cityInputEl.value.trim();

    pastSearch.textContent = city;
    cityInputEl.value = "";

    searchHistoryEl.appendChild(pastSearch);
};

searchFormEl.addEventListener("submit", createSearchHistory);