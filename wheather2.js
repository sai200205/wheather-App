const apiKey = "0823b5419995b49470d99e3c57ef4f88";

let cityInput = document.getElementById("cityInput");
let currentWeather = document.getElementById("currentWeather");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const seaLevel = document.getElementById("seaLevel");
const pressure = document.getElementById("pressure");
const timezone = document.getElementById("timezone");
const coordinates = document.getElementById("coordinates");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const convertBtn = document.getElementById("convertBtn");
const locateMeBtn = document.getElementById("locateMeBtn");
const list = document.getElementById("list");
let tempInCelsius = null;

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeatherByCity(city);

});

convertBtn.addEventListener("click", () => {
    if (tempInCelsius !== null) {
        const isCelsius = temperature.textContent.includes("°C");
        temperature.textContent = isCelsius ?
            `${(tempInCelsius * 9/5 + 32).toFixed(1)} °F` :
            `${tempInCelsius} °C`;
    }
});

locateMeBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByLocation(position.coords.latitude, position.coords.longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.outerHTML);
    updateUI(data);
}

async function getWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    updateUI(data);
}

function updateUI(data) {
    if (data.cod !== 200) {
        cityName.textContent = "City not found";
        list.classList.add("d-none");
        alert("NO response from server! Please try again");
        return;
    }
    list.classList.remove("d-none");
    cityInput.value = "";
    cityName.textContent = data.name;
    tempInCelsius = data.main.temp.toFixed(1);
    temperature.textContent = `${tempInCelsius} °C`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    seaLevel.textContent = `Sea Level: ${data.main.sea_level || "N/A"} hPa`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    timezone.textContent = `Timezone: UTC${data.timezone / 3600}`;
    coordinates.textContent = `Coordinates: ${data.coord.lat}, ${data.coord.lon}`;
    sunrise.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

    setWeatherBackground(data.weather[0].main.toLowerCase());

}

function setWeatherBackground(weather) {

    document.body.classList.remove("clear-sky", "clouds", "rain", "snow", "thunderstorm", "default_handle");
    switch (weather) {
        case "clear":
            document.body.classList.add("clear-sky");
            currentWeather.textContent = "WOW!!  CLEAR SKY";
            break;
        case "clouds":
            document.body.classList.add("clouds");
            currentWeather.textContent = "OH!! CLOUDY WEATHER";
            break;
        case "rain":
            document.body.classList.add("rain");
            currentWeather.textContent = "OOPS!! IT'S SEEMS LIKE RAINY";
            break;
        case "snow":
            document.body.classList.add("snow");
            currentWeather.textContent = "HUFF!! LOT OF FOG ";
            break;
        case "thunderstorm":
            document.body.classList.add("thunderstorm");
            currentWeather.textContent = "OMG!! BE CAREFUL OF THUNDERSTORMS";
            break;
        default:
            document.body.classList.add("default_handle");
            currentWeather.textContent = "YEAH! SUNNY TODAY ";

    }
}