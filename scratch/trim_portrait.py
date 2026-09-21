import sys
from PIL import Image

def trim_transparent(image_path, output_path):
    print(f"Opening {image_path}...")
    img = Image.open(image_path).convert("RGBA")
    
    # Get bounding box of non-zero alpha
    bbox = img.getbbox()
    if bbox:
        print(f"Original size: {img.size}")
        print(f"Bounding box: {bbox}")
        left, top, right, bottom = bbox
        print(f"Padding removed: Left: {left}, Top: {top}, Right: {img.width - right}, Bottom: {img.height - bottom}")
        
        trimmed_img = img.crop(bbox)
        print(f"Trimmed size: {trimmed_img.size}")
        
        trimmed_img.save(output_path, "WEBP", lossless=True)
        print(f"Saved trimmed image to {output_path}")
    else:
        print("Image is entirely transparent or bounding box not found.")

if __name__ == "__main__":
    input_file = r"C:\KUMARS-SPACE-ORIGINAL\SasiKumar-Portfolio\public\logos\sasi-portrait-new-cutout.webp"
    output_file = r"C:\KUMARS-SPACE-ORIGINAL\SasiKumar-Portfolio\public\logos\sasi-portrait-new-trimmed.webp"
    trim_transparent(input_file, output_file)
