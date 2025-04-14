import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ManageInvestments from "./components/ManageInvestments";
import Dashboard from "./components/Dashboard";  // New Dashboard Component
import Portfolio from "./components/Portfolio";  // New MyPortfolio Component
import "./index.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />  {/* Default page to Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard */}
        <Route path="/manage-investments" element={<ManageInvestments />} />  {/* Manage Investments */}
        <Route path="/portfolio" element={<Portfolio />} />  {/* My Portfolio */}
      </Routes>
    </>
  );
}

export default App;
