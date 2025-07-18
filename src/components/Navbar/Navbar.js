import React from 'react'
import './Navbar.css'

const Navbar = ({ currentPage, totalPages, pageOptions, onPageSelect }) => {
  return (
    <nav className="navbar">
      <div className="navbar-title">ポケモン図鑑</div>
      <div className="navbar-controls">
        <select 
          className="page-select" 
          value={currentPage} 
          onChange={onPageSelect}
        >
          {pageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}

export default Navbar