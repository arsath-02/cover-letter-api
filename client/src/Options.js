import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Options.css';


const OptionsPage = () => {
  const navigate = useNavigate(); 
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleUploadClick(event.target.files[0]);
  };

  const handleUploadClick = (file) => {
    if (file) {
      console.log('Uploading file:', file);
      navigate('/Review', { state: { file: file } });
    } else {
      alert('Please select a file to upload.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleBuildClick = () => {
    console.log('Build From Scratch clicked');
  };

  return (
    <div className="options-page">
      <header className="header">
        <h1>Choose Your Option</h1>
      </header>
      <main className="main-content">
        <div className="options-container">
          <div className="option">
            <img src="upload resume.jpg" alt="Upload Icon" className="option-icon" />
            <h2>Upload Resume</h2>
            <p>Upload your existing resume to generate a cover letter based on its content.</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button onClick={triggerFileInput} className="btn-option">
              Upload Resume
            </button>
          </div>
          <div className="option">
            <img src="build cover.png" alt="Build Icon" className="option-icon" />
            <h2>Build From Scratch</h2>
            <p>Create a cover letter from scratch by providing your details and preferences.</p>
            <button onClick={handleBuildClick} className="btn-option">
              Build From Scratch
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OptionsPage;
