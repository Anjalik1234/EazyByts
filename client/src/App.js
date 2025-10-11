import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import AdminPanel from './components/AdminPanel';
import Projects from './components/Projects';
import Education from './components/Education';

function AppContent() {
  const location = useLocation();

  // Hide Navbar on /admin route
  const hideNavbar = location.pathname === '/admin';

  return (
    <div className={`App ${hideNavbar ? 'no-header' : ''}`}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <Skills />
              <Projects />
              <Education />
            </>
          } 
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
