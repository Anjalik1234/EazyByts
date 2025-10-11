import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  roles: {
    type: [String],
    default: [
      'Full Stack Web Developer',
      'UI/UX Designer',
      'Data Analyst',
      'Machine Learning Engineer',
      'Programmer'
    ]
  },
  heroText: {
    type: String,
    default:
      "My journey in tech began with web development, and I’ve since expanded into core areas like Java-based Data Structures and Algorithms. I’m also diving into Data Science and Machine Learning, actively learning and building projects to deepen my skills. I'm highly passionate about technology and committed to developing strong, industry-relevant technical expertise. Always curious, always building, and always growing."
  }
});

const About = mongoose.model("About", AboutSchema);
export default About;
