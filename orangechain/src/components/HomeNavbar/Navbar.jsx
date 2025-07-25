import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Load sound files
  const doorOpenSound = useRef(new Audio('/music/open.mp3'));
  const doorCloseSound = useRef(new Audio('/music/close.mp3'));
  const selectSound = useRef(new Audio('/music/menu.mp3'));

  const toggleNav = () => {
    if (isOpen) {
      // Navbar is closing
      doorCloseSound.current.play();
    } else {
      // Navbar is opening
      doorOpenSound.current.play();
    }
    
    // Toggle the state
    setIsOpen(prev => !prev);
  };
  

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    selectSound.current.play();
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={{
          ...styles.hamburger,
          borderRadius: isOpen ? '50%' : '0%',
          width: '30px',
          height: '30px',
          zIndex: 2000,
        }}
        onClick={toggleNav}
        transition={{ duration: 0.1, delay: 0.5 }}
      >
        <motion.div
          style={styles.bar}
          initial={{ rotate: 0 }}
          animate={isOpen ? { rotate: 45, y: 14 } : {}}
          transition={{ delay: 0.5 }}
        />
        <motion.div
          style={styles.bar}
          initial={{ opacity: 1 }}
          animate={isOpen ? { opacity: 0 } : {}}
          transition={{ delay: 0.5 }}
        />
        <motion.div
          style={styles.bar}
          initial={{ rotate: 0 }}
          animate={isOpen ? { rotate: -45, y: -5 } : {}}
          transition={{ delay: 0.5 }}
        />
      </motion.div>

      <motion.div
        style={styles.navMenu}
        initial={{ x: '-100%' }} // Off-screen to the left
        animate={isOpen ? { x: 0 } : { x: '-100%' }} // Slide in or out smoothly
        transition={{ duration: 0.5, ease: 'easeInOut' }} // Smooth easing
      >
        <ul style={styles.menuList}>
          {['Home','About the Platform','Register Member','Create Product',"Product",'Members','OrderStatus'].map((item, index) => (
            <motion.li
              key={item}
              style={styles.menuItem}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.1 + index * 0.1 }} // Adjusted delay
            >
              <NavLink
                style={{
                  ...styles.menuLink,
                  color: hoveredIndex === index ? 'green' : 'white',
                  transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)', // Use transform for scaling
                  transition: 'color 0.3s ease, transform 0.3s ease', // Ensure transition is applied
               
                }}
                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(" ", "")}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {item}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    padding: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    zIndex: 2000,
  },
  hamburger: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    position: "absolute",
    left: "3.5rem",
    top: "-9px"
  },
  bar: {
    width: '100%',
    height: '4px',
    backgroundColor: 'white',
    margin: '3px 0',
    borderRadius: '2px',
  },
  navMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '44vw',
    height: '100vh',
    backgroundColor: 'rgb(43 47 40 / 85%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  menuItem: {
    margin: '10px 0',
  },
  menuLink: {
    textDecoration: 'none',
    fontSize: '25px',
    padding:'2rem',
    transition: 'color 0.3s',
    fontFamily: "Roboto sans-serif",
    fontWeight: 400,
    fontStyle: "normal"

  },
};

export default NavBar;
