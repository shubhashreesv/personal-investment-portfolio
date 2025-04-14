import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManageInvestments from './ManageInvestments';
import InvestmentTable from './InvestmentTable';

const InvestmentManager = () => {
  const [investments, setInvestments] = useState([]);

  // Fetch investments on load
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/investments/');
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };

    fetchInvestments();
  }, []);

  // Handle investment addition or update
  const updateInvestments = (updatedInvestments) => {
    setInvestments(updatedInvestments);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ManageInvestments investments={investments} updateInvestments={updateInvestments} />
      <InvestmentTable investments={investments} />
    </div>
  );
};

export default InvestmentManager;