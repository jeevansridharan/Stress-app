import React from 'react'
import './Sidebar.css'

function Sidebar({ activeSection, onSectionChange }) {
  const navItems = [
    { id: 'overview', label: 'Stress Overview', icon: '📊' },
    { id: 'history', label: 'History', icon: '📈' },
    { id: 'breathing', label: 'Breathing Exercise', icon: '🫁' },
    { id: 'music', label: 'Calming Music', icon: '🎵' },
    { id: 'visual', label: 'Visual Relief', icon: '🌅' },
    { id: 'tips', label: 'Quick Tips', icon: '💡' },
    { id: 'chatbot', label: 'Support Chatbot', icon: '💬' }
  ]

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">SS</span>
        <span className="sidebar-title">Stress Analyzer</span>
      </div>
      
      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
