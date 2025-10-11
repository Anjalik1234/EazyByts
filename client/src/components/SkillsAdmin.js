import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SkillsAdmin() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkill, setNewSkill] = useState({ categoryId: "", name: "", icon: "" });
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("adminToken");
  const API_SKILLS = "http://localhost:5000/api/skills";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(API_SKILLS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("SkillsAdmin fetch error:", err);
      }
    };
    fetchSkills();
  }, [token]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch(`${API_SKILLS}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((p) => [...p, data.category]);
        setNewCategoryName("");
        setStatus("✅ Category added");
      } else {
        setStatus("❌ Error adding category");
      }
    } catch (err) {
      console.error("SkillsAdmin add category error:", err);
      setStatus("Network error");
    }
    setTimeout(() => setStatus(""), 2500);
  };

  const handleAddSkill = async () => {
    const { categoryId, name, icon } = newSkill;
    if (!categoryId || !name) return;
    try {
      const res = await fetch(`${API_SKILLS}/category/${categoryId}/skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, icon }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((cats) =>
          cats.map((cat) => (cat._id === categoryId ? data.category : cat))
        );
        setNewSkill({ categoryId: "", name: "", icon: "" });
        setStatus("✅ Skill added");
        navigate("/#skills");
      } else {
        setStatus("❌ Error adding skill");
      }
    } catch (err) {
      console.error("SkillsAdmin add skill error:", err);
      setStatus("Network error");
    }
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div className="edit-section">
      <h2>Edit Skills</h2>

      {categories.map((cat) => (
        <div key={cat._id} className="skill-category">
          <h3>{cat.name}</h3>
          <div className="skills-container">
            {cat.skills?.map((skill) => (
              <span key={skill._id} className="skill-tag">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="add-category">
        <input
          type="text"
          placeholder="New Category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <div className="add-skill">
        <select
          value={newSkill.categoryId}
          onChange={(e) => setNewSkill({ ...newSkill, categoryId: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Skill Name"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Icon (faReact, faNodeJs...)"
          value={newSkill.icon}
          onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
        />
        <button onClick={handleAddSkill}>Add Skill</button>
      </div>

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}