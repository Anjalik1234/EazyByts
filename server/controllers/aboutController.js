import About from '../models/About.js';

// Get current about info
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // If no document exists, send a new About with defaults
    if (!about) {
      about = new About(); // defaults from schema will be used
      await about.save();  // optional: save it to DB
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching about info', error });
  }
};

// Update about info
export const updateAbout = async (req, res) => {
  try {
    const { heroText, roles } = req.body;  // Accept both fields
    let about = await About.findOne();

    if (!about) {
      about = new About({ heroText, roles });
    } else {
      about.heroText = heroText;
      about.roles = roles;
    }

    await about.save();
    res.json({ message: 'About section updated successfully', about });
  } catch (error) {
    res.status(500).json({ message: 'Error updating about info', error });
  }
};

