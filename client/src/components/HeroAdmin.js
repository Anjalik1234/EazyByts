import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroAdmin() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [heroText, setHeroText] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const API_ABOUT = "http://localhost:5000/api/about";

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(API_ABOUT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoles(data.roles || []);
        setHeroText(data.heroText || "");
      } catch (err) {
        console.error("HeroAdmin fetch error:", err);
      }
    };
    fetchAbout();
  }, [token]);

  const handleAddRole = () => {
    const val = newRole.trim();
    if (!val) return;
    if (!roles.includes(val)) setRoles((p) => [...p, val]);
    setNewRole("");
  };

  const handleRemoveRole = (index) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAbout = async () => {
    try {
      const res = await fetch(API_ABOUT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roles, heroText }),
      });

      if (res.ok) {
        setStatus("✅ About updated successfully!");
        navigate("/#hero");
      } else {
        setStatus("❌ Error updating About");
      }
    } catch (err) {
      console.error("HeroAdmin save error:", err);
      setStatus("Network error");
    }
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="edit-section">
      <h2>Edit About Page</h2>
      <div className="edit-box">
        <div className="roles-section">
          <label>Roles</label>
          <div className="roles-container">
            {roles.map((role, index) => (
              <span key={index} className="role-tag">
                {role}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveRole(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="add-role">
            <input
              type="text"
              placeholder="Add new role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <button type="button" onClick={handleAddRole}>
              Add
            </button>
          </div>
        </div>

        <div className="desc-section">
          <label>Description</label>
          <textarea
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            rows={7}
            placeholder="Write something about yourself..."
          />
        </div>
      </div>

      <button onClick={handleSaveAbout} className="btn primary">
        Save About
      </button>

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}