// // src/Converter.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const Convertor = () => {
//   const [pkrAmount, setPkrAmount] = useState(0);
//   const [ethAmount, setEthAmount] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handlePkrAmountChange = (event) => {
//     setPkrAmount(event.target.value);
//   };

//   const convertPkrToEth = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pkr');
//       const ethPriceInPkr = response.data.ethereum.pkr;
//       const convertedAmount = pkrAmount / ethPriceInPkr;
//       setEthAmount(convertedAmount);
//     } catch (error) {
//       setError('Failed to fetch the exchange rate. Please try again later.');
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>PKR to ETH Converter</h1>
//       <div>
//         <label htmlFor="pkrAmount">Enter PKR Amount:</label>
//         <input
//           type="number"
//           id="pkrAmount"
//           value={pkrAmount}
//           onChange={handlePkrAmountChange}
//           step="any"
//         />
//       </div>
//       <button onClick={convertPkrToEth} disabled={loading}>
//         {loading ? 'Converting...' : 'Convert'}
//       </button>

//       {ethAmount !== null && (
//         <div>
//           <h2>Result: {ethAmount.toFixed(5)} ETH</h2>
//         </div>
//       )}

//       {error && <div style={{ color: 'red' }}>{error}</div>}
//     </div>
//   );
// };

// export default Convertor;
// src/Convertor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Convertor = () => {
  const [pkrAmount, setPkrAmount] = useState(0);
  const [ethAmount, setEthAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ETH to PKR rate whenever pkrAmount changes
  useEffect(() => {
    if (pkrAmount <= 0) {
      setEthAmount(null); // Clear ETH result if PKR is 0 or less
      return;
    }

    const convertPkrToEth = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pkr');
        const ethPriceInPkr = response.data.ethereum.pkr;
        const convertedAmount = pkrAmount / ethPriceInPkr;
        setEthAmount(convertedAmount);
      } catch (error) {
        setError('Failed to fetch the exchange rate. Please try again later.');
      }

      setLoading(false);
    };

    convertPkrToEth();
  }, [pkrAmount]); // This effect runs every time pkrAmount changes

  const handlePkrAmountChange = (event) => {
    setPkrAmount(event.target.value);
  };

  return (
    <div>
      <h1>PKR to ETH Converter</h1>
      <div>
        <label htmlFor="pkrAmount">Enter PKR Amount:</label>
        <input
          type="number"
          id="pkrAmount"
          value={pkrAmount}
          onChange={handlePkrAmountChange}
          step="any"
        />
      </div>

      {loading && <p>Converting...</p>}

      {ethAmount !== null && (
        <div>
          <h2>Result: {ethAmount.toFixed(5)} ETH</h2>
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Convertor;
