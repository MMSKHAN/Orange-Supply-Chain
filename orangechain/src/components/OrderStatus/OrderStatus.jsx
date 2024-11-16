import React, { useEffect, useState } from 'react';
import web3 from 'web3';
import Firebasecode from './Firebasecode';
import './OrderStatus.css';

function OrderStatus({ state }) {
    const [showActions, setShowActions] = useState(false);
    const [address, setAddress] = useState('No account Connected yet');
    const [error, setError] = useState('');
    const [deliveryDetails, setDeliveryDetails] = useState(null);

    // Fetch connected account when the component mounts
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

    // Fetch the delivery details for the connected customer address
    useEffect(() => {

        if (address !== 'No account Connected yet' && state.contract) {
            const fetchDeliveryDetails = async () => {
                try {
                    const { contract } = state;
                    const deliveryData = await contract.methods.getDeliveryDetails(address).call();
                    setDeliveryDetails(deliveryData); // Store delivery details in state
        console.log(deliveryData)
                    setError(''); // Clear any previous error
                } catch (err) {
                    setError('No delivery found or failed to fetch delivery details.');
                    console.error(err);
                }
            };
            fetchDeliveryDetails();
        }
    }, [address, state]);

    // Handle delivery acceptance
    const handleAccept = async () => {
        const { contract } = state;
        try {
            await contract.methods.acceptDelivery().send({ from: address, value: deliveryDetails[4] });
            setShowActions(true); // Show actions after accepting
            setError('');
        } catch (err) {
            setError('Failed to accept delivery. Please try again.');
            console.error(err);
        }
    };

    // Handle delivery rejection
    const handleReject = async () => {
        const { contract } = state;
        try {
            await contract.methods.rejectDelivery().send({ from: address });
            setShowActions(false); // Hide actions on rejection
            window.alert("Order is rejected");
            setError('');
        } catch (err) {
            setError('Failed to reject delivery. Please try again.');
            console.error(err);
        }
    };

    // Handle delivery cancellation
    const handleCancel = async () => {
        const { contract } = state;
        try {
            await contract.methods.cancelDelivery().send({ from: address });
            setShowActions(false); // Hide actions on cancellation
            setError('');
        } catch (err) {
            setError('Failed to cancel delivery. Please try again.');
            console.error(err);
        }
    };

    // Handle delivery receipt
    const handleReceive = async () => {
        const { contract } = state;
        try {
            await contract.methods.receiveDelivery().send({ from: address });
            setShowActions(false); // Hide actions on receipt
            setError('');
        } catch (err) {
            setError('Failed to receive delivery. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className='orderStatusContainer'>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display the delivery details */}
            {deliveryDetails && (
          <div style={{color:"white",padding:"2rem"}}>
          <h3 className='orderStatus' style={{textAlign:"center",marginBottom:"2rem"}} >Delivery Details</h3>
          <p><strong className='OrderStrong' >Product ID:</strong> {deliveryDetails[5].toString()}</p>  {/* Convert BigInt to String */}
          <p><strong className='OrderStrong' >Logistics Address:</strong> {deliveryDetails[0]}</p>
          <p><strong className='OrderStrong' >Quantity:</strong> {deliveryDetails[1].toString()}</p>  {/* Convert BigInt to String */}
          <p><strong className='OrderStrong' >Customer Address:</strong> {deliveryDetails[2]}</p>
          <p><strong className='OrderStrong' >Fair (Logistics Fee):</strong> {web3.utils.fromWei(deliveryDetails[3], 'ether')} ETH</p>
          <p><strong className='OrderStrong' >Total Bill:</strong> {web3.utils.fromWei(deliveryDetails[4], 'ether')} ETH</p>
      </div>
      
            )}

            {/* Display accept/reject buttons if showActions is false */}
            {!showActions ? (
                <div className='orderAcept'>
                    <button className='orgerbtn' onClick={handleAccept}>Accept Delivery</button>
                    <button className='orgerbtn' onClick={handleReject}>Reject Delivery</button>
                </div>
            ) : (
                // Show action buttons (Cancel or Receive) once accepted
                <div  className='orderAcept' >
                    <button className='orgerbtn' onClick={handleCancel}>Cancel Delivery</button>
                    <button className='orgerbtn' onClick={handleReceive}>Receive Delivery</button>
                </div>
            )}
<Firebasecode />
            {/* Conditionally render Firebasecode only when delivery is accepted */}
            {showActions && <Firebasecode />}
            
        </div>
    );
}

export default OrderStatus;
