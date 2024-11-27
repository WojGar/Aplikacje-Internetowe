document.getElementById('weather-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        alert('Proszę wprowadzić nazwę miasta.');
        return;
    }

    const apiKey = '11b5451a3ad9a500792df499518feac5';

    //XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open(
        'GET',
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`,
        true
    );
    xhr.onload = function () {
        if (xhr.status === 200) {
            const currentWeather = JSON.parse(xhr.responseText);
            displayCurrentWeather(currentWeather);
            console.log('Bieżąca pogoda (XMLHttpRequest):', currentWeather);
        } else {
            alert('Nie udało się pobrać danych o bieżącej pogodzie.');
        }
    };
    xhr.send();

    //Fetch API
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych o prognozie pogody.');
            }
            return response.json();
        })
        .then(forecastData => {
            console.log('Prognoza pogody (Fetch):', forecastData);
            displayForecast(forecastData);
        })
        .catch(error => {
            console.error(error);
            alert(error.message);
        });
});

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentWeatherDiv.innerHTML = `
        <h2>Bieżąca pogoda</h2>
        <div class="weather-card">
            <p><strong>Miasto:</strong> ${data.name}</p>
            <img src="${icon}" alt="Ikona pogody" title="${data.weather[0].description}">
            <p class="temperature">${data.main.temp}°C</p>
            <p><strong>Opis:</strong> ${data.weather[0].description}</p>
            <p><strong>Wilgotność:</strong> ${data.main.humidity}%</p>
            <p><strong>Wiatr:</strong> ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    const forecasts = data.list.slice(0, 5).map(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleString('pl-PL', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
        const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        return `
            <div class="weather-card">
                <p><strong>${date}</strong></p>
                <img src="${icon}" alt="Ikona pogody" title="${forecast.weather[0].description}">
                <p class="temperature">${forecast.main.temp}°C</p>
                <p>Opis: ${forecast.weather[0].description}</p>
            </div>
        `;
    });

    forecastDiv.innerHTML = `
        <h2>Prognoza pogody (najbliższe godziny)</h2>
        ${forecasts.join('')}
    `;
}
