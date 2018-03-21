//Binds Google Places to Element
class BindGooglePlacesToElement {
	
	constructor (googleplacesautocompleteElement) {
		
		//Store class context
		let self = this;
		
		//Store user's searched place latitude
		self.latitude = "";
		
		//Store user's searched place longitude
		self.longitude = "";
		
		//Initiate Google Places Autocomplete using googleplacesautocompleteElement element
		self.googleSearchBox = new google.maps.places.Autocomplete(googleplacesautocompleteElement);
		
		//Listen for place change
		google.maps.event.addListener(self.googleSearchBox, 'place_changed', function () {
		
			//Empty out fivedayforeCast observable array
			fivedayforeCast([]);
			
			//Get Place User Searched For
			let place = self.googleSearchBox.getPlace();
			
			//If valid place has formatted address, then update query
			if(place.formatted_address) {
				
				query(place.formatted_address);
				
			}
			
			//If valid place
			if(place.geometry) {
				
				//Get user's searched place latitude
				self.latitude = place.geometry.location.lat();
				
				//Get user's searched place longitude
				self.longitude = place.geometry.location.lng();
				
				//Get weather forecast using latitude and longitude
				getweatherforecastByPosition(self.latitude, self.longitude, processdailyforecastsByDay);
				
			}
			//If not a valid place, then alert user
			else {
				
				alert("Please Select A Valid Place From List.");
				
			}
		
		});
		
	}
	
}

//Store day limit for weather
let dayLimit = 5;

//Store weather forecast url base
let weatherforecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast?';

//Store google place url base
let googleplaceBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

//Store Weather Forecast API Key
let weatherforecastApiKey = '980deca03be38de9b336e2a1f7efde8a';

//Store Google Places API Key
let googleplacesApiKey = 'AIzaSyAVJQVAspaeJnRVXa2A7LtolVsjbjhD-cc';

//Store fivedayforeCast
let fivedayforeCast = ko.observableArray();

//Browser Geo Location is enabled/disabled
let navgeolocationInUse = ko.observable();

//Store query
let query = ko.observable();

//Store user's current latitude
let currentuserLatitude = "";
		
//Store user's current longitude
let currentuserLongitude = "";

//Initiate Google Places API
new BindGooglePlacesToElement(document.getElementById('pac-input'));

//Get User's current latitude and longitude
getUserCurrentLocation();

//Define KnockoutJS Model
let model = {
	
	//Bind navgeolocationInUse observable
	navgeolocationInUse: navgeolocationInUse,
	
	//Bind fivedayforeCast observable array
	fivedayforeCast : fivedayforeCast,
	
	//Bind Query observable
	query: query,
	
	//Get Current Location Weather
	getCurrentLocationWeather: function (data, event) {
		
		//Validate current user latitude and longitude exists
		if(currentuserLatitude && currentuserLongitude) {
			
			//Empty out fivedayforeCast observable array
			fivedayforeCast([]);
			
			//Get current user place using latitude and longitude
			getplaceByPosition(currentuserLatitude, currentuserLongitude, function (response) {
				
				//Update query
				query(response.results[0].formatted_address);
				
			});
			
			//Get weather forecast using latitude and longitude
			getweatherforecastByPosition(currentuserLatitude, currentuserLongitude, processdailyforecastsByDay);
			
		}
		else {
			
			//Current Location Could Not Be Traced
			alert("Current Location Could Not Be Traced.");
			
		}
		
	},
	
	//Get Day From Specified Date
	getDay(date) {
		
		return moment(date).format("dddd")
		
	},
	
	//Get Date From Specified Date
	getDate(date) {
		
		return moment(date).format("MMM Do YYYY")
		
	}
	
};

//Apply KnockoutJS bindings using model and document body
ko.applyBindings(model, document.getElementsByTagName('body')[0]);

//Get User's current geolocation
function getUserCurrentLocation() {
	
	if(navigator.geolocation) {
		
		//Get user's current latitude and longitude position
		navigator.geolocation.getCurrentPosition(function(position) {
			
			//Browser Geo Location is enabled
			navgeolocationInUse(true);
			
			//Get user's current latitude position
			currentuserLatitude = position.coords.latitude;
			
			//Get user's current longitude
			currentuserLongitude = position.coords.longitude;
		
		}, function(error) {
			
			//Browser Geo Location is disabled
			navgeolocationInUse(false);
			
		});
		
	}
	
	else {
		
		//Browser Geo Location is disabled
		navgeolocationInUse(false);
		
	}

}

//Get Place based on latitude and longitude
function getplaceByPosition(lat, lon, callback) {
	
	rest('get', googleplaceBaseUrl + 'key=' + googleplacesApiKey + '&latlng=' + lat + ',' + lon, null, callback);
	
}

//Get Weather Forecast based on latitude and longitude
function getweatherforecastByPosition(lat, lon, callback) {
	
	rest('get', weatherforecastBaseUrl + 'lat=' + lat + '&lon=' + lon + '&units=imperial&APPID=' + weatherforecastApiKey, null, callback);
	
}

//Process Daily ForeCasts By Day
function processdailyforecastsByDay(data) {
	
	//Separate Daily Forecasts By Day
	let forecastSplitByDay = separateForecastsByDay(data.list);

	//Traverse through list
	for(let forecastKey in forecastSplitByDay) {
		
		//Store current forecast
		let forecast = forecastSplitByDay[forecastKey];
		
		//If forecast array is greater than 0
		if(forecast.length > 0) {
			
			//Push Day Forecast into observable array
			fivedayforeCast.push(consolidateToDailyForecast(forecastKey, forecast));
			
		}
		
	}

}

//Separate Forecasts By Day
function separateForecastsByDay(forecasts) {
	
	//Store separated forecasts into dictionary -- key is date and value is forecasts array
	let separatedForecasts = {};
	
	//Store day index
	let dayIdx = 0;

	//Store Previous Forecast date
	let previousforecastDate;
	
	//Store today's date
	//const today = new Date();
	
	//Traverse through forecasts and store within dictionary -- stop traversing if day index is going over 5 days of forecast
	for(let count = 0; dayIdx < 4 && count < forecasts.length; count++) {
		
		//Store current forecast
		let forecast = forecasts[count];
		
		//Resolve ES5 vs ISO-8601 specification gaps and fix issue with date showing up as invalid in iOS
		let forecastDate = new Date(forecast.dt_txt.replace(/-/g, '/'));
		
		//Skip if current forecast data matches today's date
		//if (forecastDate.getDate() === today.getDate()) {
			
		//	continue;
		
		//}
		
		//Increment dayIdx if previousforecastDate does not match forecastDate
		if (previousforecastDate && previousforecastDate.getDate() !== forecastDate.getDate()) {
			
			dayIdx++;
			
		}
		
		//Convert forecastDate to MM/dd/yyyy -- use this as key for associative array
		let forecastKey = forecastDate.toLocaleDateString();
		
		//If dictionary does not contain key forecastDate
		if(!separatedForecasts[forecastKey]) {
			
			//Create key and empty array value within dictionary
			separatedForecasts[forecastKey] = [];
			
		}
		
		//Push forecast into dictionary array
		separatedForecasts[forecastKey].push(forecast);
		
		//Set previousforecastDate to forecastDate
		previousforecastDate = forecastDate;
		
	}
	
	//If last element of separatedForecasts has no forecast data (this is likely caused by OpenWeatherMap's API not providing enough data for a 5 day forecast)
	let lastDictionaryKey = Object.keys(separatedForecasts).slice(-1)[0];
	
	if (separatedForecasts[lastDictionaryKey].length === 0) {
		
		//Remove last element from separatedForecasts dictionary
		delete separatedForecasts[lastDictionaryKey];
		
	}
	
	//Return dictionary
	return separatedForecasts;
	
}

//Consolidate a day's 3-hourly forecast into a single consolidated forecast
function consolidateToDailyForecast(forecastKey, forecast) {
	
	let main = getWeatherMain(forecast);
	
	let humidity = getAveHumidity(forecast);
	
	let [low, high] = getHighLowTemp(forecast);
	
	return {
		date: new Date(forecastKey),
		main: main,
		humidity: humidity,
		low: low,
		high: high
	};
	
}

//Get Weather Main
function getWeatherMain(forecast) {
	
	let mainTracker = {};

	forecast.forEach((forecastEl) => {
		
		let main = forecastEl.weather[0].main;

		mainTracker[main] = mainTracker[main] ? mainTracker[main] + 1 : 1;
		
	});

	let dominantMain = Object.keys.length === 1 ? Object.keys(mainTracker)[0] :
		
		Object.keys(mainTracker).reduce( (a, b) => {
		  
		  return mainTracker[a] > mainTracker[b] ? a : b;
		  
		});

	return dominantMain;
  
};

//Get High/Low Temperature
function getHighLowTemp(forecast) {
	
	let minTemp;
	let maxTemp;

	forecast.forEach((forecastEl, idx) => {
		
		let temp = forecastEl.main.temp;

		if (idx === 0) {
			
			[minTemp, maxTemp] = [temp, temp];
			
		}
		else if (temp < minTemp) {
			
			minTemp = temp;
			
		}
		else if (temp > maxTemp) {
			
			maxTemp = temp;
			
		}
		
	});

	return [minTemp, maxTemp];
  
};

//Get Ave Humidity
function getAveHumidity(forecast) {
	
	return Math.round(forecast.reduce(((acc, curr) => acc + curr.main.humidity), 0) / forecast.length);
	
};

//AJAX calls to server using jQuery
function rest(type, url, data, success, err) {
	
	$.ajax({
		type: type,
		url: url,
		success: success || function (res) { console.log(res); },
		error: err || function(err) { console.log(err); }
	});
	
}