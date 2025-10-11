import React, { useEffect, useState } from "react";
import "./Hero.css";
import profile from "../assets/profile.jpg";

export default function Hero() {
  const [roles, setRoles] = useState([]);
  const [heroText, setHeroText] = useState("");
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/about");
        const data = await res.json();
        setRoles(data.roles || []);
        setHeroText(data.heroText || "");
      } catch (err) {
        console.error("Error fetching about:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Typing effect logic
  useEffect(() => {
    if (loading || roles.length === 0) return;

    let isMounted = true;
    const i = loopNum % roles.length;
    const fullText = roles[i] || "";

    const handleTyping = () => {
      setText((prev) =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === fullText) {
        setTimeout(() => isMounted && setIsDeleting(true), 900);
        setTypingSpeed(120);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        setTypingSpeed(120);
      } else {
        setTypingSpeed(isDeleting ? 40 : 120);
      }
    };

    const timer = setTimeout(() => {
      if (isMounted) handleTyping();
    }, typingSpeed);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [text, isDeleting, loopNum, roles, typingSpeed, loading]);

  if (loading) return <p>Loading About section...</p>;

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <div className="hero-left">
          <h2 className="greet">Hi, I am</h2>
          <h1 className="name">Anjali Kale</h1>
          <h3 className="role">
            I am a. <span className="typed">{text}</span>
            <span className="cursor" aria-hidden="true">
              |
            </span>
          </h3>
          <p className="desc">{heroText}</p>

          <a
            className="cta-btn"
            href="https://drive.google.com/drive/folders/1KfsvJm6wkcXXCT95OmKYiV9C4KZVvbj1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check Resume
          </a>
        </div>

        <div className="hero-right">
          <div className="avatar-ring">
            <img src={profile} alt="profile" className="avatar" />
          </div>
        </div>
      </div>

      <div className="dots-bg" aria-hidden="true"></div>
    </section>
  );
}
