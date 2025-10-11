🎓 Portfolio Admin Panel

A full-stack portfolio management system built using MERN (MongoDB, Express, React, Node.js) that allows easy addition, editing, and deletion of portfolio sections like projects, education, skills, and experience — all from an interactive admin panel.

🚀 Features

Dynamic Portfolio: Automatically updates the public portfolio page when data is added or modified through the admin panel.

Admin Authentication: Secure access for adding or removing portfolio data.

Project Management: Upload project details with images, categories, and descriptions.

Education & Experience Section: Add degrees, institutions, timelines, and achievements.

Skill Management: Add or update your technical skills with ease.

Image Upload Support: Uses multer for handling media uploads to the backend.

Responsive UI: Built with React and styled for modern, mobile-friendly layouts.

🛠️ Tech Stack

Frontend: React.js, Axios, CSS

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ORM)

File Handling: Multer

Version Control: Git & GitHub

⚙️ Setup Instructions

Clone the repository

git clone https://github.com/<your-username>/<repo-name>.git


Install dependencies for both frontend and backend

cd client && npm install  
cd ../server && npm install


Configure your .env file with MongoDB URI and other keys.

Run both servers

npm run dev


Open your browser at http://localhost:3000

💡 Purpose

This project was created to make portfolio management easier and more flexible for developers — enabling live updates without manually editing code or redeploying.
