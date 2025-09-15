import os
import sys
from PIL import Image, ImageDraw, ImageFont
import numpy as np

def create_gradient_background(width, height, colors):
    """Create a gradient background"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # Create horizontal gradient
    for y in range(height):
        ratio = y / height
        r = int(colors[0][0] * (1 - ratio) + colors[1][0] * ratio)
        g = int(colors[0][1] * (1 - ratio) + colors[1][1] * ratio)
        b = int(colors[0][2] * (1 - ratio) + colors[1][2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def draw_medical_cross(draw, x, y, size, color):
    """Draw a medical cross symbol"""
    # Vertical bar
    draw.rectangle([x - size//6, y - size//2, x + size//6, y + size//2], fill=color)
    # Horizontal bar
    draw.rectangle([x - size//2, y - size//6, x + size//2, y + size//6], fill=color)

def draw_ai_brain_circuit(draw, x, y, size, color):
    """Draw a simplified AI brain circuit"""
    # Draw brain outline (ellipse)
    draw.ellipse([x - size//2, y - size//3, x + size//2, y + size//3], outline=color, width=3)
    
    # Draw neural network nodes
    nodes = [
        (x - size//3, y - size//6),
        (x + size//3, y - size//6),
        (x - size//4, y),
        (x + size//4, y),
        (x - size//3, y + size//6),
        (x + size//3, y + size//6)
    ]
    
    for node in nodes:
        draw.ellipse([node[0] - 3, node[1] - 3, node[0] + 3, node[1] + 3], fill=color)
    
    # Draw connections
    for i, node1 in enumerate(nodes):
        for j, node2 in enumerate(nodes[i+1:], i+1):
            draw.line([node1, node2], fill=color, width=2)

def create_main_logo():
    """Create main logo (800x200)"""
    width, height = 800, 200
    
    # Brand colors
    primary_color = (102, 126, 234)  # #667eea
    secondary_color = (118, 75, 162)  # #764ba2
    accent_color = (30, 188, 183)    # #1EBCB7
    white = (255, 255, 255)
    
    # Create gradient background
    image = create_gradient_background(width, height, [primary_color, secondary_color])
    draw = ImageDraw.Draw(image)
    
    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("arial.ttf", 48)
        subtitle_font = ImageFont.truetype("arial.ttf", 20)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Draw medical cross on the left
    draw_medical_cross(draw, 80, height//2, 40, white)
    
    # Draw AI brain on the right
    draw_ai_brain_circuit(draw, width - 120, height//2, 35, accent_color)
    
    # Draw main text
    title_text = "MediXScan"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, height//2 - 35), title_text, fill=white, font=title_font)
    
    # Draw subtitle
    subtitle_text = "AI-Powered Radiology Intelligence"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, height//2 + 15), subtitle_text, fill=(240, 248, 255), font=subtitle_font)
    
    return image

def create_hero_background():
    """Create hero background (1600x900)"""
    width, height = 1600, 900
    
    # Brand colors
    primary_color = (102, 126, 234)
    secondary_color = (118, 75, 162)
    dark_color = (31, 41, 55)
    accent_color = (30, 188, 183)
    white = (255, 255, 255)
    
    # Create complex gradient
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # Create diagonal gradient
    for y in range(height):
        for x in range(width):
            ratio_x = x / width
            ratio_y = y / height
            combined_ratio = (ratio_x + ratio_y) / 2
            
            r = int(primary_color[0] * (1 - combined_ratio) + dark_color[0] * combined_ratio)
            g = int(primary_color[1] * (1 - combined_ratio) + dark_color[1] * combined_ratio)
            b = int(primary_color[2] * (1 - combined_ratio) + dark_color[2] * combined_ratio)
            
            draw.point((x, y), fill=(r, g, b))
    
    # Add overlay pattern
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Draw grid pattern
    for x in range(0, width, 100):
        overlay_draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 20), width=1)
    for y in range(0, height, 100):
        overlay_draw.line([(0, y), (width, y)], fill=(255, 255, 255, 20), width=1)
    
    image = Image.alpha_composite(image.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(image)
    
    # Central logo area
    center_x, center_y = width // 2, height // 2 - 100
    
    # Background circle for logo
    draw.ellipse([center_x - 150, center_y - 150, center_x + 150, center_y + 150], 
                fill=(255, 255, 255, 25))
    
    # Large medical cross
    draw_medical_cross(draw, center_x - 80, center_y, 60, white)
    
    # Large AI brain
    draw_ai_brain_circuit(draw, center_x + 80, center_y, 55, accent_color)
    
    # Try to use larger fonts
    try:
        title_font = ImageFont.truetype("arial.ttf", 72)
        subtitle_font = ImageFont.truetype("arial.ttf", 32)
        tagline_font = ImageFont.truetype("arial.ttf", 24)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()
    
    # Main title
    title_text = "MediXScan AI"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, center_y + 150), title_text, fill=white, font=title_font)
    
    # Subtitle
    subtitle_text = "Advanced Radiology Intelligence Platform"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, center_y + 220), subtitle_text, fill=(240, 248, 255), font=subtitle_font)
    
    # Tagline
    tagline_text = "HIPAA Compliant • 99.7% Accuracy • Real-time AI Analysis"
    tagline_bbox = draw.textbbox((0, 0), tagline_text, font=tagline_font)
    tagline_width = tagline_bbox[2] - tagline_bbox[0]
    tagline_x = (width - tagline_width) // 2
    draw.text((tagline_x, center_y + 270), tagline_text, fill=accent_color, font=tagline_font)
    
    return image

def create_white_logo():
    """Create white background logo (800x200)"""
    width, height = 800, 200
    
    # Colors
    primary_color = (102, 126, 234)
    accent_color = (30, 188, 183)
    dark_color = (31, 41, 55)
    white = (255, 255, 255)
    
    # Create white background
    image = Image.new('RGB', (width, height), white)
    draw = ImageDraw.Draw(image)
    
    # Try to use fonts
    try:
        title_font = ImageFont.truetype("arial.ttf", 48)
        subtitle_font = ImageFont.truetype("arial.ttf", 20)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Draw medical cross on the left
    draw_medical_cross(draw, 80, height//2, 40, primary_color)
    
    # Draw AI brain on the right
    draw_ai_brain_circuit(draw, width - 120, height//2, 35, accent_color)
    
    # Draw main text
    title_text = "MediXScan"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, height//2 - 35), title_text, fill=dark_color, font=title_font)
    
    # Draw subtitle
    subtitle_text = "AI-Powered Radiology Intelligence"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, height//2 + 15), subtitle_text, fill=primary_color, font=subtitle_font)
    
    return image

def create_app_icon():
    """Create app icon (512x512)"""
    size = 512
    
    # Brand colors
    primary_color = (102, 126, 234)
    secondary_color = (118, 75, 162)
    accent_color = (30, 188, 183)
    white = (255, 255, 255)
    dark_color = (31, 41, 55)
    
    # Create radial gradient background
    image = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(image)
    
    center = size // 2
    max_radius = center
    
    for radius in range(max_radius, 0, -1):
        ratio = radius / max_radius
        r = int(accent_color[0] * (1 - ratio) + primary_color[0] * ratio * 0.7 + secondary_color[0] * ratio * 0.3)
        g = int(accent_color[1] * (1 - ratio) + primary_color[1] * ratio * 0.7 + secondary_color[1] * ratio * 0.3)
        b = int(accent_color[2] * (1 - ratio) + primary_color[2] * ratio * 0.7 + secondary_color[2] * ratio * 0.3)
        
        draw.ellipse([center - radius, center - radius, center + radius, center + radius], 
                    fill=(r, g, b))
    
    # Draw rounded rectangle overlay
    margin = 30
    corner_radius = 80
    
    # Create mask for rounded corners
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([margin, margin, size - margin, size - margin], 
                               radius=corner_radius, fill=255)
    
    # Apply mask
    image.putalpha(mask)
    final_image = Image.new('RGB', (size, size), white)
    final_image.paste(image, mask=mask)
    
    draw = ImageDraw.Draw(final_image)
    
    # Central medical cross
    draw_medical_cross(draw, center, center, 80, white)
    
    # AI circuit overlay (smaller)
    draw_ai_brain_circuit(draw, center + 40, center - 40, 30, dark_color)
    
    return final_image

def main():
    """Main function to create all logos"""
    print("🎨 Creating MediXScan AI Professional Logo Suite...")
    
    # Create output directory
    output_dir = r"d:\radiology_v2\frontend\public\assets\images"
    os.makedirs(output_dir, exist_ok=True)
    
    # Create and save main logo
    print("📸 Creating main logo (800x200)...")
    main_logo = create_main_logo()
    main_logo.save(os.path.join(output_dir, "medixscan-logo-main.png"), "PNG", quality=95)
    
    # Create and save hero background
    print("🖼️ Creating hero background (1600x900)...")
    hero_bg = create_hero_background()
    hero_bg.save(os.path.join(output_dir, "medixscan-hero-1600x900.png"), "PNG", quality=95)
    
    # Create and save white logo
    print("⚪ Creating white logo (800x200)...")
    white_logo = create_white_logo()
    white_logo.save(os.path.join(output_dir, "medixscan-logo-white.png"), "PNG", quality=95)
    
    # Create and save app icon
    print("📱 Creating app icon (512x512)...")
    app_icon = create_app_icon()
    app_icon.save(os.path.join(output_dir, "medixscan-icon-512.png"), "PNG", quality=95)
    
    # Also save as favicon
    favicon = app_icon.resize((64, 64), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(output_dir, "favicon.ico"), "ICO")
    
    print("✅ All logos created successfully!")
    print(f"📁 Saved to: {output_dir}")
    
    # List created files
    created_files = [
        "medixscan-logo-main.png",
        "medixscan-hero-1600x900.png", 
        "medixscan-logo-white.png",
        "medixscan-icon-512.png",
        "favicon.ico"
    ]
    
    print("\n📋 Created files:")
    for file in created_files:
        print(f"   - {file}")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("⚠️ PIL (Pillow) library not found. Installing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        main()
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please ensure you have Python and PIL/Pillow installed.")
