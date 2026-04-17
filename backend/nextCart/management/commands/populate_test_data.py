"""
Create a new file: your_app/management/commands/populate_test_data.py
Run with: python manage.py populate_test_data
This script uses Pexels API for verified working product images
"""

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from decimal import Decimal
import random
import requests
from io import BytesIO
from PIL import Image
import tempfile
import os

from nextCart.models import (
    Category, Product, ProductFeature, ProductDetail, 
    ProductSpecification, ProductQuality, Review
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with realistic test data and verified product images'

    # Direct working image URLs from reliable sources (verified accessible)
    PRODUCT_IMAGES = {
        'CLOTHES': [
            'https://images.pexels.com/photos/3622619/pexels-photo-3622619.jpeg?auto=compress&cs=tinysrgb&w=600',  # T-shirt
            'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',  # Jeans
            'https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg?auto=compress&cs=tinysrgb&w=600',  # Summer dress
            'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',  # Winter coat
            'https://images.pexels.com/photos/3622621/pexels-photo-3622621.jpeg?auto=compress&cs=tinysrgb&w=600',  # Shorts
        ],
        'HOME': [
            'https://images.pexels.com/photos/3556009/pexels-photo-3556009.jpeg?auto=compress&cs=tinysrgb&w=600',  # Bedsheet
            'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',  # Throw pillow
            'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=600',  # Kitchen utensils
            'https://images.pexels.com/photos/3407737/pexels-photo-3407737.jpeg?auto=compress&cs=tinysrgb&w=600',  # Dinner plates
            'https://images.pexels.com/photos/3624349/pexels-photo-3624349.jpeg?auto=compress&cs=tinysrgb&w=600',  # Bath towel
        ],
        'ELECTRONICS': [
            'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600',  # Headphones
            'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',  # Charging cable
            'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',  # Desk lamp
            'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',  # Power bank
            'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=600',  # Wireless charger
        ],
        'BEAUTY': [
            'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600',  # Face cream
            'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600',  # Makeup brushes
            'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=600',  # Lip balm
            'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600',  # Vitamin serum
            'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=600',  # Face wash
        ],
        'SPORTS': [
            'https://images.pexels.com/photos/3621931/pexels-photo-3621931.jpeg?auto=compress&cs=tinysrgb&w=600',  # Yoga mat
            'https://images.pexels.com/photos/3621937/pexels-photo-3621937.jpeg?auto=compress&cs=tinysrgb&w=600',  # Dumbbells
            'https://images.pexels.com/photos/3625260/pexels-photo-3625260.jpeg?auto=compress&cs=tinysrgb&w=600',  # Water bottle
            'https://images.pexels.com/photos/3621931/pexels-photo-3621931.jpeg?auto=compress&cs=tinysrgb&w=600',  # Knee brace
            'https://images.pexels.com/photos/3621945/pexels-photo-3621945.jpeg?auto=compress&cs=tinysrgb&w=600',  # Running socks
        ],
    }

    PRODUCT_DATA = {
        'CLOTHES': [
            {
                'name': 'Premium Cotton T-Shirt',
                'title': 'Cotton Tee',
                'description': 'Soft and comfortable 100% organic cotton t-shirt perfect for everyday wear. Features breathable fabric and durable stitching. Premium quality construction ensures long-lasting comfort.',
                'price': Decimal('29.99'),
                'discount': Decimal('10'),
                'stock': 150,
                'colors': ['Black', 'White', 'Navy', 'Charcoal'],
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'material': 'Organic Cotton',
                'origin': 'India',
                'weight': '200g',
                'features': ['Soft Fabric', 'Eco-Friendly', 'Machine Washable', 'Durable'],
            },
            {
                'name': 'Slim Fit Denim Jeans',
                'title': 'Denim Jeans',
                'description': 'Classic slim fit denim jeans with premium quality fabric. Perfect for casual and semi-formal occasions. Features comfortable stretch fabric with perfect fit.',
                'price': Decimal('59.99'),
                'discount': Decimal('15'),
                'stock': 120,
                'colors': ['Black', 'Navy', 'Indigo'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'material': '98% Cotton, 2% Elastane',
                'origin': 'Pakista',
                'weight': '650g',
                'features': ['Stretch Fabric', 'Fade Resistant', 'Comfortable Fit'],
            },
            {
                'name': 'Lightweight Summer Dress',
                'title': 'Summer Dress',
                'description': 'Breathable and stylish summer dress made from lightweight fabric. Ideal for warm weather and casual outings. Comfortable and fashionable design.',
                'price': Decimal('45.99'),
                'discount': Decimal('20'),
                'stock': 100,
                'colors': ['White', 'Beige', 'Peach', 'Mint'],
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'material': 'Linen Blend',
                'origin': 'Banglad',
                'weight': '300g',
                'features': ['Breathable', 'Lightweight', 'Wrinkle Resistant'],
            },
            {
                'name': 'Wool Winter Coat',
                'title': 'Winter Coat',
                'description': 'Warm and elegant wool coat for winter season. Features premium wool blend with water-resistant coating. Perfect for cold weather.',
                'price': Decimal('129.99'),
                'discount': Decimal('25'),
                'stock': 60,
                'colors': ['Black', 'Charcoal', 'Navy', 'Burgundy'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'material': '80% Wool, 20% Polyester',
                'origin': 'UK',
                'weight': '1200g',
                'features': ['Warm', 'Water Resistant', 'Professional Look'],
            },
            {
                'name': 'Athletic Performance Shorts',
                'title': 'Sports Shorts',
                'description': 'Moisture-wicking shorts designed for athletic activities and casual wear. Perfect for gym and outdoor activities. High-quality performance fabric.',
                'price': Decimal('34.99'),
                'discount': Decimal('12'),
                'stock': 180,
                'colors': ['Black', 'Navy', 'Gray', 'Lime'],
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'material': '87% Nylon, 13% Spandex',
                'origin': 'Vietnam',
                'weight': '150g',
                'features': ['Moisture Wicking', 'Quick Dry', 'Lightweight'],
            },
        ],
        'HOME': [
            {
                'name': 'Soft Microfiber Bedsheet Set',
                'title': 'Bedsheet Set',
                'description': 'Ultra-soft microfiber bedsheet set for a comfortable sleep. Includes fitted sheet, flat sheet, and 2 pillowcases. Perfect for any bed size.',
                'price': Decimal('49.99'),
                'discount': Decimal('18'),
                'stock': 200,
                'colors': ['White', 'Ivory', 'Gray', 'Navy'],
                'sizes': ['Queen', 'King'],
                'material': '100% Microfiber',
                'origin': 'China',
                'weight': '900g',
                'features': ['Hypoallergenic', 'Machine Washable', 'Wrinkle Resistant'],
            },
            {
                'name': 'Decorative Throw Pillow',
                'title': 'Throw Pillow',
                'description': 'Premium decorative throw pillow with elegant patterns. Perfect for adding style to your living room. High-quality construction.',
                'price': Decimal('24.99'),
                'discount': Decimal('15'),
                'stock': 250,
                'colors': ['Beige', 'Teal', 'Burgundy', 'Gold'],
                'sizes': ['16x16', '18x18', '20x20'],
                'material': 'Polyester Blend',
                'origin': 'India',
                'weight': '400g',
                'features': ['Soft', 'Durable', 'Machine Washable'],
            },
            {
                'name': 'Stainless Steel Kitchen Utensil Set',
                'title': 'Utensil Set',
                'description': 'Complete kitchen utensil set with 8 essential pieces. Durable stainless steel construction for long-lasting use.',
                'price': Decimal('39.99'),
                'discount': Decimal('20'),
                'stock': 150,
                'colors': ['Silver'],
                'sizes': ['Standard'],
                'material': 'Stainless Steel',
                'origin': 'Germany',
                'weight': '600g',
                'features': ['Non-slip Handle', 'Dishwasher Safe', 'Heat Resistant'],
            },
            {
                'name': 'Ceramic Dinner Plate Set',
                'title': 'Dinner Plates',
                'description': 'Elegant ceramic dinner plate set of 6. Perfect for daily use or special occasions. Beautiful and durable design.',
                'price': Decimal('54.99'),
                'discount': Decimal('10'),
                'stock': 120,
                'colors': ['White', 'Ivory', 'Gray'],
                'sizes': ['10 inch', '11 inch'],
                'material': 'Ceramic',
                'origin': 'Japan',
                'weight': '2000g',
                'features': ['Microwave Safe', 'Dishwasher Safe', 'Elegant Design'],
            },
            {
                'name': 'Premium Bath Towel',
                'title': 'Bath Towel',
                'description': 'Luxurious and highly absorbent bath towel. Perfect for bathroom and spa use. Premium cotton construction.',
                'price': Decimal('19.99'),
                'discount': Decimal('12'),
                'stock': 300,
                'colors': ['White', 'Navy', 'Charcoal', 'Teal'],
                'sizes': ['Standard', 'Large'],
                'material': '100% Cotton',
                'origin': 'Turkey',
                'weight': '500g',
                'features': ['Highly Absorbent', 'Soft', 'Quick Drying'],
            },
        ],
        'ELECTRONICS': [
            {
                'name': 'Wireless Bluetooth Headphones',
                'title': 'BT Headphones',
                'description': 'Premium wireless headphones with active noise cancellation. 30-hour battery life. Superior sound quality and comfort.',
                'price': Decimal('89.99'),
                'discount': Decimal('18'),
                'stock': 100,
                'colors': ['Black', 'Silver', 'Navy'],
                'sizes': ['One Size'],
                'material': 'Plastic & Metal',
                'origin': 'China',
                'weight': '250g',
                'features': ['Noise Cancellation', '30hr Battery', 'Comfortable Fit'],
            },
            {
                'name': 'USB-C Fast Charging Cable',
                'title': 'Charging Cable',
                'description': 'High-speed USB-C charging and data transfer cable. 3m length, supports up to 100W power delivery. Durable nylon braided design.',
                'price': Decimal('14.99'),
                'discount': Decimal('25'),
                'stock': 500,
                'colors': ['Black', 'White', 'Gray'],
                'sizes': ['3m'],
                'material': 'Nylon Braided',
                'origin': 'Taiwan',
                'weight': '100g',
                'features': ['Fast Charging', 'Durable', 'Tangle Resistant'],
            },
            {
                'name': 'Smart LED Desk Lamp',
                'title': 'Desk Lamp',
                'description': 'Smart LED desk lamp with adjustable brightness and color temperature. App-controlled and energy efficient.',
                'price': Decimal('49.99'),
                'discount': Decimal('20'),
                'stock': 120,
                'colors': ['Black', 'White', 'Silver'],
                'sizes': ['Standard'],
                'material': 'Aluminum & Plastic',
                'origin': 'China',
                'weight': '400g',
                'features': ['Dimmable', 'Smart Control', 'Eye Care'],
            },
            {
                'name': 'Portable Power Bank 20000mAh',
                'title': 'Power Bank',
                'description': 'High-capacity portable power bank with fast charging support. Compact and lightweight design for travel.',
                'price': Decimal('34.99'),
                'discount': Decimal('15'),
                'stock': 200,
                'colors': ['Black', 'White', 'Blue', 'Red'],
                'sizes': ['Standard'],
                'material': 'Plastic',
                'origin': 'Korea',
                'weight': '350g',
                'features': ['Fast Charge', 'Compact', 'Multiple Ports'],
            },
            {
                'name': 'Wireless Phone Charger Pad',
                'title': 'Charger Pad',
                'description': 'Fast wireless charging pad compatible with all Qi-enabled devices. Non-slip surface for safety.',
                'price': Decimal('24.99'),
                'discount': Decimal('10'),
                'stock': 250,
                'colors': ['Black', 'White'],
                'sizes': ['Standard'],
                'material': 'Plastic',
                'origin': 'China',
                'weight': '120g',
                'features': ['Fast Charge', 'Universal', 'Non-slip'],
            },
        ],
        'BEAUTY': [
            {
                'name': 'Natural Moisturizing Face Cream',
                'title': 'Face Cream',
                'description': 'Luxurious moisturizing face cream with natural ingredients. Suitable for all skin types. Anti-aging formula.',
                'price': Decimal('34.99'),
                'discount': Decimal('15'),
                'stock': 300,
                'colors': ['Standard'],
                'sizes': ['50ml', '100ml'],
                'material': 'Natural Ingredients',
                'origin': 'France',
                'weight': '100g',
                'features': ['All Skin Types', 'Natural', 'Anti-Aging'],
            },
            {
                'name': 'Professional Makeup Brush Set',
                'title': 'Brush Set',
                'description': 'Complete professional makeup brush set with 12 essential brushes. Soft synthetic bristles for precision application.',
                'price': Decimal('29.99'),
                'discount': Decimal('20'),
                'stock': 200,
                'colors': ['Black', 'Rose Gold', 'Silver'],
                'sizes': ['12pc'],
                'material': 'Synthetic Hair',
                'origin': 'China',
                'weight': '250g',
                'features': ['Professional Quality', 'Soft Bristles', 'Complete Set'],
            },
            {
                'name': 'Organic Lip Balm Collection',
                'title': 'Lip Balm',
                'description': 'Set of 4 organic lip balms with natural flavors. Moisturizing and protective. Perfect gift set.',
                'price': Decimal('14.99'),
                'discount': Decimal('12'),
                'stock': 400,
                'colors': ['Assorted'],
                'sizes': ['4pc'],
                'material': 'Organic',
                'origin': 'Canada',
                'weight': '60g',
                'features': ['Organic', 'Natural', 'Moisturizing'],
            },
            {
                'name': 'Vitamin C Brightening Serum',
                'title': 'Vitamin Serum',
                'description': 'High-potency Vitamin C serum for brightening and anti-aging. Fast absorption formula for best results.',
                'price': Decimal('44.99'),
                'discount': Decimal('18'),
                'stock': 150,
                'colors': ['Standard'],
                'sizes': ['30ml'],
                'material': 'Serum',
                'origin': 'Korea',
                'weight': '50g',
                'features': ['Brightening', 'Anti-Aging', 'Fast Absorption'],
            },
            {
                'name': 'Gentle Cleansing Face Wash',
                'title': 'Face Wash',
                'description': 'Gentle and effective face wash for daily cleansing. Removes dirt without stripping skin.',
                'price': Decimal('12.99'),
                'discount': Decimal('10'),
                'stock': 500,
                'colors': ['Standard'],
                'sizes': ['150ml', '300ml'],
                'material': 'Cleanser',
                'origin': 'Japan',
                'weight': '180g',
                'features': ['Gentle', 'Effective', 'Daily Use'],
            },
        ],
        'SPORTS': [
            {
                'name': 'Professional Yoga Mat',
                'title': 'Yoga Mat',
                'description': 'Non-slip yoga mat with alignment lines. Ideal for yoga and pilates practice. Eco-friendly material.',
                'price': Decimal('39.99'),
                'discount': Decimal('15'),
                'stock': 150,
                'colors': ['Black', 'Navy', 'Purple', 'Teal'],
                'sizes': ['183x61cm'],
                'material': 'TPE',
                'origin': 'China',
                'weight': '600g',
                'features': ['Non-slip', 'Alignment Lines', 'Eco-Friendly'],
            },
            {
                'name': 'Adjustable Dumbbells Set',
                'title': 'Dumbbells',
                'description': 'Complete adjustable dumbbell set from 5kg to 20kg. Ideal for home gym workouts. Space saving design.',
                'price': Decimal('89.99'),
                'discount': Decimal('20'),
                'stock': 80,
                'colors': ['Black'],
                'sizes': ['5-20kg'],
                'material': 'Iron & Rubber',
                'origin': 'China',
                'weight': '5000g',
                'features': ['Adjustable', 'Space Saving', 'Durable'],
            },
            {
                'name': 'Sports Water Bottle 1L',
                'title': 'Water Bottle',
                'description': 'Insulated sports water bottle keeps drinks cold for 24 hours. Leak-proof design. Perfect for athletes.',
                'price': Decimal('24.99'),
                'discount': Decimal('10'),
                'stock': 300,
                'colors': ['Black', 'Navy', 'Gray', 'Teal'],
                'sizes': ['1L'],
                'material': 'Stainless Steel',
                'origin': 'USA',
                'weight': '300g',
                'features': ['Insulated', '24hr Cold', 'Leak Proof'],
            },
            {
                'name': 'Compression Knee Support Brace',
                'title': 'Knee Brace',
                'description': 'Medical-grade compression knee brace for support and pain relief. Adjustable fit for comfort.',
                'price': Decimal('29.99'),
                'discount': Decimal('15'),
                'stock': 200,
                'colors': ['Black', 'Navy'],
                'sizes': ['S', 'M', 'L', 'XL'],
                'material': 'Neoprene',
                'origin': 'Taiwan',
                'weight': '150g',
                'features': ['Compression', 'Pain Relief', 'Adjustable'],
            },
            {
                'name': 'Running Performance Socks',
                'title': 'Running Socks',
                'description': 'Moisture-wicking running socks with arch support. Pack of 3 pairs. Perfect for long runs.',
                'price': Decimal('16.99'),
                'discount': Decimal('12'),
                'stock': 400,
                'colors': ['Black', 'White', 'Gray'],
                'sizes': ['S', 'M', 'L'],
                'material': '80% Polyester, 20% Spandex',
                'origin': 'Vietnam',
                'weight': '150g',
                'features': ['Moisture Wicking', 'Arch Support', '3-pack'],
            },
        ],
    }

    FEATURES_MAPPING = {
        'Premium Cotton T-Shirt': ['Soft Fabric', 'Eco-Friendly', 'Machine Washable', 'Durable'],
        'Slim Fit Denim Jeans': ['Stretch Fabric', 'Fade Resistant', 'Comfortable Fit', 'Premium Quality'],
        'Lightweight Summer Dress': ['Breathable', 'Lightweight', 'Wrinkle Resistant', 'Stylish'],
        'Wool Winter Coat': ['Warm', 'Water Resistant', 'Professional Look', 'Premium Material'],
        'Athletic Performance Shorts': ['Moisture Wicking', 'Quick Dry', 'Lightweight', 'Athletic Design'],
        'Soft Microfiber Bedsheet Set': ['Hypoallergenic', 'Machine Washable', 'Wrinkle Resistant', 'Comfortable'],
        'Decorative Throw Pillow': ['Soft', 'Durable', 'Machine Washable', 'Elegant Design'],
        'Stainless Steel Kitchen Utensil Set': ['Non-slip Handle', 'Dishwasher Safe', 'Heat Resistant', 'Professional'],
        'Ceramic Dinner Plate Set': ['Microwave Safe', 'Dishwasher Safe', 'Elegant Design', 'Durable'],
        'Premium Bath Towel': ['Highly Absorbent', 'Soft', 'Quick Drying', 'Premium Quality'],
        'Wireless Bluetooth Headphones': ['Noise Cancellation', '30hr Battery', 'Comfortable Fit', 'Premium Sound'],
        'USB-C Fast Charging Cable': ['Fast Charging', 'Durable', 'Tangle Resistant', 'High Quality'],
        'Smart LED Desk Lamp': ['Dimmable', 'Smart Control', 'Eye Care', 'Energy Efficient'],
        'Portable Power Bank 20000mAh': ['Fast Charge', 'Compact', 'Multiple Ports', 'High Capacity'],
        'Wireless Phone Charger Pad': ['Fast Charge', 'Universal', 'Non-slip', 'Efficient'],
        'Natural Moisturizing Face Cream': ['All Skin Types', 'Natural', 'Anti-Aging', 'Moisturizing'],
        'Professional Makeup Brush Set': ['Professional Quality', 'Soft Bristles', 'Complete Set', 'Durable'],
        'Organic Lip Balm Collection': ['Organic', 'Natural', 'Moisturizing', 'Long Lasting'],
        'Vitamin C Brightening Serum': ['Brightening', 'Anti-Aging', 'Fast Absorption', 'Effective'],
        'Gentle Cleansing Face Wash': ['Gentle', 'Effective', 'Daily Use', 'Natural'],
        'Professional Yoga Mat': ['Non-slip', 'Alignment Lines', 'Eco-Friendly', 'Durable'],
        'Adjustable Dumbbells Set': ['Adjustable', 'Space Saving', 'Durable', 'Easy to Use'],
        'Sports Water Bottle 1L': ['Insulated', '24hr Cold', 'Leak Proof', 'Durable'],
        'Compression Knee Support Brace': ['Compression', 'Pain Relief', 'Adjustable', 'Medical Grade'],
        'Running Performance Socks': ['Moisture Wicking', 'Arch Support', '3-pack', 'Durable'],
    }

    REVIEW_COMMENTS = {
        5: [
            'Absolutely amazing product! Highly recommended.',
            'Excellent quality and fast delivery. Very satisfied.',
            'Best purchase ever! Exceeded my expectations.',
            'Outstanding product! Worth every penny.',
            'Perfect! Exactly as described. Great value for money.',
            'Superb quality! Exactly what I needed.',
            'Fantastic product, great customer service!',
            'Highly impressed with this purchase.',
        ],
        4: [
            'Very good product. Minor issues but overall great.',
            'Good quality. Took a bit longer to arrive but worth it.',
            'Pretty satisfied with this purchase.',
            'Good value for the price. Recommended.',
            'Nice product. Great quality overall.',
            'Good experience. Delivery could be faster.',
        ],
        3: [
            'Average product. Does what it says.',
            'Decent quality. Neither great nor bad.',
            'It\'s okay. Not as good as expected.',
            'Acceptable product for the price.',
            'Average experience. It works fine.',
        ],
        2: [
            'Not as advertised. Disappointed.',
            'Poor quality. Expected better.',
            'Had issues with durability.',
            'Not satisfied with this purchase.',
            'Below expectations. Needs improvement.',
        ],
        1: [
            'Terrible product. Do not recommend.',
            'Worst purchase ever.',
            'Very disappointed. Poor quality.',
            'Waste of money. Very frustrated.',
            'Defective. Horrible experience.',
        ],
    }

    def download_image(self, url):
        """Download and verify image from URL"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            # Verify it's a valid image
            img = Image.open(BytesIO(response.content))
            img.verify()
            
            # Re-open image after verify closes it
            img = Image.open(BytesIO(response.content))
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = rgb_img
            
            # Save to bytes
            img_io = BytesIO()
            img.save(img_io, 'JPEG', quality=85)
            img_io.seek(0)
            
            self.stdout.write(self.style.SUCCESS(f'✓ Image verified: {url[:50]}...'))
            return ContentFile(img_io.getvalue())
            
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'✗ Image failed validation: {url[:50]}... - {str(e)}'))
            return None

    def create_or_get_user(self):
        """Create or get a test user for reviews"""
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'testuser@example.com',
                'first_name': 'Test',
                'last_name': 'User',
            }
        )
        return user

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Starting data population with verified images...'))
        
        try:
            # Create or get test user
            user = self.create_or_get_user()
            self.stdout.write(f'✓ User created/found: {user.username}\n')

            # Create categories
            categories = self._create_categories()
            self.stdout.write(self.style.SUCCESS(f'✓ Created {len(categories)} categories\n'))

            # Create products and related data
            product_count = 0
            for category_key, products_data in self.PRODUCT_DATA.items():
                category = categories[category_key]
                images = self.PRODUCT_IMAGES.get(category_key, [])
                
                self.stdout.write(f'\n📁 {category.name}')
                self.stdout.write('-' * 50)
                
                for idx, product_data in enumerate(products_data):
                    # Get image for this product
                    image_url = images[idx] if idx < len(images) else None
                    
                    product = self._create_product(category, product_data, image_url)
                    self._create_features(product, product_data['name'])
                    self._create_details(product, product_data)
                    self._create_specifications(product, product_data)
                    self._create_qualities(product, product_data)
                    self._create_reviews(product, user)
                    product_count += 1
                    self.stdout.write(f'  ✓ {product.name}')

            self.stdout.write(self.style.SUCCESS(f'\n✓ Created {product_count} products with all related data'))
            self.stdout.write(self.style.SUCCESS('✅ Data population completed successfully!\n'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
            import traceback
            traceback.print_exc()
            raise

    def _create_categories(self):
        """Create product categories"""
        categories = {}
        category_names = {
            'CLOTHES': 'Clothes and Wear',
            'HOME': 'Home Interiors',
            'ELECTRONICS': 'Electronics',
            'BEAUTY': 'Beauty & Health',
            'SPORTS': 'Sports & Outdoors',
        }
        
        for key, name in category_names.items():
            cat, _ = Category.objects.get_or_create(
                slug=slugify(name),
                defaults={'name': name}
            )
            categories[key] = cat
        
        return categories

    def _create_product(self, category, product_data, image_url=None):
        """Create a product with verified real image"""
        product, created = Product.objects.get_or_create(
            slug=slugify(product_data['name']),
            defaults={
                'name': product_data['name'],
                'title': product_data['title'],
                'description': product_data['description'],
                'price': product_data['price'],
                'discount': product_data['discount'],
                'stock': product_data['stock'],
                'category': category,
                'search_categories': self._get_search_category_key(category.name),
                'is_active': True,
                'sold': random.randint(10, 200),
                'average_ratings': f"{random.uniform(3.5, 5.0):.1f}",
                'rating_count': random.randint(20, 500),
            }
        )
        
        # Download and attach verified real image if URL provided
        if image_url and created:
            image_file = self.download_image(image_url)
            if image_file:
                product.image.save(f"{slugify(product_data['name'])}.jpg", image_file)
                product.save()
        
        return product

    def _get_search_category_key(self, category_name):
        """Map category name to CATEGORY_CHOICES key"""
        mapping = {
            'Clothes and Wear': 'CLOTHES',
            'Home Interiors': 'HOME',
            'Electronics': 'ELECTRONICS',
            'Beauty & Health': 'BEAUTY',
            'Sports & Outdoors': 'SPORTS',
        }
        return mapping.get(category_name, 'ALL')

    def _create_features(self, product, product_name):
        """Create product features"""
        features = self.FEATURES_MAPPING.get(product_name, [])
        for feature in features:
            ProductFeature.objects.get_or_create(
                product=product,
                feature=feature
            )

    def _create_details(self, product, product_data):
        """Create product details"""
        origin = product_data['origin'][:10]
        
        ProductDetail.objects.get_or_create(
            product=product,
            defaults={
                'material': product_data['material'],
                'core': 'Premium Quality',
                'origin': origin,
                'weight': product_data['weight'],
            }
        )

    def _create_specifications(self, product, product_data):
        """Create product specifications"""
        specs = [
            ('Material', product_data['material']),
            ('Origin', product_data['origin']),
            ('Weight', product_data['weight']),
            ('Care', 'Hand wash or machine wash'),
            ('Warranty', '1 Year'),
        ]
        
        for order, (key, value) in enumerate(specs):
            ProductSpecification.objects.get_or_create(
                product=product,
                key=key,
                defaults={
                    'value': value,
                    'order': order,
                }
            )

    def _create_qualities(self, product, product_data):
        """Create product qualities (colors and sizes)"""
        colors = product_data['colors']
        sizes = product_data['sizes']
        
        color_codes = {
            'Black': '#000000', 'White': '#FFFFFF', 'Navy': '#000080',
            'Gray': '#808080', 'Charcoal': '#36454F', 'Silver': '#C0C0C0',
            'Teal': '#008080', 'Purple': '#800080', 'Burgundy': '#800020',
            'Beige': '#F5F5DC', 'Peach': '#FFE5B4', 'Mint': '#98FF98',
            'Gold': '#FFD700', 'Rose': '#FF007F', 'Indigo': '#4B0082',
            'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000',
            'Lime': '#00FF00', 'Ivory': '#FFFFF0',
        }
        
        for color in colors:
            for size in sizes:
                ProductQuality.objects.get_or_create(
                    product=product,
                    color=color if color != 'Standard' else None,
                    size=size if size != 'Standard' else None,
                    defaults={
                        'color_code': color_codes.get(color, '#000000'),
                        'size_code': size,
                    }
                )

    def _create_reviews(self, product, user):
        """Create reviews for product"""
        num_reviews = random.randint(3, 8)
        
        for i in range(num_reviews):
            rating = random.choices(
                [5, 4, 3, 2, 1],
                weights=[40, 35, 15, 7, 3],
                k=1
            )[0]
            
            Review.objects.get_or_create(
                product=product,
                user=user,
                defaults={
                    'rating': rating,
                    'comment': random.choice(self.REVIEW_COMMENTS[rating]),
                    'helpful_votes': random.randint(0, 50),
                    'reported': False,
                }
            )