import random
import requests
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.db import transaction

# REPLACE 'nextCart.models' with your actual app name
from nextCart.models import (
    Category, Product, ProductFeature, ProductDetail, 
    ProductSpecification, ProductQuality, Review
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with real, accurate test data using Unsplash images'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data generation...')
        
        # 1. Create Dummy User
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={'email': 'test@example.com', 'is_staff': True}
        )
        if created:
            user.set_password('password123')
            user.save()

        # 2. Define Real Data Sets with ACCURATE Unsplash URLs
        # I have mapped specific Unsplash photo IDs to ensure the image matches the text.
        
        datasets = [
            {
                "cat_name": "Clothes and Wear",
                "cat_slug": "clothes-wear",
                "search_choice": "CLOTHES",
                "products": [
                    {
                        "name": "Classic Denim Jacket",
                        "price": 59.99,
                        "desc": "A timeless classic denim jacket featuring button-up closure.",
                        "material": "98% Cotton, 2% Elastane",
                        "features": ["Vintage Wash", "Button Cuffs", "Slim Fit"],
                        "specs": {"Style": "Casual", "Season": "All Season", "Gender": "Unisex"},
                        "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Blue", "M"), ("Blue", "L")]
                    },
                    {
                        "name": "Oversized White T-Shirt",
                        "price": 25.00,
                        "desc": "Breathable and soft oversized t-shirt perfect for streetwear looks.",
                        "material": "100% Organic Cotton",
                        "features": ["Crew Neck", "Drop Shoulders", "Heavyweight"],
                        "specs": {"Pattern": "Solid", "Sleeve": "Short", "Fit": "Oversized"},
                        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
                        "variants": [("White", "L"), ("White", "XL")]
                    },
                    {
                        "name": "Slim Fit Chino Pants",
                        "price": 45.50,
                        "desc": "Versatile beige chinos that work for both office and casual weekends.",
                        "material": "Cotton Twill",
                        "features": ["Stretch Fabric", "4 Pockets", "Zip Fly"],
                        "specs": {"Rise": "Mid-Rise", "Occasion": "Smart Casual"},
                        "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Beige", "32"), ("Navy", "32")]
                    },
                    {
                        "name": "Summer Floral Dress",
                        "price": 39.99,
                        "desc": "Lightweight summer dress with a vibrant floral print.",
                        "material": "Rayon",
                        "features": ["Adjustable Straps", "Midi Length", "Flowy Hem"],
                        "specs": {"Neckline": "V-Neck", "Pattern": "Floral"},
                        "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Red", "S"), ("Red", "M")]
                    },
                    {
                        "name": "Red Running Sneakers",
                        "price": 89.00,
                        "desc": "High-performance sneakers designed for marathon runners.",
                        "material": "Mesh Upper, Rubber Sole",
                        "features": ["Breathable Mesh", "Memory Foam", "Shock Absorption"],
                        "specs": {"Activity": "Running", "Closure": "Lace-Up"},
                        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Red", "9 x 12 inch")] 
                    },
                ]
            },
            {
                "cat_name": "Electronics",
                "cat_slug": "electronics",
                "search_choice": "ELECTRONICS",
                "products": [
                    {
                        "name": "Noise Cancelling Headphones",
                        "price": 299.00,
                        "desc": "Industry-leading noise cancellation with 30-hour battery life.",
                        "material": "Plastic, Leatherette",
                        "features": ["Active Noise Cancellation", "Bluetooth 5.0"],
                        "specs": {"Battery": "30 Hours", "Connectivity": "Wireless"},
                        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")] # Assuming 'Standard' maps to a choice or blank
                    },
                    {
                        "name": "Titanium Smartphone",
                        "price": 999.00,
                        "desc": "Flagship smartphone with a sleek titanium design.",
                        "material": "Titanium, Glass",
                        "features": ["5G Capable", "OLED Display", "Triple Camera"],
                        "specs": {"Storage": "256GB", "Screen": "6.1 Inch"},
                        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                    {
                        "name": "4K Smart TV",
                        "price": 650.00,
                        "desc": "Experience cinematic visuals with this 55-inch 4K Smart TV.",
                        "material": "Plastic, Glass",
                        "features": ["HDR10+", "Voice Remote", "Streaming Apps"],
                        "specs": {"Resolution": "4K", "Refresh Rate": "60Hz"},
                        "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                    {
                        "name": "Mechanical Keyboard",
                        "price": 120.00,
                        "desc": "Tactile mechanical switches with RGB backlighting.",
                        "material": "Aluminum, PBT",
                        "features": ["Hot-swappable", "RGB Backlight"],
                        "specs": {"Switch Type": "Brown", "Layout": "75%"},
                        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Charcoal", "Standard")]
                    },
                    {
                        "name": "Digital SLR Camera",
                        "price": 850.00,
                        "desc": "Capture life's moments in stunning detail with this DSLR.",
                        "material": "Magnesium Alloy",
                        "features": ["24.2 MP Sensor", "4K Video", "Lens Included"],
                        "specs": {"ISO": "100-25600", "Focus": "Auto/Manual"},
                        "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                ]
            },
            {
                "cat_name": "Home Interiors",
                "cat_slug": "home-interiors",
                "search_choice": "HOME",
                "products": [
                    {
                        "name": "Velvet Accent Chair",
                        "price": 150.00,
                        "desc": "Add a touch of luxury with this green velvet armchair.",
                        "material": "Velvet, Wood",
                        "features": ["Ergonomic Design", "Gold Legs", "Soft Cushion"],
                        "specs": {"Color": "Emerald", "Max Load": "120kg"},
                        "image_url": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Emerald", "Standard")]
                    },
                    {
                        "name": "Minimalist Floor Lamp",
                        "price": 85.00,
                        "desc": "Sleek floor lamp with adjustable brightness.",
                        "material": "Metal, LED",
                        "features": ["Remote Control", "Energy Saving"],
                        "specs": {"Height": "150cm", "Voltage": "110-240V"},
                        "image_url": "https://images.unsplash.com/photo-1507473888900-52e1ad145986?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                    {
                        "name": "Cozy Duvet Cover",
                        "price": 60.00,
                        "desc": "Sleep in comfort with this soft duvet set.",
                        "material": "Cotton",
                        "features": ["Hypoallergenic", "Button Closure"],
                        "specs": {"Thread Count": "400", "Set": "3 Piece"},
                        "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
                        "variants": [("White", "L")]
                    },
                    {
                        "name": "Ceramic Vase",
                        "price": 35.00,
                        "desc": "Handcrafted ceramic vase with a textured matte finish.",
                        "material": "Ceramic",
                        "features": ["Handmade", "Waterproof"],
                        "specs": {"Height": "25cm", "Weight": "800g"},
                        "image_url": "https://images.unsplash.com/photo-1581783342308-f792ca11df53?auto=format&fit=crop&w=800&q=80",
                        "variants": [("White", "Standard")]
                    },
                    {
                        "name": "Cookware Set",
                        "price": 199.00,
                        "desc": "Complete kitchen cookware set.",
                        "material": "Aluminum, Non-Stick",
                        "features": ["Non-Stick", "Induction Compatible"],
                        "specs": {"Pieces": "10", "Dishwasher Safe": "Yes"},
                        "image_url": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                ]
            },
             {
                "cat_name": "Beauty & Health",
                "cat_slug": "beauty-health",
                "search_choice": "BEAUTY",
                "products": [
                    {
                        "name": "Hydrating Face Serum",
                        "price": 28.00,
                        "desc": "Hyaluronic acid serum for deep hydration.",
                        "material": "Liquid",
                        "features": ["Vegan", "Cruelty Free"],
                        "specs": {"Volume": "30ml", "Skin Type": "All"},
                        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
                        "variants": [("White", "S")]
                    },
                    {
                        "name": "Matte Lipstick",
                        "price": 18.50,
                        "desc": "Long-lasting matte lipstick.",
                        "material": "Cream",
                        "features": ["Waterproof", "High Pigment"],
                        "specs": {"Finish": "Matte", "Duration": "12 Hours"},
                        "image_url": "https://images.unsplash.com/photo-158649577744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Red", "Standard")]
                    },
                    {
                        "name": "Argan Shampoo",
                        "price": 22.00,
                        "desc": "Sulfate-free shampoo infused with Argan oil.",
                        "material": "Liquid Gel",
                        "features": ["Sulfate Free", "Color Safe"],
                        "specs": {"Volume": "500ml", "Hair Type": "Dry"},
                        "image_url": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Gold", "M")]
                    },
                    {
                        "name": "Luxury Perfume",
                        "price": 85.00,
                        "desc": "A floral woody musk fragrance.",
                        "material": "Glass Bottle",
                        "features": ["High Concentration", "Signature Scent"],
                        "specs": {"Volume": "100ml", "Origin": "France"},
                        "image_url": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Gold", "Standard")]
                    },
                     {
                        "name": "Face Cream",
                        "price": 32.00,
                        "desc": "Brightening moisturizer tailored to reduce dark spots.",
                        "material": "Cream",
                        "features": ["Antioxidant Rich", "SPF 15"],
                        "specs": {"Volume": "50ml", "Time": "Day/Night"},
                        "image_url": "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80",
                        "variants": [("White", "S")]
                    },
                ]
            },
             {
                "cat_name": "Sports & Outdoors",
                "cat_slug": "sports-outdoors",
                "search_choice": "SPORTS",
                "products": [
                    {
                        "name": "Yoga Mat",
                        "price": 24.99,
                        "desc": "Eco-friendly yoga mat with carry strap.",
                        "material": "TPE",
                        "features": ["Anti-Tear", "Lightweight"],
                        "specs": {"Thickness": "6mm", "Length": "183cm"},
                        "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Purple", "Standard")]
                    },
                    {
                        "name": "Gym Dumbbells",
                        "price": 199.00,
                        "desc": "Heavy duty dumbbells for home workouts.",
                        "material": "Steel, Rubber",
                        "features": ["Rubber Grip", "Hex Shape"],
                        "specs": {"Weight": "20lbs", "Sold As": "Pair"},
                        "image_url": "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                    {
                        "name": "Camping Tent",
                        "price": 145.00,
                        "desc": "Waterproof dome tent for camping.",
                        "material": "Polyester",
                        "features": ["Easy Setup", "Rainfly Included"],
                        "specs": {"Capacity": "4 People", "Season": "3-Season"},
                        "image_url": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Green", "Standard")]
                    },
                    {
                        "name": "Mountain Bike",
                        "price": 450.00,
                        "desc": "Hardtail mountain bike with disc brakes.",
                        "material": "Aluminum Alloy",
                        "features": ["21 Speed", "Front Suspension"],
                        "specs": {"Wheel Size": "29 inch", "Brakes": "Disc"},
                        "image_url": "https://images.unsplash.com/photo-1576435728678-38d01d52e3a3?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Black", "Standard")]
                    },
                    {
                        "name": "Water Bottle",
                        "price": 25.00,
                        "desc": "Vacuum insulated stainless steel bottle.",
                        "material": "Stainless Steel",
                        "features": ["Leak Proof", "BPA Free"],
                        "specs": {"Capacity": "32oz", "Insulation": "24 Hours"},
                        "image_url": "https://images.unsplash.com/photo-1602143407151-011141959309?auto=format&fit=crop&w=800&q=80",
                        "variants": [("Silver", "Standard")]
                    },
                ]
            }
        ]

        # Helper to download and save image
        def save_image_from_url(url, title):
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    # Create a valid filename from title
                    filename = f"{slugify(title)}.jpg"
                    return ContentFile(response.content, name=filename)
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Failed to download image for {title}: {e}"))
            return None

        # 3. Execution Loop
        with transaction.atomic():
            # Clear old data if you want to start fresh:
            # self.stdout.write('Deleting old data...')
            # Product.objects.all().delete()
            # Category.objects.all().delete()

            for data in datasets:
                self.stdout.write(f"Processing Category: {data['cat_name']}")
                
                category, _ = Category.objects.get_or_create(
                    slug=data['cat_slug'],
                    defaults={'name': data['cat_name']}
                )

                for prod_data in data['products']:
                    p_name = prod_data['name']
                    self.stdout.write(f"  - Creating Product: {p_name}")
                    
                    product = Product.objects.create(
                        name=p_name,
                        title=p_name,
                        slug=slugify(p_name),
                        description=prod_data['desc'],
                        price=prod_data['price'],
                        stock=random.randint(10, 100),
                        is_active=True,
                        category=category,
                        search_categories=data['search_choice'],
                        default_size="M",
                        default_color="Black",
                        materials=prod_data['material'],
                        care_instructions="Hand wash or wipe clean.",
                        rating_count=random.randint(1, 50)
                    )

                    # Download and Attach Main Image
                    img_file = save_image_from_url(prod_data['image_url'], p_name)
                    if img_file:
                        product.image = img_file
                        product.save()

                    # Features
                    for feat in prod_data['features']:
                        ProductFeature.objects.create(product=product, feature=feat)

                    # Details
                    ProductDetail.objects.create(
                        product=product,
                        material=prod_data['material'],
                        core="Standard",
                        origin="Imported",
                        weight="1kg"
                    )

                    # Specifications
                    order = 1
                    for k, v in prod_data['specs'].items():
                        ProductSpecification.objects.create(
                            product=product, key=k, value=v, order=order
                        )
                        order += 1

                    # Variants (ProductQuality)
                    for variant in prod_data['variants']:
                        color_name, size_name = variant
                        
                        # Validate choices (simple check to avoid errors if strict validation is on)
                        valid_colors = dict(ProductQuality.COLOR_CHOICES)
                        valid_sizes = dict(ProductQuality.SIZE_CHOICES)

                        c_val = color_name if color_name in valid_colors else None
                        s_val = size_name if size_name in valid_sizes else None
                        
                        pq = ProductQuality(
                            product=product,
                            color=c_val,
                            size=s_val
                        )
                        
                        # Ideally, variants have different images (e.g., Red vs Blue). 
                        # For now, we reuse the main accurate image to avoid 404s/bad searches.
                        # You can create a copy of the content file if needed, 
                        # or re-download if you want separate file instances.
                        if img_file:
                             # We re-download or seek to 0 if reusing file object directly isn't supported by storage backend easily
                             # Easiest way in script: just save the same content
                             pq.image.save(f"variant_{slugify(p_name)}_{color_name}.jpg", img_file)
                        
                        pq.save()

                    # Reviews
                    review_texts = [
                        "Absolutely love this!",
                        "Great quality, fast shipping.",
                        "Good, but expected slightly different texture.",
                        "Worth the money.",
                        "Five stars!"
                    ]
                    
                    for _ in range(3):
                        Review.objects.create(
                            product=product,
                            user=user,
                            rating=random.randint(4, 5),
                            comment=random.choice(review_texts),
                            helpful_votes=random.randint(0, 5)
                        )
                        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with high-quality Unsplash data!'))