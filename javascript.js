var cityName = "Tenafly";
var APIKey = "9cd99493507b3254897bb34ce8c633dd";
var queryURL;
var latitude;
var longitude;
var back;
var uvEl = $("#uv-index");

// UV colors
var lowColor = "#0A492C";
var modColor = "#086336";
var highColor = "#EE791D";
var veryHighColor = "#F0DBA";
var extremeColor = "#E72D15";

function colorUV() {
  var uv = parseFloat(uvEl.text());
  // choose background color based on UV index value
  if (uv < 3) {
    // low UV 0-2
    back = lowColor;
  } else if (uv < 6) {
    // Moderate UV 3-5
    back = modColor;
  } else if (uv < 8) {
    // High 6-7
    back = highColor;
  } else if (uv < 11) {
    // very high 8-10
    back = veryHighColor;
  } else {
    // extreme 11+
    back = extremeColor;
  }
  // assign background color
  uvEl.css("background-color", back);
}

function renderInfo() {
  // assign city name
  $("#city-name").text(cityName);
  // assign date
  $("#date").text(Date().substring(0, 15));

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
    console.log(response);

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
      // assign UV index
      uvEl.text(response.value);
    });
    // color code UV index
    colorUV();
  });

  // // 5 DAY forecat
  // var queryURL =
  //   "https://api.openweathermap.org/data/2.5/forecast?q=" +
  //   cityName +
  //   "&cnt=5&appid=" +
  //   APIKey;

  // $.ajax({
  //   url: queryURL,
  //   method: "GET",
  // }).then(function (response) {
  //   console.log(response);
  // });
}

// when selecting a city
$(".city-choice").click(function () {
  cityName = $(this).text();
  renderInfo();
});
