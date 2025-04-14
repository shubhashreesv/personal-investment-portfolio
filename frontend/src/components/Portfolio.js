import React, { useState } from 'react';
import { RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

const Portfolio = () => {
  const [investments] = useState([
    {
      id: '1',
      stockName: 'Apple Inc.',
      ticker: 'AAPL',
      quantity: 10,
      buyPrice: 150.0,
      currentPrice: 175.0,
      buyDate: '2024-01-15',
    },
    // Add more mock data as needed
  ]);

  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const calculateGainLoss = (investment) => {
    const gainLoss = (investment.currentPrice - investment.buyPrice) * investment.quantity;
    const percentage =
      ((investment.currentPrice - investment.buyPrice) / investment.buyPrice) * 100;
    return { amount: gainLoss, percentage };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Portfolio</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <RefreshCw className="w-5 h-5" />
          Refresh Prices
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stockName')}
                >
                  Stock Name
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ticker')}
                >
                  Ticker
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('quantity')}
                >
                  Quantity
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('buyPrice')}
                >
                  Buy Price
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('currentPrice')}
                >
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Gain/Loss
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {investments.map((investment) => {
                const { amount, percentage } = calculateGainLoss(investment);
                const isPositive = amount >= 0;

                return (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{investment.stockName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{investment.ticker}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{investment.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${investment.buyPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${investment.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div
                        className={`flex items-center ${
                          isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span className="ml-1">
                          ${Math.abs(amount).toFixed(2)} ({percentage.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
