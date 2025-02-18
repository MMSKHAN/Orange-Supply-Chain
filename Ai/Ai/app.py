import streamlit as st
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image

# Load the trained model
model = tf.keras.models.load_model("orange_quality_model.h5")

# Define class labels
class_labels = ["Class 1 Orange - A1 (Quality is Awesome)", 
                "Class 2 Orange - A2 (Quality is Normal)", 
                "Bad Quality (Rotten)"]

# Function to preprocess the image
def preprocess_image(image):
    img = np.array(image)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# Streamlit page config
st.set_page_config(page_title="Orange Quality Checker 🍊", layout="wide")

# Custom CSS for background video and text styling
st.markdown(
    """
    <style>
    /* Background Video */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .background-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
    }

    .background-container video {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100%;
        min-height: 100%;
        opacity: 0.5;
        filter: brightness(70%);
    }

    /* Text Styling */
    .main-title {
        font-size: 50px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
        margin-bottom: 10px;
    }

    .subtitle {
        font-size: 20px;
        text-align: center;
        color: #ffcc00;
        font-weight: bold;
        margin-bottom: 30px;
    }

    .upload-box {
        border: 3px dashed #ff914d;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        background: rgba(255, 255, 255, 0.9);
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    .prediction-box {
        padding: 20px;
        border-radius: 15px;
        background: #ff914d;
        color: white;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin-top: 20px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    }

    </style>

    <div class="background-container">
        <video autoplay loop muted>
            <source src="https://videos.pexels.com/video-files/856711/856711-hd_1280_720_24fps.mp4" type="video/mp4">
        </video>
    </div>
    """,
    unsafe_allow_html=True
)

# Sidebar
st.sidebar.image("https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg", width=200)
st.sidebar.title("🍊 Orange Quality Checker")
st.sidebar.write("Upload an image of an orange to check its quality.")

# Main Title
st.markdown("<div class='main-title'>🍊 Orange Quality Classification 🍊</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Upload an image of an orange, and our AI will classify its quality.</div>", unsafe_allow_html=True)

# File uploader
st.markdown("<div class='upload-box'>📤 Upload an Orange Image</div>", unsafe_allow_html=True)
uploaded_file = st.file_uploader("", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="📷 Uploaded Image", use_column_width=True)

    # Preprocess and predict
    img_array = preprocess_image(image)
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)
    confidence = np.max(prediction)

    # Display result with cool styling
    st.markdown(
        f"<div class='prediction-box'>🔥 Prediction: <b>{class_labels[predicted_class]}</b><br>🎯 Confidence: <b>{confidence * 100:.2f}%</b></div>",
        unsafe_allow_html=True
    )
