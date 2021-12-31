// TODO: Clarify icons with icon names

var queryURL;
var latitude;
var longitude;
var back;
var uvValue;
var uvEl = $("#uv-index");

// initialize city to last searched city

var APIKey = "9cd99493507b3254897bb34ce8c633dd";

// UV colors
var lowColor = "#0A492C";
var modColor = "#086336";
var highColor = "#EE791D";
var veryHighColor = "#F0DBA";
var extremeColor = "#E72D15";

function colorUV(val) {
  // choose background color based on UV index value
  if (val < 3) {
    // low UV 0-2
    back = lowColor;
  } else if (val < 6) {
    // Moderate UV 3-5
    back = modColor;
  } else if (val < 8) {
    // High 6-7
    back = highColor;
  } else if (val < 11) {
    // very high 8-10
    back = val;
  } else {
    // extreme 11+
    back = val;
  }
  return back;
}

function renderInfo() {
  // assign city name
  $("#city-name").text(cityName);
  // assign date
  $("#date").text("(" + Date().substring(0, 15) + ")");

  // CURRENT weather
  queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    console.log("Response: ", response)

    // assign weather icon
    var image = $("<img>");
    var source =
      "http://openweathermap.org/img/wn/" +
      response.weather[0].icon +
      "@2x.png";
    image.attr("src", source);
    image.css("display", "block");
    image.css("margin", "auto");
    $(".city-today").prepend(image);
    // assign temperature
    $("#temp").text(response.main.temp);
    // assign Humidity
    $("#humidity").text(response.main.humidity);
    // assign Wind Speed
    $("#wind-speed").text(response.wind.speed);
    // assign latitude & longitude
    latitude = response.coord.lat;
    longitude = response.coord.lon;

    // UV index
    queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // make sure UV is empty
      uvEl.text("UV Index: ");
      // add UV Element
      var UV = $("<span class='uv'>");
      // assign text
      uvValue = response.value;
      UV.text(uvValue);
      // color code UV index
      back = colorUV(uvValue);
      // assign background color
      UV.css("background-color", back);
      // assign UV index
      uvEl.append(UV);
    });
  });

  // 5 DAY forecat
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&cnt=42" +
    "&appid=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // iterate over next 5 days
    for (let i = 1; i <= 5; i++) {
      // daily weather object
      var day = response.list[7 + (i - 1) * 8];
      // add date
      $("#date-" + i).text(day.dt_txt.substring(0, 10));
      // add icon
      var source =
        "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
      $("#img-" + i).attr("src", source);
      // add temperature
      $("#temp-" + i).text(day.main.temp);
      // add humidity
      $("#humidity-" + i).text(day.main.humidity);
    }
  });
}

function addSelectionFunctionality() {
  // if there were no cities previously searched
  if (!localStorage.getItem("citiesSearched")) {
    $(".city-today").css("display", "block");
    $(".forecast").css("display", "block");
  }
  // when clicking a city
  $(".cities button").click(function () {
    cityName = $(this).text();
    renderInfo();
  });
}

// When adding a city
$("#add-city").click(function () {
  var newCity = $("#city").val();
  // if input isn't empty
  if (newCity) {
    // add city button
    var cityButton = $("<button>").text(newCity);
    cityButton.addClass("city-choice");
    // add click event
    cityButton.click(addSelectionFunctionality);
    $(".cities").append(cityButton);
    cityName = newCity;
    // if displaying city for first time
    if (!localStorage.getItem("citiesSearched")) {
      $(".city-today").css("display", "block");
      $(".forecast").css("display", "block");
    }
    renderInfo();
    // update city list in local storage
    var cityList = [];
    for (let i = 0; i < $(".city-choice").length; i++) {
      cityList.push($(".city-choice")[i].textContent);
    }
    localStorage.setItem("citiesSearched", JSON.stringify(cityList));
  }
});

var citiesSearched = JSON.parse(localStorage.getItem("citiesSearched"));
// if a cities were previously searched
if (citiesSearched) {
  // put cities as choice
  for (let i = 0; i < citiesSearched.length; i++) {
    // create button
    var cityButton = $("<button>");
    // add class and text
    cityButton.addClass("city-choice");
    cityButton.text(citiesSearched[i]);
    // display
    $(".cities").append(cityButton);
  }
  // last city added is the city displayed
  cityName = citiesSearched[citiesSearched.length - 1];
  addSelectionFunctionality();
  renderInfo();
} else {
  $(".city-today").css("display", "none");
  $(".forecast").css("display", "none");
}
