import tensorflow as tf
import numpy as np
import cv2
import sys

# Load the trained model
model = tf.keras.models.load_model("orange_quality_model.h5")

# Define class labels (same order as training)
class_labels = ["Class 1(Good Quality)", "Class 2(Normal Quality)", "Orange Rotten(Bad Quality)"]

def preprocess_image(image_path):
    """Preprocess the input image for prediction."""
    img = cv2.imread(image_path)  # Load image
    img = cv2.resize(img, (224, 224))  # Resize to match model input
    img = img / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

def predict(image_path):
    """Make a prediction on the given image."""
    img = preprocess_image(image_path)
    prediction = model.predict(img)
    predicted_class = np.argmax(prediction)  # Get class index
    confidence = np.max(prediction)  # Get confidence score

    print(f"Predicted Quality: {class_labels[predicted_class]} (Confidence: {confidence*100:.2f}%)")

# Get image path from command line argument
if len(sys.argv) < 2:
    print("Usage: python predict.py <image_path>")
else:
    image_path = sys.argv[1]
    predict(image_path)
