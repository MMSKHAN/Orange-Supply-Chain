import React, { useRef } from 'react'

function HomePage6() {
  const selectSound = useRef(new Audio('/music/menu.mp3'));
  const handleMouseEnter = () => {
   
    selectSound.current.play();
  };
  return (
    <div className='HomePage6-container'  >
      <h1>Contact Us</h1>
     <div className='Home6text' > <p>We would love to hear from you! Our team are always keen to meet new people - so please get in touch, provide feedback or request to receive more information about our product.</p>
     <button className='email'  onMouseEnter={ handleMouseEnter} >Email US</button></div>
    </div>
  )
}

export default HomePage6
