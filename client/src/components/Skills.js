import React, { useEffect, useState } from "react";
import "./Skills.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faHtml5,
  faCss3Alt,
  faJsSquare,
  faBootstrap,
  faNodeJs,
  faPython,
  faGitAlt,
  faFigma,
} from "@fortawesome/free-brands-svg-icons";
import {
  faDatabase,
  faServer,
  faCode,
  faBrain,
  faTable,
  faCubes,
  faLaptopCode,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";

// Map icon strings from backend to actual FontAwesome icons
const ICONS_MAP = {
  faReact,
  faHtml5,
  faCss3Alt,
  faJsSquare,
  faBootstrap,
  faNodeJs,
  faPython,
  faGitAlt,
  faFigma,
  faDatabase,
  faServer,
  faCode,
  faBrain,
  faTable,
  faCubes,
  faLaptopCode,
  faCloud,
};

export default function Skills() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/skills");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const renderPills = (skills) =>
    skills.map((skill) => (
      <span key={skill.name} className="skill-pill">
        <FontAwesomeIcon icon={ICONS_MAP[skill.icon]} className="skill-fa" />
        <span className="skill-name">{skill.name}</span>
      </span>
    ));

  if (loading) return <p>Loading Skills...</p>;

  return (
    // IMPORTANT: no "hero-like" or "fullscreen" here
    <section id="skills" className="section skills-section">
      <div className="container">
        <h2 className="section-title">Skills</h2>
        <p className="section-sub">
          Here are some of my skills on which I have been working for the past
          3 years.
        </p>

        <div className="skills-grid">
          {categories.map((category) => (
            <div key={category._id} className="skill-card">
              <h3>{category.name}</h3>
              <div className="pill-row">{renderPills(category.skills)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
