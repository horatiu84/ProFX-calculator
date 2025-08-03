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

/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Training from './Training';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Training />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

*/
