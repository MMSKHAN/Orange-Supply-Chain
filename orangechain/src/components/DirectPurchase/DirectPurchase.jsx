import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BN from 'bn.js'; // Import BN directly
import './DirectPurchase.css';

function DirectPurchase({ state }) {
    const { id, price, variety, dateOfHarvest } = useParams();

    const [address, setAddress] = useState('No account connected yet');
    const [quantity, setQuantity] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function getAccount() {
            if (state.web3) {
                const accounts = await state.web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                }
            }
        }

        getAccount();
    }, [state]);

    useEffect(() => {
        if (quantity > 0 && state.web3) {
            try {
                const priceBN = new BN(price); // Use BN directly
                const quantityBN = new BN(quantity);
                setTotalCost(priceBN.mul(quantityBN).toString()); // Ensure totalCost is a string
            } catch (error) {
                console.error('Error creating BN:', error);
                setTotalCost(0);
            }
        } else {
            setTotalCost(0);
        }
    }, [price, quantity, state.web3]);

    const handlePurchase = async () => {
        const { contract } = state;

        try {
            setLoading(true);
            setErrorMessage('');

            const balance = await state.web3.eth.getBalance(address);
            if (Number(balance) < Number(totalCost)) {
                alert('Insufficient balance to complete the purchase.');
                return;
            }

            const priceBN = new BN(price);
            const quantityBN = new BN(quantity);

            // Ensure totalCost is a string
            const totalCostBN = new BN(totalCost);

            const transaction = await contract.methods.directPurchase(
                id,
                quantityBN.toString(), // Pass as string
                variety,
                priceBN.toString(), // Pass as string
                dateOfHarvest
            ).send({ from: address, value: totalCostBN.toString() }); // Pass as string

            alert('Purchase successful!', transaction);
        } catch (error) {
            alert(error.message || 'Purchase failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="directCon">
          <div className="dicard">
            <h3>Product ID: {id}</h3>
            <h3>Price: {state.web3.utils.fromWei(price.toString(), 'ether')} ETH</h3>
            <h3>Total Cost: {state.web3?.utils.fromWei(totalCost.toString(), 'ether')} ETH</h3>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div className="purchase-controls">
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value) || 0)} // Convert to number
                    />
                </label>
                <button className='orgerbtn' onClick={handlePurchase} disabled={loading}>
                    {loading ? 'Processing...' : 'Buy'}
                </button>
            </div>
        </div>
      </div>
    );
}

export default DirectPurchase;