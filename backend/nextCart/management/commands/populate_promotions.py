import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from nextCart.models import Product
from decimal import Decimal



class Command(BaseCommand):
    help = 'Populate Product model with sample data'

    def download_image(self, url, filename):
        """Download image from URL and return ContentFile"""
        try:
            full_url = f"{url}?w=800&h=800&fit=crop&q=85"
            response = requests.get(full_url, timeout=10)
            if response.status_code == 200:
                return ContentFile(response.content), filename
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Error downloading {filename}: {str(e)}'))
        return None, None

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting product data population...'))

        products_data = [
            {
                'name': 'Floral Dress',
                'description': 'Beautiful floral summer dress',
                'price': Decimal('49.99'),
                'image_url': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1'
            },
            {
                'name': 'Leather Jacket',
                'description': 'Premium leather jacket',
                'price': Decimal('199.99'),
                'image_url': 'https://images.unsplash.com/photo-1551028719-00167b16eac5'
            },
            {
                'name': 'Winter Puffer Coat',
                'description': 'Warm winter puffer coat',
                'price': Decimal('129.99'),
                'image_url': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3'
            },
            {
                'name': 'Wireless Bluetooth Headphones',
                'description': 'High-quality wireless headphones',
                'price': Decimal('89.99'),
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
            },
            {
                'name': 'Smart Watch Fitness Tracker',
                'description': 'Advanced fitness tracking smartwatch',
                'price': Decimal('199.99'),
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
            },
            {
                'name': 'Decorative Throw Pillows Set',
                'description': 'Set of decorative throw pillows',
                'price': Decimal('59.99'),
                'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
            },
            {
                'name': 'Yoga Mat Premium',
                'description': 'Premium eco-friendly yoga mat',
                'price': Decimal('39.99'),
                'image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'
            },
            {
                'name': 'Organic Face Serum',
                'description': 'Natural organic face serum',
                'price': Decimal('44.99'),
                'image_url': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be'
            },
            {
                'name': 'Camping Tent 4-Person',
                'description': 'Professional camping tent',
                'price': Decimal('149.99'),
                'image_url': 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d'
            },
            {
                'name': 'Adjustable Dumbbells Set',
                'description': 'Adjustable dumbbells for home gym',
                'price': Decimal('119.99'),
                'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd'
            },
            {
                'name': 'Athletic Running Shorts',
                'description': 'Performance running shorts',
                'price': Decimal('34.99'),
                'image_url': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b'
            },
            {
                'name': 'Yoga Leggings',
                'description': 'Premium stretch yoga leggings',
                'price': Decimal('54.99'),
                'image_url': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8'
            },
            {
                'name': 'Casual Hoodie',
                'description': 'Comfortable casual hoodie',
                'price': Decimal('44.99'),
                'image_url': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7'
            },
            {
                'name': 'Portable Power Bank',
                'description': 'Portable 20000mAh power bank',
                'price': Decimal('29.99'),
                'image_url': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5'
            },
            {
                'name': 'Wireless Gaming Mouse',
                'description': 'Pro gaming mouse with RGB lighting',
                'price': Decimal('59.99'),
                'image_url': 'https://images.unsplash.com/photo-1527814050087-3793815479db'
            },
            {
                'name': 'USB-C Hub Adapter',
                'description': '7-in-1 USB-C multi-port hub',
                'price': Decimal('49.99'),
                'image_url': 'https://images.unsplash.com/photo-1625948515291-69613efd103f'
            },
            {
                'name': 'LED Desk Lamp with USB',
                'description': 'LED desk lamp with USB charging',
                'price': Decimal('34.99'),
                'image_url': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'
            },
            {
                'name': 'Modern Table Lamp',
                'description': 'Modern table lamp with smart touch control',
                'price': Decimal('54.99'),
                'image_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c'
            },
            {
                'name': 'Minimalist Clock',
                'description': 'Minimalist wall clock with silent movement',
                'price': Decimal('39.99'),
                'image_url': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c'
            },
        ]

        for idx, product_data in enumerate(products_data, 1):
            try:
                # Check if product already exists
                if Product.objects.filter(name=product_data['name']).exists():
                    self.stdout.write(self.style.WARNING(
                        f'  ⊘ [{idx}] Product already exists: {product_data["name"]}'
                    ))
                    continue

                # Download image
                img_content, img_name = self.download_image(
                    product_data['image_url'],
                    f"product_{idx}.jpg"
                )

                # Create product
                product = Product.objects.create(
                    name=product_data['name'],
                    description=product_data['description'],
                    price=product_data['price']
                )

                if img_content:
                    product.image.save(img_name, img_content, save=True)

                self.stdout.write(self.style.SUCCESS(
                    f'  ✓ [{idx}] Created Product: {product_data["name"]}'
                ))

            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'  ✗ Error creating product {idx}: {str(e)}'
                ))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS(f'✓ Total products created: {Product.objects.count()}'))
        self.stdout.write(self.style.SUCCESS('✓ Product population completed!'))
        self.stdout.write(self.style.SUCCESS('='*60))