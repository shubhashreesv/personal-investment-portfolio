import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const InvestmentGraphModal = ({ investment, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/investments/${investment.id}/history/`);
        const data = await res.json();
        const sortedData = data.map(entry => ({
          date: entry.date,
          value: entry.value,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        setHistory(sortedData);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    if (investment) {
      fetchHistory();
    }
  }, [investment]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-3xl shadow-xl relative">
        <h3 className="text-xl font-semibold mb-4">📈 {investment.asset} Price History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Close
        </button>
      </div>
    </div>
  );
};

export default InvestmentGraphModal;
