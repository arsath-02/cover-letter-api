import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import JobDetails from './JobDetails/JobDetails';
import Options from './Options/Options';
import Review from './Review/Review';
import BuildForm from './BuildForm/BuildForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
        <Route path='/JobDetails' element={<JobDetails />} />
        <Route path="/review" element={<Review />} />
        <Route path="/buildForm" element={<BuildForm />} />
      </Routes>
    </Router>
  );
};

export default App;

