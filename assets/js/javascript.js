const settings = {
	async: true,
	crossDomain: true,
	url: "https://booking-com.p.rapidapi.com/v1/metadata/exchange-rates?currency=AED&locale=en-gb",
	method: "GET",
	headers: {
		XRapidAPIKey: "0b014ef4a7msh20044d57c266fadp11ce28jsn558d2ceb2559",
		XRapidAPIHost: "booking-com.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});