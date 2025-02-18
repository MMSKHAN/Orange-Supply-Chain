import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Load the trained model
model = tf.keras.models.load_model("orange_quality_model.h5")

# Define dataset path
test_dir = r"D:\coding\orangeChain\Ai\generative ai\Orange\Testing"  # Use original test set
IMG_SIZE = (224, 224)
BATCH_SIZE = 32  

# Create image data generator for testing
test_datagen = ImageDataGenerator(rescale=1./255)
test_generator = test_datagen.flow_from_directory(
    test_dir, target_size=IMG_SIZE, batch_size=BATCH_SIZE, class_mode='categorical', shuffle=False)

# Evaluate the model
loss, accuracy = model.evaluate(test_generator)
print(f" Test Accuracy: {accuracy * 100:.2f}%")

# Get predictions
predictions = model.predict(test_generator)
predicted_classes = np.argmax(predictions, axis=1)
true_classes = test_generator.classes
class_labels = list(test_generator.class_indices.keys())

# Generate classification report
print("\n Classification Report:")
print(classification_report(true_classes, predicted_classes, target_names=class_labels))

# Confusion matrix
conf_matrix = confusion_matrix(true_classes, predicted_classes)

# Print confusion matrix
print("\n Confusion Matrix:")
print(conf_matrix)

# Plotting the confusion matrix and heatmap
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Confusion Matrix
axes[0].imshow(conf_matrix, interpolation='nearest', cmap=plt.cm.Blues)
axes[0].set_title("Confusion Matrix")
axes[0].set_xlabel('Predicted')
axes[0].set_ylabel('True')
axes[0].set_xticks(np.arange(len(class_labels)))
axes[0].set_yticks(np.arange(len(class_labels)))
axes[0].set_xticklabels(class_labels, rotation=45)
axes[0].set_yticklabels(class_labels)
for i in range(len(class_labels)):
    for j in range(len(class_labels)):
        axes[0].text(j, i, conf_matrix[i, j], ha="center", va="center", color="red")
        
# Heatmap
sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues", xticklabels=class_labels, yticklabels=class_labels, ax=axes[1])
axes[1].set_title("Confusion Matrix Heatmap")
axes[1].set_xlabel('Predicted')
axes[1].set_ylabel('True')

plt.tight_layout()
plt.show()
