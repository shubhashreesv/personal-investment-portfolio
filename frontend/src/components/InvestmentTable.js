import React, { useState } from 'react';
import { Edit2, Trash2, LineChart as LineChartIcon } from 'lucide-react';
import InvestmentGraphModal from './InvestmentGraphModal'; // Assuming this component is correctly created
import InvestmentManager from './InvestmentManager'; 

const InvestmentTable = ({ investments, onEditClick, onDeleteClick }) => {
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const handleGraphClick = (investment) => {
    setSelectedInvestment(investment);
    setShowGraph(true);
  };

  const handleCloseGraph = () => {
    setSelectedInvestment(null);
    setShowGraph(false);
  };

  return (
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
              {investments.map((inv, index) => (
                <tr key={inv.id || index} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{inv.asset}</td>
                  <td className="px-4 py-2">${inv.amount}</td>
                  <td className="px-4 py-2">${inv.current_value}</td>
                  <td className="px-4 py-2">{inv.date}</td>
                  <td className={`px-4 py-2 ${inv.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${inv.profit_loss}
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <button onClick={() => handleGraphClick(inv)} className="text-purple-600 hover:text-purple-800">
                      <LineChartIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showGraph && (
        <InvestmentGraphModal
          investment={selectedInvestment}
          onClose={handleCloseGraph}
        />
      )}
    </div>
  );
};

export default InvestmentTable;