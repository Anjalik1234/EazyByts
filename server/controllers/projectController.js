import fs from "fs/promises";
import path from "path";
import Project from "../models/projectModel.js";

export const addProject = async (req, res) => {
  try {
    const {
      title = "",
      description = "",
      githubLink = "",
      liveDemo = "",
      technologies = "",
      startDate = "",
      endDate = "",
    } = req.body;

    // Convert comma-separated technologies string to array
    const techArray =
      typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : Array.isArray(technologies)
        ? technologies
        : [];

    // Handle uploaded image path
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Create and save project
    const project = await Project.create({
      title,
      description,
      githubLink,
      liveDemo,
      technologies: techArray,
      startDate: startDate || null,
      endDate: endDate || null,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "✅ Project added successfully",
      project,
    });
  } catch (err) {
    console.error("❌ addProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err) {
    console.error("getProjects error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Not found" });

    // Remove image file if exists
    if (project.image) {
      const filePath = path.join(
        path.resolve(),
        "server",
        project.image.replace(/^\/+/, "")
      );
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.warn("File delete warning:", e.message);
      }
    }

    await project.deleteOne();
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const proj = await Project.findById(id);
    if (!proj) return res.status(404).json({ message: "Project not found" });

    const {
      title,
      description,
      githubLink,
      liveDemo,
      technologies,
      startDate,
      endDate,
    } = req.body;

    // parse technologies if sent as CSV
    const techArray =
      typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : technologies;

    // handle new uploaded image
    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;
      // delete old file if exists
      const old = proj.image || proj.imageUrl;
      if (old) {
        const oldFsPath = path.join(path.resolve(), old.replace(/^\/+/, ""));
        try {
          await fs.unlink(oldFsPath);
        } catch (err) {
          // ignore if file missing
        }
      }
      proj.image = newImagePath;
      proj.imageUrl = newImagePath;
    }

    // update fields only when provided
    if (title !== undefined) proj.title = title;
    if (description !== undefined) proj.description = description;
    if (githubLink !== undefined) proj.githubLink = githubLink;
    if (liveDemo !== undefined) proj.liveDemo = liveDemo;
    if (startDate !== undefined && startDate !== "") proj.startDate = startDate;
    if (endDate !== undefined && endDate !== "") proj.endDate = endDate;
    if (technologies !== undefined) proj.technologies = techArray || [];

    await proj.save();
    return res.json({ project: proj });
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
