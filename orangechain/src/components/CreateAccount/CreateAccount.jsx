import React, { useEffect, useState } from 'react';
import img from "./image/img.png"
import "./CreateAccount.css"
const CreateAccount = ({ state }) => {
  const [address, setAddress] = useState('No account Connected yet');
  const [formData, setFormData] = useState({
    firmAdd: '',
    firmName: '',
    firmLocation: '',
    ownerName: '',
    ownerContact: '',
    city: '',
    entityType: '0', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    async function getAccount() {
      const { web3 } = state;
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    }

    if (state.web3) {
      getAccount();
    }
  }, [state]);

  async function handle(e) {
    e.preventDefault();
    const { contract } = state;

    if (contract) {
      try {
        await contract.methods.setEntity(
          formData.firmAdd,
          formData.firmName,
          formData.firmLocation,
          formData.ownerName,
          formData.ownerContact,
          formData.city,
          formData.entityType 
        ).send({ from: address });

        alert('Entity created successfully!');
        setFormData({
          firmAdd: '',
          firmName: '',
          firmLocation: '',
          ownerName: '',
          ownerContact: '',
          city: '',
          entityType: '0', 
        });
      } catch (error) {
        console.error('Error creating entity:', error);
        alert('Failed to create entity: ' + error.message);
      }
    }
  }

  return (
    <>
     <div className="CreateAccountMain">
      <h1 className='Cheading' >Orange Chain</h1>
<div className='combineContainer' >
 <img className="image" src={img} alt="Image 1" />
 <div  className='InputContainer'  > 
      <h1>Create a new Account</h1>
      <form onSubmit={handle} className='formContainer' >
        <input
          type="text"
          name="firmAdd"
          placeholder="wallet Address"
          value={formData.firmAdd}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="firmName"
          placeholder="Firm Name"
          value={formData.firmName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="firmLocation"
          placeholder="Firm Location"
          value={formData.firmLocation}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={formData.ownerName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ownerContact"
          placeholder="Owner Contact"
          value={formData.ownerContact}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <select
        className='select' 
          name="entityType" 
          value={formData.entityType} 
          onChange={handleChange}
        >
          <option value="0">Farmer</option>
          <option value="1">Wholesaler</option>
          <option value="2">Logistics</option>
          <option value="3">Retailer</option>
          <option value="4">Customer</option>
        </select>
        <button type="submit" className='signup' >Sign up</button>
      </form>
    </div>
  </div> 

</div>

   
   </>
  );
};

export default CreateAccount;
