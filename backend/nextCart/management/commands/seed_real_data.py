import requests
import random
import time
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from django.contrib.auth import get_user_model

# Adjust 'nextCart' to your actual app name
from nextCart.models import (
    Category, Product, ProductQuality, ProductVariant, 
    ProductImage, ProductFeature, ProductDetail, ProductSpecification,
    Review
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with REAL data and high-quality Unsplash images'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting Professional Data Seed...")

        # 1. Setup Admin
        user, _ = User.objects.get_or_create(
            username='admin_real',
            defaults={'email': 'real@example.com', 'is_staff': True, 'is_superuser': True}
        )
        if _:
            user.set_password('admin123')
            user.save()

        # 2. Real Product Definitions
        real_products = [
            {
                "name": "Minimalist Leather Backpack",
                "category": "Clothes",
                "price": 145.00,
                "keyword": "backpack",
                "description": "Handcrafted from premium full-grain leather, this backpack combines a sleek minimalist aesthetic with rugged durability.",
                "specs": {"Material": "Full-grain Leather", "Capacity": "20L", "Hardware": "Brass"},
                "variants": [
                    {"color": "Black", "size": "M"},
                    {"color": "Navy", "size": "M"},
                    {"color": "Charcoal", "size": "M"},
                    {"color": "Maroon", "size": "M"},
                ]
            },
            {
                "name": "Wireless Noise Cancelling Headphones",
                "category": "Electronics",
                "price": 299.00,
                "keyword": "headphones",
                "description": "Experience pure sound with industry-leading noise cancellation technology and 30-hour battery life.",
                "specs": {"Battery": "30 Hours", "Bluetooth": "5.2", "Driver": "40mm"},
                "variants": [
                    {"color": "Black", "size": "S"},
                    {"color": "Silver", "size": "S"},
                    {"color": "Navy", "size": "S"},
                    {"color": "White", "size": "S"},
                ]
            },
            {
                "name": "Nordic Fabric Armchair",
                "category": "Home",
                "price": 350.00,
                "keyword": "chair",
                "description": "A stylish Scandinavian-inspired armchair featuring solid oak legs and stain-resistant fabric upholstery.",
                "specs": {"Wood": "Oak", "Fabric": "Polyester Blend", "Style": "Scandi"},
                "variants": [
                    {"color": "Beige", "size": "L"},
                    {"color": "Teal", "size": "L"},
                    {"color": "Olive", "size": "L"},
                    {"color": "Charcoal", "size": "L"},
                ]
            }
        ]

        # Helper to get real Unsplash images
        def get_unsplash_image(query):
            # Using Unsplash Source for high-quality specific photos
            url = f"https://source.unsplash.com/featured/800x800?{query}"
            # Note: Unsplash Source is legacy, alternatively use the direct API or 
            # images.unsplash.com with specific IDs. For a seed script, this is efficient:
            try:
                # Randomize to avoid getting the same image for every variant
                response = requests.get(url, timeout=15)
                if response.status_code == 200:
                    return ContentFile(response.content, name=f"{slugify(query)}.jpg")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Image fetch failed: {e}"))
            return None

        # 3. Execution
        for item in real_products:
            self.stdout.write(f"Processing: {item['name']}")

            cat, _ = Category.objects.get_or_create(
                name=item['category'], 
                defaults={'slug': slugify(item['category'])}
            )

            # Avoid Slug Integrity Errors
            product, created = Product.objects.update_or_create(
                slug=slugify(item['name']),
                defaults={
                    'name': item['name'],
                    'title': item['name'],
                    'description': item['description'],
                    'price': item['price'],
                    'stock': 50,
                    'category': cat,
                    'search_categories': item['category'].upper() if item['category'].upper() in dict(Product.CATEGORY_CHOICES) else "ALL",
                    'default_color': item['variants'][0]['color'],
                    'default_size': item['variants'][0]['size'][:10],
                }
            )

            # Main Image
            if not product.image:
                img_content = get_unsplash_image(item['keyword'])
                if img_content:
                    product.image.save(f"{product.slug}.jpg", img_content)

            # Cleanup old relations before re-seeding
            product.product_quality.all().delete()
            product.variants.all().delete()
            product.specifications.all().delete()

            # Create Qualities (4 objects per product)
            for v_data in item['variants']:
                color = v_data['color']
                size = v_data['size']

                # 1. Create ProductQuality
                quality = ProductQuality.objects.create(
                    product=product,
                    color=color,
                    size=size
                )
                
                # Fetch a specific colored image if possible, else general
                v_img = get_unsplash_image(f"{color}-{item['keyword']}")
                if v_img:
                    quality.image.save(f"quality-{slugify(color)}.jpg", v_img)

                # 2. Create Variant
                variant = ProductVariant.objects.create(
                    product=product,
                    stock=random.randint(5, 20),
                    price_modifier=0.00
                )
                variant.quality.add(quality)

                # 3. Create ProductImage (Gallery)
                g_img = get_unsplash_image(item['keyword'])
                if g_img:
                    p_img = ProductImage(
                        product=product,
                        alt_text=f"{item['name']} in {color}",
                        product_variant=variant
                    )
                    p_img.image.save(f"gallery-{random.randint(100,999)}.jpg", g_img)

            # Specs
            for order, (k, v) in enumerate(item['specs'].items(), 1):
                ProductSpecification.objects.create(product=product, key=k, value=v, order=order)

            self.stdout.write(self.style.SUCCESS(f"Finished {item['name']}"))
            time.sleep(1) # Sleep to respect API rate limits

        self.stdout.write(self.style.SUCCESS("Database seeded with professional Unsplash images!"))