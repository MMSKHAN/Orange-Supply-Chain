import os
import random
import string
import numpy as np
from PIL import Image
import cv2
import albumentations as A

# Paths
input_folder = r"D:\coding\orangeChain\Ai\generative ai\Orange\Testing"  # Original images
# output_folder_resized = r"D:\coding\orangeChain\Ai\generative ai\Orange\Resize"  # Resized images
# output_folder_normalized = r"D:\coding\orangeChain\Ai\generative ai\Orange\Normalized"  # Normalized images
output_folder_augmented = r"D:\coding\orangeChain\Ai\generative ai\Orange\Training_Augmented"  # Augmented images

# Define image size
IMG_SIZE = (224, 224)

# Create output folders if they don't exist
os.makedirs(output_folder_augmented, exist_ok=True)

# Define augmentation pipeline
augment = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.RandomBrightnessContrast(p=0.5),
    A.Rotate(limit=30, p=0.5),
    A.GaussianBlur(p=0.3),
    A.Resize(224, 224)  # Keep image dimensions fixed
])

# Function to generate a random string for filenames
def generate_random_string(length=6):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

# Process each image in the input folder
for category in os.listdir(input_folder):
    category_path = os.path.join(input_folder, category)
    
    # Skip if not a directory
    if not os.path.isdir(category_path):  
        continue  

    # Prepare category directories in output folders
    output_category_path_augmented = os.path.join(output_folder_augmented, category)
    os.makedirs(output_category_path_augmented, exist_ok=True)

    # Process each image in the category folder
    for img_name in os.listdir(category_path):
        img_path = os.path.join(category_path, img_name)
        
        if os.path.isdir(img_path):  # Skip directories
            continue
        
        try:
            # Read the image
            img = Image.open(img_path)

            # Normalize image (convert to RGB and then to [0, 1] range)
            img = img.convert("RGB")
            img_array = np.array(img) / 255.0  # Normalize to [0, 1]
            img_array = (img_array * 255).astype(np.uint8)  # Convert back to uint8
            normalized_img_path = os.path.join(output_category_path_augmented, os.path.splitext(img_name)[0] + "_normalized.png")
            pil_img = Image.fromarray(img_array)
            pil_img.save(normalized_img_path)
            print(f"Normalized and saved: {normalized_img_path}")

            # Augment the normalized image using albumentations
            img_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            augmented = augment(image=img_cv)['image']
            
            # Generate a unique filename for augmented images
            random_suffix = generate_random_string()
            aug_img_name = f"aug_{random_suffix}_{img_name}"
            aug_img_path = os.path.join(output_category_path_augmented, aug_img_name)
            aug_img = Image.fromarray(augmented)
            aug_img.save(aug_img_path)
            print(f"Augmented and saved: {aug_img_path}")

        except Exception as e:
            print(f"Error processing {img_name}: {e}")

print("Image processing, normalization, and augmentation complete!")
