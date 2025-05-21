import React, { useEffect, useState } from 'react';
import '../HomePage/weather.css';

const LAT = -29.8289;
const LON = 30.9252;
const API_KEY = 'cee83872579c285a649c15a41b74095c';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const currentResponse = await fetch(`
          https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}
        `);
        const currentData = await currentResponse.json();
        setWeather(currentData);

        const forecastResponse = await fetch(`
          https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}
        `);
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();

    
    const interval = setInterval(fetchWeatherData, 600000);

    return () => clearInterval(interval);
  }, []);

  if (!weather || !weather.main || !weather.weather || !weather.wind || !forecast || !forecast.list) {
    return (
      <aside className="weather-sidebar loading">
        <p>⛅ Checking Sherwood’s weather...</p>
      </aside>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString()} (${date.toLocaleDateString('en-US', { weekday: 'long' })})`;
  };

  return (
    <aside className="weather-sidebar">
      <header>
        <h3>Weather – Sherwood, Durban</h3>
        <img src={iconUrl} alt="Weather Icon" />
      </header>
      <h3>📅 {currentDate.toLocaleDateString()} ({currentDate.toLocaleDateString('en-US', { weekday: 'long' })})</h3>
      <p>🌡️ {weather.main.temp}°C — {weather.weather[0].main}</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>🌬️ Wind: {weather.wind.speed} m/s</p>

      <section className="weekly-forecast">
        <h4>🌦️ 5-Day Forecast:</h4>
        <ul>
          {forecast.list.filter(day => {
            const dayDate = new Date(day.dt * 1000);
            return dayDate.getDate() !== new Date().getDate(); 
          }).filter((_, index) => index % 8 === 0).map((day, index) => (
            <li key={index}>
              {formatDate(day.dt)} — {day.weather[0].main}
              <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Weather Icon" />
              ({day.main.temp}°C)
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default WeatherWidget;