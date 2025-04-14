import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign, Edit2, Trash2 } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
  } from 'recharts';

 


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
    const chartData = investments.reduce((acc, curr) => {
        const existing = acc.find((item) => item.date === curr.date);
        if (existing) {
        existing.value += curr.current_value;
        } else {
        acc.push({ date: curr.date, value: curr.current_value });
        }
        return acc;
    }, []);
    
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
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        {investments.length === 0 ? (
          <p className="text-gray-600">No investments added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Asset</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Current Value</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Profit/Loss</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{inv.asset}</td>
                    <td className="px-4 py-2">${inv.amount}</td>
                    <td className="px-4 py-2">${inv.current_value}</td>
                    <td className="px-4 py-2">{inv.date}</td>
                    <td className={`px-4 py-2 ${inv.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${inv.profit_loss}
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleEditClick(inv)} className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(inv.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Investment</button>
              <button type="button" onClick={handleModalClose} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
