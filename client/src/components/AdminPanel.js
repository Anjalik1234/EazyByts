import React from "react";
import "./AdminPanel.css";
import HeroAdmin from "./HeroAdmin";
import SkillsAdmin from "./SkillsAdmin";
import ProjectsAdmin from "./ProjectsAdmin";
import EducationAdmin from "./EducationAdmin";

export default function AdminPanel() {
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Panel</h1>

      <HeroAdmin />

      <SkillsAdmin />

      <ProjectsAdmin />

      <EducationAdmin/>
    </div>
  );
}
