import React, { useState } from 'react';
import axios from 'axios';

function Ai() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error("Error during prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="main-title">
        <h1>🍊 Orange Quality Classification 🍊</h1>
        <p>Upload an image of an orange, and our AI will classify its quality.</p>
      </div>
      
      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing...' : 'Upload Image'}
        </button>
      </div>

      {prediction && (
        <div className="prediction-box">
          <p>🔥 Prediction: <b>{prediction}</b></p>
          <p>🎯 Confidence: <b>{confidence.toFixed(2)}%</b></p>
        </div>
      )}
    </div>
  );
}

export default Ai;
