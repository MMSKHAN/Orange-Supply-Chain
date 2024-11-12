import React, { useRef } from 'react';

const cardData = [
  { id: 1, title: "Farmer", image: require('./images/farmer.png') },
  { id: 2, title: "Artificial Intelligence", image: require('./images/ai.png') },
  { id: 3, title: "Smart Contract", image: require('./images/contract.png') },
  { id: 5, title: "iot", image: require('./images/iot.png') },
  { id: 4, title: "logistics", image: require('./images/logistics.png') },
  { id: 6, title: "warehouse", image: require('./images/warehouse.png') },
  { id: 7, title: "retailer", image: require('./images/retailer.png') },
  { id: 8, title: "Traceability", image: require('./images/quality.png') },
];

function Homepage3() {
  const selectSound = useRef(new Audio('/music/menu.mp3'));
  const handleMouseEnter = () => {
   
    selectSound.current.play();
  };

  return (
    <>
    <div className="Page4contaner"  >

   
    <div className='page3text'  >
        <p>
        A cutting-edge solution
        </p>
        <h5>
        Built for the future of connected industries, OrangeChain integrates AI, IoT, and blockchain to deliver the most secure, efficient, and intelligent supply chain platform
        </h5>
    </div>
    <div className="h3card-container"  >
      {cardData.map(card => (
        <div key={card.id} className="h3card"  onMouseEnter={ handleMouseEnter} >
         <div className="h3img">
         <img src={card.image} alt={card.title} className="h3card-image" />
         </div>
          <div className="h3card-text">{card.title}</div>
        </div>
      ))}
    </div>
    </div>
    </>
  );
}

export default Homepage3;
