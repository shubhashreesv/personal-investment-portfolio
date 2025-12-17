import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Help from "./components/Help";
import Home from "./components/Home";

import ManageInvestments from "./components/ManageInvestments";
import Dashboard from "./components/Dashboard";  // New Dashboard Component
import Settings from "./components/Settings";  // New MyPortfolio Component
import Chatbot from "./components/Chatbot";
import Auth from "./components/Auth";
import "./index.css";
import StockDashboard from "./components/StockDashboard";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />  {/* Default page to Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard */}
        <Route path="/manage-investments" element={<ManageInvestments />} />  {/* Manage Investments */}
        <Route path="/settings" element={<Settings />} />  {/* My Portfolio */}
        <Route path="/about" element={<About />} />  {/* About */}
        <Route path="/faq" element={<FAQ />} />  {/* FAQ */}
        <Route path="/help" element={<Help />} />  {/* Help */}
        <Route path="/home" element={<Home />} />  {/* Home */}
        <Route path="/account" element={<Auth />} />  {/* Account */}
        <Route path="/stock-dashboard" element={<StockDashboard />} />  {/* Home */}
      </Routes>
      <Chatbot/>
      <Footer />
    </>
  );
}

export default App;
