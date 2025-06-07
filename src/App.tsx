import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/shared/Layout";
import CaseLibrary from "./pages/CaseLibrary";
import Training from "./pages/Training";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/train\" replace />} />
          <Route path="cases" element={<CaseLibrary />} />
          <Route path="train" element={<Training />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
