import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './Order.css'; // Import the CSS file for styling

function Order({ state, delivery }) {
    const [showActions, setShowActions] = useState(false);
    const [address, setAddress] = useState('No account connected yet');
    const [error, setError] = useState('');

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

    const handleAccept = async () => {
        const { contract } = state;
        try {
            await contract.methods.acceptDelivery().send({ from: address, value: Web3.utils.toWei('5', 'ether') });
            setShowActions(true);
            setError('');
        } catch (err) {
            setError('Failed to accept delivery. Please try again.');
            console.error(err);
        }
    };

    const handleReject = async () => {
        const { contract } = state;
        try {
            await contract.methods.rejectDelivery().send({ from: address });
            setShowActions(false);
            window.alert("Order is rejected");
            setError('');
        } catch (err) {
            setError('Failed to reject delivery. Please try again.');
            console.error(err);
        }
    };

    const handleCancel = async () => {
        const { contract } = state;
        try {
            await contract.methods.cancelDelivery().send({ from: address });
            setShowActions(false);
            setError('');
        } catch (err) {
            setError('Failed to cancel delivery. Please try again.');
            console.error(err);
        }
    };

    const handleReceive = async () => {
        const { contract } = state;
        try {
            await contract.methods.receiveDelivery().send({ from: address });
            setShowActions(false);
            setError('');
        } catch (err) {
            setError('Failed to receive delivery. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className='orderCon' >
        <div className="order-status-card">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h3>Order Status</h3>
            <div className="action-buttons">
                {!showActions ? (
                    <>
                        <button onClick={handleAccept}>Accept Delivery</button>
                        <button onClick={handleReject}>Reject Delivery</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleCancel}>Cancel Delivery</button>
                        <button onClick={handleReceive}>Receive Delivery</button>
                    </>
                )}
            </div>
            <div className="account-info">
                <p>Connected account: {address}</p>
                {delivery && <p>Total Bill: {delivery.totalBill} wei</p>}
            </div>
        </div>
        </div>
    );
}

export default Order;
