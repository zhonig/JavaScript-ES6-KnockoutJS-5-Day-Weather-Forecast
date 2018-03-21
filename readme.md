Requirements:

	Please build a responsive single HTML page displaying a 5 day weather forecast.
	
		*Use HTML5/CSS3/JavaScript ES6 to implement the solution.
		*Use the OpenWeatherMap forecast API to retrieve forecast data -- http://openweathermap.org/api
		*Give some thought to what will be visually appealing and demonstrate a good user experience.
		*Use any supporting technologies, frameworks, package management, starter kits, build managers, or libraries that you feel demonstrate best practice.
		*Provide a readme.md file that documents:
			*How to build, run, and test your creation
			*Your thought process when creating the solution
			*Any tradeoffs you made
			*Anything you might implement with more time (features, fixes, technical debt corrections, etc.)	
		*Automated tests (e.g. unit, functional, integration, system) are especially important to us, as well as approaches such as TDD & BDD. We’re not looking for 100% coverage, but please make sure that you include what you believe to be an appropriate approach to testing.
		*If your solution uses a package manager, please ensure that there are no globally installed dependencies required to build / run your app. This avoids environment issues when trying to build your solution.
			*If you absolutely have to have global packages, please explain why.
		*Please make your code available in a public git repository of your choice (GitHub, Bitbucket, etc.)
		*Host your solution on a public platform of your choice.

What we are looking for:

	The purpose of this exercise is for you to demonstrate to us your engineering principals, technical knowledge, and reasoning ability. There are no tricks or hidden agendas. Please make sure that your code is clear, and that you’ve included appropriate automated testing. Your submission will form the basis for discussion in subsequent interviews.

Check-list:

	The following are important, so please ensure you have submitted the following:
		*A readme.md as described above
		*Working, meaningful tests
		*A working forecast page as per requirements above
		*A project that builds, runs, and tests as per instruction without warnings or errors

Summary:

The 5-Day Weather Forecast Web Page is a single web page that extracts weather data and displays a 5-day forecast using the OpenWeatherMap API. Additionally, the web page uses Google Places API to extract the latitude and longitude coordinates of the user's current/specified location. The weather data is then obtained using the user's coordinates.

Live Website:

http://zackhonig.com/projects/5-Day-Weather-Forecast/
		
Languages:

	1) JavaScript ES6
	2) HTML5
	3) CSS3
	
Frameworks and Technologies:

	1) KnockoutJS
	2) jQuery
	3) Bootstrap
	4) Moment

Vendor Technologies:

	1) Font Awesome CSS

Third-party APIs:

	1) OpenWeatherMap API -- http://openweathermap.org/forecast5
	2) Google Places API -- https://developers.google.com/places/
	
Web Page features:

	1) If browser location is enabled, get the current location weather and display results after clicking button
	2) Google Place API's auto-complete feature allows you to search for any place in the world. It also allows you to find a place based on latitude and longitude coordinates.
	3) Queries and processes OpenWeatherMap API's data into a 5-day forecast
	4) Desktop, Mobile, and Tablet responsive
	
Trade-off decisions:

	To deliver the best user experience, I decided to integrate Google Places API into the web page. This would make it easy for users to search for a location, and to provide latitude and longitude coordinates to OpenWeatherMap. Additionally, integrating the Bootstrap Framework allowed the web page to be responsive, and for the styles to look good.

Challenges:

	OpenWeatherMap's free API service returned daily forecast data. This was a lot more data than I actually needed. Additionally, the number of records received can vary depending on time of the request. Due to these restrictions, I had to implement additional functionality that parsed and processed the data.

What Can We Do To Improve The Web page:

	I would use/implement an API that returns forecast data by days. The web page's performance would be much better on the front-end.
		
To run application on local machine, you must do the following:

	1) Download Zip file to desktop
	2) Extract Zip file to desktop
	3) Open command prompt
		*Click Start Button
		*In "Search programs and files" field, type in "cmd" without the quotation marks
		*Select cmd.exe
	4) To prevent CORS error on localhost and Google Chrome Browser, paste the following commands into the windows "command prompt":
		cd C:\Program Files (x86)\Google\Chrome\Application
		chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
	5) In Google Chrome browser, copy and paste the following url where %User% is pc user:
		file:///C:/Users/%User%/Desktop/JavaScript-ES6-KnockoutJS-5-Day-Weather-Forecast-master/index.html
		
Additional Notes:

	1) Uncomment Lines 243, 257, and 259 within js/main.js if you want to display forecast for the next 5 days (this will exclude today from forecast)