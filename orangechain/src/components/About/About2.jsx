import React from 'react';
import { Canvas} from '@react-three/fiber';
import Ethereium from './Ethereium';
const About2 = () => {
  return (
    <div className="about2-container">
         <h2>How Blockchain is Useful in Orange Chain</h2>
    <div className="rapper2">
    <div>
      <ul>
        <li><strong className='strongs' >Transparency & Traceability:</strong> Blockchain provides end-to-end traceability, allowing stakeholders to track goods from origin to final destination securely and transparently.</li>
        <li><strong className='strongs' >Fraud Prevention & Counterfeit Reduction:</strong> Blockchain's immutable records make it extremely difficult for counterfeit goods to enter the supply chain, ensuring product authenticity.</li>
        <li><strong className='strongs' >Building Trust:</strong> With a decentralized and transparent ledger, all participants in the supply chain can trust that the data they are seeing is accurate and unaltered.</li>
        <li><strong className='strongs' >Automation with Smart Contracts:</strong> Smart contracts automate processes like payments, orders, and inventory updates, reducing administrative costs and improving operational efficiency.</li>
        <li><strong className='strongs' >Improved Compliance:</strong> Blockchain provides an easy-to-access audit trail, ensuring compliance with regulations and providing verifiable records for industry standards.</li>
      </ul></div>
     <div>
     <Canvas style={{width:"50rem",height:"100vh",display:"inline-block"}} >
        <ambientLight intensity={0.5} />
<Ethereium/>
      </Canvas>
     </div>
    </div>
    </div>
  );
};

export default About2;
