import mongoose from 'mongoose';

// Single Skill Schema
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },       // e.g. React JS, Node JS
  icon: { type: String }                        // e.g. faReact, faNodeJs
});

// Category Schema containing skills
const SkillCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. Frontend, Backend
  skills: [SkillSchema],                                 // Array of skills under this category
  createdAt: { type: Date, default: Date.now }
});

// Export model
export const SkillCategory = mongoose.model('SkillCategory', SkillCategorySchema);
