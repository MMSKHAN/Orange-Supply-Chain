import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

def create_model():
    # Define input shape
    IMG_SIZE = (224, 224, 3)

    # Load MobileNetV2 (excluding top layer)
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=IMG_SIZE)

    # Freeze base model layers
    base_model.trainable = False

    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)  # Reduce dimensions
    x = Dense(128, activation='relu')(x)  # Fully connected layer
    x = Dense(3, activation='softmax')(x)  # Output layer (3 classes)

    # Define final model
    model = Model(inputs=base_model.input, outputs=x)

    # Compile the model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    return model
