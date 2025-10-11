import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EducationAdmin.css";

const API_URL = "http://localhost:5000/api/educations"; // update if using hosted backend

export default function EducationAdmin() {
  const [educations, setEducations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    degree: "",
    branch: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    grade: "",
    description: "",
    logo: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📄 Fetch all educations
  const fetchEducations = async () => {
    try {
      const res = await axios.get(API_URL);
      setEducations(res.data.data);
    } catch (error) {
      console.error("Error fetching educations:", error);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  // 🧾 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🖼️ Handle logo file
  const handleFileChange = (e) => {
    setForm({ ...form, logo: e.target.files[0] });
  };

  // ➕ Add or ✏️ Update Education
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (editingId) {
        // update
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        // add new
        await axios.post(`${API_URL}/add`, formData);
      }

      setForm({
        name: "",
        degree: "",
        branch: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        grade: "",
        description: "",
        logo: null,
      });

      fetchEducations();
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEducations();
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  // ✏️ Edit
  const handleEdit = (edu) => {
    setForm({
      name: edu.name,
      degree: edu.degree,
      branch: edu.branch,
      startMonth: edu.startMonth,
      startYear: edu.startYear,
      endMonth: edu.endMonth,
      endYear: edu.endYear,
      grade: edu.grade,
      description: edu.description,
      logo: null,
    });
    setEditingId(edu._id);
  };

  return (
    <div className="education-admin">
      <h2>{editingId ? "Edit Education" : "Add New Education"}</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input type="text" name="name" placeholder="Institute Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} required />
        <input type="text" name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} required />

        <div className="form-row">
          <input type="text" name="startMonth" placeholder="Start Month" value={form.startMonth} onChange={handleChange} required />
          <input type="text" name="startYear" placeholder="Start Year" value={form.startYear} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <input type="text" name="endMonth" placeholder="End Month" value={form.endMonth} onChange={handleChange} required />
          <input type="text" name="endYear" placeholder="End Year" value={form.endYear} onChange={handleChange} required />
        </div>

        <input type="text" name="grade" placeholder="Grade (e.g., 9.1 CGPA)" value={form.grade} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" />

        <input type="file" name="logo" accept="image/*" onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Education" : "Add Education"}
        </button>
      </form>

      <hr />

      <h2>All Educations</h2>
      <div className="education-list">
        {educations.map((edu) => (
          <div key={edu._id} className="education-card">
            {edu.logo && <img src={`http://localhost:5000${edu.logo}`} alt={edu.name} className="edu-logo" />}
            <div className="edu-info">
              <h3>{edu.name}</h3>
              <p>
                {edu.degree} — {edu.branch}
              </p>
              <p>
                {edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}
              </p>
              <p>{edu.grade}</p>
              <p>{edu.description}</p>
            </div>
            <div className="edu-actions">
              <button onClick={() => handleEdit(edu)}>Edit</button>
              <button onClick={() => handleDelete(edu._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
