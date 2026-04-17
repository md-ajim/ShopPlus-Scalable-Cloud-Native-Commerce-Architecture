"""
Django Test Data Generator with Real Images - FINAL FIXED VERSION
Run this in Django shell: Get-Content test_data.py | python manage.py shell
"""

from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from django.utils.text import slugify
from django.core.files import File
import os
import urllib.request
from pathlib import Path

# Import your models - Using your custom User model
from nextCart.models import (
    User,  # Using custom User model from nextCart
    Category, Product, ProductQuality, ProductVariant, 
    ProductFeature, ProductDetail, ProductSpecification, SpecialOffer,
    Review, Coupon, ReviewCategory
)


def download_image(url, save_path):
    """Download an image from URL"""
    try:
        urllib.request.urlretrieve(url, save_path)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False


def setup_real_images():
    """Download real product images"""
    
    Path("media/product_images").mkdir(parents=True, exist_ok=True)
    
    images = {
        'tshirt_main.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        'tshirt_black.jpg': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        'tshirt_white.jpg': 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800',
        'tshirt_navy.jpg': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
        'tshirt_red.jpg': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
        
        'headphones_main.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'headphones_black.jpg': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        'headphones_silver.jpg': 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
        'headphones_gold.jpg': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        
        'yogamat_main.jpg': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        'yogamat_teal.jpg': 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800',
        'yogamat_lavender.jpg': 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
        'yogamat_mint.jpg': 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=800',
        'yogamat_coral.jpg': 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800',
        
        'mug_main.jpg': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
        'mug_white.jpg': 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
        'mug_beige.jpg': 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800',
        'mug_azure.jpg': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        'mug_ivory.jpg': 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800',
        
        'dress_main.jpg': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
        'dress_rose.jpg': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'dress_lavender.jpg': 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800',
        'dress_peach.jpg': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800',
        'dress_mint.jpg': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
    }
    
    print("Downloading product images...")
    for filename, url in images.items():
        filepath = f"media/product_images/{filename}"
        if not os.path.exists(filepath):
            if download_image(url, filepath):
                print(f"✓ Downloaded {filename}")
        else:
            print(f"⊙ {filename} already exists")
    
    print("\nImage download complete!")


def generate_test_data():
    print("Starting test data generation with real data...")
    
    # Create test users using custom User model
    users_data = [
        {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
        {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
        {'username': 'mike_wilson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Wilson'},
    ]
    
    users = []
    for user_data in users_data:
        try:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                }
            )
            if created:
                user.set_password('testpass123')
                user.save()
            users.append(user)
        except Exception as e:
            print(f"Error creating user {user_data['username']}: {e}")
    
    print(f"✓ Users created: {len(users)}")
    
    # If no users created, create at least one
    if not users:
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        users.append(user)
        print("✓ Created fallback user")

    # Create Categories
    categories_data = [
        {'name': 'Clothing', 'slug': 'clothing', 'parent': None},
        {'name': "Men's Wear", 'slug': 'mens-wear', 'parent': 'Clothing'},
        {'name': "Women's Wear", 'slug': 'womens-wear', 'parent': 'Clothing'},
        {'name': 'Electronics', 'slug': 'electronics', 'parent': None},
        {'name': 'Home & Living', 'slug': 'home-living', 'parent': None},
        {'name': 'Sports & Fitness', 'slug': 'sports-fitness', 'parent': None},
    ]
    
    categories = {}
    for cat_data in categories_data:
        parent = categories.get(cat_data['parent']) if cat_data['parent'] else None
        cat, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name'], 'parent': parent}
        )
        categories[cat_data['name']] = cat
    print(f"✓ Categories created: {len(categories)}")

    # Real Products Data
    products_data = [
        {
            'name': 'Premium Cotton Crew Neck T-Shirt',
            'title': 'Essential Comfort Tee',
            'description': 'Experience ultimate comfort with our premium 100% organic cotton t-shirt. Features a classic crew neck design, reinforced shoulder seams, and a tailored fit that looks great on everyone. The soft, breathable fabric keeps you cool throughout the day. Pre-shrunk for a perfect fit wash after wash.',
            'price': Decimal('29.99'),
            'discount': Decimal('15.00'),
            'discount_percentage': '15%',
            'stock': 150,
            'category': "Men's Wear",
            'search_categories': 'CLOTHES',
            'default_size': 'M',
            'default_color': 'Black',
            'materials': '100% Organic Cotton, Pre-shrunk fabric',
            'care_instructions': 'Machine wash cold with like colors. Tumble dry low. Do not bleach.',
            'sold': 245,
            'average_ratings': '4.5',
            'rating_count': 87,
            'main_image': 'tshirt_main.jpg',
            'qualities': [
                {'color': 'Black', 'size': 'M', 'image': 'tshirt_black.jpg'},
                {'color': 'White', 'size': 'L', 'image': 'tshirt_white.jpg'},
                {'color': 'Navy', 'size': 'XL', 'image': 'tshirt_navy.jpg'},
                {'color': 'Red', 'size': 'S', 'image': 'tshirt_red.jpg'},
            ],
            'features': [
                'Premium 100% Organic Cotton',
                'Classic Crew Neck Design',
                'Reinforced Shoulder Seams',
                'Pre-shrunk for Perfect Fit',
                'Breathable & Comfortable'
            ],
            'specifications': [
                ('Brand', 'ComfortWear'),
                ('Material', '100% Organic Cotton'),
                ('Fit Type', 'Regular Fit'),
                ('Neck Style', 'Crew Neck'),
                ('Country of Origin', 'USA'),
                ('Warranty', '90 Days')
            ]
        },
        {
            'name': 'Wireless Active Noise Cancelling Headphones Pro',
            'title': 'SoundMax Pro ANC',
            'description': 'Immerse yourself in crystal-clear audio with our flagship wireless headphones. Advanced active noise cancellation blocks out distractions. Premium 40mm drivers deliver deep bass and crisp highs. Ultra-comfortable memory foam ear cushions for all-day wear. 30-hour battery life with quick charge.',
            'price': Decimal('149.99'),
            'discount': Decimal('20.00'),
            'discount_percentage': '20%',
            'stock': 75,
            'category': 'Electronics',
            'search_categories': 'ELECTRONICS',
            'default_color': 'Black',
            'materials': 'Aluminum frame, Memory foam cushions, Premium plastic',
            'care_instructions': 'Wipe with soft, dry cloth. Avoid exposure to moisture.',
            'sold': 189,
            'average_ratings': '4.7',
            'rating_count': 142,
            'main_image': 'headphones_main.jpg',
            'qualities': [
                {'color': 'Black', 'size': None, 'image': 'headphones_black.jpg'},
                {'color': 'Silver', 'size': None, 'image': 'headphones_silver.jpg'},
                {'color': 'Gold', 'size': None, 'image': 'headphones_gold.jpg'},
            ],
            'features': [
                'Active Noise Cancellation',
                '30-Hour Battery Life',
                'Premium 40mm Drivers',
                'Memory Foam Cushions',
                'Multipoint Connectivity',
                'Quick Charge Technology'
            ],
            'specifications': [
                ('Brand', 'SoundMax'),
                ('Driver Size', '40mm'),
                ('Frequency Response', '20Hz - 20kHz'),
                ('Bluetooth Version', '5.2'),
                ('Battery Life', '30 hours'),
                ('Weight', '250g'),
                ('Warranty', '2 Years')
            ]
        },
        {
            'name': 'Premium Non-Slip Yoga Mat with Alignment Lines',
            'title': 'FlexFlow Pro Yoga Mat',
            'description': 'Elevate your practice with our eco-friendly premium yoga mat. Extra thick 6mm cushioning protects joints during any pose. Non-slip textured surface provides superior grip even during hot yoga. Alignment lines help perfect your form. Made from sustainable TPE material.',
            'price': Decimal('39.99'),
            'discount': Decimal('10.00'),
            'discount_percentage': '10%',
            'stock': 200,
            'category': 'Sports & Fitness',
            'search_categories': 'SPORTS',
            'materials': 'TPE (Thermoplastic Elastomer)',
            'care_instructions': 'Wipe with damp cloth and mild soap. Air dry completely.',
            'sold': 312,
            'average_ratings': '4.6',
            'rating_count': 203,
            'main_image': 'yogamat_main.jpg',
            'qualities': [
                {'color': 'Teal', 'size': '6 x 8 inch', 'image': 'yogamat_teal.jpg'},
                {'color': 'Lavender', 'size': '6 x 8 inch', 'image': 'yogamat_lavender.jpg'},
                {'color': 'Mint', 'size': '7 x 9 inch', 'image': 'yogamat_mint.jpg'},
                {'color': 'Coral', 'size': '8 x 11 inch', 'image': 'yogamat_coral.jpg'},
            ],
            'features': [
                'Extra Thick 6mm Cushioning',
                'Non-Slip Textured Surface',
                'Alignment Lines',
                'Eco-Friendly TPE Material',
                'Lightweight & Portable'
            ],
            'specifications': [
                ('Brand', 'FlexFlow'),
                ('Material', 'TPE'),
                ('Thickness', '6mm'),
                ('Dimensions', '72" x 24"'),
                ('Weight', '2.2 lbs'),
                ('Warranty', '1 Year')
            ]
        },
        {
            'name': 'Handcrafted Ceramic Coffee Mug Set of 4',
            'title': 'Artisan Morning Collection',
            'description': 'Start your day right with our beautiful handcrafted ceramic mugs. Each mug is individually crafted by skilled artisans. Holds 12oz. Comfortable C-handle design. Microwave and dishwasher safe.',
            'price': Decimal('34.99'),
            'discount': Decimal('5.00'),
            'discount_percentage': '5%',
            'stock': 120,
            'category': 'Home & Living',
            'search_categories': 'HOME',
            'materials': 'Premium Ceramic with Lead-free Glaze',
            'care_instructions': 'Dishwasher safe. Microwave safe.',
            'sold': 156,
            'average_ratings': '4.4',
            'rating_count': 98,
            'main_image': 'mug_main.jpg',
            'qualities': [
                {'color': 'White', 'size': None, 'image': 'mug_white.jpg'},
                {'color': 'Beige', 'size': None, 'image': 'mug_beige.jpg'},
                {'color': 'Azure', 'size': None, 'image': 'mug_azure.jpg'},
                {'color': 'Ivory', 'size': None, 'image': 'mug_ivory.jpg'},
            ],
            'features': [
                'Handcrafted by Artisans',
                'Generous 12oz Capacity',
                'Comfortable C-Handle',
                'Microwave & Dishwasher Safe',
                'Chip-Resistant Glaze'
            ],
            'specifications': [
                ('Brand', 'Artisan Home'),
                ('Material', 'Premium Ceramic'),
                ('Capacity', '12 oz'),
                ('Set Includes', '4 Mugs'),
                ('Dishwasher Safe', 'Yes'),
                ('Warranty', '6 Months')
            ]
        },
        {
            'name': 'Floral Print Maxi Summer Dress',
            'title': 'Blossom Romance Dress',
            'description': 'Look effortlessly elegant in our stunning floral maxi dress. Beautiful all-over floral print. Adjustable spaghetti straps. Empire waist design. Lightweight, breathable fabric.',
            'price': Decimal('59.99'),
            'discount': Decimal('25.00'),
            'discount_percentage': '25%',
            'stock': 85,
            'category': "Women's Wear",
            'search_categories': 'CLOTHES',
            'default_size': 'M',
            'materials': '95% Rayon, 5% Spandex',
            'care_instructions': 'Hand wash cold. Hang to dry.',
            'sold': 98,
            'average_ratings': '4.8',
            'rating_count': 76,
            'main_image': 'dress_main.jpg',
            'qualities': [
                {'color': 'Rose', 'size': 'S', 'image': 'dress_rose.jpg'},
                {'color': 'Lavender', 'size': 'M', 'image': 'dress_lavender.jpg'},
                {'color': 'Peach', 'size': 'L', 'image': 'dress_peach.jpg'},
                {'color': 'Mint', 'size': 'XL', 'image': 'dress_mint.jpg'},
            ],
            'features': [
                'Beautiful Floral Print',
                'Adjustable Straps',
                'Empire Waist Design',
                'Breathable Fabric',
                'Hidden Side Pockets'
            ],
            'specifications': [
                ('Brand', 'SummerStyle'),
                ('Material', '95% Rayon, 5% Spandex'),
                ('Style', 'Maxi Dress'),
                ('Neckline', 'V-Neck'),
                ('Length', 'Maxi'),
                ('Warranty', 'Not Applicable')
            ]
        },
    ]

    created_products = []
    
    for prod_data in products_data:
        try:
            qualities_data = prod_data.pop('qualities')
            features_data = prod_data.pop('features')
            specs_data = prod_data.pop('specifications')
            category_name = prod_data.pop('category')
            main_image_file = prod_data.pop('main_image')
            
            # Create Product
            product, created = Product.objects.get_or_create(
                slug=slugify(prod_data['name']),
                defaults={
                    **prod_data,
                    'category': categories[category_name],
                }
            )
            
            if created:
                # Attach main product image
                image_path = f"media/product_images/{main_image_file}"
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        product.image.save(main_image_file, File(f), save=True)
                
                print(f"\n✓ Product created: {product.name}")
                
                # Create ProductQuality objects with images
                for quality_data in qualities_data:
                    color = quality_data.get('color')
                    size = quality_data.get('size')
                    image_file = quality_data.get('image')
                    
                    quality = ProductQuality.objects.create(
                        product=product,
                        color=color,
                        size=size,
                    )
                    
                    # Attach variant image
                    if image_file:
                        variant_image_path = f"media/product_images/{image_file}"
                        if os.path.exists(variant_image_path):
                            with open(variant_image_path, 'rb') as f:
                                quality.image.save(image_file, File(f), save=True)
                    
                    print(f"  ✓ ProductQuality: {quality}")
                    
                    # Create ProductImage WITH the image attached
                    if image_file and os.path.exists(f"media/product_images/{image_file}"):
                        with open(f"media/product_images/{image_file}", 'rb') as f:
                            product_image = ProductImage(
                                product=product,
                                alt_text=f"{product.name} - {color or 'Default'} {size or ''}".strip(),
                            )
                            product_image.image.save(image_file, File(f), save=False)
                            product_image.save()
                        print(f"    ✓ ProductImage: {product_image.alt_text}")
                
                # Create ProductVariants
                qualities = list(product.product_quality.all())
                for i, quality in enumerate(qualities[:3]):
                    variant = ProductVariant.objects.create(
                        product=product,
                        stock=(30 - i * 5),
                        price_modifier=Decimal(i * 2.50).quantize(Decimal('0.01'))
                    )
                    variant.quality.add(quality)
                    print(f"  ✓ ProductVariant created")
                
                # Create ProductFeatures
                for feature in features_data:
                    ProductFeature.objects.create(
                        product=product,
                        feature=feature
                    )
                print(f"  ✓ Created {len(features_data)} features")
                
                # Create ProductSpecifications
                for i, (key, value) in enumerate(specs_data):
                    ProductSpecification.objects.create(
                        product=product,
                        key=key,
                        value=value,
                        order=i
                    )
                print(f"  ✓ Created {len(specs_data)} specifications")
                
                # Create ProductDetail
                origin_value = None
                for key, value in specs_data:
                    if key == 'Country of Origin':
                        origin_value = value
                        break
                
                ProductDetail.objects.create(
                    product=product,
                    material=prod_data.get('materials', 'Premium Materials'),
                    core='High Quality Core',
                    origin=origin_value or 'USA',
                    weight='Standard'
                )
                print(f"  ✓ ProductDetail created")
                
                # Create Reviews
                reviews_data = [
                    {'rating': 5, 'comment': 'Absolutely love this product! Highly recommend!'},
                    {'rating': 4, 'comment': 'Great product. Works exactly as described.'},
                    {'rating': 5, 'comment': 'Perfect! Very satisfied with my purchase.'},
                ]
                
                for review_data in reviews_data:
                    Review.objects.create(
                        product=product,
                        user=users[0],  # Use first user
                        rating=review_data['rating'],
                        comment=review_data['comment'],
                        helpful_votes=review_data['rating'] * 3
                    )
                print(f"  ✓ Created {len(reviews_data)} reviews")
                
                # Create Special Offer
                SpecialOffer.objects.create(
                    title=f"Special: {product.name[:30]}",
                    discount_percentage=product.discount,
                    price=product.price,
                    valid_from=timezone.now() - timedelta(days=5),
                    product=product
                )
                print(f"  ✓ Special offer created")
                
                created_products.append(product)
                
        except Exception as e:
            print(f"\n✗ Error creating product: {e}")
            import traceback
            traceback.print_exc()
            continue

    # Create Coupons
    coupons_data = [
        {'code': 'SAVE10', 'discount': Decimal('10.00'), 'max_uses': 100},
        {'code': 'SAVE20', 'discount': Decimal('20.00'), 'max_uses': 50},
        {'code': 'FIRST25', 'discount': Decimal('25.00'), 'max_uses': 200},
    ]
    
    for coupon_data in coupons_data:
        Coupon.objects.get_or_create(
            code=coupon_data['code'],
            defaults={
                'discount': coupon_data['discount'],
                'max_uses': coupon_data['max_uses'],
                'valid_from': timezone.now() - timedelta(days=30),
                'valid_to': timezone.now() + timedelta(days=60)
            }
        )
    print(f"\n✓ Coupons created: {len(coupons_data)}")
    
    # Create Review Categories
    for category_choice in ReviewCategory.CATEGORY_CHOICES:
        ReviewCategory.objects.get_or_create(name=category_choice[0])
    print(f"✓ Review categories created")

    print(f"\n{'='*50}")
    print(f"✓ Total products created: {len(created_products)}")
    print(f"{'='*50}\n")
    
    print("Generated Products Summary:")
    for p in created_products:
        print(f"  📦 {p.name}")
        print(f"     └─ Qualities: {p.product_quality.count()}")
        print(f"     └─ Variants: {p.variants.count()}")
        print(f"     └─ Images: {p.images.count()}")
        print(f"     └─ Reviews: {p.reviews.count()}")
    
    print("\n✓ DATA GENERATION COMPLETE!")


# Run if executed as main
if __name__ == '__main__':
    print("\n" + "="*50)
    print("DJANGO TEST DATA GENERATOR")
    print("="*50 + "\n")
    
    # Comment out this line if images already downloaded
    # setup_real_images()
    
    generate_test_data()