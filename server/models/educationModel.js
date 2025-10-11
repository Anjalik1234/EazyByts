import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // College or School Name
  },
  degree: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  startMonth: {
    type: String,
    required: true,
  },
  startYear: {
    type: String,
    required: true,
  },
  endMonth: {
    type: String,
    required: true,
  },
  endYear: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  logo: {
    type: String, // Will store uploaded file path or URL
  },
});

const Education = mongoose.model("Education", educationSchema);
export default Education;
