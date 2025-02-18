from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io

# Load the trained model
model = tf.keras.models.load_model("orange_quality_model.h5")

# Define class labels
class_labels = [
    "Class 1 Orange - A1 (Quality is Awesome)",
    "Class 2 Orange - A2 (Quality is Normal)",
    "Bad Quality (Rotten)"
]

# Function to preprocess the image
def preprocess_image(image):
    img = np.array(image)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Define route for image prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Open image and check for any file issues
        image = Image.open(file.stream)
        img_array = preprocess_image(image)

        # Perform prediction
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)
        confidence = np.max(prediction)

        # Convert the confidence value to a standard float type
        confidence = float(confidence)

        result = {
            "prediction": class_labels[predicted_class],
            "confidence": confidence * 100  # Multiply by 100 for percentage
        }
        return jsonify(result)

    except Exception as e:
        # Log error details
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
