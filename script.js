// 🍲 Weather App with Hinglish Comments
const apiKey = "c7d3b6dfbd484f158a5192927251706";
const loader = document.getElementById("loader");
const weatherInfo = document.getElementById("weatherInfo");
const forecastDiv = document.getElementById("forecast");

// 🌀 Show and Hide Loader
function showLoader() {
  loader.style.display = "block";
}
function hideLoader() {
  loader.style.display = "none";
}

// 📍 Auto-location se weather
function getLocationWeather() {
  if (navigator.geolocation) {
    showLoader();
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&aqi=yes`;
      fetchWeather(url);
    }, () => {
      document.getElementById("error").textContent = "❌ Location access denied.";
    });
  } else {
    document.getElementById("error").textContent = "❌ Geolocation not supported.";
  }
}

// 🔍 City ke naam se weather
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=yes`;
  showLoader();
  fetchWeather(url);
}

// 🛠 Weather fetch logic
function fetchWeather(url) {
  document.getElementById("error").textContent = "";
  forecastDiv.innerHTML = "";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      hideLoader();
      if (data.location) {
        weatherInfo.style.display = "block";
        document.getElementById("cityName").textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById("temp").textContent = data.current.temp_c;
        document.getElementById("description").textContent = data.current.condition.text;
        document.getElementById("wind").textContent = data.current.wind_kph;
        document.getElementById("humidity").textContent = data.current.humidity;
        document.getElementById("weatherIcon").src = `https:${data.current.condition.icon}`;

        // 🔮 Forecast data
        data.forecast.forecastday.slice(1).forEach(day => {
          const forecastHTML = `
            <div>
              <h4>${day.date}</h4>
              <img src="https:${day.day.condition.icon}" width="48" />
              <p>${day.day.condition.text}</p>
              <p>🌡️ Max: ${day.day.maxtemp_c}°C / Min: ${day.day.mintemp_c}°C</p>
            </div>
          `;
          forecastDiv.innerHTML += forecastHTML;
        });
      } else {
        document.getElementById("error").textContent = "❌ City not found or API error.";
      }
    })
    .catch((err) => {
      hideLoader();
      document.getElementById("error").textContent = "❌ Failed to load data.";
      console.error(err);
    });
}

// 🌗 Theme Mode Toggle
document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
