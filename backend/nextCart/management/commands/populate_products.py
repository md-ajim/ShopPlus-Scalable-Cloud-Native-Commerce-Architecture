

# # management/commands/populate_products.py
# import requests
# from io import BytesIO
# from django.core.management.base import BaseCommand
# from django.core.files.base import ContentFile
# from django.utils.text import slugify
# from nextCart.models import Product, ProductQuality, Category
# from decimal import Decimal
# import random


# class Command(BaseCommand):
#     help = 'Populate database with 30 products and 4 ProductQuality variants each'

#     def get_quality_variants(self, product_type):
#         """Return 4 different color/size combinations based on product type"""
        
#         clothing_variants = [
#             {'color': 'Black', 'size': 'M'},
#             {'color': 'White', 'size': 'L'},
#             {'color': 'Navy', 'size': 'S'},
#             {'color': 'Red', 'size': 'XL'},
#         ]
        
#         home_variants = [
#             {'color': 'Beige', 'size': '10 x 15 inch'},
#             {'color': 'White', 'size': '8 x 11 inch'},
#             {'color': 'Silver', 'size': '7 x 9 inch'},
#             {'color': 'Gold', 'size': '9 x 12 inch'},
#         ]
        
#         electronics_variants = [
#             {'color': 'Black', 'size': 'M'},
#             {'color': 'White', 'size': 'L'},
#             {'color': 'Silver', 'size': 'M'},
#             {'color': 'Rose', 'size': 'S'},
#         ]
        
#         beauty_variants = [
#             {'color': 'Rose', 'size': '2 Inches'},
#             {'color': 'Peach', 'size': '4 Inches'},
#             {'color': 'Coral', 'size': '6 Inches'},
#             {'color': 'Lavender', 'size': '2 Inches'},
#         ]
        
#         sports_variants = [
#             {'color': 'Black', 'size': 'L'},
#             {'color': 'Navy', 'size': 'M'},
#             {'color': 'Red', 'size': 'XL'},
#             {'color': 'Teal', 'size': 'L'},
#         ]
        
#         variant_map = {
#             'CLOTHES': clothing_variants,
#             'HOME': home_variants,
#             'ELECTRONICS': electronics_variants,
#             'BEAUTY': beauty_variants,
#             'SPORTS': sports_variants,
#         }
        
#         return variant_map.get(product_type, clothing_variants)

#     def handle(self, *args, **kwargs):
#         # Sample product data with quality variant images
#         products_data = [
#             # CLOTHES (10 products)
#             {
#                 'name': 'Classic Cotton T-Shirt',
#                 'title': 'Comfort Tee',
#                 'description': 'Premium quality cotton t-shirt with breathable fabric. Perfect for casual wear and everyday comfort. Features reinforced stitching and pre-shrunk material.',
#                 'price': Decimal('29.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 150,
#                 'sold': 89,
#                 'average_ratings': '4.5',
#                 'category_name': 'T-Shirts',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'M',
#                 'default_color': 'Blue',
#                 'materials': '100% Cotton',
#                 'care_instructions': 'Machine wash cold, tumble dry low',
#                 'rating_count': 45,
#                 'main_image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
#                     'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
#                     'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
#                     'https://images.unsplash.com/photo-1562157873-818bc0726f68'
#                 ]
#             },
#             {
#                 'name': 'Slim Fit Denim Jeans',
#                 'title': 'Modern Fit',
#                 'description': 'Stylish slim fit jeans made from premium denim. Features a modern cut with comfortable stretch. Five-pocket design with button fly.',
#                 'price': Decimal('79.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 120,
#                 'sold': 67,
#                 'average_ratings': '4.7',
#                 'category_name': 'Jeans',
#                 'search_categories': 'CLOTHES',
#                 'default_size': '32',
#                 'default_color': 'Dark Blue',
#                 'materials': '98% Cotton, 2% Elastane',
#                 'care_instructions': 'Machine wash inside out, hang dry',
#                 'rating_count': 38,
#                 'main_image': 'https://images.unsplash.com/photo-1542272604-787c3835535d',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1542272604-787c3835535d',
#                     'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
#                     'https://images.unsplash.com/photo-1475178626620-a4d074967452',
#                     'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab'
#                 ]
#             },
#             {
#                 'name': 'Leather Jacket',
#                 'title': 'Premium Leather',
#                 'description': 'Genuine leather jacket with quilted lining. Classic biker style with asymmetric zipper. Durable and timeless design.',
#                 'price': Decimal('299.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 45,
#                 'sold': 23,
#                 'average_ratings': '4.8',
#                 'category_name': 'Jackets',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'L',
#                 'default_color': 'Black',
#                 'materials': '100% Genuine Leather',
#                 'care_instructions': 'Professional leather clean only',
#                 'rating_count': 28,
#                 'main_image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1551028719-00167b16eac5',
#                     'https://images.unsplash.com/photo-1520975954732-35dd22299614',
#                     'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
#                     'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
#                 ]
#             },
#             {
#                 'name': 'Summer Floral Dress',
#                 'title': 'Elegant Summer',
#                 'description': 'Beautiful floral print dress perfect for summer occasions. Lightweight and breathable fabric with comfortable fit. Features adjustable straps.',
#                 'price': Decimal('89.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 80,
#                 'sold': 54,
#                 'average_ratings': '4.6',
#                 'category_name': 'Dresses',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'M',
#                 'default_color': 'Floral',
#                 'materials': '95% Polyester, 5% Spandex',
#                 'care_instructions': 'Hand wash cold, hang dry',
#                 'rating_count': 42,
#                 'main_image': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
#                     'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
#                     'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
#                     'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03'
#                 ]
#             },
#             {
#                 'name': 'Wool Blend Sweater',
#                 'title': 'Cozy Warmth',
#                 'description': 'Soft wool blend sweater perfect for cold weather. Classic crew neck design with ribbed cuffs and hem. Maintains shape after washing.',
#                 'price': Decimal('69.99'),
#                 'discount': Decimal('10.00'),
#                 'discount_percentage': '10%',
#                 'stock': 95,
#                 'sold': 41,
#                 'average_ratings': '4.4',
#                 'category_name': 'Sweaters',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'L',
#                 'default_color': 'Gray',
#                 'materials': '60% Wool, 40% Acrylic',
#                 'care_instructions': 'Hand wash cold, lay flat to dry',
#                 'rating_count': 35,
#                 'main_image': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633',
#                     'https://images.unsplash.com/photo-1576871337622-98d48d1cf531',
#                     'https://images.unsplash.com/photo-1582557183908-80e3bfe90f5d',
#                     'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4'
#                 ]
#             },
#             {
#                 'name': 'Athletic Running Shorts',
#                 'title': 'Performance Gear',
#                 'description': 'Lightweight running shorts with moisture-wicking fabric. Features built-in liner and side pockets. Reflective details for visibility.',
#                 'price': Decimal('39.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 110,
#                 'sold': 78,
#                 'average_ratings': '4.5',
#                 'category_name': 'Shorts',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'M',
#                 'default_color': 'Black',
#                 'materials': '100% Polyester',
#                 'care_instructions': 'Machine wash cold, tumble dry low',
#                 'rating_count': 52,
#                 'main_image': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1591195853828-11db59a44f6b',
#                     'https://images.unsplash.com/photo-1591195851473-c4edd2d41846',
#                     'https://images.unsplash.com/photo-1598032895397-86d60e3c9b3d',
#                     'https://images.unsplash.com/photo-1622445275576-721325763afe'
#                 ]
#             },
#             {
#                 'name': 'Business Formal Shirt',
#                 'title': 'Professional',
#                 'description': 'Crisp formal shirt perfect for business settings. Wrinkle-resistant fabric with modern fit. Available in classic colors.',
#                 'price': Decimal('59.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 130,
#                 'sold': 92,
#                 'average_ratings': '4.6',
#                 'category_name': 'Shirts',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'M',
#                 'default_color': 'White',
#                 'materials': '65% Cotton, 35% Polyester',
#                 'care_instructions': 'Machine wash warm, iron if needed',
#                 'rating_count': 61,
#                 'main_image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
#                     'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
#                     'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
#                     'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4'
#                 ]
#             },
#             {
#                 'name': 'Yoga Leggings',
#                 'title': 'Flex Comfort',
#                 'description': 'High-waisted yoga leggings with four-way stretch. Squat-proof and moisture-wicking. Perfect for yoga, gym, or casual wear.',
#                 'price': Decimal('49.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 140,
#                 'sold': 103,
#                 'average_ratings': '4.7',
#                 'category_name': 'Activewear',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'M',
#                 'default_color': 'Black',
#                 'materials': '80% Nylon, 20% Spandex',
#                 'care_instructions': 'Machine wash cold, hang dry',
#                 'rating_count': 87,
#                 'main_image': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1506629082955-511b1aa562c8',
#                     'https://images.unsplash.com/photo-1556906965-3b36de888bf6',
#                     'https://images.unsplash.com/photo-1599643477877-530eb83abc8e',
#                     'https://images.unsplash.com/photo-1579975096809-e44791b13f8f'
#                 ]
#             },
#             {
#                 'name': 'Winter Puffer Coat',
#                 'title': 'Warm Protection',
#                 'description': 'Insulated puffer coat with water-resistant exterior. Features removable hood and multiple pockets. Keeps you warm in extreme cold.',
#                 'price': Decimal('189.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 65,
#                 'sold': 34,
#                 'average_ratings': '4.8',
#                 'category_name': 'Coats',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'L',
#                 'default_color': 'Navy',
#                 'materials': 'Shell: 100% Nylon, Fill: 90% Down, 10% Feather',
#                 'care_instructions': 'Machine wash cold, tumble dry low',
#                 'rating_count': 29,
#                 'main_image': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
#                     'https://images.unsplash.com/photo-1608256246200-53e635b5b65f',
#                     'https://images.unsplash.com/photo-1548126032-079fe3317a9f',
#                     'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'
#                 ]
#             },
#             {
#                 'name': 'Casual Hoodie',
#                 'title': 'Everyday Comfort',
#                 'description': 'Comfortable pullover hoodie with kangaroo pocket. Soft fleece interior with adjustable drawstring hood. Perfect for casual wear.',
#                 'price': Decimal('54.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 125,
#                 'sold': 71,
#                 'average_ratings': '4.5',
#                 'category_name': 'Hoodies',
#                 'search_categories': 'CLOTHES',
#                 'default_size': 'L',
#                 'default_color': 'Gray',
#                 'materials': '80% Cotton, 20% Polyester',
#                 'care_instructions': 'Machine wash cold, tumble dry low',
#                 'rating_count': 55,
#                 'main_image': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
#                     'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77',
#                     'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d',
#                     'https://images.unsplash.com/photo-1614252369475-531eba835eb1'
#                 ]
#             },
            
#             # HOME (8 products)
#             {
#                 'name': 'Modern Table Lamp',
#                 'title': 'Ambient Light',
#                 'description': 'Contemporary table lamp with adjustable brightness. Features touch control and energy-efficient LED. Perfect for bedside or desk.',
#                 'price': Decimal('69.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 75,
#                 'sold': 48,
#                 'average_ratings': '4.6',
#                 'category_name': 'Lighting',
#                 'search_categories': 'HOME',
#                 'default_size': 'Standard',
#                 'default_color': 'Silver',
#                 'materials': 'Metal, Glass',
#                 'care_instructions': 'Wipe with dry cloth',
#                 'rating_count': 41,
#                 'main_image': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
#                     'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
#                     'https://images.unsplash.com/photo-1509043759401-136742328bb3',
#                     'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f'
#                 ]
#             },
#             {
#                 'name': 'Decorative Throw Pillows Set',
#                 'title': '4-Piece Set',
#                 'description': 'Set of 4 decorative throw pillows with premium covers. Soft and comfortable with hidden zippers. Mix and match patterns included.',
#                 'price': Decimal('49.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 90,
#                 'sold': 62,
#                 'average_ratings': '4.5',
#                 'category_name': 'Decor',
#                 'search_categories': 'HOME',
#                 'default_size': '18x18',
#                 'default_color': 'Multi',
#                 'materials': 'Cotton, Polyester Fill',
#                 'care_instructions': 'Remove cover and machine wash',
#                 'rating_count': 53,
#                 'main_image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
#                     'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
#                     'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
#                     'https://images.unsplash.com/photo-1560185127-6ed189bf02f4'
#                 ]
#             },
#             {
#                 'name': 'Wall Art Canvas Print',
#                 'title': 'Abstract Modern',
#                 'description': 'Large canvas wall art with modern abstract design. Gallery-wrapped edges ready to hang. UV-resistant fade-proof inks.',
#                 'price': Decimal('129.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 55,
#                 'sold': 28,
#                 'average_ratings': '4.7',
#                 'category_name': 'Wall Art',
#                 'search_categories': 'HOME',
#                 'default_size': '24x36',
#                 'default_color': 'Multi',
#                 'materials': 'Canvas, Wood Frame',
#                 'care_instructions': 'Dust with soft cloth',
#                 'rating_count': 32,
#                 'main_image': 'https://images.unsplash.com/photo-1582277538938-2524f5026002',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1582277538938-2524f5026002',
#                     'https://images.unsplash.com/photo-1549887534-1541e9326642',
#                     'https://images.unsplash.com/photo-1578926288207-a90a5366759d',
#                     'https://images.unsplash.com/photo-1561214115-f2f134cc4912'
#                 ]
#             },
#             {
#                 'name': 'Ceramic Vase Set',
#                 'title': 'Elegant Decor',
#                 'description': 'Set of 3 handcrafted ceramic vases in varying heights. Modern minimalist design perfect for fresh or dried flowers.',
#                 'price': Decimal('79.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 70,
#                 'sold': 39,
#                 'average_ratings': '4.6',
#                 'category_name': 'Vases',
#                 'search_categories': 'HOME',
#                 'default_size': 'Various',
#                 'default_color': 'White',
#                 'materials': 'Ceramic',
#                 'care_instructions': 'Hand wash only',
#                 'rating_count': 36,
#                 'main_image': 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1578500494198-246f612d3b3d',
#                     'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261',
#                     'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6',
#                     'https://images.unsplash.com/photo-1603296135643-43b5c3d527dc'
#                 ]
#             },
#             {
#                 'name': 'Luxury Area Rug',
#                 'title': 'Premium Quality',
#                 'description': 'Soft plush area rug with non-slip backing. Stain-resistant and easy to clean. Adds warmth and style to any room.',
#                 'price': Decimal('159.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 40,
#                 'sold': 21,
#                 'average_ratings': '4.8',
#                 'category_name': 'Rugs',
#                 'search_categories': 'HOME',
#                 'default_size': '5x7',
#                 'default_color': 'Beige',
#                 'materials': '100% Polypropylene',
#                 'care_instructions': 'Vacuum regularly, spot clean',
#                 'rating_count': 27,
#                 'main_image': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
#                     'https://images.unsplash.com/photo-1615873968403-89e068629265',
#                     'https://images.unsplash.com/photo-1604762524889-cadb9d819d8a',
#                     'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a'
#                 ]
#             },
#             {
#                 'name': 'Wooden Wall Shelf',
#                 'title': 'Floating Design',
#                 'description': 'Rustic floating wall shelf with concealed mounting. Solid wood construction with natural finish. Perfect for books and decor.',
#                 'price': Decimal('89.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 85,
#                 'sold': 56,
#                 'average_ratings': '4.5',
#                 'category_name': 'Shelving',
#                 'search_categories': 'HOME',
#                 'default_size': '36 inch',
#                 'default_color': 'Natural Wood',
#                 'materials': 'Solid Pine Wood',
#                 'care_instructions': 'Wipe with damp cloth',
#                 'rating_count': 49,
#                 'main_image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
#                     'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
#                     'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
#                     'https://images.unsplash.com/photo-1610466025874-6e6d86e5e2f3'
#                 ]
#             },
#             {
#                 'name': 'Scented Candle Collection',
#                 'title': 'Aromatherapy',
#                 'description': 'Set of 6 premium scented candles in glass jars. Natural soy wax with essential oils. Long-lasting burn time of 40+ hours each.',
#                 'price': Decimal('59.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 100,
#                 'sold': 74,
#                 'average_ratings': '4.7',
#                 'category_name': 'Candles',
#                 'search_categories': 'HOME',
#                 'default_size': 'Standard',
#                 'default_color': 'Various',
#                 'materials': 'Soy Wax, Essential Oils',
#                 'care_instructions': 'Trim wick before each use',
#                 'rating_count': 68,
#                 'main_image': 'https://images.unsplash.com/photo-1602874801006-95415e31de0f',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1602874801006-95415e31de0f',
#                     'https://images.unsplash.com/photo-1583991928840-08e7e6a84061',
#                     'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c',
#                     'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
#                 ]
#             },
#             {
#                 'name': 'Minimalist Clock',
#                 'title': 'Silent Modern',
#                 'description': 'Wall clock with silent sweep movement. Minimalist design with clear numbers. Battery operated with modern aesthetics.',
#                 'price': Decimal('44.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 95,
#                 'sold': 63,
#                 'average_ratings': '4.4',
#                 'category_name': 'Clocks',
#                 'search_categories': 'HOME',
#                 'default_size': '12 inch',
#                 'default_color': 'Black',
#                 'materials': 'Plastic, Metal',
#                 'care_instructions': 'Wipe with dry cloth',
#                 'rating_count': 57,
#                 'main_image': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c',
#                     'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5',
#                     'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
#                     'https://images.unsplash.com/photo-1543946207-39bd91e70ca7'
#                 ]
#             },

#             # ELECTRONICS (6 products)
#             {
#                 'name': 'Wireless Bluetooth Headphones',
#                 'title': 'Premium Sound',
#                 'description': 'Over-ear wireless headphones with active noise cancellation. 30-hour battery life with quick charge. Superior audio quality.',
#                 'price': Decimal('199.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 80,
#                 'sold': 67,
#                 'average_ratings': '4.7',
#                 'category_name': 'Audio',
#                 'search_categories': 'ELECTRONICS',
#                 'default_size': 'One Size',
#                 'default_color': 'Black',
#                 'materials': 'Plastic, Leather, Metal',
#                 'care_instructions': 'Wipe with soft cloth',
#                 'rating_count': 89,
#                 'main_image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
#                     'https://images.unsplash.com/photo-1484704849700-f032a568e944',
#                     'https://images.unsplash.com/photo-1545127398-14699f92334b',
#                     'https://images.unsplash.com/photo-1577174881658-0f30157d9285'
#                 ]
#             },
#             {
#                 'name': 'Smart Watch Fitness Tracker',
#                 'title': 'Health Monitor',
#                 'description': 'Advanced smartwatch with heart rate monitor, GPS, and sleep tracking. Water-resistant with 7-day battery life. Multiple sport modes.',
#                 'price': Decimal('249.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 65,
#                 'sold': 52,
#                 'average_ratings': '4.6',
#                 'category_name': 'Wearables',
#                 'search_categories': 'ELECTRONICS',
#                 'default_size': 'Adjustable',
#                 'default_color': 'Black',
#                 'materials': 'Aluminum, Silicone',
#                 'care_instructions': 'Rinse with water after workouts',
#                 'rating_count': 74,
#                 'main_image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
#                     'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
#                     'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
#                     'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8'
#                 ]
#             },
#             {
#                 'name': 'Portable Power Bank',
#                 'title': '20000mAh',
#                 'description': 'High-capacity portable charger with fast charging technology. Dual USB ports and LED indicator. Compatible with all devices.',
#                 'price': Decimal('49.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 150,
#                 'sold': 112,
#                 'average_ratings': '4.5',
#                 'category_name': 'Accessories',
#                 'search_categories': 'ELECTRONICS',
#                 'default_size': 'Compact',
#                 'default_color': 'Black',
#                 'materials': 'Aluminum, Lithium Battery',
#                 'care_instructions': 'Keep dry, avoid extreme temperatures',
#                 'rating_count': 98,
#                 'main_image': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
#                     'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd',
#                     'https://images.unsplash.com/photo-1620507405951-fa3c0944f5ec',
#                     'https://images.unsplash.com/photo-1625948515291-69613efd103f'
#                 ]
#             },
#             {
#                 'name': 'Wireless Gaming Mouse',
#                 'title': 'Pro Gaming',
#                 'description': 'High-precision gaming mouse with customizable RGB lighting. 16000 DPI sensor with programmable buttons. Ergonomic design.',
#                 'price': Decimal('79.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 90,
#                 'sold': 71,
#                 'average_ratings': '4.8',
#                 'category_name': 'Gaming',
#                 'search_categories': 'ELECTRONICS',
#                 'default_size': 'Standard',
#                 'default_color': 'Black',
#                 'materials': 'ABS Plastic',
#                 'care_instructions': 'Clean with microfiber cloth',
#                 'rating_count': 82,
#                 'main_image': 'https://images.unsplash.com/photo-1527814050087-3793815479db',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1527814050087-3793815479db',
#                     'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
#                     'https://images.unsplash.com/photo-1563297007-0686b7003af7',
#                     'https://images.unsplash.com/photo-1586288947138-c2bb31f29c50'
#                 ]
#             },
#             {
#                 'name': 'USB-C Hub Adapter',
#                 'title': 'Multi-Port',
#                 'description': '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more. Plug and play with aluminum casing. Fast data transfer.',
#                 'price': Decimal('39.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 120,
#                 'sold': 89,
#                 'average_ratings': '4.6',
#                 'category_name': 'Adapters',
#                 'search_categories': 'ELECTRONICS',
#                 'default_size': 'Compact',
#                 'default_color': 'Gray',
#                 'materials': 'Aluminum Alloy',
#                 'care_instructions': 'Keep ports clean and dry',
#                 'rating_count': 76,
#                 'main_image': 'https://images.unsplash.com/photo-1625948515291-69613efd103f',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1625948515291-69613efd103f',
#                     'https://images.unsplash.com/photo-1591488320449-011701bb6704',
#                     'https://images.unsplash.com/photo-1624823183493-ed5832f48f18',
#                     'https://images.unsplash.com/photo-1625948515291-69613efd103f'
#                 ]
#             },
#             {
#                 'name': 'LED Desk Lamp with USB',
#                 'title': 'Smart Lighting',
#                 'description': 'Modern LED desk lamp with touch control and USB charging port. Adjustable color temperature and brightness. Energy efficient.',
#                 'price': Decimal('54.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 105,
#                 'sold': 68,
#                 'average_ratings': '4.7',
#                 'category_name': 'Desk Accessories',
#                 'search_categories': 'ELECTRONICS',
#                 'default_size': 'Standard',
#                 'default_color': 'White',
#                 'materials': 'ABS Plastic, LED',
#                 'care_instructions': 'Wipe with dry cloth',
#                 'rating_count': 63,
#                 'main_image': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
#                     'https://images.unsplash.com/photo-1540932239986-30128078f3c5',
#                     'https://images.unsplash.com/photo-1550985616-10810253b84d',
#                     'https://images.unsplash.com/photo-1565602726621-c265800c3b01'
#                 ]
#             },

#             # BEAUTY (3 products)
#             {
#                 'name': 'Organic Face Serum',
#                 'title': 'Anti-Aging',
#                 'description': 'Premium anti-aging face serum with hyaluronic acid and vitamin C. Reduces fine lines and brightens skin. Natural ingredients.',
#                 'price': Decimal('69.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 85,
#                 'sold': 63,
#                 'average_ratings': '4.8',
#                 'category_name': 'Skincare',
#                 'search_categories': 'BEAUTY',
#                 'default_size': '30ml',
#                 'default_color': 'Clear',
#                 'materials': 'Hyaluronic Acid, Vitamin C, Botanical Extracts',
#                 'care_instructions': 'Store in cool place, use within 6 months',
#                 'rating_count': 71,
#                 'main_image': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
#                     'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908',
#                     'https://images.unsplash.com/photo-1556228994-d8b989c7af9a',
#                     'https://images.unsplash.com/photo-1571875257727-256c39da42af'
#                 ]
#             },
#             {
#                 'name': 'Luxury Lipstick Set',
#                 'title': '5-Color Collection',
#                 'description': 'Set of 5 long-lasting lipsticks in popular shades. Moisturizing formula with vitamin E. Matte and satin finishes included.',
#                 'price': Decimal('89.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 70,
#                 'sold': 54,
#                 'average_ratings': '4.6',
#                 'category_name': 'Makeup',
#                 'search_categories': 'BEAUTY',
#                 'default_size': 'Standard',
#                 'default_color': 'Various',
#                 'materials': 'Wax, Oils, Pigments, Vitamin E',
#                 'care_instructions': 'Store at room temperature',
#                 'rating_count': 59,
#                 'main_image': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
#                     'https://images.unsplash.com/photo-1631214460839-f83b8c60e4d7',
#                     'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
#                     'https://images.unsplash.com/photo-1596704017254-9b121068ec31'
#                 ]
#             },
#             {
#                 'name': 'Hair Care Treatment Set',
#                 'title': 'Professional',
#                 'description': 'Complete hair care set with shampoo, conditioner, and mask. Repairs damaged hair and adds shine. Sulfate-free formula.',
#                 'price': Decimal('59.99'),
#                 'discount': Decimal('20.00'),
#                 'discount_percentage': '20%',
#                 'stock': 95,
#                 'sold': 72,
#                 'average_ratings': '4.7',
#                 'category_name': 'Hair Care',
#                 'search_categories': 'BEAUTY',
#                 'default_size': '250ml each',
#                 'default_color': 'N/A',
#                 'materials': 'Natural Oils, Proteins, Botanical Extracts',
#                 'care_instructions': 'Keep bottles sealed when not in use',
#                 'rating_count': 81,
#                 'main_image': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b',
#                     'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
#                     'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d',
#                     'https://images.unsplash.com/photo-1556228720-195a672e8a03'
#                 ]
#             },

#             # SPORTS (3 products)
#             {
#                 'name': 'Yoga Mat Premium',
#                 'title': 'Non-Slip',
#                 'description': 'Extra thick yoga mat with superior grip and cushioning. Eco-friendly TPE material. Includes carrying strap.',
#                 'price': Decimal('49.99'),
#                 'discount': Decimal('15.00'),
#                 'discount_percentage': '15%',
#                 'stock': 110,
#                 'sold': 87,
#                 'average_ratings': '4.7',
#                 'category_name': 'Yoga',
#                 'search_categories': 'SPORTS',
#                 'default_size': '72x24',
#                 'default_color': 'Purple',
#                 'materials': 'TPE (Thermoplastic Elastomer)',
#                 'care_instructions': 'Wipe with damp cloth, air dry',
#                 'rating_count': 93,
#                 'main_image': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
#                     'https://images.unsplash.com/photo-1592432678016-e910b452f9a0',
#                     'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
#                     'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6'
#                 ]
#             },
#             {
#                 'name': 'Adjustable Dumbbells Set',
#                 'title': 'Home Gym',
#                 'description': 'Space-saving adjustable dumbbells from 5-52.5 lbs. Quick weight adjustment system. Durable construction for home workouts.',
#                 'price': Decimal('299.99'),
#                 'discount': Decimal('25.00'),
#                 'discount_percentage': '25%',
#                 'stock': 45,
#                 'sold': 31,
#                 'average_ratings': '4.8',
#                 'category_name': 'Weights',
#                 'search_categories': 'SPORTS',
#                 'default_size': 'Adjustable',
#                 'default_color': 'Black',
#                 'materials': 'Cast Iron, Rubber',
#                 'care_instructions': 'Wipe clean after use',
#                 'rating_count': 47,
#                 'main_image': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1517838277536-f5f99be501cd',
#                     'https://images.unsplash.com/photo-1584466977773-e625c37cdd50',
#                     'https://images.unsplash.com/photo-1599058917212-d750089bc07e',
#                     'https://images.unsplash.com/photo-1598971639058-fab3c3109a00'
#                 ]
#             },
#             {
#                 'name': 'Camping Tent 4-Person',
#                 'title': 'All-Season',
#                 'description': 'Spacious 4-person camping tent with waterproof rainfly. Easy setup with color-coded poles. Includes storage bag and stakes.',
#                 'price': Decimal('189.99'),
#                 'discount': Decimal('30.00'),
#                 'discount_percentage': '30%',
#                 'stock': 55,
#                 'sold': 38,
#                 'average_ratings': '4.6',
#                 'category_name': 'Camping',
#                 'search_categories': 'SPORTS',
#                 'default_size': '4-Person',
#                 'default_color': 'Green',
#                 'materials': 'Polyester, Fiberglass Poles',
#                 'care_instructions': 'Dry completely before storing',
#                 'rating_count': 52,
#                 'main_image': 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
#                 'variant_images': [
#                     'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
#                     'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed',
#                     'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
#                     'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce'
#                 ]
#             },
#         ]

#         self.stdout.write(self.style.SUCCESS('Starting product population...'))

#         # Create parent categories first
#         parent_categories = {
#             'CLOTHES': 'Clothes and Wear',
#             'HOME': 'Home Interiors',
#             'ELECTRONICS': 'Electronics',
#             'BEAUTY': 'Beauty & Health',
#             'SPORTS': 'Sports & Outdoors',
#         }
        
#         parents_created = {}
#         for key, name in parent_categories.items():
#             parent, created = Category.objects.get_or_create(
#                 name=name,
#                 defaults={'slug': slugify(name), 'parent': None}
#             )
#             parents_created[key] = parent
#             if created:
#                 self.stdout.write(f'Created parent category: {name}')

#         # Create subcategories for products
#         categories_created = {}
#         for product_data in products_data:
#             cat_name = product_data['category_name']
#             search_cat = product_data['search_categories']
            
#             if cat_name not in categories_created:
#                 parent_cat = parents_created.get(search_cat)
                
#                 category, created = Category.objects.get_or_create(
#                     name=cat_name,
#                     defaults={
#                         'slug': slugify(cat_name),
#                         'parent': parent_cat
#                     }
#                 )
#                 categories_created[cat_name] = category
#                 if created:
#                     self.stdout.write(f'Created subcategory: {cat_name} under {parent_cat.name}')

#         # Create products
#         for idx, product_data in enumerate(products_data, 1):
#             # Extract data
#             variant_image_urls = product_data.pop('variant_images')
#             main_image_url = product_data.pop('main_image')
#             category_name = product_data.pop('category_name')
            
#             # Get category
#             category = categories_created[category_name]
            
#             # Create product
#             product = Product.objects.create(
#                 name=product_data['name'],
#                 title=product_data['title'],
#                 slug=slugify(product_data['name']),
#                 description=product_data['description'],
#                 price=product_data['price'],
#                 discount=product_data['discount'],
#                 discount_percentage=product_data['discount_percentage'],
#                 stock=product_data['stock'],
#                 sold=product_data['sold'],
#                 average_ratings=product_data['average_ratings'],
#                 category=category,
#                 search_categories=product_data['search_categories'],
#                 default_size=product_data['default_size'],
#                 default_color=product_data['default_color'],
#                 materials=product_data['materials'],
#                 care_instructions=product_data['care_instructions'],
#                 rating_count=product_data['rating_count'],
#                 is_active=True
#             )

#             # Download and set main product image
#             try:
#                 full_url = f"{main_image_url}?w=800&h=800&fit=crop&q=85"
#                 response = requests.get(full_url, timeout=10)
                
#                 if response.status_code == 200:
#                     img_content = ContentFile(response.content)
#                     img_name = f"{product.slug}_main.jpg"
#                     product.image.save(img_name, img_content, save=True)
#                     self.stdout.write(f'  ✓ Set main image for {product.name}')
#             except Exception as e:
#                 self.stdout.write(self.style.WARNING(
#                     f'  ✗ Error setting main image for {product.name}: {str(e)}'
#                 ))

#             # Get quality variants for this product type
#             variants = self.get_quality_variants(product_data['search_categories'])

#             # Create ProductQuality instances with images
#             for quality_idx, (img_url, variant) in enumerate(zip(variant_image_urls, variants), 1):
#                 try:
#                     full_url = f"{img_url}?w=800&h=800&fit=crop&q=85"
#                     response = requests.get(full_url, timeout=10)
                    
#                     if response.status_code == 200:
#                         img_content = ContentFile(response.content)
#                         img_name = f"{product.slug}_quality_{quality_idx}.jpg"
                        
#                         # Create ProductQuality instance linked to product
#                         quality = ProductQuality.objects.create(
#                             product=product,  # Link to parent product
#                             color=variant['color'],
#                             size=variant['size']
#                         )
#                         quality.image.save(img_name, img_content, save=True)
                        
#                         self.stdout.write(
#                             f'  ✓ Added ProductQuality {quality_idx}: '
#                             f'{variant["color"]} - {variant["size"]} for {product.name}'
#                         )
#                     else:
#                         self.stdout.write(self.style.WARNING(
#                             f'  ✗ Failed to download quality image {quality_idx}'
#                         ))
#                 except Exception as e:
#                     self.stdout.write(self.style.ERROR(
#                         f'  ✗ Error creating quality {quality_idx}: {str(e)}'
#                     ))

#             self.stdout.write(self.style.SUCCESS(
#                 f'[{idx}/30] ✓ Created product: {product.name} with 4 quality variants\n'
#             ))

#         self.stdout.write(self.style.SUCCESS(
#             f'\n🎉 Successfully created 30 products with 4 ProductQuality variants each!'
#         ))


#     help = 'Populate SpecialOffer, OutdoorProduct, and ElectronicsProduct models'

#     def download_image(self, url, filename):
#         """Download image from URL and return ContentFile"""
#         try:
#             full_url = f"{url}?w=800&h=800&fit=crop&q=85"
#             response = requests.get(full_url, timeout=10)
#             if response.status_code == 200:
#                 return ContentFile(response.content), filename
#         except Exception as e:
#             self.stdout.write(self.style.WARNING(f'Error downloading {filename}: {str(e)}'))
#         return None, None

#     def handle(self, *args, **kwargs):
#         self.stdout.write(self.style.SUCCESS('Starting promotional data population...'))

#         # Check if products exist
#         if not Product.objects.exists():
#             self.stdout.write(self.style.ERROR(
#                 'No products found! Please run populate_products command first.'
#             ))
#             return

#         # ===== SPECIAL OFFERS =====
#         self.stdout.write(self.style.SUCCESS('\n📢 Creating Special Offers...'))
        
#         special_offer_data = [
#             {
#                 'title': 'Summer Fashion Sale - Up to 50% Off',
#                 'discount_percentage': Decimal('50.00'),
#                 'product_search': 'Floral Dress',  # Fixed search term
#                 'image_url': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
#                 'days_valid': 30
#             },
#             {
#                 'title': 'Premium Leather Jacket - Limited Time Offer',
#                 'discount_percentage': Decimal('25.00'),
#                 'product_search': 'Leather Jacket',
#                 'image_url': 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
#                 'days_valid': 15
#             },
#             {
#                 'title': 'Winter Warmth Sale - Cozy Essentials',
#                 'discount_percentage': Decimal('30.00'),
#                 'product_search': 'Winter Puffer Coat',
#                 'image_url': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
#                 'days_valid': 45
#             },
#             {
#                 'title': 'Tech Deal - Wireless Headphones',
#                 'discount_percentage': Decimal('25.00'),
#                 'product_search': 'Wireless Bluetooth Headphones',
#                 'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
#                 'days_valid': 20
#             },
#             {
#                 'title': 'Smart Watch Flash Sale',
#                 'discount_percentage': Decimal('30.00'),
#                 'product_search': 'Smart Watch Fitness Tracker',
#                 'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
#                 'days_valid': 10
#             },
#             {
#                 'title': 'Home Decor Mega Sale',
#                 'discount_percentage': Decimal('35.00'),
#                 'product_search': 'Decorative Throw Pillows Set',
#                 'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
#                 'days_valid': 25
#             },
#             {
#                 'title': 'Fitness Gear Clearance',
#                 'discount_percentage': Decimal('20.00'),
#                 'product_search': 'Yoga Mat Premium',
#                 'image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
#                 'days_valid': 30
#             },
#             {
#                 'title': 'Beauty & Skincare Bundle',
#                 'discount_percentage': Decimal('40.00'),
#                 'product_search': 'Organic Face Serum',
#                 'image_url': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
#                 'days_valid': 15
#             },
#         ]

#         for idx, offer_data in enumerate(special_offer_data, 1):
#             try:
#                 product = Product.objects.filter(
#                     name__icontains=offer_data['product_search']
#                 ).first()
                
#                 if product:
#                     # Download image
#                     img_content, img_name = self.download_image(
#                         offer_data['image_url'],
#                         f"special_offer_{idx}.jpg"
#                     )
                    
#                     # Create special offer
#                     special_offer = SpecialOffer.objects.create(
#                         title=offer_data['title'],
#                         discount_percentage=offer_data['discount_percentage'],
#                         price=product.price,
#                         valid_from=timezone.now(),
#                         product=product
#                     )
                    
#                     if img_content:
#                         special_offer.image.save(img_name, img_content, save=True)
                    
#                     self.stdout.write(self.style.SUCCESS(
#                         f'  ✓ [{idx}/8] Created Special Offer: {offer_data["title"]}'
#                     ))
#                 else:
#                     self.stdout.write(self.style.WARNING(
#                         f'  ✗ Product not found for: {offer_data["product_search"]}'
#                     ))
#             except Exception as e:
#                 self.stdout.write(self.style.ERROR(
#                     f'  ✗ Error creating special offer {idx}: {str(e)}'
#                 ))

#         # ===== OUTDOOR PRODUCTS =====
#         self.stdout.write(self.style.SUCCESS('\n🏕️ Creating Outdoor Products...'))
        
#         outdoor_data = [
#             {
#                 'title': 'Professional Camping Tent - 4 Person',
#                 'discount_percentage': Decimal('30.00'),
#                 'product_search': 'Camping Tent 4-Person',
#                 'image_url': 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d'
#             },
#             {
#                 'title': 'Premium Yoga Mat - Eco Friendly',
#                 'discount_percentage': Decimal('15.00'),
#                 'product_search': 'Yoga Mat Premium',
#                 'image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'
#             },
#             {
#                 'title': 'Adjustable Dumbbells - Home Gym Essential',
#                 'discount_percentage': Decimal('25.00'),
#                 'product_search': 'Adjustable Dumbbells Set',
#                 'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd'
#             },
#             {
#                 'title': 'Performance Running Shorts',
#                 'discount_percentage': Decimal('15.00'),
#                 'product_search': 'Athletic Running Shorts',
#                 'image_url': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b'
#             },
#             {
#                 'title': 'Winter Puffer Jacket - All Weather',
#                 'discount_percentage': Decimal('30.00'),
#                 'product_search': 'Winter Puffer Coat',
#                 'image_url': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3'
#             },
#             {
#                 'title': 'Athletic Yoga Leggings - Premium Stretch',
#                 'discount_percentage': Decimal('25.00'),
#                 'product_search': 'Yoga Leggings',
#                 'image_url': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8'
#             },
#             {
#                 'title': 'Outdoor Adventure Hoodie',
#                 'discount_percentage': Decimal('15.00'),
#                 'product_search': 'Casual Hoodie',
#                 'image_url': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7'
#             },
#             {
#                 'title': 'Summer Activewear Collection',
#                 'discount_percentage': Decimal('20.00'),
#                 'product_search': 'Floral Dress',  # Fixed search term
#                 'image_url': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1'
#             },
#         ]

#         for idx, outdoor in enumerate(outdoor_data, 1):
#             try:
#                 product = Product.objects.filter(
#                     name__icontains=outdoor['product_search']
#                 ).first()
                
#                 if product:
#                     img_content, img_name = self.download_image(
#                         outdoor['image_url'],
#                         f"outdoor_{idx}.jpg"
#                     )
                    
#                     outdoor_product = OutdoorProduct.objects.create(
#                         title=outdoor['title'],
#                         discount_percentage=outdoor['discount_percentage'],
#                         price=product.price,
#                         product=product
#                     )
                    
#                     if img_content:
#                         outdoor_product.image.save(img_name, img_content, save=True)
                    
#                     self.stdout.write(self.style.SUCCESS(
#                         f'  ✓ [{idx}/8] Created Outdoor Product: {outdoor["title"]}'
#                     ))
#                 else:
#                     self.stdout.write(self.style.WARNING(
#                         f'  ✗ Product not found for: {outdoor["product_search"]}'
#                     ))
#             except Exception as e:
#                 self.stdout.write(self.style.ERROR(
#                     f'  ✗ Error creating outdoor product {idx}: {str(e)}'
#                 ))

#         # ===== ELECTRONICS PRODUCTS =====
#         self.stdout.write(self.style.SUCCESS('\n⚡ Creating Electronics Products...'))
        
#         electronics_data = [
#             {
#                 'title': 'Premium Wireless Headphones - Noise Cancelling',
#                 'discount_percentage': Decimal('25.00'),
#                 'product_search': 'Wireless Bluetooth Headphones',
#                 'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
#             },
#             {
#                 'title': 'Smart Watch Fitness Tracker - Advanced Features',
#                 'discount_percentage': Decimal('30.00'),
#                 'product_search': 'Smart Watch Fitness Tracker',
#                 'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
#             },
#             {
#                 'title': 'Portable Power Bank 20000mAh - Fast Charging',
#                 'discount_percentage': Decimal('20.00'),
#                 'product_search': 'Portable Power Bank',
#                 'image_url': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5'
#             },
#             {
#                 'title': 'Pro Gaming Mouse - RGB Lighting',
#                 'discount_percentage': Decimal('15.00'),
#                 'product_search': 'Wireless Gaming Mouse',
#                 'image_url': 'https://images.unsplash.com/photo-1527814050087-3793815479db'
#             },
#             {
#                 'title': 'USB-C Multi-Port Hub - 7-in-1 Adapter',
#                 'discount_percentage': Decimal('25.00'),
#                 'product_search': 'USB-C Hub Adapter',
#                 'image_url': 'https://images.unsplash.com/photo-1625948515291-69613efd103f'
#             },
#             {
#                 'title': 'LED Desk Lamp with USB Charging',
#                 'discount_percentage': Decimal('20.00'),
#                 'product_search': 'LED Desk Lamp with USB',
#                 'image_url': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'
#             },
#             {
#                 'title': 'Modern Table Lamp - Smart Touch Control',
#                 'discount_percentage': Decimal('20.00'),
#                 'product_search': 'Modern Table Lamp',
#                 'image_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c'
#             },
#             {
#                 'title': 'Minimalist Wall Clock - Silent Movement',
#                 'discount_percentage': Decimal('15.00'),
#                 'product_search': 'Minimalist Clock',
#                 'image_url': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c'
#             },
#         ]

#         for idx, electronic in enumerate(electronics_data, 1):
#             try:
#                 product = Product.objects.filter(
#                     name__icontains=electronic['product_search']
#                 ).first()
                
#                 if product:
#                     img_content, img_name = self.download_image(
#                         electronic['image_url'],
#                         f"electronics_{idx}.jpg"
#                     )
                    
#                     electronics_product = ElectronicsProduct.objects.create(
#                         title=electronic['title'],
#                         discount_percentage=electronic['discount_percentage'],
#                         price=product.price,
#                         product=product
#                     )
                    
#                     if img_content:
#                         electronics_product.image.save(img_name, img_content, save=True)
                    
#                     self.stdout.write(self.style.SUCCESS(
#                         f'  ✓ [{idx}/8] Created Electronics Product: {electronic["title"]}'
#                     ))
#                 else:
#                     self.stdout.write(self.style.WARNING(
#                         f'  ✗ Product not found for: {electronic["product_search"]}'
#                     ))
#             except Exception as e:
#                 self.stdout.write(self.style.ERROR(
#                     f'  ✗ Error creating electronics product {idx}: {str(e)}'
#                 ))

#         # ===== SUMMARY =====
#         self.stdout.write(self.style.SUCCESS('\n' + '='*60))
#         self.stdout.write(self.style.SUCCESS('📊 SUMMARY'))
#         self.stdout.write(self.style.SUCCESS('='*60))
        
#         special_count = SpecialOffer.objects.count()
#         outdoor_count = OutdoorProduct.objects.count()
#         electronics_count = ElectronicsProduct.objects.count()
        
#         self.stdout.write(self.style.SUCCESS(f'✓ Special Offers created: {special_count}'))
#         self.stdout.write(self.style.SUCCESS(f'✓ Outdoor Products created: {outdoor_count}'))
#         self.stdout.write(self.style.SUCCESS(f'✓ Electronics Products created: {electronics_count}'))
#         self.stdout.write(self.style.SUCCESS(f'✓ Total promotional items: {special_count + outdoor_count + electronics_count}'))
#         self.stdout.write(self.style.SUCCESS('\n🎉 Promotional data population completed successfully!'))



