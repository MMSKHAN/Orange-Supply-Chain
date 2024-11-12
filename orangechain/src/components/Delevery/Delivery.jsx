import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Delevery.css'
function Delivery({ state }) {
    // const id=1;
    const { id } = useParams(); // Get product ID from URL params
    const [logistics, setLogistics] = useState('');
    const [quantity, setQuantity] = useState(); // Default quantity
    const [customer, setCustomer] = useState('');
    const [fair, setFair] = useState();
    const [address, setAddress] = useState('No account connected yet');

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

    const handleDelivery = async () => {
        const { contract } = state;
    
        try {
            // Validate inputs
            if (!logistics || !quantity || !customer || !fair) {
                alert('Please fill in all fields.');
                return;
            }
    
            // Log the transaction details
            console.log(`Calling delivery with id: ${id}, logistics: ${logistics}, quantity: ${quantity}, customer: ${customer}, fair: ${fair}`);
    
            // Call the delivery function
            await contract.methods.delivery(id, logistics, quantity, customer, fair).send({ from: address });
    
            console.log('Delivery scheduled successfully!');
            alert('Delivery scheduled successfully!');
        } catch (error) {
            console.error('Error scheduling delivery:', error);
            alert(`Delivery failed: ${error.message}`);
        }
    };

    return (
        <div className='DeliveryContainer' >
            <h3 className='DeleveryHeading'  >Schedule Delivery </h3>
           
            <div className='DeleveryCard' >
       <div className='DeleveryMainCard'  >
       <p> <strong>Product ID</strong> {id} </p>
                <p>
                   {/* <p> Logistics Provider Address:</p> */}
                    <input
                    className='Devinput'
                        type="text"
                        value={logistics}
                        onChange={(e) => setLogistics(e.target.value)}
                        placeholder="Enter logistics address"
                    />
                </p>
                <p>
                   {/* <p> Quantity:</p> */}
                    <input
                   
                        type="number"
                        value={quantity}
                        placeholder='Quantity'
                        onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                        style={{backgroundColor: "transparent", color: "rgba(255, 255, 255, 0.567)", border:" none", width: "100%",borderBottom: "2px solid orange"}}
               
                   
                    />
                </p>
                <p>
                  {/* <p>  Customer Address:</p> */}
                    <input
                      className='Devinput'
                        type="text"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        placeholder="Enter customer address"
                    />
                </p>
                <p>
                   {/* <p> Fair (Logistics Fee in Wei):</p> */}
                    <input
                        type="number"
                        placeholder='Fair (Logistics Fee in Wei)'
                       style={{backgroundColor: "transparent", color: "rgba(255, 255, 255, 0.567)", border:" none", width: "100%",borderBottom: "2px solid orange"}}
                        value={fair}
                        onChange={(e) => setFair(e.target.value)}
                       
                    />
                </p>

       </div>
                       <button onClick={handleDelivery} className='orgerbtn'>Schedule Delivery</button>
            </div>
        </div>
    );
}

export default Delivery;
