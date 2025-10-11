import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import AdminLogin from './AdminLogin';

export default function Navbar() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const navigate = useNavigate();

  const handleAdminSubmit = async (password) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Server error");
    } finally {
      setIsAdminOpen(false);
    }
  };

  return (
    <header className="site-header">
      <div className="logo">Anjali.</div>

      <nav className="nav-links">
        <a href="/#hero">About</a>
        <a href="/#skills">Skills</a>
        <a href="/#projects">Projects</a>
        <a href="/#education">Education</a>
        <a href="/#contact">Contact</a>
      </nav>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a
          className="cta"
          href="https://github.com/Anjalik1234"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Profile
        </a>

        <button
          className="cta"
          onClick={() => setIsAdminOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isAdminOpen}
        >
          Admin Login
        </button>
      </div>

      <AdminLogin
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSubmit={handleAdminSubmit}
      />
    </header>
  );
}
