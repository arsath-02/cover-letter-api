import './JobDetails.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobDetails = () => {
  const [formData, setFormData] = useState({
    jobRole: '',
    company: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    // Example validation: Check if jobRole and company are filled
    if (formData.jobRole && formData.company) {
      // Navigate to review page
      navigate('/Options');
    } else {
      // Handle validation error (optional)
      alert('Please fill in both Job Role and Company fields.');
    }
  };

  return (
    <div className="input-container">
      <h2>Enter Job Role and Company</h2>
      
      <div className="input-group">
        <label>Job Role:</label>
        <input 
          type="text" 
          name="jobRole" 
          value={formData.jobRole} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="input-group">
        <label>Company:</label>
        <input 
          type="text" 
          name="company" 
          value={formData.company} 
          onChange={handleChange} 
        />
      </div>
      
      <button onClick={handleNext} className="next-button">Next</button>
    </div>
  );
};

export default JobDetails;
