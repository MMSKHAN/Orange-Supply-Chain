import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom';

function Homepage4() {
  const selectSound = useRef(new Audio('/music/menu.mp3'));
  const handleMouseEnter = () => {
   
    selectSound.current.play();
  };

    const cardData = [
        { id: 1, title: "Farmer", image: require('./images/Farmers.png') },
        { id: 2, title: "Customer", image: require('./images/customer.png') },
        { id: 3, title: "Logistics", image: require('./images/Logisticss.png') },
        // { id: 4, title: "logistics", image: require('./images/logistics.png') },
      ];
  return (
    <>
      <div className="h4container">
        <div className='h4text' >
            <h1>Industrial Excellence with OrangeChain</h1>
            <h5>In the rapidly evolving landscape of connected industries, the demand for robust, secure, and intelligent supply chain management systems has never been greater. OrangeChain leads the way, offering a cutting-edge platform that seamlessly integrates AI, IoT, and blockchain to transform the supply chain ecosystem. Our suite of advanced tools provides industries with unparalleled control, transparency, and efficiency across their operations.</h5>
        </div>
        <div>
            <h4 className='empower'  >See how we can empower you</h4>
            <div>
            <div className="h4card-container">
      {cardData.map(card => (
        <div key={card.id} className="h4card">
         <div className="h4img">
         <img src={card.image} alt={card.title} className="h4card-image" />
         </div>
          <NavLink to={'/aboutthe platform'} className="explorebtn"  onMouseEnter={ handleMouseEnter} >{card.title}</NavLink>
        </div>
      ))}
    </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Homepage4
