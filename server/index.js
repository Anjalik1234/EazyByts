import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";

// Routes
import aboutRoutes from "./routes/aboutRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";

dotenv.config();
const app = express();

// Serve uploads so uploaded images are accessible at /uploads/filename.jpg
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🔹 Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "2h" });
    return res.json({ success: true, token });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }
});

// 🔹 Middleware to verify admin (for protected routes)
export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    next();
  });
};

// 🔹 Routes
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/education", educationRoutes);

// Example protected test route
app.get("/api/protected", verifyAdmin, (req, res) => {
  res.json({ message: "You are an authorized admin!" });
});

// 🔹 Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
