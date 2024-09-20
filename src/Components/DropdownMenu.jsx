import React, { useState } from 'react';
import './DropdownMenu.css'; // Importing the CSS
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';


function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <div className="navbar">
            <div className="logo">
                <img src="/image/logo.png" alt="CityZen" />
            </div>
            <div className="nav-items">
                <div className="dropdown-container">
                    <div className="dropdown-menu">
                        <ul>
                            <li><a href="home">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Reports</a></li>
                            <li><a href="feedback">Feedback</a></li>
                        </ul>
                    </div>
                </div>
                <div className='logout'>
                    <button onClick={handleLogout}>
                        <img src="/image/logout.png" alt="img" /><span>Logout</span>
                    </button>
                </div>
            </div>


            {/* <div className="menu-icon" onClick={toggleMenu}>
                <img src="/image/add.png" alt="Menu" className={`menu-image ${isOpen ? 'rotated' : ''}`} />
            </div> */}
            {/* {isOpen && (
                <div className="dropdown-container">
                    <div className="overlay" onClick={toggleMenu} />
                    <div className="dropdown-menu">
                        <ul>
                            <li><a href="home">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="model">AI Models</a></li>
                            <li><a href="feedback">Feedback</a></li>
                        </ul>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default DropdownMenu;