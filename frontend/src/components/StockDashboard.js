import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_KEY = "d0hd081r01qv1u36o2ngd0hd081r01qv1u36o2o0";
const DEFAULT_STOCKS = ["AAPL", "GOOGL", "TSLA", "MSFT", "AMZN"];

const StockDashboard = () => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState(DEFAULT_STOCKS);

  const fetchStockData = async (symbols) => {
    setLoading(true);
    const data = {};
    for (const symbol of symbols) {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );
        const json = await res.json();
        data[symbol] = json;
      } catch (error) {
        console.error("Error fetching data for", symbol);
      }
    }
    setStockData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStockData(stocks);
    const interval = setInterval(() => fetchStockData(stocks), 60000);
    return () => clearInterval(interval);
  }, [stocks]);

  const handleSearch = (e) => {
    e.preventDefault();
    const symbol = query.trim().toUpperCase();
    if (symbol && !stocks.includes(symbol)) {
      setStocks([symbol, ...stocks]);
      setQuery("");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">📈 Live Stock Dashboard</h1>

      <form onSubmit={handleSearch} className="mb-6 text-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter stock symbol (e.g., NFLX)"
          className="p-2 border border-gray-300 rounded-l-lg w-60"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-center">Loading stock data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((symbol) => {
            const stock = stockData[symbol];
            if (!stock || stock.c === 0) return null; // Skip invalid symbols
            const change = stock.d;
            const percent = stock.dp;
            const isUp = change >= 0;
            return (
              <div
                key={symbol}
                className="rounded-2xl shadow-lg p-4 bg-white hover:shadow-xl transition duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{symbol}</h2>
                <p className="text-gray-600">Current: ${stock.c.toFixed(2)}</p>
                <p
                  className={
                    isUp ? "text-green-500 font-semibold" : "text-red-500 font-semibold"
                  }
                >
                  {isUp ? "+" : ""}{change.toFixed(2)} ({percent.toFixed(2)}%)
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  High: ${stock.h.toFixed(2)} | Low: ${stock.l.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
