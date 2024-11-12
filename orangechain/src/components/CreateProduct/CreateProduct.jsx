import React, { useEffect, useState } from 'react';
import image from "./images/orange.gif"
import "./CreateProduct.css"
function CreateProduct({ state }) {
  const [productVariety, setProductVariety] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productDate, setProductDate] = useState('');
  const [address, setAddress] = useState('');

  // Fetch the user's address
  useEffect(() => {
    const fetchAddress = async () => {
      const accounts = await state.web3.eth.getAccounts();
      setAddress(accounts[0]);
    };
    fetchAddress();
  }, [state]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const { contract, web3 } = state;

    try {
      // Convert product price from Ether to Wei
      const priceInWei = web3.utils.toWei(productPrice.toString(), 'ether');
      
      await contract.methods.productCreation(productVariety, priceInWei, productQuantity, productDate).send({ from: address });
      alert('Product created successfully!');
      // Reset form fields
      setProductVariety('');
      setProductPrice('');
      setProductQuantity('');
      setProductDate('');
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product');
    }
  };

  return (
    <div className='ClassMain' >
 <p className='h1h' >Join the Orange Revolution</p>
   <div className='CreateClass' >
   <div className='gifsize' >

{/* <p className='h1h' > Where Flavor Meets Fun</p> */}
<img src={image} alt="orange" />
</div>
<div className="card">
{/* <div className="card-body"> */}
<form onSubmit={handleCreateProduct} className='productform' >
<h1>Register Product</h1>
<div>
  <p>Product Variety</p>
  <input type="text" placeholder='Variety' className='inputs' value={productVariety} onChange={(e) => setProductVariety(e.target.value)} required />
</div>
<div>
<p>Price in eth</p>
  <input type="number" placeholder='Price in ETH' className='inputs' value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
</div>
<div>
<p>Quantity</p>
  <input type="number" placeholder='Quantity in Kg' className='inputs' value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} required />
</div>
<div>
<p>Harvesting date</p>
  <input type="date" placeholder='Date of Harvest' className='inputs'  value={productDate} onChange={(e) => setProductDate(e.target.value)} required />
</div>
<button type="submit" className='register_btn'>Register</button>
</form>
</div>
   </div>
    </div>
  );
}

export default CreateProduct;
