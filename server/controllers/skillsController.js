import { SkillCategory } from '../models/Skills.js';

// Get all skill categories with skills
export const getSkills = async (req, res) => {
  try {
    let categories = await SkillCategory.find();

    // If DB empty, insert default skills
    if (!categories || categories.length === 0) {
      categories = await SkillCategory.insertMany([
        {
          name: "Frontend",
          skills: [
            { name: "React JS", icon: "faReact" },
            { name: "HTML", icon: "faHtml5" },
            { name: "CSS", icon: "faCss3Alt" },
            { name: "JavaScript", icon: "faJsSquare" },
            { name: "Bootstrap", icon: "faBootstrap" },
          ],
        },
        {
          name: "Backend",
          skills: [
            { name: "Node JS", icon: "faNodeJs" },
            { name: "Express JS", icon: "faServer" },
            { name: "Python", icon: "faPython" },
            { name: "MySQL", icon: "faDatabase" },
            { name: "MongoDB", icon: "faDatabase" },
          ],
        },
      ]);
    }

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching skills", err });
  }
};


// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existing = await SkillCategory.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new SkillCategory({ name, skills: [] });
    await category.save();

    res.json({ message: 'Category added', category });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
};

// Add a new skill to a category
export const addSkill = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, icon } = req.body;

    const category = await SkillCategory.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.skills.push({ name, icon });
    await category.save();

    res.json({ message: 'Skill added', category });
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error });
  }
};

// Update category name
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await SkillCategory.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = name;
    await category.save();

    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// Update skill inside a category
export const updateSkill = async (req, res) => {
  try {
    const { categoryId, skillId } = req.params;
    const { name, icon } = req.body;

    const category = await SkillCategory.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const skill = category.skills.id(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.name = name || skill.name;
    skill.icon = icon || skill.icon;

    await category.save();
    res.json({ message: 'Skill updated', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error });
  }
};
