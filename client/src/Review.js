import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Review.css'; // Add appropriate styling here

const Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileData } = location.state || {}; // Get the uploaded file data from the location state

  const [formData, setFormData] = useState({});
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Review extracted info, Step 2: Generate cover letter
  const [successMessage, setSuccessMessage] = useState(''); // Add state for success message

  useEffect(() => {
    if (fileData) {
      extractInfo(fileData);
    }
  }, [fileData]);

  const extractInfo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/extract_info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const { extracted_info, message } = response.data;
      setFormData(extracted_info);
      setSuccessMessage(message); // Set success message
      setError('');
      setStep(1); // Move to the review step
    } catch (error) {
      console.error('Error extracting information:', error);
      setError('Failed to extract information from the resume. Please try again.');
      setFormData({});
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateCoverLetter = async () => {
    const { jobTitle, companyName, ...extractedInfo } = formData;
    try {
      const response = await axios.post('http://localhost:5000/generate_cover_letter', {
        jobTitle,
        companyName,
        extractedInfo
      });
      setCoverLetter(response.data.cover_letter);
      setError('');
      setStep(3); // Move to the cover letter display step
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setError('Failed to generate cover letter. Please try again.');
      setCoverLetter('');
    }
  };

  const isFieldEmpty = (field) => !field || field.trim() === '';

  return (
    <div className="review-container">
      {loading && <div>Loading...</div>}
      {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
      {step === 1 && (
        <div>
          <h2>Let's review your extracted information</h2>
          <p>You can fill in missing information or edit the extracted information.</p>
          <div className="section">
            <h3>Personal Information</h3>
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.name) ? 'needs-review' : ''}
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.email) ? 'needs-review' : ''}
              />
            </div>
            <div className="input-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.phoneNumber) ? 'needs-review' : ''}
              />
            </div>
          </div>
          <div className="section">
            <h3>Skills and Strengths</h3>
            <div className="input-group">
              <label>Technical Skills:</label>
              <input
                type="text"
                name="technicalSkills"
                value={formData.technicalSkills || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.technicalSkills) ? 'needs-review' : ''}
              />
            </div>
            <div className="input-group">
              <label>Experience Years:</label>
              <input
                type="text"
                name="experienceYears"
                value={formData.experienceYears || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.experienceYears) ? 'needs-review' : ''}
              />
            </div>
            <div className="input-group">
              <label>Work Experience:</label>
              <textarea
                name="workExperience"
                value={formData.workExperience || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.workExperience) ? 'needs-review' : ''}
              />
            </div>
          </div>
          <div className="section">
            <h3>Education and Projects</h3>
            <div className="input-group">
              <label>Education Details:</label>
              <input
                type="text"
                name="educationDetails"
                value={formData.educationDetails || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.educationDetails) ? 'needs-review' : ''}
              />
            </div>
            <div className="input-group">
              <label>Projects:</label>
              <textarea
                name="projects"
                value={formData.projects || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.projects) ? 'needs-review' : ''}
              />
            </div>
          </div>
          <div className="section">
            <h3>Job Details</h3>
            <div className="input-group">
              <label>Job Title:</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.jobTitle) ? 'needs-review' : ''}
              />
            </div>
            <div className="input-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className={isFieldEmpty(formData.companyName) ? 'needs-review' : ''}
              />
            </div>
          </div>
          <button onClick={() => setStep(2)}>Generate Cover Letter</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Review and Generate Cover Letter</h2>
          <p>Please review the information and make any necessary changes. Once done, click "Generate Cover Letter".</p>
          <button onClick={handleGenerateCoverLetter}>Generate Cover Letter</button>
          <button onClick={() => setStep(1)}>Back to Review</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Your Generated Cover Letter</h2>
          <div className="cover-letter">
            <pre>{coverLetter}</pre>
          </div>
          <button onClick={() => navigate('/')}>Start Over</button>
        </div>
      )}
      {error && (
        <div className="error-section">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Review;
