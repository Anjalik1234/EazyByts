import Education from "../models/educationModel.js";

// ➕ Add new education entry
export const addEducation = async (req, res) => {
  try {
    const {
      name,
      degree,
      branch,
      startMonth,
      startYear,
      endMonth,
      endYear,
      grade,
      description,
    } = req.body;

    const newEducation = new Education({
      name,
      degree,
      branch,
      startMonth,
      startYear,
      endMonth,
      endYear,
      grade,
      description,
      logo: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newEducation.save();
    res
      .status(201)
      .json({ success: true, message: "Education added successfully", data: newEducation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding education", error: error.message });
  }
};

// 📄 Get all education entries
export const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({ startYear: -1 });
    res.status(200).json({ success: true, data: educations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching educations", error: error.message });
  }
};

// ✏️ Update an education entry
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const updated = await Education.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Education not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Education updated successfully", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating education", error: error.message });
  }
};

// ❌ Delete an education entry
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Education.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Education not found" });
    }
    res.status(200).json({ success: true, message: "Education deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting education", error: error.message });
  }
};
