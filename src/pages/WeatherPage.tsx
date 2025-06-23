// src/pages/WeatherPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useTitle } from "../hooks/useTitle";
import {
  WiThermometer,
  WiHumidity,
  WiCloud,
  WiStrongWind,
  WiDirectionUp,
} from "react-icons/wi";

interface WeatherPayload {
  temperature: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  windDirection: string;
  source: "openweathermap" | "cache";
}

const API_BASE = import.meta.env.VITE_MAIN_API || "http://localhost:3000";

const WeatherPage: React.FC = () => {
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useTitle("Weather | OpenWeatherApi");
  const token = localStorage.getItem("token") || "";

  // parse & validate
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  const isLatValid = !isNaN(latNum) && latNum >= -90 && latNum <= 90;
  const isLonValid = !isNaN(lonNum) && lonNum >= -180 && lonNum <= 180;
  const isFormValid = isLatValid && isLonValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWeather(null);

    if (!isFormValid) {
      setError(
        "Latitude must be between –90 and 90, longitude between –180 and 180."
      );
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get<WeatherPayload>(`${API_BASE}/weather`, {
        params: { lat: latNum, lon: lonNum },
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeather(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Weather Search</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Latitude */}
          <div>
            <label htmlFor="lat" className="block text-sm font-medium">
              Latitude
            </label>
            <input
              id="lat"
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 24.7136"
              min={-90}
              max={90}
              step="any"
              required
              className={`mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                lat && !isLatValid ? "border-red-500" : "border-gray-300"
              }`}
            />
            {lat && !isLatValid && (
              <p className="mt-1 text-red-500 text-sm">
                Latitude must be between –90 and 90.
              </p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label htmlFor="lon" className="block text-sm font-medium">
              Longitude
            </label>
            <input
              id="lon"
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="e.g. 46.6753"
              min={-180}
              max={180}
              step="any"
              required
              className={`mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                lon && !isLonValid ? "border-red-500" : "border-gray-300"
              }`}
            />
            {lon && !isLonValid && (
              <p className="mt-1 text-red-500 text-sm">
                Longitude must be between –180 and 180.
              </p>
            )}
          </div>

          {/* Overall hint */}
          {!isFormValid && (
            <div className="text-yellow-600 text-sm text-center">
              Please correct the highlighted fields above.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {weather && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Header card */}
            <div className="col-span-full bg-gradient-to-br from-blue-50 to-blue-200 p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Current Conditions
              </h2>
              <p className="text-center italic text-sm">
                Source:{" "}
                {weather.source === "cache" ? "Cache" : "OpenWeatherMap"}
              </p>
            </div>

            {/* Temperature */}
            <div className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <WiThermometer className="text-4xl text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Temperature</p>
                <p className="text-2xl font-bold">{weather.temperature}°C</p>
              </div>
            </div>

            {/* Humidity */}
            <div className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <WiHumidity className="text-4xl text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Humidity</p>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
              </div>
            </div>

            {/* Conditions */}
            <div className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <WiCloud className="text-4xl text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Conditions</p>
                <p className="text-2xl font-bold capitalize">
                  {weather.conditions}
                </p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <WiStrongWind className="text-4xl text-teal-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Wind Speed</p>
                <p className="text-2xl font-bold">{weather.windSpeed} m/s</p>
              </div>
            </div>

            {/* Wind Direction */}
            <div className="flex items-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <WiDirectionUp className="text-4xl text-yellow-500 mr-3 rotate-45" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Wind Direction
                </p>
                <p className="text-2xl font-bold">{weather.windDirection}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
