// src/pages/WeatherPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useTitle } from "../hooks/useTitle";

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
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useTitle("Weather | OpenWeatherApi");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWeather(null);

    if (!lat || !lon) {
      setError("Both latitude and longitude are required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get<WeatherPayload>(`${API_BASE}/weather`, {
        params: { lat, lon },
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
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 24.7136"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="e.g. 46.6753"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2">
            <h2 className="text-xl font-semibold">Results</h2>
            <p>
              <span className="font-medium">Temperature:</span>{" "}
              {weather.temperature} °C
            </p>
            <p>
              <span className="font-medium">Humidity:</span> {weather.humidity}%
            </p>
            <p>
              <span className="font-medium">Conditions:</span>{" "}
              {weather.conditions}
            </p>
            <p>
              <span className="font-medium">Wind Speed:</span>{" "}
              {weather.windSpeed} m/s
            </p>
            <p>
              <span className="font-medium">Wind Dir.:</span>{" "}
              {weather.windDirection}
            </p>
            <p className="italic text-sm">
              Source: {weather.source === "cache" ? "Cache" : "OpenWeatherMap"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
