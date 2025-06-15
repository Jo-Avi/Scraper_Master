import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Scraper from './pages/Scraper';
import Features from './pages/Features';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scraper" element={<Scraper />} />
      <Route path="/features" element={<Features />} />
    </Routes>
  </Router>
);

export default App;
