import express from "express";
import upload from "../utils/upload.js";
import {
  addEducation,
  getEducations,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

const router = express.Router();

// Add new education
router.post("/add", upload.single("logo"), addEducation);

// Get all educations
router.get("/", getEducations);

// Update education
router.put("/:id", upload.single("logo"), updateEducation);

// Delete education
router.delete("/:id", deleteEducation);

export default router;
