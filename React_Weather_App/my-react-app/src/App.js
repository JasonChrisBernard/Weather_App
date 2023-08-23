import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function MyApp() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [showAllDays, setShowAllDays] = useState(false);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const inputRef = useRef(null);
  const API_KEY = "88c33ce0390f73bb5d6921feb30c9966";
  const weatherEmojiMap = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '☁️',
    'overcast clouds': '☁️',
    'light rain': '🌦️',
    'moderate rain': '🌧️',
    'heavy intensity rain': '🌧️',
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      // Clear the forecast data when searching for a new location
      setForecastData([]);
  
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=7&units=metric&appid=${API_KEY}`
        )
        .then((response) => {
          const forecastList = response.data.list;
          const formattedForecastData = forecastList.map((item) => ({
            date: new Date(item.dt * 1000),
            temperature: item.main.temp,
            description: item.weather[0].description,
          }));
  
          setForecastData(formattedForecastData);
        })
        .catch((error) => {
          console.error("Error fetching forecast data:", error);
        });
  
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
        )
        .then((response) => {
          setData(response.data);
          setLat(response.data.coord.lat);
          setLon(response.data.coord.lon);
        })
        .catch((error) => {
          console.error("Error fetching current weather data:", error);
        });
  
      setLocation(''); // Reset the location input after the search
  
      // Set focus to the input field
      inputRef.current.focus();
    }
  };

  const handleViewMoreClick = () => {
    setShowAllDays(!showAllDays);
  };

  useEffect(() => {
    if (location) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
        )
        .then((response) => {
          setData(response.data);
          setLat(response.data.coord.lat);
          setLon(response.data.coord.lon);
        })
        .catch((error) => {
          console.error("Error fetching current weather data:", error);
        });
    }
  }, [location, API_KEY]);

  let filteredForecastData = [];

  if (showAllDays) {
    filteredForecastData = forecastData;
  } else {
    filteredForecastData = forecastData.slice(0, 3);
  }

  return (
    <div className="app">
      <div className="search">
        <div className="centered-input">
        <input
          ref={inputRef}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
        </div>
      </div>
      <div className="container">
        {data.name && (
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? (
                <h1>{data.main.temp.toFixed()}°C</h1>
              ) : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
            <div className="latlong">
              <p>Latitude: {lat}</p>
              <p>Longitude: {lon}</p>
            </div>
          </div>
        )}
        {data.main && (
          <div className="bottom">
            <div className="feels">
              <p className="bold">{data.main.feels_like.toFixed()}°C</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            {data.wind && (
              <div className="wind">
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
                <p>Wind Speed</p>
              </div>
            )}
          </div>
        )}

        {/* Conditionally render the weather forecast */}
        {forecastData.length > 0 && (
          <div className="forecast">
            <h2>{showAllDays ? "7-Day" : "3-Day"} Weather Forecast</h2>
            <div className="forecast-items">
              {filteredForecastData.map((day, index) => {
                const today = new Date();
                const nextDate = new Date(today);
                nextDate.setDate(today.getDate() + index);
                return (
                  <div className="forecast-item" key={index}>
                    Date: {nextDate.toLocaleDateString()}&nbsp;&nbsp;
                    Temperature: {day.temperature.toFixed(1)}°C&nbsp;&nbsp;
                    Description: {weatherEmojiMap[day.description.toLowerCase()] || day.description}&nbsp;{day.description}
                  </div>
                );
              })}
            </div>
            <div className="button-container">
              <button className="view-more-button" onClick={handleViewMoreClick}>
                {showAllDays ? "View Less" : "View More"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default MyApp;
