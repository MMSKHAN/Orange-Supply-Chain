import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './Products.css'; // Import the CSS file

function Products({ state }) {
  // Get the parameters from the URL (from useParams)
  const { id, variety, price, quantity, dateOfHarvest, creator, currentOwner, imageHash,prediction,confidence } = useParams();
  const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;  // Construct the image URL

  // Check if state.web3 is available before accessing it
  const priceInEth = state?.web3?.utils ? state.web3.utils.fromWei(price.toString(), 'ether') : null;

  return (
    <div className="varitycontainer">
      <h1>{variety}</h1>

      {/* Display a single product's details */}
      <div className="product-card">
        {/* Display Image */}
        <div className="product-image">
          <img 
            src={imageUrl} 
            alt={variety}  // Variety name for alt text
            className="product-img"
          />
        </div>

        {/* Display Product Details */}
        <div>
          <p className='card-description'>ID: <span>{id}</span></p>
          <p className='card-description'>Variety: <span>{variety}</span></p> {/* Display variety */}
          <p className='card-description'>Price: <span>{priceInEth ? `${priceInEth} ETH` : 'Loading...'}</span></p>
          <p className='card-description'>Quantity: <span>{quantity}</span></p>
          <p className='card-description'>Date of Harvest: <span>{dateOfHarvest}</span></p>
          <p className='card-description'>Creator: <span>{creator}</span></p>
          <p className='card-description'>Current Owner: <span>{currentOwner}</span></p>
          <p className='card-description'>Quality: <span>{prediction}</span></p>
          <p className='card-description'> confidence: <span>{Math.round(confidence)}%</span></p>
        </div>

        {/* Action Buttons */}
        <div className='ordernav'>
          <NavLink 
            to={`/DirectPurchase/${id}/${price}/${variety}/${dateOfHarvest}/${creator}`} 
            className="orgerbtn"
          >
            Direct Purchase
          </NavLink>

          <NavLink 
            to={`/Delivery/${id}/${price}`} 
            className="orgerbtn"
          >
            Order
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Products;
