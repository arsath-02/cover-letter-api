import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const navigate = useNavigate(); 

  const handleGenerateClick = () => {
    navigate('/Options'); 
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>AI-Powered Cover Letter Generator</h1>
      </header>
      <main className="main-content">
        <div className="content-container">
          <div className="image-container">
            <img src="cover_home.webp" alt="Cover Letter" className="cover-letter-image" />
          </div>
          <div className="text-container">
            <section className="description">
              <h2>About Our Cover Letter Generator</h2>
              <p>
                Quickly create personalized cover letters with our AI-powered generator. Provide some basic details, and our AI crafts a professional cover letter tailored to your needs. Our tool ensures your cover letter stands out, highlighting your unique skills and experiences. Save time and enhance your job applications effortlessly with a customized, polished cover letter in seconds.
              </p>
            </section>
            <section className="generate-button">
              <button onClick={handleGenerateClick} className="btn-generate">
                Generate Cover Letter
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
