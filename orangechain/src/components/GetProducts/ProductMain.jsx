import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Products.css'; // Import the CSS file

function ProductMain({ state }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { contract } = state;

      if (contract) {
        try {
          const fetchedProducts = await contract.methods.getProducts().call();
          console.log('Fetched Products:', fetchedProducts); // Log the fetched products
          setProducts(fetchedProducts);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to fetch products');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [state]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.variety[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm) // Include ID in the search
  );

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="products-container">
      <h1>Oranges</h1>
      <div className='inputdev'>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="cards-container">
          {filteredProducts.map((product, index) => {
            // Parse the variety string into an actual array
            const varietyArray = JSON.parse(product.variety);  // Parse the string to get the array
            const variety = varietyArray[0];  // First element is the variety name
            const imageHash = varietyArray[1];  // Second element is the image hash
           const  prediction =varietyArray[2];
           const  confidence =varietyArray[3];
            const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
            // console.log('Image prediction,confidence:', confidence);


            return (
                <NavLink 
                to={`/product-details/${product.id}/${variety}/${product.price}/${product.quantity}/${product.dateOfHarvest}/${product.creator}/${product.currentOwner}/${imageHash}/${prediction}/${confidence}`}

                key={index} 
                className="product-card"
              >
                {/* Display Image */}
                <div className="product-image">
                  <img 
                    src={imageUrl} 
                    alt={variety} 
                    className="product-img"
                  />
                </div>
              
                {/* Display Product Details */}
                <p className='card-description'>Variety: <p>{variety}</p></p>
                <p className='card-description'>Price: <p>{state.web3.utils.fromWei(product.price.toString(), 'ether')} ETH</p></p>
                {/* <p className='card-description'>Quantity: <p>{Number(product.quantity)}</p></p> */}
                {/* <p className='card-description'>Date of Harvest: <p>{product.dateOfHarvest}</p></p> */}
                {/* <p className='card-description'>Creator: <p>{product.creator}</p></p> */}
                {/* <p className='card-description'>Current Owner: <p>{product.currentOwner}</p></p> */}
              </NavLink>
              
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductMain;
