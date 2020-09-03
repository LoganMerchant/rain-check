var searchFormEl = document.querySelector("#search-form");
var searchHistoryEl = document.querySelector("#search-history");

var createSearchHistory = function(city) {
    var search = document.createElement("a");

    search.textContent = city;

    searchHistoryEl.appendChild(search);
};

createSearchHistory('houston');