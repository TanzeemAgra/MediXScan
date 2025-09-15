import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def create_gradient_background(width, height, colors):
    """Create a gradient background"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # Create diagonal gradient for more professional look
    for y in range(height):
        for x in range(width):
            # Create diagonal gradient
            ratio_x = x / width
            ratio_y = y / height
            combined_ratio = (ratio_x * 0.7 + ratio_y * 0.3)
            
            r = int(colors[0][0] * (1 - combined_ratio) + colors[1][0] * combined_ratio)
            g = int(colors[0][1] * (1 - combined_ratio) + colors[1][1] * combined_ratio)
            b = int(colors[0][2] * (1 - combined_ratio) + colors[1][2] * combined_ratio)
            
            draw.point((x, y), fill=(r, g, b))
    
    return image

def draw_subtle_medical_pattern(draw, width, height, color, alpha=20):
    """Draw subtle medical/tech pattern for background texture"""
    # Create subtle grid pattern
    for x in range(0, width, 100):
        draw.line([(x, 0), (x, height)], fill=color + (alpha,), width=1)
    for y in range(0, height, 100):
        draw.line([(0, y), (width, y)], fill=color + (alpha,), width=1)
    
    # Add subtle medical cross pattern in corners
    cross_size = 30
    positions = [
        (50, 50),           # Top left
        (width - 80, 50),   # Top right
        (50, height - 80),  # Bottom left
        (width - 80, height - 80)  # Bottom right
    ]
    
    for x, y in positions:
        # Vertical line
        draw.line([(x, y - cross_size//2), (x, y + cross_size//2)], fill=color + (alpha,), width=2)
        # Horizontal line  
        draw.line([(x - cross_size//2, y), (x + cross_size//2, y)], fill=color + (alpha,), width=2)

def draw_tech_circuit_pattern(overlay_draw, width, height):
    """Draw subtle tech circuit pattern"""
    circuit_color = (255, 255, 255, 15)  # Very subtle white
    
    # Draw circuit lines in corners
    corners = [
        {"x": 60, "y": 60, "direction": "bottom-right"},
        {"x": width - 60, "y": 60, "direction": "bottom-left"}, 
        {"x": 60, "y": height - 60, "direction": "top-right"},
        {"x": width - 60, "y": height - 60, "direction": "top-left"}
    ]
    
    for corner in corners:
        x, y = corner["x"], corner["y"]
        
        # Draw L-shaped circuit lines
        overlay_draw.line([(x - 40, y), (x, y)], fill=circuit_color, width=2)
        overlay_draw.line([(x, y), (x, y - 40)], fill=circuit_color, width=2)
        
        # Add small nodes
        overlay_draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=circuit_color)

def create_clean_hero_background():
    """Create clean hero background without text overlays (1600x900)"""
    width, height = 1600, 900
    
    # Professional brand colors
    primary_color = (102, 126, 234)    # #667eea
    secondary_color = (118, 75, 162)   # #764ba2
    dark_color = (31, 41, 55)          # #1F2937
    accent_color = (30, 188, 183)      # #1EBCB7
    
    # Create professional gradient background
    image = create_gradient_background(width, height, [primary_color, dark_color])
    
    # Add overlay for patterns
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Add subtle medical grid pattern
    draw_subtle_medical_pattern(overlay_draw, width, height, (255, 255, 255), 25)
    
    # Add tech circuit patterns in corners only
    draw_tech_circuit_pattern(overlay_draw, width, height)
    
    # Combine base image with overlay
    final_image = Image.alpha_composite(image.convert('RGBA'), overlay).convert('RGB')
    
    # Add subtle vignette effect for professional look
    vignette = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)
    
    # Create radial vignette
    center_x, center_y = width // 2, height // 2
    max_radius = max(width, height) // 2
    
    for radius in range(max_radius, 0, -10):
        alpha = max(0, min(40, int((radius - max_radius * 0.7) * 0.5)))
        if alpha > 0:
            vignette_draw.ellipse([
                center_x - radius, center_y - radius,
                center_x + radius, center_y + radius
            ], fill=(0, 0, 0, alpha))
    
    # Apply vignette
    final_image = Image.alpha_composite(final_image.convert('RGBA'), vignette).convert('RGB')
    
    return final_image

def create_minimal_pattern_background():
    """Create minimal pattern background (1600x900)"""
    width, height = 1600, 900
    
    # Very subtle gradient
    primary = (102, 126, 234)
    secondary = (76, 90, 149)
    
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # Simple linear gradient
    for y in range(height):
        ratio = y / height
        r = int(primary[0] * (1 - ratio) + secondary[0] * ratio)
        g = int(primary[1] * (1 - ratio) + secondary[1] * ratio)
        b = int(primary[2] * (1 - ratio) + secondary[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Add very minimal geometric pattern
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Minimal dots pattern
    dot_color = (255, 255, 255, 10)
    spacing = 120
    
    for x in range(spacing, width, spacing):
        for y in range(spacing, height, spacing):
            overlay_draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=dot_color)
    
    final_image = Image.alpha_composite(image.convert('RGBA'), overlay).convert('RGB')
    return final_image

def create_solid_gradient_background():
    """Create simple solid gradient background (1600x900)"""
    width, height = 1600, 900
    
    # Brand colors for clean gradient
    start_color = (102, 126, 234)  # Primary blue
    end_color = (31, 41, 55)       # Professional dark
    
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # Create smooth gradient
    for y in range(height):
        ratio = y / height
        r = int(start_color[0] * (1 - ratio) + end_color[0] * ratio)
        g = int(start_color[1] * (1 - ratio) + end_color[1] * ratio)
        b = int(start_color[2] * (1 - ratio) + end_color[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def main():
    """Create clean professional backgrounds without text conflicts"""
    print("🎨 Creating Clean Professional Backgrounds...")
    
    output_dir = r"d:\radiology_v2\frontend\public\assets\images"
    os.makedirs(output_dir, exist_ok=True)
    
    # Create clean hero background (no text overlays)
    print("🖼️ Creating clean hero background (1600x900)...")
    clean_hero = create_clean_hero_background()
    clean_hero.save(os.path.join(output_dir, "medixscan-hero-clean-1600x900.png"), "PNG", quality=95)
    
    # Create minimal pattern background
    print("🔹 Creating minimal pattern background (1600x900)...")
    minimal_bg = create_minimal_pattern_background()
    minimal_bg.save(os.path.join(output_dir, "medixscan-hero-minimal-1600x900.png"), "PNG", quality=95)
    
    # Create solid gradient background
    print("🌅 Creating solid gradient background (1600x900)...")
    gradient_bg = create_solid_gradient_background()
    gradient_bg.save(os.path.join(output_dir, "medixscan-hero-gradient-1600x900.png"), "PNG", quality=95)
    
    print("✅ Clean backgrounds created successfully!")
    print(f"📁 Saved to: {output_dir}")
    
    print("\n📋 Created clean background options:")
    print("   - medixscan-hero-clean-1600x900.png (subtle patterns, no text)")
    print("   - medixscan-hero-minimal-1600x900.png (minimal dots pattern)")
    print("   - medixscan-hero-gradient-1600x900.png (pure gradient)")

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
