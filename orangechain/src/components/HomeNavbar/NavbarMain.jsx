import React, { useEffect, useRef, useState } from 'react'; 
import NavBar from './Navbar';
import log from "./images/logo.png";

import { NavLink } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';

function NavbarMain() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if the scroll position is greater than 100vh
      setIsScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap:"1rem",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "background-color 0.3s ease",
        backgroundColor: isScrolled ? "rgb(33 76 105 / 58%)" : "",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
      }}>
        <div><NavBar /></div>
        <NavLink to={'/'} style={{ height: "5rem", width: "5rem" }}>
          <img src={log} alt="logo" style={{ width: "100%" }} />
        </NavLink>
        <div className='singup' ><NavLink to="/profile data"
      
        ><PersonCircle/> </NavLink></div>
      </div>
      {/* Divider */}
      {!isScrolled && (
        <div style={{ width: "90%", height: "1px", background: "white", margin: "0 auto" }} />
      )}
    </div>
  );
}

export default NavbarMain;