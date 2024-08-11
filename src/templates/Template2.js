import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Template2.css'; // Import the CSS file for Template2

const Template2 = () => {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    // Fetch resumes from API
    const fetchResumes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resumes');
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="template2-container">
      <h1>Resumes - Template 2</h1>
      {resumes.map((resume) => (
        <div key={resume._id} className="resume-item">
          <section className="header">
            <h2>{resume.Name}</h2>
            <p>Email: {resume.Email}</p>
            <p>Phone Number: {resume['Phone Number']}</p>
            <p>Location: {resume.Location}</p>
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

          <section className="skills">
            <h2>Skills</h2>
            <div className="skills-list">
              <div className="skill-category">
                <h3>Programming Languages</h3>
                <ul>
                  {resume['Technical Skills']['Programming Languages'].map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              </div>
              <div className="skill-category">
                <h3>Web Technologies</h3>
                <ul>
                  {resume['Technical Skills']['Web Technologies'].map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>
              <div className="skill-category">
                <h3>Tools and Frameworks</h3>
                <ul>
                  {resume['Technical Skills']['Tools and Frameworks'].map((tool, index) => (
                    <li key={index}>{tool}</li>
                  ))}
                </ul>
              </div>
              <div className="skill-category">
                <h3>Databases</h3>
                <ul>
                  {resume['Technical Skills'].Databases.map((db, index) => (
                    <li key={index}>{db}</li>
                  ))}
                </ul>
              </div>
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
        </div>
      ))}
    </div>
  );
};

export default Template2;
