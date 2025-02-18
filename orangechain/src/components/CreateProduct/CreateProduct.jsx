import React, { useEffect, useState } from 'react';
import image from "./images/orange.gif";
import axios from 'axios';
import Spinner from '../Spinner'; // Import the Spinner component
import "./CreateProduct.css";
const JWT= `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYjQ1ZmZkZC1lOWE3LTQyZmMtYmI0MS03YWE5ZGJjN2M4MTMiLCJlbWFpbCI6Im1zYXVka2hhbjE4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmNTc4Y2M5ZDhkNjgyMTQxYjJiNiIsInNjb3BlZEtleVNlY3JldCI6IjdiNmRjNzc4MWY0ODRjZTkzNTdlY2I0OTgzOWFmYTk4MDk1YjJhMTM1MGJiYjJhZGM5MjkwYzBlNTU2MzkxNDIiLCJpYXQiOjE2OTY0MDc3NTl9.etrBva8LWw-6m6fFY4FXwUBEUSB3rXdaf76KVyeLqhk`

function CreateProduct({ state }) {
  const [productVariety, setProductVariety] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productDate, setProductDate] = useState('');
  const [productImage, setProductImage] = useState(null);  // For storing the selected image file
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
//  const [prediction, setPrediction] = useState(null);
  // const [confidence, setConfidence] = useState(null);
  useEffect(() => {
    const fetchAddress = async () => {
      if (state && state.web3) {
        try {
          const accounts = await state.web3.eth.getAccounts();
          setAddress(accounts[0]);
        } catch (err) {
          console.error('Error fetching accounts:', err);
        }
      } else {
        console.error('Web3 is not initialized yet');
      }
    };
    fetchAddress();
  }, [state]);


  

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const { contract, web3 } = state;
  
    // Check if all the required fields are filled
    if (productImage && productVariety && productPrice && productQuantity && productDate) {
      setLoading(true);
  
      // Prepare form data for image upload
      const formData = new FormData();
      formData.append('file', productImage);
  
      try {
        // Fetch prediction data from Flask server
        const response = await axios.post('http://localhost:5000/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Get prediction and confidence from response
        const { prediction, confidence } = response.data;
  
        if (!prediction || confidence === null) {
          alert('Prediction failed. Please try uploading a valid image.');
          setLoading(false);
          return; // Stop the process if prediction is invalid
        }
  
        // Upload the image to Pinata
        const imageUploadResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        });
  
        const imageHash = imageUploadResponse.data.IpfsHash;
  
        // Convert product price from Ether to Wei
        const priceInWei = web3.utils.toWei(productPrice.toString(), 'ether');
  
        // Combine all product details into a string for smart contract input
        const combine = [productVariety, imageHash, prediction, confidence];
        const combinedString = JSON.stringify(combine);
  
        // Create the product by calling the smart contract
        await contract.methods.productCreation(
          combinedString,
          priceInWei,
          productQuantity,
          productDate,
        ).send({ from: address });
  
        alert('Product created successfully!');
  
        // Reset form fields after success
        setProductVariety('');
        setProductPrice('');
        setProductQuantity('');
        setProductDate('');
        setProductImage(null);
      } catch (err) {
        console.error('Error creating product:', err);
        alert('Failed to create product');
      } finally {
        setLoading(false);  // Make sure loading is reset after success or error
      }
    } else {
      alert('Please fill all fields and upload an image.');
    }
  };
  



  return (
    <>
        {loading && ( <div className='spinner' ><Spinner/></div>)}  
    
    <div className='ClassMain'>
      
      <p className='h1h'>Join the Orange Revolution</p>
      <div className='CreateClass'>
        <div className='gifsize'>
          <img src={image} alt="orange" />
        </div>
        <div className="card">
          <form onSubmit={handleCreateProduct} className='productform'>
            <h1>Register Product</h1>
            <div className="file-upload-container">
              <p>Upload Product Image</p>
              
              {/* Custom button for file input */}
              <label htmlFor="fileInput" className="file-upload-btn">
                {productImage ? 'Change Image' : 'Choose Image'}
              </label>
              <input
                id="fileInput"
                type="file"
                className="file-input"
                onChange={handleImageChange}
                required
                style={{ display: 'none' }} // Hide default file input
              />
            </div>
            <div>
              <p>Product Variety</p>
              <input
                type="text"
                placeholder='Variety'
                className='inputs'
                value={productVariety}
                onChange={(e) => setProductVariety(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Price in eth</p>
              <input
                type="number"
                placeholder='Price in ETH'
                className='inputs'
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Quantity</p>
              <input
                type="number"
                placeholder='Quantity in Kg'
                className='inputs'
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                required
              />
            </div>
            <div className="harcontainer" >
              <p>Harvesting date</p>
              <input
                type="date"
                placeholder='Date of Harvest'
                className='inputs'
                value={productDate}
                onChange={(e) => setProductDate(e.target.value)}
                required
              />
            </div>
      
           
          

            <button type="submit" className='register_btn'>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
    </>);
}

export default CreateProduct;
