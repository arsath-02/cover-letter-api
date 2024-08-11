import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BuildForm.css';

const BuildForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: '',
    companyName: '',
    recipient: '',
    post: '',
    companyExperience: '',
    jobDescription: '',
    relevantSkills: '',
    degree: '',
    higherSecondary: '',
    secondary: '',
    whyGreatFit: '',
    callToAction: '',
    closing: '',
    softSkills: '',
    technicalSkills: '',
    otherSkills: '',
  });

  const totalSteps = 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsFlipped(false);
    }, 600); // Duration should match the transition duration in CSS
  };

  const prevStep = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setStep(step - 1);
      setIsFlipped(false);
    }, 600); // Duration should match the transition duration in CSS
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coverLetterData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      role: formData.role,
      companyName: formData.companyName,
      recipient: formData.recipient,
      post: formData.post,
      companyExperience: formData.companyExperience,
      jobDescription: formData.jobDescription,
      relevantSkills: formData.relevantSkills,
      degree: formData.degree,
      higherSecondary: formData.higherSecondary,
      secondary: formData.secondary,
      whyGreatFit: formData.whyGreatFit,
      callToAction: formData.callToAction,
      closing: formData.closing,
      softSkills: formData.softSkills,
      technicalSkills: formData.technicalSkills,
      otherSkills: formData.otherSkills,
    };

    try {
      // Send form data to backend API to generate cover letter
      const response = await axios.post('https://apparent-wolf-obviously.ngrok-free.app/submit', coverLetterData);

      if (response.status === 200) {
        // Handle successful response
        console.log('Received response:', response.data);
        navigate('/Review', { state: { coverLetter: response.data.coverLetter } });
      } else {
        // Handle error response
        console.error('Failed to generate cover letter:', response.data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="build-form">
      <div className={`step-card ${isFlipped ? 'step-card-flip' : ''}`}>
        <h1>Create Your Cover Letter</h1>
        <div className="step-counter">
          Step {step} of {totalSteps}
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`form-step ${step === 1 ? 'form-step-active' : ''}`}>
            <h2>Applicant Details</h2>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 2 ? 'form-step-active' : ''}`}>
            <h2>Job Details</h2>
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Recipient:</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Post Applying For:</label>
              <input
                type="text"
                name="post"
                value={formData.post}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Company Experience:</label>
              <textarea
                name="companyExperience"
                value={formData.companyExperience}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 3 ? 'form-step-active' : ''}`}>
            <h2>Skills</h2>
            <div className="form-group">
              <label>Job Description:</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Relevant Skills:</label>
              <textarea
                name="relevantSkills"
                value={formData.relevantSkills}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 4 ? 'form-step-active' : ''}`}>
            <h2>Education</h2>
            <div className="form-group">
              <label>Degree:</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Higher Secondary:</label>
              <input
                type="text"
                name="higherSecondary"
                value={formData.higherSecondary}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Secondary:</label>
              <input
                type="text"
                name="secondary"
                value={formData.secondary}
                onChange={handleChange}
                required
              />
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 5 ? 'form-step-active' : ''}`}>
            <h2>Fit for the Job</h2>
            <div className="form-group">
              <label>Why You're a Great Fit:</label>
              <textarea
                name="whyGreatFit"
                value={formData.whyGreatFit}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 6 ? 'form-step-active' : ''}`}>
            <h2>Call to Action</h2>
            <div className="form-group">
              <label>Call to Action:</label>
              <textarea
                name="callToAction"
                value={formData.callToAction}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 7 ? 'form-step-active' : ''}`}>
            <h2>Closing</h2>
            <div className="form-group">
              <label>Closing:</label>
              <textarea
                name="closing"
                value={formData.closing}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="button" onClick={nextStep} className="btn-next">
              Next
            </button>
          </div>

          <div className={`form-step ${step === 8 ? 'form-step-active' : ''}`}>
            <h2>Skills</h2>
            <div className="form-group">
              <label>Soft Skills:</label>
              <textarea
                name="softSkills"
                value={formData.softSkills}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Technical Skills:</label>
              <textarea
                name="technicalSkills"
                value={formData.technicalSkills}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Other Skills:</label>
              <textarea
                name="otherSkills"
                value={formData.otherSkills}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={prevStep} className="btn-prev">
              Previous
            </button>
            <button type="submit" className="btn-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuildForm;
