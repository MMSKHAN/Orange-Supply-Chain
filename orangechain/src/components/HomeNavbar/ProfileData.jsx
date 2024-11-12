import React, { useEffect, useState } from 'react';
import { PencilSquare } from 'react-bootstrap-icons'; // For the profile icon

// Entity Types for display
const entityTypeNames = {
  0: 'Farmer',
  1: 'Wholesaler',
  2: 'Logistics',
  3: 'Retailer',
  4: 'Customer',
};

function ProfileData({ state }) {
  const [address, setAddress] = useState(''); // Connected wallet address
  const [entities, setEntities] = useState([]); // All entities
  const [products, setProducts] = useState([]); // All products
  const [filteredEntities, setFilteredEntities] = useState([]); // Filtered entities based on the connected address
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on the connected address
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(null); // Track which product was clicked
  const [newPrice, setNewPrice] = useState(''); // Store the new price input

  useEffect(() => {
    const getAccountData = async () => {
      const { web3, contract } = state;
      
      // Fetch the connected wallet address
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }

      if (contract) {
        try {
          // Fetch all entities and products from the contract
          const fetchedEntities = await contract.methods.getEntity().call();
          const fetchedProducts = await contract.methods.getProducts().call();
          
          setEntities(fetchedEntities);
          setProducts(fetchedProducts);

        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch data');
        } finally {
          setLoading(false);
        }
      }
    };

    getAccountData();
  }, [state]);

  useEffect(() => {
    // Filter the entities and products based on the connected wallet address
    const filteredEntitiesList = entities.filter(entity =>
      entity.Firmadd.toLowerCase() === address.toLowerCase() // Match the address exactly
    );
    setFilteredEntities(filteredEntitiesList);

    const filteredProductsList = products.filter(product =>
      product.currentOwner.toLowerCase() === address.toLowerCase() // Match the address exactly
    );
    setFilteredProducts(filteredProductsList);

  }, [address, entities, products]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to show the input container when the pencil icon is clicked
  const clickShow = (index) => {
    setCurrentProductIndex(index);
    setShow(true);
    setNewPrice(''); // Reset the new price input field when opening a new one
  };

  // Handle the price change submission
  const handleChange = async () => {
    const { web3, contract } = state;
    if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const productId = filteredProducts[currentProductIndex].id; // Get the product ID
    const priceInWei = web3.utils.toWei(newPrice.toString(), 'ether'); // Convert price to Wei

    try {
      const accounts = await web3.eth.getAccounts();
      const senderAddress = accounts[0];

      // Call the updateProductPrice function from the contract
      await contract.methods.updateProductPrice(productId, priceInWei).send({ from: senderAddress });

      // After the transaction is successful, update the price in the local state
      const updatedProducts = [...filteredProducts];
      updatedProducts[currentProductIndex].price = priceInWei;
      setFilteredProducts(updatedProducts);

      // Hide the price input container
      setShow(false);
      setNewPrice('');
      alert('Price updated successfully');
    } catch (err) {
      console.error('Error updating product price:', err);
      alert('Error updating price. Please try again');
    }
  };

  return (
    <div className="account-data-container">

      {/* Show filtered entity data */}
      <div className="filtered-entities">
        {filteredEntities.length > 0 ? (
          <div>
            <h2 className='ProfileDataHeading'>Personal Data</h2>
            {filteredEntities.map((entity, index) => (
              <div key={index} className="entity-card">
                <p><strong className='str'>Firm Name:</strong> {entity.Firmname}</p>
                <p><strong className='str'>Wallet Address:</strong> {entity.Firmadd}</p>
                <p><strong className='str'>Location:</strong> {entity.Firmlocation}</p>
                <p><strong className='str'>Owner Name:</strong> {entity.ownerName}</p>
                <p><strong className='str'>Contact:</strong> {entity.ownerContact}</p>
                <p><strong className='str'>City:</strong> {entity.city}</p>
                <p><strong className='str'>Type:</strong> {entityTypeNames[entity.entityType]}</p>
                <p><strong className='str'>Status:</strong> {entity.isAllowed ? 'Allowed' : 'Disallowed'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='ProfileDataHeading2'>No matching entities found for this address.</p>
        )}
      </div>

      {/* Show filtered product data */}
      <div className="filtered-products">
        {filteredProducts.length > 0 ? (
          <div>
            <h2 className='ProfileDataHeading2'>Oranges</h2>
            {filteredProducts.map((product, index) => (
              <div key={index} className="entity-card">
                <p><strong className='str'>Product ID:</strong> {Number(product.id)}</p>
                <p><strong className='str'>Variety:</strong> {product.variety}</p>
                <p className='editcontainer'>
                  <p><strong className='str'>Price:</strong> {state.web3.utils.fromWei(product.price.toString(), 'ether')} ETH</p>
                  <PencilSquare className='changeicon' onClick={() => clickShow(index)} />
                </p>
                <p><strong className='str'>Quantity:</strong> {Number(product.quantity)}</p>
                <p><strong className='str'>Date of Harvest:</strong> {product.dateOfHarvest}</p>
                <p><strong className='str'>Creator:</strong> {product.creator}</p>
                <p><strong className='str'>Current Owner:</strong> {product.currentOwner}</p>

                {show && currentProductIndex === index && (
                  <div className='changePriceContainer'>
                    <input
                      type='number'
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder='New price (in ETH)'
                    />
                    <button className='changebtn' onClick={handleChange}>Change</button>
                  </div>
                )}
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p className='ProfileDataHeading2'>No matching products found for this address.</p>
        )}
      </div>
    </div>
  );
}

export default ProfileData;
