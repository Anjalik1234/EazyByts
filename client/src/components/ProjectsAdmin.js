import React, { useEffect, useState, useMemo } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_PROJECTS = `${API_BASE}/api/projects`;

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    githubLink: "",
    liveDemo: "",
    technologies: "",
    startDate: "",
    endDate: "",
    image: null, // File object when selecting new file
    imagePath: null, // existing saved path like "/uploads/..."
  });
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(API_PROJECTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("ProjectsAdmin fetch error:", err);
      }
    };
    fetchProjects();
  }, [token]);

  // preview: use selected File if present, otherwise show existing imagePath
  const imagePreview = useMemo(() => {
    if (projectForm.image) return URL.createObjectURL(projectForm.image);
    if (projectForm.imagePath) return `${API_BASE}${projectForm.imagePath}`;
    return null;
  }, [projectForm.image, projectForm.imagePath]);

  useEffect(() => {
    return () => {
      // revoke object URL if created
      if (projectForm.image) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview]);

  const handleProjectInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProjectForm((p) => ({ ...p, image: files[0] || null, imagePath: files[0] ? null : p.imagePath }));
    } else {
      setProjectForm((p) => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setProjectForm({
      title: "",
      description: "",
      githubLink: "",
      liveDemo: "",
      technologies: "",
      startDate: "",
      endDate: "",
      image: null,
      imagePath: null,
    });
    setEditingId(null);
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const entries = { ...projectForm };
    delete entries.imagePath;
    Object.entries(entries).forEach(([key, val]) => {
      if (val !== null && val !== "") {
        if (key === "image" && val instanceof File) {
          formData.append("image", val);
        } else {
          formData.append(key, val);
        }
      }
    });

    try {
      const url = editingId ? `${API_PROJECTS}/${editingId}` : `${API_PROJECTS}/add`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }, // DO NOT set Content-Type when sending FormData
        body: formData,
      });

      // read raw text first so we can show server error messages even when not JSON
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        // not JSON, keep raw text
      }

      console.log("Project response:", { status: res.status, ok: res.ok, body: data ?? text });

      if (res.ok) {
        const project = data?.project ?? null;
        if (editingId) {
          setProjects((p) => p.map((proj) => (proj._id === editingId ? project : proj)));
          setStatus("✅ Project updated");
        } else {
          setProjects((p) => (project ? [project, ...p] : p));
          setStatus("✅ Project added successfully!");
        }
        resetForm();

        // redirect to main page Projects section
        // using hash ensures the browser navigates/scrolls to element with id="projects"
        setTimeout(() => {
          // if your app root is "/", this will navigate there with hash
          window.location.href = "/#projects";
        }, 600);
      } else {
        // show useful error to user
        const errMsg = data?.message || data?.error || text || `Server returned ${res.status}`;
        setStatus(`❌ ${errMsg}`);
        console.error("Save project failed:", { status: res.status, body: data ?? text });
      }
    } catch (err) {
      console.error("ProjectsAdmin add/update error:", err);
      setStatus(`Network error: ${err.message}`);
    }
    setTimeout(() => setStatus(""), 4000);
  };

  const handleEditClick = (proj) => {
    setEditingId(proj._id);
    setProjectForm({
      title: proj.title || "",
      description: proj.description || "",
      githubLink: proj.githubLink || "",
      liveDemo: proj.liveDemo || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies || "",
      startDate: proj.startDate ? proj.startDate.split("T")[0] : "",
      endDate: proj.endDate ? proj.endDate.split("T")[0] : "",
      image: null, // user can choose a new file
      imagePath: proj.image || proj.imageUrl || null,
    });
    window.scrollTo({ top: 1300, behavior: "smooth" });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${API_PROJECTS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((p) => p.filter((proj) => proj._id !== id));
        setStatus("✅ Project deleted");
        if (editingId === id) resetForm();
      } else {
        setStatus("❌ Error deleting project");
      }
    } catch (err) {
      console.error("ProjectsAdmin delete error:", err);
      setStatus("Network error");
    }
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div className="edit-section">
      <h2>{editingId ? "Edit Project" : "Add Project"}</h2>

      <form onSubmit={handleAddOrUpdateProject} className="project-form">
        <input type="text" name="title" placeholder="Title" value={projectForm.title} onChange={handleProjectInput} required />
        <textarea name="description" placeholder="Description" value={projectForm.description} onChange={handleProjectInput} />
        <input type="text" name="githubLink" placeholder="GitHub Link" value={projectForm.githubLink} onChange={handleProjectInput} />
        <input type="text" name="technologies" placeholder="Technologies(Web App, Machine Learning, Data Science)" value={projectForm.technologies} onChange={handleProjectInput} />
        <input type="date" name="startDate" value={projectForm.startDate} onChange={handleProjectInput} />
        <input type="date" name="endDate" value={projectForm.endDate} onChange={handleProjectInput} />
        <input type="file" name="image" accept="image/*" onChange={handleProjectInput} />
        {imagePreview && <div style={{ marginTop: 8 }}><img src={imagePreview} alt="preview" style={{ width: 120, height: "auto", borderRadius: 6 }} /></div>}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit">{editingId ? "Update Project" : "Add Project"}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <h3 style={{ marginTop: 20 }}>Existing Projects</h3>
      <div className="projects-list">
        {projects.map((p) => (
          <div key={p._id} className="project-item" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {(p.image || p.imageUrl) ? (
              <img src={`${API_BASE}${p.image || p.imageUrl}`} alt={p.title} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6 }} />
            ) : null}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: "#555" }}>{p.description}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => handleEditClick(p)}>Edit</button>
              <button onClick={() => handleDeleteProject(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}