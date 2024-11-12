import React from 'react'

function About4() {
  return (
    <div className='about4-container' >
      <h2>AI Features</h2>
 <div className='rapper4' >
 <div>
      <ul>
        <li>
          <strong className='strongs' > Quality Checking:</strong> AI-powered systems analyze the quality of the oranges based on factors like color, size, and firmness, ensuring only the best oranges are selected for distribution.
        </li>
        <li>
          <strong className='strongs' > Decision Making:</strong> AI helps identify potential issues in quality early in the process, predicting spoilage or damage, and suggesting corrective actions to optimize freshness.
        </li>
      </ul>
      </div>
      <div>
        <img src={require('./image/image-processing20210401-29100-unscreen.gif')} alt="ai" />
        
         </div>
 </div>
    </div>
  )
}

export default About4
