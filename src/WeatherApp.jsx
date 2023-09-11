import React, { useState, useEffect } from "react";
import "./WeatherApp.scss";
import { weatherIcons, weatherImages } from "./objWeatherImages";

const apiKey = "31115f294d171da80379c38f00368dda";

function WeatherApp() {
  const [city, setCity] = useState(""); // Состояние для хранения введенного города
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDescr, setWeatherDescr] = useState("heavy snow");
  const [userTimeZone, setUserTimeZone] = useState("");
  const [imgUrl, setImgUrl] = useState(weatherImages[weatherDescr]);
  const [iconUrl, setIconUrl] = useState(weatherIcons[weatherDescr]);

  const now = new Date();
  const utcNow = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
  const timeDifference = (now - utcNow) / 1000;
  const adjustedDate = new Date(
    now.getTime() - timeDifference * 1000 + userTimeZone * 1000
  );

  const year = adjustedDate.getFullYear();
  const options = { month: "short" };
  const month = new Intl.DateTimeFormat("en-En", options).format(adjustedDate);
  const day = String(adjustedDate.getDate()).padStart(2, "0");
  const hours = String(adjustedDate.getHours()).padStart(2, "0");
  const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");

  const formattedDate = `${month} ${day} ${year} `;
  const formattedTime = `${hours}:${minutes}`;

useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data not available for this location.");
      }

      const data = await response.json();

      setWeatherData(data);
      setWeatherDescr(data.weather[0].description.toLowerCase());

      if (Number(hours) >= 5 && Number(hours) < 22) {
        setImgUrl(weatherImages[data.weather[0].description.toLowerCase()]);
      } else {
        setImgUrl(weatherImages["night"]);
      }

      setIconUrl(weatherIcons[data.weather[0].description.toLowerCase()]);

      if (data.timezone) {
        setUserTimeZone(data.timezone);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
  if (city) {
    fetchData();
  }
}, [city, hours]);


  return (
    <div className="main" style={{ backgroundImage: `url('${imgUrl}')` }}>
      <div className="logo">
        <img src="/icons/logo.svg" alt="" />
        <p>Weather App</p>
      </div>

      <div className="main-cont">
        <div className="left">
          {weatherData && (
            <div className="main-block">
              <div className="temp">{Math.floor(weatherData.main.temp)}°C</div>
              <div className="descr">
                <p className="city">{weatherData.name}</p>
                <div className="date">
                  {formattedTime} {formattedDate}
                </div>
              </div>
              <div className="icon">
                <img src={`${iconUrl}`} alt="" />
              </div>
            </div>
          )}
        </div>

        <div className="right">
          <div className="input-main">
            <label htmlFor="cityInput">Enter City: </label>
            <div className="input-cont">
              <input
                type="text"
                id="cityInput"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {city ? (
                <button onClick={() => setCity("")}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.33268 15.8337L4.16602 14.667L8.83268 10.0003L4.16602 5.33366L5.33268 4.16699L9.99935 8.83366L14.666 4.16699L15.8327 5.33366L11.166 10.0003L15.8327 14.667L14.666 15.8337L9.99935 11.167L5.33268 15.8337Z"
                      fill="white"
                    />
                  </svg>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          {weatherData && (
            <div className="weather-cont">
              <h2>Weather in {weatherData.name}</h2>
              <div className="character">
                Temperature:
                <p className="value"> {Math.floor(weatherData.main.temp)}°C</p>
              </div>
              <div className="character">
                Min Temperature:{" "}
                <p className="value">{Math.floor(weatherData.main.temp_min)}°C</p>
              </div>
              <div className="character">
                Max Temperature:{" "}
                <p className="value">{Math.floor(weatherData.main.temp_max)}°C</p>
              </div>
              <div className="character">
                Humidity: <p className="value">{weatherData.main.humidity}%</p>
              </div>
              <div className="character">
                Condition: <p className="value">{weatherDescr}</p>
              </div>
              <div className="character">
                Wind Speed: <p className="value">{Math.floor(weatherData.wind.speed)} m/s</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
