import React from 'react';

const About3 = () => {
  return (
  <div className='about3-container' >
      <h1>IoT in Orange Supply Chain</h1>
   <div className='rapper3' >
   <div>
      <div className="iotimg">
<img src={require("./image/giphy.gif")} alt="" />
      </div>
    </div>
    <div>
      <ul>
        <li>
          <strong className='strongs' >GPS Location Tracking:</strong> IoT GPS sensors track the real-time location of oranges throughout the supply chain, ensuring accurate and timely delivery.
        </li>
        <li>
          <strong className='strongs' >Temperature & Humidity Monitoring:</strong> IoT sensors measure and maintain optimal temperature and humidity levels to preserve orange quality during storage and transport.
        </li>
      </ul>
    </div>
   </div>
  </div>
  );
};

export default About3;
