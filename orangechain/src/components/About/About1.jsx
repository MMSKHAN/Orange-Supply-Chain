import React from 'react'

function About1() {
  return (
    <div className='About1-contaner' >
      <h1>Introducing the Orange Chain</h1>
      <div>
      <h1 className='conventional' >CONVENTIONAL SUPLY CHAIN</h1>
    <div className="abou2img">

    <img src={require('../Home/images/Your paragraph text.png')} alt="img" />
    </div>
      </div>

      <div className="paralox1">
    <h1 className='conventional' >DIRECT-TO-CUSTOMER(D2C) SUPLY CHAIN</h1>
    <div className="abou2img">

    <img src={require('../Home/images/Blockchain (1).png')} alt="img" />
    </div>
      </div>
      <div className="paralox1text">
 <p>
        Orange Chain is an advanced, integrated platform designed to revolutionize supply chain management by combining the power of blockchain, Internet of Things (IoT), and Artificial Intelligence (AI). It provides a secure, transparent, and real-time management solution for businesses across various industries, ensuring the smooth flow of information and products throughout the entire supply chain.
      </p>
      <p>
        By leveraging blockchain technology, Orange Chain offers an immutable and decentralized ledger to track and verify transactions, ensuring transparency and accountability at every step. IoT devices enable real-time data collection from physical assets, while AI-driven analytics optimize decision-making and predict potential disruptions.
      </p>
      <p>
        Orange Chain connects key stakeholders within the supply chain, from manufacturers and suppliers to distributors and retailers, creating a trusted, collaborative network. With real-time insights, predictive analytics, and automated processes, businesses can significantly reduce inefficiencies, improve product traceability, and lower operational costs.
      </p>
      <p>
        Whether you're managing raw materials, finished goods, or complex logistics, Orange Chain transforms how you manage and monitor your supply chain, making it more agile, secure, and cost-effective.
      </p>
      </div>
    </div>
  )
}

export default About1
