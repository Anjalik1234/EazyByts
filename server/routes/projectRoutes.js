import express from "express";
import upload from "../utils/upload.js";
import { addProject, getProjects, deleteProject, updateProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProject);
router.get("/", getProjects);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;
