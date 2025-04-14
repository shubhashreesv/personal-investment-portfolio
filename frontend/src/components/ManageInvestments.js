import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const ManageInvestments = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    asset: '',
    amount: 0,
    date: '',
    current_value: 0,
  });
  const [investments, setInvestments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/investments/');
      console.log("Fetched data:", response.data);  
      setInvestments(response.data);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && editId) {
        // PUT request to update the investment
        const response = await axios.put(`http://localhost:8000/api/investments/${editId}/`, formData);
        
        // Update the investment in the state after the update
        const updatedInvestments = investments.map((investment) =>
          investment.id === editId 
            ? { ...investment, ...formData, current_value: response.data.current_value }  // Ensure current_value is updated
            : investment
        );

        setInvestments(updatedInvestments); // Update state directly
        
        setIsEditMode(false);
        setEditId(null);
      } else {
        // POST request to add a new investment
        const response = await axios.post('http://localhost:8000/api/investments/', formData);
        setInvestments((prevInvestments) => [...prevInvestments, response.data]);
    }

      setShowForm(false);
      setFormData({ asset: '', amount: 0, date: '', current_value: 0 });
    } catch (error) {
      console.error("Error saving investment:", error);
    }
   };


  

  const handleEdit = (investment) => {
    setFormData({
      asset: investment.asset,
      amount: investment.amount,
      date: investment.date,
      current_value: investment.current_value,
    });
    setIsEditMode(true);
    setEditId(investment.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/investments/${id}/`);
      setInvestments(investments.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  const handleClear = async () => {
    try {
      await axios.delete('http://localhost:8000/api/investments/clear/');
      setInvestments([]);
    } catch (error) {
      console.error("Error clearing investments:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Investments</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsEditMode(false);
              setFormData({ asset: '', amount: 0, date: '', current_value: 0 });
              setShowForm(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Investment
          </button>
          
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Investment' : 'Add New Investment'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                <input
                  type="text"
                  value={formData.asset}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                <input
                  type="number"
                  value={formData.current_value}
                  onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
                  required min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isEditMode ? 'Update Investment' : 'Add Investment'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Investments</h2>
        <div className="space-y-4">
          {investments.length === 0 ? (
            <p>No investments found.</p>
          ) : (
            investments.map((investment) => (
              <div key={investment.id} className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{investment.asset}</h3>
                  <p>Amount: ${investment.amount}</p>
                  <p>Current Value: ${investment.current_value}</p>
                  <p>Date: {investment.date}</p>
                  <p>Profit/Loss: ${investment.profit_loss}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(investment)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(investment.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageInvestments;
