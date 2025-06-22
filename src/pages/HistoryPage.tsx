// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const fetchEntries = async () => {
    setError("");
    setTotal(null);
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

  // filter entries by searchTerm across conditions, lat/lon
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
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">History</h1>

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
              placeholder="Search by condition, lat, lon, source"
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

        <div className="space-y-6">
          {filteredEntries.map((e) => (
            <div
              key={e._id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  <strong>Lat:</strong> {e.lat}, <strong>Lon:</strong> {e.lon}
                </span>
                <span>
                  {new Date(e.requestedAt).toLocaleString("en-US", {
                    hour12: false,
                  })}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Temp:</strong> {e.temperature} °C
                </div>
                <div>
                  <strong>Humidity:</strong> {e.humidity}%
                </div>
                <div>
                  <strong>Conditions:</strong> {e.conditions}
                </div>
                <div>
                  <strong>Wind:</strong> {e.windSpeed} m/s {e.windDirection}
                </div>
              </div>

              <div className="mt-2 italic text-sm text-right">
                Source: {e.source === "cache" ? "Cache" : "OpenWeatherMap"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
