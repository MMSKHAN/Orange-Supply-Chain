import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Products.css'; // Import the CSS file
// import orange from "./img.png"
function Products({ state }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const selectSound = useRef(new Audio('/music/menu.mp3'));
  const handleMouseEnter = () => {
   
    selectSound.current.play();
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const { contract } = state;

      if (contract) {
        try {
          const fetchedProducts = await contract.methods.getProducts().call();
          console.log(fetchedProducts);
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
    product.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
   <div className='inputdev' >   <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      /></div>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="cards-container">
          {filteredProducts.map((product, index) => (
            <div key={index} className="product-card">
              {/* <div className="orange">  <img src={orange} alt="orange" /></div> */}
              <p className='card-description'>ID: <p> {Number(product.id)}</p> </p>
              <p className='card-description' >Variety:  <p>{product.variety}</p> </p>
              <p className='card-description' >Price: <p>{state.web3.utils.fromWei(product.price.toString(), 'ether')} ETH</p> </p>
              <p className='card-description'>Quantity: <p>{Number(product.quantity)}</p></p>  {/* Convert BigInt to number */}
              <p className='card-description' >Date of Harvest: <p>{product.dateOfHarvest}</p> </p>
              <p className='card-description' >Creator: <p>{product.creator}</p></p>
              <p className='card-description' >Current Owner: <p> {product.currentOwner}</p>  </p>
              <div className='ordernav' >
                <NavLink 
                  to={`/DirectPurchase/${product.id}/${product.price}/${product.variety}/${product.dateOfHarvest}/${product.creator}`} 
                onMouseEnter={ handleMouseEnter}
                  className="orgerbtn"
                >
                  Direct Purchase
                </NavLink>
             
                <NavLink 
                  to={`/Delivery/${product.id}/${product.price}`} 
                onMouseEnter={ handleMouseEnter}
                  className="orgerbtn"
                >
                  Order
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
