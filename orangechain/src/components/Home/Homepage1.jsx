import React from 'react';
import { ChevronRight } from 'react-bootstrap-icons';
import orange1 from "./or/oorange4.mp4"
function Homepage1() {
  // Function to handle the scroll on button click
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight, // Scroll down by 100vh (one full screen height)
      behavior: 'smooth' // Smooth scroll effect
    });
  };

  return (
    <>
          <div className="video-background">
                <video autoPlay  muted style={{width:"100%"}} >
                    <source src={orange1} type="video/mp4" />
                </video>
            </div>
      <div></div>
      <div className='page1con'>
      <img src={require('./images/Conn__1_-removebg-preview.png')} alt="best" />

        <button className='explorebtn' onClick={handleScrollDown}>
          Explore Now <ChevronRight />
        </button>
      </div>
    </>
  );
}

export default Homepage1;
