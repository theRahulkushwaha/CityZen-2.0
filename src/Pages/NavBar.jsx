import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Video Feed</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;