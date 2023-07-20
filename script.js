// Constants
const apiKey = '3b2849112ceb2f51a20973635f098193'; // Replace with your actual API key


// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const historyList = document.getElementById('history-list');
const currentWeatherInfo = document.getElementById('current-weather-info');
const forecastInfo = document.getElementById('forecast-info');


// Event listener for form submission
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName !== '') {
    getWeatherData(cityName);
    cityInput.value = '';
  }
});


// Function to fetch weather data from the API
function getWeatherData(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
 
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error: ' + response.status);
      }
    })
    .then(function (data) {
      // Process and display weather data
      displayCurrentWeather(data);
      displayForecast(data);
      saveToLocalStorage(cityName);
      updateSearchHistory();
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}


// Function to display current weather
function displayCurrentWeather(data) {
  const city = data.city.name;
  const date = new Date(data.list[0].dt * 1000).toLocaleDateString();
  const temperature = Math.round((data.list[0].main.temp - 273.15) * 9/5 + 32); // Convert from Kelvin to Fahrenheit
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;
 
  // Update the HTML with the weather information
  currentWeatherInfo.innerHTML = `
    <p><strong>City:</strong> ${city}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Temperature:</strong> ${temperature}&deg;F</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
  `;
}

// Function to display forecast
function displayForecast(data) {
  // Clear previous forecast
  forecastInfo.innerHTML = '';
 
  // Display 5-day forecast
  for (let i = 0; i < data.list.length && i < 40; i += 8) {
    const forecastDate = new Date(data.list[i].dt * 1000).toLocaleDateString();
    const forecastTemperature = Math.round((data.list[i].main.temp - 273.15) * 9/5 + 32); // Convert from Kelvin to Fahrenheit
    const forecastHumidity = data.list[i].main.humidity;
    const forecastIcon = data.list[i].weather[0].icon;
   
    // Create forecast card
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
      <p><strong>Date:</strong> ${forecastDate}</p>
      <p><strong>Temperature:</strong> ${forecastTemperature}&deg;F</p>
      <p><strong>Humidity:</strong> ${forecastHumidity}%</p>
    `;
   
    // Append forecast card to the forecast section
    forecastInfo.appendChild(forecastCard);
  }
}


// Function to save city name to localStorage
function saveToLocalStorage(cityName) {
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  history.push(cityName);
  localStorage.setItem('searchHistory', JSON.stringify(history));
}


// Function to update search history
function updateSearchHistory() {
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  history.forEach(function (city) {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', function () {
      getWeatherData(city);
    });
    historyList.appendChild(listItem);
  });
}


// Load search history from localStorage on page load
window.addEventListener('load', function () {
  updateSearchHistory();
});



