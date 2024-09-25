import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Options.css';

const OptionsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    await handleUploadClick(event.target.files[0]);
  };

  const handleUploadClick = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        setIsUploading(true);
        setMessage('Generating cover letter...');
  
        const response = await fetch('https://apparent-wolf-obviously.ngrok-free.app/generate_cover_letter', {
          method: 'POST',
          body: formData,
        });
  
        setIsUploading(false);
  
        if (response.ok) {
          const data = await response.text(); 
          console.log('Received response:', data);
          
          if (data) { 
            console.log('Navigating to Review page with cover letter:', data);
            navigate('/Review', { state: { coverLetter: data } });
          } else {
            console.error('Cover letter is missing:', data);
            setMessage('Failed to generate cover letter.');
          }
         
        
        } else {
          const errorData = await response.json();
          console.error('Failed to upload file and extract information:', errorData);
          setMessage('Failed to upload file and extract information.');
        }
      } catch (error) {
        setIsUploading(false);
        console.error('Error uploading file:', error);
        setMessage('An error occurred while uploading the file.');
      }
    } else {
      setMessage('Please select a file to upload.');
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleBuildClick = () => {
    console.log('Build From Scratch clicked');
    navigate('/BuildForm');
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
            <button onClick={triggerFileInput} className="btn-option" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Resume'}
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
        {message && <div className="upload-message">{message}</div>}
      </main>
    </div>
  );
};

export default OptionsPage;