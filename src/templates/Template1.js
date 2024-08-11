// Template1.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Template1.css';

const Template1 = () => {
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
    <div className="template-container">
      <h1>Resumes</h1>
      {resumes.map((resume) => (
        <div key={resume._id} className="resume-item">
          <section className="personal-info">
            <h2>{resume.Name}</h2>
            <p>Email: {resume.Email}</p>
            <p>Phone Number: {resume['Phone Number']}</p>
            <p>Location: {resume.Location}</p>
            <p>GitHub: {resume['Social Media']?.GitHub || 'Not mentioned'}</p>
            <p>LinkedIn: {resume['Social Media']?.LinkedIn || 'Not mentioned'}</p>
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
            <p>Programming Languages: {resume['Technical Skills']['Programming Languages'].join(', ')}</p>
            <p>Web Technologies: {resume['Technical Skills']['Web Technologies'].join(', ')}</p>
            <p>Tools and Frameworks: {resume['Technical Skills']['Tools and Frameworks'].join(', ')}</p>
            <p>Databases: {resume['Technical Skills'].Databases.join(', ')}</p>
          </section>

          <section className="interests">
            <h2>Interests</h2>
            <p>Soft Skills: {resume.Interests['Soft Skills'].join(', ')}</p>
            <p>Field of Interest: {resume.Interests['Field of Interest'].join(', ')}</p>
            <p>Hobbies: {resume.Interests.Hobbies.join(', ')}</p>
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

export default Template1;
