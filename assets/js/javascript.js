// global var
var cityResultText = $("#cityResult");
var hotelResultsText= $("#hotels");
var starRatingText = $("starRating");
var tempResultText = $("#tempResult");
var humidityResult = $("#humidityResult");
var windResultText = $("#windResult");
var mainIcon =$("#mainIcon");
var rowCards = $("#rowCards");
var dayForecast = $("#row5day");
var cardDisplay = $("#cardDisplay");
var UVIndexText = $("#UVIndexResult");
var buttonList = $("#buttonsList");
var forecastDate = {};
var forecastIcon = {};
var forecastTemp = {};
var forecastHum = {};
var forecastWspd = {};
var today = moment().format('MM' + "/" + 'DD' + '/' + 'YYYY');
var APIKey = "&units=imperial&APPID=c2a625940250e9689564c95583eb14c8";
var url =  "https://api.openweathermap.org/data/2.5/weather?q=";
var citiesArray = JSON.parse(localStorage.getItem("Saved City")) || [];


$(document).ready(function (){
    var userInput = citiesArray[citiesArray.length - 1];
    currentWeather(userInput);
    forecast(userInput);
    lastSearch ();

});

function currentWeather(userInput) {
    mainIcon.empty();
    var queryURL = url + userInput + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        var cityInfo = response.name;
        var country = response.sys.country; 
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var icon = response.weather[0].icon;
        var UVindexURL = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + lat + "&" + "lon=" + lon + "&APPID=123babda3bc150d180af748af99ad173";
        var newImgMain = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        mainIcon.append(newImgMain);
        cityResultText.text(cityInfo + ", " + country + " " + today);
        tempResultText.text("Temperature: " + temp + " ºF");
        humidityResult.text("Humidity: " + humidity + " %");
        windResultText.text("Wind Speed: " + wind + " MPH");
        $.ajax({
            url: UVindexURL,
            method: "GET"
        }).then(function(uvIndex){
            var UV = uvIndex.value;
            var colorUV;
            if (UV <= 3) {
                colorUV = "green";
            } else if (UV >= 3 & UV <= 6) {
                colorUV = "yellow";
            } else if (UV >= 6 & UV <= 8) {
                colorUV = "orange";
            } else {
                colorUV = "red";
            }
            UVIndexText.empty();
            var UVResultText = $("<p>").attr("class", "card-text").text("UV Index: ");
            UVResultText.append($("<span>").attr("class", "uvindex").attr("style", ("background-color: " + colorUV)).text(UV))
            UVIndexText.append(UVResultText);
            cardDisplay.attr("style", "display: flex; width: 98%");
        })    
    })
    }

function forecast (userInput) {
    dayForecast.empty();
    rowCards.empty();
    var fore5 = $("<h2>").attr("class", "forecast").text("5-Day Forecast: "); 
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&units=imperial&APPID=123babda3bc150d180af748af99ad173";
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(response){
        for (var i = 0; i < response.list.length; i += 8){
            
            forecastDate[i] = response.list[i].dt_txt;
            forecastIcon[i] = response.list[i].weather[0].icon;
            forecastTemp[i] = response.list[i].main.temp; 
            forecastHum[i] = response.list[i].main.humidity;  
            forecastWspd[i] = response.list[i].wind.speed;

            var newCol2 = $("<div>").attr("class", "col-2");
            rowCards.append(newCol2);

            var newDivCard = $("<div>").attr("class", "card text-white bg-primary mb-3");
            newDivCard.attr("style", "max-width: 18rem;")
            newCol2.append(newDivCard);

            var newCardBody = $("<div>").attr("class", "card-body");
            newDivCard.append(newCardBody);

            var newH5 = $("<h5>").attr("class", "card-title").text(moment(forecastDate[i]).format("MMM Do"));
            newCardBody.append(newH5);

            var newImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastIcon[i] + "@2x.png");
            newCardBody.append(newImg);

            var newPTemp = $("<p>").attr("class", "card-text").text("Temp: " + Math.floor(forecastTemp[i]) + "ºF");
            newCardBody.append(newPTemp);

            var newPHum = $("<p>").attr("class", "card-text").text("Humidity: " + forecastHum[i] + " %");
            newCardBody.append(newPHum);

            var newWspd = $("<p>").attr("class", "card-text").text("Wind Speed: " + forecastHum[i] + " MPH");
            newCardBody.append(newWspd);

            dayForecast.append(fore5);
            };
            })

        }

function storeData (userInput) {
    var userInput = $("#searchInput").val().trim().toLowerCase();
    var containsCity = false;

    if (citiesArray != null) {

		$(citiesArray).each(function(x) {
			if (citiesArray[x] === userInput) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
        citiesArray.push(userInput);
	}

	localStorage.setItem("Saved City", JSON.stringify(citiesArray));

}

function lastSearch () {
    buttonList.empty()
    for (var i = 0; i < citiesArray.length; i ++) {
        var newButton = $("<button>").attr("type", "button").attr("class","savedBtn btn btn-secondary btn-lg btn-block");
        newButton.attr("data-name", citiesArray[i])
        newButton.text(citiesArray[i]);
        buttonList.prepend(newButton);
    }
    $(".savedBtn").on("click", function(event){
        event.preventDefault();
        var userInput = $(this).data("name");
        currentWeather(userInput);
        forecast(userInput);
    })

}

$(".btn").on("click", function (event){
    event.preventDefault();
    if ($("#searchInput").val() === "") {
    alert("Please type a valid input to know the current weather");
    } else
    var userInput = $("#searchInput").val().trim().toLowerCase();
    currentWeather(userInput);
    forecast(userInput);
    storeData();
    lastSearch();
    hotels();
    $("#searchInput").val("");

})

// $("#hotels").on("click", function(hotels){
//     hotels.preventDefault();
//     if ($("#searchInput").val() === "") {
//         alert("Please type a valid input to know the current weather");
//     } else 
//     var userInput = $("#searchInput").val().trim().toLowerCase();
// })




// const settings = {
// 	async: true,
// 	crossDomain: true,
// 	url: "https://booking-com.p.rapidapi.com/v1/metadata/exchange-rates?currency=AED&locale=en-gb",
// 	method: "GET",
// 	headers: {
// 		XRapidAPIKey: "0b014ef4a7msh20044d57c266fadp11ce28jsn558d2ceb2559",
// 		XRapidAPIHost: "booking-com.p.rapidapi.com"
// 	}
// };

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0b014ef4a7msh20044d57c266fadp11ce28jsn558d2ceb2559',
		'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
	}
};

fetch('https://priceline-com-provider.p.rapidapi.com/v1/hotels/search?sort_order=HDR&location_id=3000035821&date_checkout=2022-11-16&date_checkin=2022-11-15&star_rating_ids=3.0%2C3.5%2C4.0%2C4.5%2C5.0&rooms_number=1&amenities_ids=FINTRNT%2CFBRKFST', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

function hotels (userInput) {
    $.ajax(options).then (function(response) {
        // var hotel = response.hotels;
        var hotelName = response.name;
        var hotelStarRating = response.starRating;
        hotelResultsText.text("name: " + hotelName + "");
        hotelStarRating.text("Star rating: " + hotelStarRating + "out of 5");


    }) 
}