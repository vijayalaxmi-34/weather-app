import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // ✅ Use this instead of hardcoding
 // 🔴 Replace with your API key

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!currentRes.ok) throw new Error("City not found");

      const currentData = await currentRes.json();
      setWeather(currentData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastData = await forecastRes.json();
      const dailyData = forecastData.list.filter((item, index) => index % 8 === 0);
      setForecast(dailyData);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="body">
      <div className="glassCard">
        <h1 className="title">Weather App</h1>

        <div className="searchRow">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />
          <button onClick={getWeather}>Search</button>
        </div>

        {loading && <p className="infoText">Fetching weather...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="currentSection">
            <h2>{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <h1>{Math.round(weather.main.temp)}°C</h1>
            <p>{weather.weather[0].description}</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecastGrid">
            {forecast.map((day, index) => (
              <div key={index} className="forecastCard">
                <p className="date">{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt="icon"
                />
                <p className="temp">{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
