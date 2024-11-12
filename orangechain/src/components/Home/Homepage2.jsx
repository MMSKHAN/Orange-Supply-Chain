import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom';

function Homepage2() {
  const selectSound = useRef(new Audio('/music/menu.mp3'));
  const handleMouseEnter = () => {
   
    selectSound.current.play();
  };

  return (
    <div className='page2container' >
         <h1> <span>Orange</span> Chain</h1>
   
    <div className='page2con' >
      <div className='page2text'  >
        <p>
      <strong>  Orange Chain</strong> is an innovative platform that harnesses the power of Blockchain, IoT, and AI to transform and streamline supply chain management. Whether you're in manufacturing, logistics, retail, or agriculture, Orange Chain brings together all stakeholders in the supply chain, enabling them to make smarter, data-driven decisions, increase transparency, and enhance operational efficiency all-in-one seamless platform....
        </p>
        <NavLink to={'/aboutthe platform'} className='explorebtn' onMouseEnter={ handleMouseEnter} >Learn More</NavLink>
      </div>
      <div className='page2pic' >
        <img src={require('./images/Your paragraph text.png')} alt="suplychain" />
      </div>
    </div>
    </div>
  )
}

export default Homepage2
