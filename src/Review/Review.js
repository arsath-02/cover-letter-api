import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './Review.css';

const ReviewPage = () => {
  const location = useLocation();
  const { coverLetter } = location.state || { coverLetter: '' };
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < coverLetter.length) {
        setDisplayedText((prev) => prev + coverLetter[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); 
    return () => clearInterval(typingInterval);
  }, [coverLetter]);

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
          <p className="typing-animation">{displayedText}</p>
        </div>
        <button onClick={handleDownload} className="btn-download">
          Download Cover Letter
        </button>
      </main>
    </div>
  );
};

export default ReviewPage;
