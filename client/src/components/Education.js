import React from "react";
import "./Education.css";
import pict_logo from "../assets/pict_logo.png"; // Replace with your COEP logo
import bjs_logo from "../assets/bjs_logo.png"; // Replace with your Government Polytechnic Pune logo
const Education = () => {
  return (
    <section className="education-section" id="education">
      <div className="background-animation"></div>

      <h1 className="education-title">Education</h1>
      <p className="education-subtitle">
        My education has been a journey of self-discovery and growth. My educational details are as follows.
      </p>

      <div className="timeline">
        {/* ---- BTech ---- */}
        <div className="timeline-item left">
          <div className="timeline-content">
            <div className="edu-logo">
              <img src={pict_logo} alt="COEP Logo" />
            </div>
            <h2>COEP Technological University</h2>
            <h3>Bachelor of Technology – BTech, Computer Engineering</h3>
            <span className="timeline-date">Oct 2024 – Sep 2027</span>
            <p><strong>Grade:</strong> 9.29 CGPA</p>
            <p>
              I am currently pursuing a Bachelor's degree in Computer Engineering at COEP Technological University, Pune.
              I have completed 2 semesters and have a CGPA of 9.29. I have taken courses in Data Structures,
              Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, and Computer Networks.
            </p>
          </div>
        </div>

        {/* ---- Diploma ---- */}
        <div className="timeline-item right">
          <div className="timeline-content">
            <div className="edu-logo">
              <img src={bjs_logo} alt="Government Polytechnic Pune Logo" />
            </div>
            <h2>Government Polytechnic Pune</h2>
            <h3>Diploma in Computer Engineering</h3>
            <span className="timeline-date">Apr 2021 – Apr 2024</span>
            <p><strong>Grade:</strong> 97.20%</p>
            <p>
              I completed my diploma in Computer Engineering at Government Polytechnic Pune,
              where I was honored as the gold medalist of the department.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
