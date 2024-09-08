import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './Review.css';

const ReviewPage = () => {
  const location = useLocation();
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (location.state && location.state.coverLetter) {
      console.log('Cover letter received in ReviewPage:', location.state.coverLetter);
      setDisplayedText(location.state.coverLetter); // Correctly set the state here
    } else {
      console.error('Cover letter is empty or undefined.');
    }
  }, [location.state]);
  

  const handleDownload = () => {
    const element = document.getElementById('cover-letter-content');
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: 'cover_letter.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .save();
  };

  return (
    <div className="review-page">
      <header className="header">
        <h1>Review Your Cover Letter</h1>
      </header>
      <main className="main-content">
        <div id="cover-letter-content" className="cover-letter-container">
          {displayedText ? <p>{displayedText}</p> : <p>No cover letter available</p>}
        </div>
        <button onClick={handleDownload} className="btn-download">
          Download Cover Letter
        </button>
      </main>
    </div>
  );
};

export default ReviewPage;
