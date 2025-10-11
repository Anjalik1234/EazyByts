import React, { useMemo, useState, useEffect } from 'react';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');
  const [expandedIds, setExpandedIds] = useState([]); // track expanded cards

  const filters = ['All', 'Web App', 'Machine Learning', 'Data Science'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects');
        const data = await res.json();
        const formatted = data.map(p => ({
          id: p._id,
          title: p.title,
          date: `${new Date(p.startDate).toLocaleString('default', { month: 'short', year: 'numeric' })}` +
                (p.endDate ? ` - ${new Date(p.endDate).toLocaleString('default', { month: 'short', year: 'numeric' })}` : ''),
          category: p.technologies?.[0] || 'Web App',
          image: p.image,
          description: p.description,
          repo: p.githubLink,
          liveDemo: p.liveDemo,
        }));
        setProjects(formatted);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    if (active === 'All') return projects;
    return projects.filter(p => p.category === active);
  }, [active, projects]);

  const toggleReadMore = id => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <section id="projects" className="section projects-section">
      <div className="projects-container">
        <h2 className="projects-title">Projects</h2>
        <p className="projects-sub">
          I have worked on a wide range of projects. From web apps to Machine Learning models. Here are some of my projects.
        </p>

        <div className="projects-filters" role="tablist" aria-label="Project filters">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-btn ${active === f ? 'active' : ''}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map(p => {
            const isExpanded = expandedIds.includes(p.id);
            const desc = isExpanded ? p.description : p.description.slice(0, 120);

            return (
              <article key={p.id} className="project-card">
                <div className="project-media">
                  <img src={`http://localhost:5000${p.image}`} alt={p.title} />
                </div>

                <div className="project-body">
                  <h3 className="project-title">{p.title}</h3>
                  <div className="project-date">{p.date}</div>
                  <p className="project-desc">
                    {desc}
                    {p.description.length > 120 && (
                      <span className="read-more" onClick={() => toggleReadMore(p.id)}>
                        {isExpanded ? ' Show Less' : '... Read More'}
                      </span>
                    )}
                  </p>
                  {p.repo && (
                    <a className="project-link" href={p.repo} target="_blank" rel="noopener noreferrer">
                      View Code
                    </a>
                  )}
                  {p.liveDemo && (
                    <a className="project-link" href={p.liveDemo} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
