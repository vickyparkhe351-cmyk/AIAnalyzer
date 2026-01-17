import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          AI Resume Analyzer
        </Link>
        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/upload" className="navbar-link">Upload Resume</Link>
            <Link to="/job-description" className="navbar-link">Job Description</Link>
            <Link to="/analyze" className="navbar-link">Analyze</Link>
            <Link to="/history" className="navbar-link">History</Link>
            <span className="navbar-user">{user.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
