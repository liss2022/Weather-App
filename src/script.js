let now = new Date();
let h1 = document.querySelector("h1");
let h4 = document.querySelector("h4");

let days = now.getDate()
let years = now.getFullYear();

let daysNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
let weekDays = daysNames[now.getDay()];

let monthsNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
let months = monthsNames[now.getMonth()];

h1.innerHTML = `${weekDays} ${months} ${days}, ${years}`;

let hours = now.getHours();
let minutes = now.getMinutes();

if (hours < 10){
    hours = `0${hours}`;
}
if (minutes < 10){
    minutes = `0${minutes}`;
}

let timePeriod = [
    "AM",
    "PM",
]
if (hours >= 12){
    timePeriod = `PM`;
}else{
    timePeriod = `AM`;
}
h4.innerHTML = `${hours}: ${minutes} ${timePeriod}`;

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    console.log(lat);
    console.log(lon);
    
    let metricUnit = `metric`;
    let apiKey = `647c7f64d4d8e2cb344d1165b1ce2c4e`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${metricUnit}`;
    axios.get(`${apiUrl}`).then(showWeather);

  }

function getLocation(event){
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(getPosition);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click",getLocation);

function cities(event){
    event.preventDefault();
    let searchInput = document.querySelector("#enter-city-input");

    console.log(searchInput.value);
    let metricUnit = `metric`;
    let apiKey = `647c7f64d4d8e2cb344d1165b1ce2c4e`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
    axios.get(`${apiUrl}${searchInput.value}&appid=${apiKey}&units=${metricUnit}`).then(showWeather);
   
}

function getForecast(coords){
console.log(coords)

let apiKey = `647c7f64d4d8e2cb344d1165b1ce2c4e`;
let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
console.log(apiUrl);

axios.get(apiUrl).then(dailyForecast);
};

function formatDay(timestamp){
    let date = new Date(timestamp * 1000);
    let day = date.getDay();

    let dayName = [
        "Sun", 
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];

    return dayName[day];


}



function dailyForecast(response){
    console.log(response.data);
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row" id="forecast">`;

    let forecast = response.data.daily;
    

    forecast.forEach(function(forecastDay, index){
            if (index < 5 ){


    forecastHTML = forecastHTML + `
		<div class="col-2">
		<div class="card">
		  <div class="card-body" id="forecast-one">
			<h5 class="card-title"> ${formatDay(forecastDay.dt)}</h5><p id="forecast-date-one"></p>
            <img id="weather-icons" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" width="60" />
			<p class="card-text"><small class="text-muted"> <p id="forecast-max">${Math.round(forecastDay.temp.max)} ° </p> 
            <p id="forecast-min">${Math.round(forecastDay.temp.min)} °</p></small></p>
		</div>
        </div>
        </div>

    `;}

            })

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function showWeather(response) {
    console.log(response);
    console.log(response.data.main.temp);
    console.log(response.data.coord.lon);
    console.log(response.data.coord.lat);
    console.log(response.data.name)
    console.log(response.data.weather[0].icon);
    console.log(response.data.weather[0].main);
    console.log(response.data.wind.speed);
    console.log(response.data.weather[0].description);

    let h2 = document.querySelector("h2");
    h2.innerHTML = `${response.data.name}`;

    let p = document.querySelector("#city-temp");
    p.innerHTML = `${response.data.main.temp}°`;

    let speed = document.getElementById(`wind-speed`);
    speed.innerHTML = `${response.data.wind.speed}`;

    let description = document.getElementById(`weather-descriptions`);
    description.innerHTML = `${response.data.weather[0].description}`;

    let images = document.getElementById(`weather-icons`);
    images.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

    if (response.data.weather[0].main === `Clear` & timePeriod === `PM`
    ){
        document.body.style.backgroundColor = "#5066A2";
    } else {
        if (response.data.weather[0].main === `Clear` & timePeriod === `AM` ){
            document.body.style.backgroundColor = "#D6E7F0";

    }
        if(response.data.weather[0].main === `Rain` || response.data.weather[0].main === `Drizzle` || response.data.weather[0].main === `Thunderstorm`){
            document.body.style.backgroundColor = "#556B8F";
        }else{
            if(response.data.weather[0].main === `Snow`){
                document.body.style.backgroundColor = "#9FAAB8";
            }else{
                if(response.data.weather[0].main === `Clouds`){
                    document.body.style.backgroundColor = `#CED2D3`
                }
            }
        }
    };

getForecast(response.data.coord);

};

let searchEngine = document.querySelector("#enter-city");
searchEngine.addEventListener("submit", cities);

function conversionTemp(event){
    event.preventDefault();

    let searchInput = document.querySelector("#enter-city-input");
    
    let imperialUnit = `imperial`;
    let apiKey = `647c7f64d4d8e2cb344d1165b1ce2c4e`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
    axios.get(`${apiUrl}${searchInput.value}&appid=${apiKey}&units=${imperialUnit}`).then(fahrenheitTemp);
    
}

function fahrenheitTemp(response){
    console.log(response);
    console.log(response.data.main.temp);

    let p = document.querySelector("#city-temp");
    p.innerHTML = `${response.data.main.temp}°`;

}

let conversionLinks = document.querySelector("#fahrenheit-conversion");
conversionLinks.addEventListener("click", conversionTemp);

function celsiusTemp(event){
    event.preventDefault();

    let searchInput = document.querySelector("#enter-city-input");
    let metricUnit = `metric`;
    let apiKey = `647c7f64d4d8e2cb344d1165b1ce2c4e`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
    axios.get(`${apiUrl}${searchInput.value}&appid=${apiKey}&units=${metricUnit}`).then(backToCelsius);
}

function backToCelsius(response){
    console.log(response);
    console.log(response.data.main.temp);
    let p = document.querySelector("#city-temp");
    p.innerHTML = `${response.data.main.temp}°`;
}

let revertCelsius = document.querySelector("#celsius-conversion");
revertCelsius.addEventListener("click", celsiusTemp);
