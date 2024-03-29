$(document).ready(function (){
    let NowMoment = moment().format("l");

    // Forecast Days:

    let day1 = moment().add(1, "days").format("l");
    let day2 = moment().add(2, "days").format("l");
    let day3 = moment().add(3, "days").format("l");
    let day4 = moment().add(4, "days").format("l");
    let day5 = moment().add(5, "days").format("l");

    //Global Variables:

    let city;
    let cities;

    // Getter from local storage for most recent city searched:

    function loadMostRecent(){
        let lastSearch = localStorage.getItem("mostRecent");
        if (lastSearch) {
            city = lastSearch;
            searchBtn();
        } 
        else {
            city = "London"
            search();
        }
    }

    loadMostRecent()

    // Getter from local storage for recently searched cities:

    function loadRecentCities() {
        let recentCities = JSON.parse(localStorage.getItem("cities"));
        if (recentCities){
            cities - recentCities;
        }
        else {
            cities = [];
        }
    }
    loadRecentCities()

    $("#submit").on("click", (e) => {
        e.preventDefault();
        getCity();
        search();
        $("#city-input").val("");
        listCities();
    });

    // Save the cities searched to local storage:

    function saveToLocalStorage(){
        localStorage.setItem("mostRecent", city);
        cities.push(city);
        localStorage.setitem("cities", JSON.stringify(cities));
    }

    // Retrieve chosen city inputted by user:

    function getCity(){
        city = $("#city-input").val();
        if (city && cities.includes(city) === false){
            saveToLocalStorage();
            return city;
        }
        else if (!city){
            alert("Oops, that doesn't look like a city");
        }
    }

    // API search:

    function search(){
        let queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName;
        let coords = [];

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
            coords.push(response.coord.lat);
            coords.push(response.coord.lon);
            let cityName = response.name;
            let cityCond = response.weather[0].description.toUpperCase();
            let cityTemp = response.main.temp;
            let cityHum = response.main.humidity;
            let cityWind = response.wind.speed;
            let icon = response.weather[0].icon;
            $("#icon").html(
              `<img src= "https://openweathermap.org/img/wn/10d@2x.png">`
            );
            $("#city-name").html(cityName + " " + "(" + NowMoment + ")");
            $("#city-cond").text("Current Conditions: " + cityCond);
            $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
            $("#humidity").text("Humidity: " + cityHum + "%");
            $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
            $("#date1").text(day1);
            $("#date2").text(day2);
            $("#date3").text(day3);
            $("#date4").text(day4);
            $("#date5").text(day5);
      
            getUV(response.coord.lat, response.coord.lon);

        }).fail(function(){
            alert("Oops, could not retrieve data")
        });
        
        function getUV(lat, lon){
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",
                method: "GET",
            }).then(function(response){

                    let uvIndex = response.current.uvi;
            $("#uv-index").text("UV Index:" + " " + uvIndex);
            if (uvIndex >= 8) {
            $("#uv-index").css("color", "red");
            } else if (uvIndex > 4 && uvIndex < 8) {
            $("#uv-index").css("color", "yellow");
            } else {
            $("#uv-index").css("color", "green");
            }
            let cityHigh = response.daily[0].temp.max;
            $("#high").text("Expected high (F): " + " " + cityHigh);

            //temperature variables:
            let day1temp = response.daily[1].temp.max;
            let day2temp = response.daily[2].temp.max;
            let day3temp = response.daily[3].temp.max;
            let day4temp = response.daily[4].temp.max;
            let day5temp = response.daily[5].temp.max;

            //forecast humidity variables:

            let day1hum = response.daily[1].humidity;
            let day2hum = response.daily[2].humidity;
            let day3hum = response.daily[3].humidity;
            let day4hum = response.daily[4].humidity;
            let day5hum = response.daily[5].humidity;

            //forecast weather icon variables:

            let icon1 = response.daily[1].weather[0].icon;
            let icon2 = response.daily[2].weather[0].icon;
            let icon3 = response.daily[3].weather[0].icon;
            let icon4 = response.daily[4].weather[0].icon;
            let icon5 = response.daily[5].weather[0].icon;
            //
            $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
            $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
            $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
            $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
            $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));

            $("#hum1").text("Hum:" + " " + day1hum + "%");
            $("#hum2").text("Hum:" + " " + day2hum + "%");
            $("#hum3").text("Hum:" + " " + day3hum + "%");
            $("#hum4").text("Hum:" + " " + day4hum + "%");
            $("#hum5").text("Hum:" + " " + day5hum + "%");

            $("#icon1").html(
            `<img src="https://openweathermap.org/img/wn/${icon1}10d@2x.png">`
            );
            $("#icon2").html(
            `<img src="https://openweathermap.org/img/wn/${icon2}10d@2x.png">`
            );
            $("#icon3").html(
            `<img src="https://openweathermap.org/img/wn/${icon3}10d@2x.png">`
            );
            $("#icon4").html(
            `<img src="https://openweathermap.org/img/wn/${icon4}10d@2x.png">`
            );
            $("#icon5").html(
            `<img src="https://openweathermap.org/img/wn/${icon5}10d@2x.png">`
            );

            });
         }
    }

    // RENDER recently searched cities:

    function listCities(){
        $("#cities").text("");
        cities.forEach((city) =>{
            $("cityList").prepend("<tr><td>" + city + "</td></tr>");
        });
    }

    listCities();

    // Event Handler for recently seached cties:

    $(document).on("click", "td", (e) => {
        e.preventDefault();
        let listedCity = $(e.target).text();
        city = listedCity;
        search();
    });

    // Event Handler for clear btn:

    $("clr-btn").click(() => {
        localStorage.removeItem("cities");
        loadRecentCities();
        listCities();
    });
});

    
