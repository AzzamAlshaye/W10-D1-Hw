// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTitle } from "../hooks/useTitle";
import {
  WiThermometer,
  WiHumidity,
  WiCloud,
  WiStrongWind,
  WiDirectionUp,
} from "react-icons/wi";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface HistoryEntry {
  _id: string;
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  windDirection: string;
  requestedAt: string;
  source: "openweathermap" | "cache";
}

const API_BASE = import.meta.env.VITE_MAIN_API || "http://localhost:3000";

const HistoryPage: React.FC = () => {
  useTitle("History | OpenWeatherApi");
  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const token = localStorage.getItem("token") || "";

  const fetchEntries = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.get<HistoryEntry[]>(`${API_BASE}/history`, {
        params: { limit, skip, sort: "-requestedAt" },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.get<{ total: number }>(
        `${API_BASE}/history`,
        {
          params: { count: "true" },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotal(data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch count.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = entries.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.conditions.toLowerCase().includes(term) ||
      e.lat.toString().includes(term) ||
      e.lon.toString().includes(term) ||
      e.source.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">History</h1>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Skip</label>
            <input
              type="number"
              value={skip}
              onChange={(e) => setSkip(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="condition, lat, lon, source"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={fetchEntries}
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Loading…" : "Fetch"}
          </button>
          <button
            onClick={fetchCount}
            disabled={loading}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "…" : "Count"}
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {total !== null && (
          <div className="mb-4 text-center text-lg">
            Total records: <span className="font-semibold">{total}</span>
          </div>
        )}

        {/* Results */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((e) => (
            <div
              key={e._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Header: coords & time */}
              <div className="flex justify-between items-center mb-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  {e.lat}, {e.lon}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  {new Date(e.requestedAt).toLocaleString("en-US", {
                    hour12: false,
                  })}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center">
                  <WiThermometer className="text-2xl text-red-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Temp</p>
                    <p className="text-lg font-bold">{e.temperature}°C</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WiHumidity className="text-2xl text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Humidity
                    </p>
                    <p className="text-lg font-bold">{e.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center col-span-2">
                  <WiCloud className="text-2xl text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Conditions
                    </p>
                    <p className="text-lg font-bold capitalize">
                      {e.conditions}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WiStrongWind className="text-2xl text-teal-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Wind</p>
                    <p className="text-lg font-bold">{e.windSpeed} m/s</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <WiDirectionUp className="text-2xl text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Direction
                    </p>
                    <p className="text-lg font-bold">{e.windDirection}</p>
                  </div>
                </div>
              </div>

              {/* Source */}
              <p className="text-xs italic text-right text-gray-500">
                Source: {e.source === "cache" ? "Cache" : "OpenWeatherMap"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
