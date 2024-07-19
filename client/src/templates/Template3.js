import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Template3.css'; // Ensure your CSS file has relevant styles

const Template3 = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resumes');
        setResumes(response.data);
      } catch (error) {
        setError('Error fetching resumes');
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const downloadResume = async (resume) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/download/${resume._id}`, {
        responseType: 'blob', // Important to handle as blob
      });

      // Create a blob object from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.Name}_Resume.pdf`;
      document.body.appendChild(link);

      // Click the link to trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="template3-container">
      <h1 className="header">Professional Resumes</h1>
      {resumes.map((resume) => (
        <div key={resume._id} className="resume-item">
          <section className="personal-info">
            <div className="name">{resume.Name}</div>
            <div className="contact">
              <p>Email: {resume.Email}</p>
              <p>Phone: {resume['Phone Number']}</p>
              <p>Location: {resume.Location}</p>
              <p>LinkedIn: {resume['Social Media']?.LinkedIn || 'Not mentioned'}</p>
            </div>
          </section>

          <section className="career-objective">
            <h2>Career Objective</h2>
            <p>{resume['Career Objective']}</p>
          </section>

          <section className="education">
            <h2>Education</h2>
            {resume.Education.map((edu, index) => (
              <div key={index} className="edu-item">
                <p>{edu.Year} - {edu.Institution}</p>
                <p>{edu.Degree}</p>
                {edu.CGPA && <p>CGPA: {edu.CGPA}</p>}
                {edu.Percentage && <p>Percentage: {edu.Percentage}</p>}
              </div>
            ))}
          </section>

          <section className="projects">
            <h2>Projects</h2>
            {resume.Projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3>{project['Project Name']}</h3>
                <p>{project.Description}</p>
                <p>Technologies: {project.Technologies.Frontend}, {project.Technologies.Backend}, {project.Technologies.Other}</p>
                <p>{project.Functionality}</p>
              </div>
            ))}
          </section>

          <section className="technical-skills">
            <h2>Technical Skills</h2>
            <div className="skills-list">
              {Object.keys(resume['Technical Skills']).map((category, index) => (
                <div key={index} className="skill-category">
                  <h3>{category}</h3>
                  <ul>
                    {resume['Technical Skills'][category].map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="achievements">
            <h2>Achievements</h2>
            {resume.Achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <p>{achievement.Award}</p>
                <p>{achievement.Title}</p>
                <p>{achievement.Event}, {achievement.Date}</p>
              </div>
            ))}
          </section>

          <section className="responsibilities">
            <h2>Positions of Responsibility</h2>
            <p>{resume['Positions of Responsibility'].Position}</p>
            <p>{resume['Positions of Responsibility'].Organization}, {resume['Positions of Responsibility'].Dates}</p>
            <p>{resume['Positions of Responsibility'].Responsibilities}</p>
          </section>

          <button onClick={() => downloadResume(resume)}>Download Resume</button>
        </div>
      ))}
    </div>
  );
};

export default Template3;
