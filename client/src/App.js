import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import JobDetails from './JobDetails';
import Options from './Options';
import Review from './Review';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
        <Route path='JobDetails' element={<JobDetails />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </Router>
  );
};

export default App;

