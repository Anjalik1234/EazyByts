import express from 'express';
import { getSkills, addCategory, addSkill, updateCategory, updateSkill } from '../controllers/skillsController.js';

const router = express.Router();

router.get('/', getSkills);                           // Get all skills
router.post('/category', addCategory);               // Add new category
router.post('/category/:categoryId/skill', addSkill); // Add skill to category
router.put('/category/:categoryId', updateCategory); // Update category name
router.put('/category/:categoryId/skill/:skillId', updateSkill); // Update a skill

export default router;
