import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware for admin verification
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    next();
  });
};

router.get("/", getAbout);
router.put("/", updateAbout); // Only admin can edit

export default router;
