import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./db/Dashboard";
import LotCalculator from "./LotCalculator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LotCalculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

