const apiKey = "e51b504963ed94eb53673d2757f0361f";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
let isCelsius = true;

async function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    if (city) {
        try {
            const response = await fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`);
            const data = await response.json();
            document.getElementById("cityName").innerText = data.name;
            displayCurrentWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        } catch (error) {
            console.error("Ошибка при получении погоды:", error);
        }
    }
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`${apiUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`);
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error("Ошибка при получении прогноза:", error);
    }
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById("currentWeather");
    currentWeatherDiv.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p>Температура: ${Math.round(data.main.temp)}° ${isCelsius ? 'C' : 'F'}</p>
        <p>Влажность: ${data.main.humidity}%</p>
        <p>Скорость ветра: ${data.wind.speed} м/с</p>
        <p>${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastDiv.innerHTML += `
            <div class="forecast-day">
                <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                <p>Макс: ${Math.round(day.main.temp_max)}°</p>
                <p>Мин: ${Math.round(day.main.temp_min)}°</p>
            </div>
        `;
    }
}

function fetchLocationWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`${apiUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`);
            const data = await response.json();
            document.getElementById("cityName").innerText = data.name;
            displayCurrentWeather(data);
            fetchForecast(latitude, longitude);
        } catch (error) {
            console.error("Ошибка при получении погоды по локации:", error);
        }
    }, (error) => {
        console.error("Ошибка при получении геолокации:", error);
    });
}

function toggleUnit() {
    isCelsius = !isCelsius;
    const city = document.getElementById("cityInput").value;
    if (city) fetchWeather();
}
