import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './AdminLogin.css';

export default function AdminLogin({ isOpen, onClose, onSubmit }) {
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div className="admin-backdrop" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="admin-modal" onMouseDown={e => e.stopPropagation()}>
        <button className="admin-close" aria-label="Close" onClick={onClose}>×</button>
        <h4 className="admin-title">Admin Login</h4>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(password); }}>
          <label className="admin-label" htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            ref={inputRef}
            className="admin-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter password"
          />
          <div className="admin-actions">
            <button type="button" className="admin-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );

  // render modal at document.body so fixed positioning is relative to viewport
  return createPortal(modal, document.body);
}