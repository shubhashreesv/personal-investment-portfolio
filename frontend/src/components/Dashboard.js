// src/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import InvestmentTable from './InvestmentTable'; // Import InvestmentTable

const StatsCard = ({ title, value, icon, trend }) => {
  const trendColor =
    trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-700';

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${trendColor}`}>{value}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/investments/');
        setInvestments(res.data);
      } catch (err) {
        console.error("Error fetching investments:", err);
      }
    };

    fetchInvestments();
  }, []);

  // Aggregate the total portfolio value over time
  const chartData = investments.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing.value += curr.current_value;  // Add current investment value to the existing entry
    } else {
      acc.push({ date: curr.date, value: curr.current_value });  // Create a new entry for the date
    }
    return acc;
  }, []);

  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalCurrent = investments.reduce((sum, i) => sum + i.current_value, 0);
  const gainLoss = totalCurrent - totalInvested;

  const handleEditClick = (investment) => {
    setSelectedInvestment(investment);
    setModalVisible(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/investments/${id}/`);
      setInvestments(investments.filter((inv) => inv.id !== id));
    } catch (err) {
      console.error("Error deleting investment:", err);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedInvestment(null);
  };

  const handleUpdateInvestment = async (updatedInvestment) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/investments/${updatedInvestment.id}/`, updatedInvestment);
      setInvestments(investments.map((inv) => (inv.id === updatedInvestment.id ? res.data : inv)));
      setModalVisible(false);
      setSelectedInvestment(null);
    } catch (err) {
      console.error("Error updating investment:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Invested"
          value={`$${totalInvested.toFixed(2)}`}
          icon={<DollarSign className="text-blue-500" />}
          trend="neutral"
        />
        <StatsCard
          title="Current Value"
          value={`$${totalCurrent.toFixed(2)}`}
          icon={<TrendingUp className="text-green-500" />}
          trend={totalCurrent >= totalInvested ? 'up' : 'down'}
        />
        <StatsCard
          title="Gain / Loss"
          value={`$${gainLoss.toFixed(2)}`}
          icon={gainLoss >= 0 ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
          trend={gainLoss >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Portfolio Value Over Time Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Portfolio Value Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Investment Table */}
      <InvestmentTable
        investments={investments}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Edit Modal */}
      {modalVisible && selectedInvestment && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Investment</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateInvestment(selectedInvestment);
            }}>
              <input
                type="text"
                value={selectedInvestment.asset}
                onChange={(e) => setSelectedInvestment({ ...selectedInvestment, asset: e.target.value })}
                placeholder="Asset"
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                value={selectedInvestment.amount}
                onChange={(e) => setSelectedInvestment({ ...selectedInvestment, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                value={selectedInvestment.current_value}
                onChange={(e) => setSelectedInvestment({ ...selectedInvestment, current_value: e.target.value })}
                placeholder="Current Value"
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="date"
                value={selectedInvestment.date}
                onChange={(e) => setSelectedInvestment({ ...selectedInvestment, date: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded mt-4 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
            <button onClick={handleModalClose} className="absolute top-0 right-0 p-2 text-gray-600">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;