import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IssuePage from './Issue page and assoicated stuff/Issues'; // optional if you have a homepage
import TestPage from './MainUiComponents/testMainUI';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Issue Page</Link></li>
          <li><Link to="/test">Test Page</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<IssuePage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
