import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from model import create_model

# Define dataset paths
train_dir =  r"D:\coding\orangeChain\Ai\generative ai\Orange\Training_Augmented"  # Use augmented dataset
test_dir =  r"D:\coding\orangeChain\Ai\generative ai\Orange\Testing"  # Original testing dataset
IMG_SIZE = (224, 224)
BATCH_SIZE = 32  # Adjust based on your system memory

# Create image data generators
train_datagen = ImageDataGenerator(rescale=1./255)  # Normalize pixels
test_datagen = ImageDataGenerator(rescale=1./255)

# Load images
train_generator = train_datagen.flow_from_directory(
    train_dir, target_size=IMG_SIZE, batch_size=BATCH_SIZE, class_mode='categorical')

test_generator = test_datagen.flow_from_directory(
    test_dir, target_size=IMG_SIZE, batch_size=BATCH_SIZE, class_mode='categorical')

# Load model
model = create_model()

# Train the model
history = model.fit(train_generator, validation_data=test_generator, epochs=10)

# Save the trained model
model.save("orange_quality_model.h5")

print(" Model training complete! Saved as orange_quality_model.h5")
