# from django.core.files.base import ContentFile
# from decimal import Decimal
# from django.utils import timezone
# from django.utils.text import slugify
# import requests
# from io import BytesIO
# from PIL import Image
# import random
# import copy

# # Categories data matching your Category model
# categories_data = [
#     {
#         "name": "ALL",
#         "slug": "all-categories"
#     },
#     {
#         "name": "CLOTHES",
#         "slug": "clothes-wear"
#     },
#     {
#         "name": "HOME", 
#         "slug": "home-interiors"
#     },
#     {
#         "name": "ELECTRONICS",
#         "slug": "electronics"
#     },
#     {
#         "name": "BEAUTY",
#         "slug": "beauty-health"
#     },
#     {
#         "name": "SPORTS",
#         "slug": "sports-outdoors"
#     }
# ]

# # Products data with working image URLs
# products_data = [
#     # Clothes - 6 products
#     {
#         "name": "Casual Blazer",
#         "title": "Men's Slim Blazer",
#         "category_name": "CLOTHES",
#         "description": "Elegant slim-fit blazer perfect for business casual occasions. Made from premium wool blend with comfortable stretch.",
#         "price": Decimal("89.99"),
#         "discount": Decimal("10.00"),
#         "stock": 45,
#         "default_size": "L",
#         "default_color": "Navy",
#         "materials": "70% Wool, 25% Polyester, 5% Elastane",
#         "care_instructions": "Dry clean only. Do not bleach.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1594938371073-8c8d8dbee0c0",
#             "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
#             "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
#             "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
#         ],
#         "qualities": [
#             {"color": "Navy", "size": "M"},
#             {"color": "Navy", "size": "L"},
#             {"color": "Black", "size": "M"},
#             {"color": "Black", "size": "L"}
#         ]
#     },
#     {
#         "name": "Knit Sweater",
#         "title": "Cozy Pullover",
#         "category_name": "CLOTHES",
#         "description": "Warm cable-knit sweater for cold weather comfort. Perfect for winter seasons with soft cotton blend.",
#         "price": Decimal("42.99"),
#         "discount": Decimal("5.00"),
#         "stock": 78,
#         "default_size": "M",
#         "default_color": "Burgundy",
#         "materials": "100% Cotton",
#         "care_instructions": "Machine wash cold. Tumble dry low.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
#             "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
#             "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
#             "https://images.unsplash.com/photo-1574180045827-681f8a1a9622"
#         ],
#         "qualities": [
#             {"color": "Burgundy", "size": "S"},
#             {"color": "Burgundy", "size": "M"},
#             {"color": "Navy", "size": "S"},
#             {"color": "Navy", "size": "M"}
#         ]
#     },
#     {
#         "name": "Cargo Shorts",
#         "title": "Summer Shorts",
#         "category_name": "CLOTHES",
#         "description": "Comfortable cargo shorts with multiple pockets. Ideal for outdoor activities and casual wear.",
#         "price": Decimal("34.99"),
#         "discount": None,
#         "stock": 120,
#         "default_size": "32",
#         "default_color": "Olive",
#         "materials": "100% Cotton Twill",
#         "care_instructions": "Machine wash warm. Do not iron prints.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1506629905607-e48b0e67d879",
#             "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
#             "https://images.unsplash.com/photo-1506629905607-e48b0e67d879",
#             "https://images.unsplash.com/photo-1591195853828-11db59a44f6b"
#         ],
#         "qualities": [
#             {"color": "Olive", "size": "30"},
#             {"color": "Olive", "size": "32"},
#             {"color": "Black", "size": "30"},
#             {"color": "Black", "size": "32"}
#         ]
#     },
#     {
#         "name": "Athletic Leggings",
#         "title": "Workout Tights",
#         "category_name": "CLOTHES",
#         "description": "High-waist athletic leggings with moisture-wicking fabric. Perfect for yoga, gym, and running.",
#         "price": Decimal("38.99"),
#         "discount": Decimal("15.00"),
#         "stock": 95,
#         "default_size": "S",
#         "default_color": "Black",
#         "materials": "88% Nylon, 12% Spandex",
#         "care_instructions": "Machine wash cold. Lay flat to dry.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1508296695146-257a814070b4",
#             "https://images.unsplash.com/photo-1506629082955-511b1aa562c8",
#             "https://images.unsplash.com/photo-1508296695146-257a814070b4",
#             "https://images.unsplash.com/photo-1506629082955-511b1aa562c8"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "XS"},
#             {"color": "Black", "size": "S"},
#             {"color": "Navy", "size": "XS"},
#             {"color": "Navy", "size": "S"}
#         ]
#     },
#     {
#         "name": "Denim Jacket",
#         "title": "Classic Jean Jacket",
#         "category_name": "CLOTHES",
#         "description": "Timeless denim jacket with button closure. Vintage wash with comfortable fit for all seasons.",
#         "price": Decimal("59.99"),
#         "discount": Decimal("8.00"),
#         "stock": 60,
#         "default_size": "M",
#         "default_color": "Blue",
#         "materials": "100% Cotton Denim",
#         "care_instructions": "Machine wash cold. Wash inside out.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
#             "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
#             "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
#             "https://images.unsplash.com/photo-1576995853123-5a10305d93c0"
#         ],
#         "qualities": [
#             {"color": "Blue", "size": "S"},
#             {"color": "Blue", "size": "M"},
#             {"color": "Black", "size": "S"},
#             {"color": "Black", "size": "M"}
#         ]
#     },
#     {
#         "name": "Ankle Boots",
#         "title": "Leather Boots",
#         "category_name": "CLOTHES",
#         "description": "Genuine leather ankle boots with side zipper. Comfortable for all-day wear with cushioned insoles.",
#         "price": Decimal("94.99"),
#         "discount": Decimal("12.00"),
#         "stock": 35,
#         "default_size": "9",
#         "default_color": "Brown",
#         "materials": "Genuine Leather, Rubber Sole",
#         "care_instructions": "Use leather conditioner. Protect from water.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
#             "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
#             "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
#             "https://images.unsplash.com/photo-1543163521-1bf539c55dd2"
#         ],
#         "qualities": [
#             {"color": "Brown", "size": "8"},
#             {"color": "Brown", "size": "9"},
#             {"color": "Black", "size": "8"},
#             {"color": "Black", "size": "9"}
#         ]
#     },
    
#     # Home Interiors - 6 products
#     {
#         "name": "Pendant Light",
#         "title": "Modern Chandelier",
#         "category_name": "HOME",
#         "description": "Elegant crystal pendant light for dining room. Creates beautiful light patterns with LED compatible design.",
#         "price": Decimal("129.99"),
#         "discount": Decimal("20.00"),
#         "stock": 25,
#         "default_size": "24 inch",
#         "default_color": "Chrome",
#         "materials": "Crystal, Metal, Glass",
#         "care_instructions": "Wipe with dry cloth. Do not use chemicals.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1558618666-fcd25856cd63",
#             "https://images.unsplash.com/photo-1567225477277-c1c5b3e0d9d1",
#             "https://images.unsplash.com/photo-1558618666-fcd25856cd63",
#             "https://images.unsplash.com/photo-1567225477277-c1c5b3e0d9d1"
#         ],
#         "qualities": [
#             {"color": "Chrome", "size": "20 inch"},
#             {"color": "Chrome", "size": "24 inch"},
#             {"color": "Gold", "size": "20 inch"},
#             {"color": "Gold", "size": "24 inch"}
#         ]
#     },
#     {
#         "name": "Accent Chair",
#         "title": "Mid-Century Chair",
#         "category_name": "HOME",
#         "description": "Stylish mid-century modern accent chair with wooden legs. Perfect for living room or bedroom decor.",
#         "price": Decimal("189.99"),
#         "discount": Decimal("25.00"),
#         "stock": 15,
#         "default_size": None,
#         "default_color": "Mustard",
#         "materials": "Fabric, Solid Wood, Foam",
#         "care_instructions": "Spot clean only. Avoid direct sunlight.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
#             "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
#             "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
#             "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c"
#         ],
#         "qualities": [
#             {"color": "Mustard", "size": None},
#             {"color": "Navy", "size": None},
#             {"color": "Emerald", "size": None},
#             {"color": "Rose", "size": None}
#         ]
#     },
#     {
#         "name": "Side Table",
#         "title": "Nightstand",
#         "category_name": "HOME",
#         "description": "Compact side table with drawer storage. Modern design with smooth finish and easy assembly.",
#         "price": Decimal("79.99"),
#         "discount": None,
#         "stock": 40,
#         "default_size": "18x18",
#         "default_color": "White",
#         "materials": "Engineered Wood, Metal Hardware",
#         "care_instructions": "Wipe with damp cloth. Avoid excessive moisture.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
#             "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
#             "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
#             "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
#         ],
#         "qualities": [
#             {"color": "White", "size": "18x18"},
#             {"color": "White", "size": "20x20"},
#             {"color": "Black", "size": "18x18"},
#             {"color": "Black", "size": "20x20"}
#         ]
#     },
#     {
#         "name": "Wall Clock",
#         "title": "Vintage Clock",
#         "category_name": "HOME",
#         "description": "Large vintage-style wall clock with Roman numerals. Silent movement mechanism for quiet operation.",
#         "price": Decimal("44.99"),
#         "discount": Decimal("10.00"),
#         "stock": 65,
#         "default_size": "20 inch",
#         "default_color": "Black",
#         "materials": "Metal, Glass, Battery Movement",
#         "care_instructions": "Dust with soft cloth. Replace battery yearly.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
#             "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c",
#             "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
#             "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "16 inch"},
#             {"color": "Black", "size": "20 inch"},
#             {"color": "White", "size": "16 inch"},
#             {"color": "White", "size": "20 inch"}
#         ]
#     },
#     {
#         "name": "Throw Blanket",
#         "title": "Soft Blanket",
#         "category_name": "HOME",
#         "description": "Ultra-soft fleece throw blanket for couch. Perfect for cozy evenings and home decoration.",
#         "price": Decimal("29.99"),
#         "discount": Decimal("5.00"),
#         "stock": 85,
#         "default_size": "50x60",
#         "default_color": "Gray",
#         "materials": "100% Polyester Fleece",
#         "care_instructions": "Machine wash cold. Tumble dry low.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
#             "https://images.unsplash.com/photo-1631679706909-1844bbd07221",
#             "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
#             "https://images.unsplash.com/photo-1631679706909-1844bbd07221"
#         ],
#         "qualities": [
#             {"color": "Gray", "size": "50x60"},
#             {"color": "Gray", "size": "60x80"},
#             {"color": "Beige", "size": "50x60"},
#             {"color": "Beige", "size": "60x80"}
#         ]
#     },
#     {
#         "name": "Picture Frame Set",
#         "title": "Gallery Frames",
#         "category_name": "HOME",
#         "description": "Set of 5 black picture frames in various sizes. Create your own gallery wall with premium frames.",
#         "price": Decimal("39.99"),
#         "discount": None,
#         "stock": 100,
#         "default_size": "Multi",
#         "default_color": "Black",
#         "materials": "Wood Composite, Glass",
#         "care_instructions": "Clean glass with glass cleaner. Dust frame regularly.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
#             "https://images.unsplash.com/photo-1582053433976-25c00369fc93",
#             "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
#             "https://images.unsplash.com/photo-1582053433976-25c00369fc93"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "6 x 8 inch"},
#             {"color": "Black", "size": "8 x 11 inch"},
#             {"color": "White", "size": "6 x 8 inch"},
#             {"color": "White", "size": "8 x 11 inch"}
#         ]
#     },
    
#     # Electronics - 6 products
#     {
#         "name": "Wireless Charger",
#         "title": "Fast Charging Pad",
#         "category_name": "ELECTRONICS",
#         "description": "Qi wireless charging pad with LED indicator. Fast charging compatible with most smartphones.",
#         "price": Decimal("24.99"),
#         "discount": Decimal("8.00"),
#         "stock": 150,
#         "default_size": None,
#         "default_color": "White",
#         "materials": "Plastic, Electronic Components",
#         "care_instructions": "Keep dry. Wipe with dry cloth.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
#             "https://images.unsplash.com/photo-1591290619762-71d1e58e7a1b",
#             "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
#             "https://images.unsplash.com/photo-1591290619762-71d1e58e7a1b"
#         ],
#         "qualities": [
#             {"color": "White", "size": None},
#             {"color": "Black", "size": None},
#             {"color": "Silver", "size": None},
#             {"color": "Rose", "size": None}
#         ]
#     },
#     {
#         "name": "Gaming Headset",
#         "title": "RGB Headphones",
#         "category_name": "ELECTRONICS",
#         "description": "7.1 surround sound gaming headset with microphone. Customizable RGB lighting and comfortable ear cups.",
#         "price": Decimal("79.99"),
#         "discount": Decimal("15.00"),
#         "stock": 60,
#         "default_size": None,
#         "default_color": "Black",
#         "materials": "Plastic, Metal, Memory Foam",
#         "care_instructions": "Wipe with damp cloth. Store in dry place.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1599669454699-248893623440",
#             "https://images.unsplash.com/photo-1599669454699-248893623440",
#             "https://images.unsplash.com/photo-1599669454699-248893623440",
#             "https://images.unsplash.com/photo-1599669454699-248893623440"
#         ],
#         "qualities": [
#             {"color": "Black", "size": None},
#             {"color": "White", "size": None},
#             {"color": "Red", "size": None},
#             {"color": "Blue", "size": None}
#         ]
#     },
#     {
#         "name": "Phone Case",
#         "title": "Protective Case",
#         "category_name": "ELECTRONICS",
#         "description": "Shockproof phone case with raised edges. Military grade protection with clear design.",
#         "price": Decimal("14.99"),
#         "discount": None,
#         "stock": 200,
#         "default_size": "iPhone",
#         "default_color": "Clear",
#         "materials": "TPU, Polycarbonate",
#         "care_instructions": "Wipe with alcohol wipe. Avoid extreme heat.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1601593346740-925612772716",
#             "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb",
#             "https://images.unsplash.com/photo-1601593346740-925612772716",
#             "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb"
#         ],
#         "qualities": [
#             {"color": "Clear", "size": "iPhone 14"},
#             {"color": "Clear", "size": "iPhone 15"},
#             {"color": "Black", "size": "iPhone 14"},
#             {"color": "Black", "size": "iPhone 15"}
#         ]
#     },
#     {
#         "name": "Smart LED Bulb",
#         "title": "WiFi Light Bulb",
#         "category_name": "ELECTRONICS",
#         "description": "Color-changing smart bulb compatible with Alexa and Google Home. 16 million colors with scheduling.",
#         "price": Decimal("19.99"),
#         "discount": Decimal("5.00"),
#         "stock": 180,
#         "default_size": "E26",
#         "default_color": "Multi",
#         "materials": "Plastic, LED, Electronics",
#         "care_instructions": "Install when cool. Use with compatible app.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
#             "https://images.unsplash.com/photo-1550985616-10810253b84d",
#             "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
#             "https://images.unsplash.com/photo-1550985616-10810253b84d"
#         ],
#         "qualities": [
#             {"color": "White", "size": "E26"},
#             {"color": "White", "size": "E27"},
#             {"color": "Multi", "size": "E26"},
#             {"color": "Multi", "size": "E27"}
#         ]
#     },
#     {
#         "name": "Desk Monitor",
#         "title": "24-inch Display",
#         "category_name": "ELECTRONICS",
#         "description": "Full HD IPS monitor with ultra-thin bezels. VESA mount compatible with multiple input ports.",
#         "price": Decimal("159.99"),
#         "discount": Decimal("30.00"),
#         "stock": 35,
#         "default_size": "24 inch",
#         "default_color": "Black",
#         "materials": "Plastic, Glass, Electronics",
#         "care_instructions": "Clean screen with microfiber cloth. Avoid pressure.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c",
#             "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
#             "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c",
#             "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "24 inch"},
#             {"color": "Black", "size": "27 inch"},
#             {"color": "Silver", "size": "24 inch"},
#             {"color": "Silver", "size": "27 inch"}
#         ]
#     },
#     {
#         "name": "External SSD",
#         "title": "Portable Drive",
#         "category_name": "ELECTRONICS",
#         "description": "1TB portable SSD with USB-C connection. Transfer speeds up to 1050MB/s with shock resistance.",
#         "price": Decimal("99.99"),
#         "discount": Decimal("10.00"),
#         "stock": 75,
#         "default_size": "1TB",
#         "default_color": "Gray",
#         "materials": "Aluminum, Electronics",
#         "care_instructions": "Eject safely. Keep away from magnets.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
#             "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
#             "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
#             "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b"
#         ],
#         "qualities": [
#             {"color": "Gray", "size": "500GB"},
#             {"color": "Gray", "size": "1TB"},
#             {"color": "Black", "size": "500GB"},
#             {"color": "Black", "size": "1TB"}
#         ]
#     },
    
#     # Beauty & Health - 6 products
#     {
#         "name": "Lip Gloss Set",
#         "title": "Shine Collection",
#         "category_name": "BEAUTY",
#         "description": "Set of 6 moisturizing lip glosses in trendy shades. Non-sticky formula with vitamin E.",
#         "price": Decimal("26.99"),
#         "discount": Decimal("12.00"),
#         "stock": 90,
#         "default_size": "6x8ml",
#         "default_color": "Multi",
#         "materials": "Cosmetic Grade Ingredients",
#         "care_instructions": "Store at room temperature. Close tightly after use.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
#             "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
#             "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
#             "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
#         ],
#         "qualities": [
#             {"color": "Rose", "size": "6x8ml"},
#             {"color": "Coral", "size": "6x8ml"},
#             {"color": "Peach", "size": "6x8ml"},
#             {"color": "Mint", "size": "6x8ml"}
#         ]
#     },
#     {
#         "name": "Eyeshadow Palette",
#         "title": "Nude Palette",
#         "category_name": "BEAUTY",
#         "description": "18-color eyeshadow palette with mirror. Highly pigmented matte and shimmer shades.",
#         "price": Decimal("32.99"),
#         "discount": Decimal("8.00"),
#         "stock": 65,
#         "default_size": "18 colors",
#         "default_color": "Neutral",
#         "materials": "Talc-free Formula, Mirror",
#         "care_instructions": "Keep dry. Close palette after use.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1515688594390-b649af70d282",
#             "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
#             "https://images.unsplash.com/photo-1515688594390-b649af70d282",
#             "https://images.unsplash.com/photo-1512496015851-a90fb38ba796"
#         ],
#         "qualities": [
#             {"color": "Neutral", "size": "12 colors"},
#             {"color": "Neutral", "size": "18 colors"},
#             {"color": "Vibrant", "size": "12 colors"},
#             {"color": "Vibrant", "size": "18 colors"}
#         ]
#     },
#     {
#         "name": "Micellar Water",
#         "title": "Makeup Remover",
#         "category_name": "BEAUTY",
#         "description": "Gentle micellar water for all skin types. Effectively removes makeup without rinsing.",
#         "price": Decimal("16.99"),
#         "discount": None,
#         "stock": 120,
#         "default_size": "400ml",
#         "default_color": None,
#         "materials": "Aqua, Micelles, Glycerin",
#         "care_instructions": "Shake before use. Use with cotton pad.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
#             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
#             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
#             "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
#         ],
#         "qualities": [
#             {"color": None, "size": "200ml"},
#             {"color": None, "size": "400ml"},
#             {"color": None, "size": "600ml"},
#             {"color": None, "size": "800ml"}
#         ]
#     },
#     {
#         "name": "Hair Straightener",
#         "title": "Ceramic Iron",
#         "category_name": "BEAUTY",
#         "description": "Professional ceramic hair straightener with adjustable temperature. Ionic technology for frizz control.",
#         "price": Decimal("49.99"),
#         "discount": Decimal("20.00"),
#         "stock": 45,
#         "default_size": None,
#         "default_color": "Black",
#         "materials": "Ceramic Plates, Aluminum",
#         "care_instructions": "Unplug when not in use. Clean plates when cool.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1602751959735-17dafe6a94b6",
#             "https://images.unsplash.com/photo-1526045478516-99145907023c",
#             "https://images.unsplash.com/photo-1602751959735-17dafe6a94b6",
#             "https://images.unsplash.com/photo-1526045478516-99145907023c"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "1 inch"},
#             {"color": "Black", "size": "1.5 inch"},
#             {"color": "Pink", "size": "1 inch"},
#             {"color": "Pink", "size": "1.5 inch"}
#         ]
#     },
#     {
#         "name": "Face Cream",
#         "title": "Anti-Aging Cream",
#         "category_name": "BEAUTY",
#         "description": "Retinol night cream for fine lines and wrinkles. Hydrating formula with hyaluronic acid.",
#         "price": Decimal("39.99"),
#         "discount": Decimal("10.00"),
#         "stock": 80,
#         "default_size": "50ml",
#         "default_color": None,
#         "materials": "Retinol, Hyaluronic Acid, Ceramides",
#         "care_instructions": "Use at night. Apply to clean face.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
#             "https://images.unsplash.com/photo-1556228852-80f5ac04fa36",
#             "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
#             "https://images.unsplash.com/photo-1556228852-80f5ac04fa36"
#         ],
#         "qualities": [
#             {"color": None, "size": "30ml"},
#             {"color": None, "size": "50ml"},
#             {"color": None, "size": "75ml"},
#             {"color": None, "size": "100ml"}
#         ]
#     },
#     {
#         "name": "Bath Bombs",
#         "title": "Spa Set",
#         "category_name": "BEAUTY",
#         "description": "Luxury bath bomb set with essential oils. Creates colorful fizz with moisturizing benefits.",
#         "price": Decimal("21.99"),
#         "discount": Decimal("5.00"),
#         "stock": 150,
#         "default_size": "6 pack",
#         "default_color": "Multi",
#         "materials": "Baking Soda, Essential Oils, Colorants",
#         "care_instructions": "Store in dry place. Use within 6 months.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
#             "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
#             "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
#             "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108"
#         ],
#         "qualities": [
#             {"color": "Lavender", "size": "3 pack"},
#             {"color": "Lavender", "size": "6 pack"},
#             {"color": "Rose", "size": "3 pack"},
#             {"color": "Rose", "size": "6 pack"}
#         ]
#     },
    
#     # Sports & Outdoors - 6 products
#     {
#         "name": "Bike Helmet",
#         "title": "Safety Helmet",
#         "category_name": "SPORTS",
#         "description": "Adjustable cycling helmet with ventilation. Meets safety standards with comfortable fit system.",
#         "price": Decimal("39.99"),
#         "discount": Decimal("15.00"),
#         "stock": 70,
#         "default_size": "Adult",
#         "default_color": "Red",
#         "materials": "EPS Foam, Polycarbonate Shell",
#         "care_instructions": "Clean with mild soap. Replace after impact.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1558618666-fcd25856cd63",
#             "https://images.unsplash.com/photo-1565641379548-67006a29f9f3",
#             "https://images.unsplash.com/photo-1558618666-fcd25856cd63",
#             "https://images.unsplash.com/photo-1565641379548-67006a29f9f3"
#         ],
#         "qualities": [
#             {"color": "Red", "size": "Adult"},
#             {"color": "Red", "size": "Youth"},
#             {"color": "Blue", "size": "Adult"},
#             {"color": "Blue", "size": "Youth"}
#         ]
#     },
#     {
#         "name": "Camping Tent",
#         "title": "4-Person Tent",
#         "category_name": "SPORTS",
#         "description": "Waterproof camping tent with easy setup. Lightweight design with rainfly and storage pockets.",
#         "price": Decimal("129.99"),
#         "discount": Decimal("25.00"),
#         "stock": 30,
#         "default_size": "4 person",
#         "default_color": "Green",
#         "materials": "Polyester, Fiberglass Poles, Mesh",
#         "care_instructions": "Dry completely before storage. Clean with damp cloth.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b",
#             "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
#             "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b",
#             "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
#         ],
#         "qualities": [
#             {"color": "Green", "size": "2 person"},
#             {"color": "Green", "size": "4 person"},
#             {"color": "Blue", "size": "2 person"},
#             {"color": "Blue", "size": "4 person"}
#         ]
#     },
#     {
#         "name": "Soccer Ball",
#         "title": "Match Ball",
#         "category_name": "SPORTS",
#         "description": "Official size 5 soccer ball for training and matches. Durable construction with good bounce.",
#         "price": Decimal("24.99"),
#         "discount": None,
#         "stock": 100,
#         "default_size": "Size 5",
#         "default_color": "White",
#         "materials": "PVC, Rubber Bladder",
#         "care_instructions": "Inflate properly. Clean with mild soap.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1614632537197-38a17061c2bd",
#             "https://images.unsplash.com/photo-1614632537197-38a17061c2bd",
#             "https://images.unsplash.com/photo-1614632537197-38a17061c2bd",
#             "https://images.unsplash.com/photo-1614632537197-38a17061c2bd"
#         ],
#         "qualities": [
#             {"color": "White", "size": "Size 4"},
#             {"color": "White", "size": "Size 5"},
#             {"color": "Black", "size": "Size 4"},
#             {"color": "Black", "size": "Size 5"}
#         ]
#     },
#     {
#         "name": "Yoga Block",
#         "title": "Foam Block",
#         "category_name": "SPORTS",
#         "description": "High-density EVA foam yoga block for support. Lightweight and durable for all yoga practices.",
#         "price": Decimal("12.99"),
#         "discount": Decimal("3.00"),
#         "stock": 200,
#         "default_size": "9x6x4",
#         "default_color": "Purple",
#         "materials": "EVA Foam",
#         "care_instructions": "Wipe with damp cloth. Air dry completely.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
#             "https://images.unsplash.com/photo-1588286840104-8957b019727f",
#             "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
#             "https://images.unsplash.com/photo-1588286840104-8957b019727f"
#         ],
#         "qualities": [
#             {"color": "Purple", "size": "9x6x4"},
#             {"color": "Purple", "size": "12x8x6"},
#             {"color": "Blue", "size": "9x6x4"},
#             {"color": "Blue", "size": "12x8x6"}
#         ]
#     },
#     {
#         "name": "Protein Shaker",
#         "title": "Blender Bottle",
#         "category_name": "SPORTS",
#         "description": "Leak-proof protein shaker with mixing ball. Easy to clean with measurement markings.",
#         "price": Decimal("9.99"),
#         "discount": None,
#         "stock": 180,
#         "default_size": "28oz",
#         "default_color": "Black",
#         "materials": "Plastic, Stainless Steel Ball",
#         "care_instructions": "Dishwasher safe. Hand wash recommended.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd",
#             "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd",
#             "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd",
#             "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "20oz"},
#             {"color": "Black", "size": "28oz"},
#             {"color": "Blue", "size": "20oz"},
#             {"color": "Blue", "size": "28oz"}
#         ]
#     },
#     {
#         "name": "Swimming Goggles",
#         "title": "Anti-Fog Goggles",
#         "category_name": "SPORTS",
#         "description": "UV protection swimming goggles with adjustable strap. Anti-fog coating with comfortable seal.",
#         "price": Decimal("19.99"),
#         "discount": Decimal("6.00"),
#         "stock": 120,
#         "default_size": "Adult",
#         "default_color": "Blue",
#         "materials": "Silicone, Polycarbonate Lens",
#         "care_instructions": "Rinse after use. Do not wipe inside lens.",
#         "image_urls": [
#             "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
#             "https://images.unsplash.com/photo-1519315901367-f34ff9154487",
#             "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
#             "https://images.unsplash.com/photo-1519315901367-f34ff9154487"
#         ],
#         "qualities": [
#             {"color": "Blue", "size": "Adult"},
#             {"color": "Blue", "size": "Youth"},
#             {"color": "Clear", "size": "Adult"},
#             {"color": "Clear", "size": "Youth"}
#         ]
#     }
# ]

# def download_image(url, timeout=10):
#     """Download image from URL and return as bytes"""
#     try:
#         # Add parameters to get a properly sized image
#         if '?' not in url:
#             url += '?w=800&q=80&fit=crop'
        
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
#         }
#         response = requests.get(url, timeout=timeout, stream=True, headers=headers)
#         response.raise_for_status()
#         return response.content
#     except Exception as e:
#         print(f"  ⚠ Error downloading image from {url}: {str(e)}")
#         return None

# def smart_resize_image(image_data, max_width=800, max_height=600):
#     """Intelligently resize image ONLY if it exceeds max dimensions"""
#     try:
#         img = Image.open(BytesIO(image_data))
#         original_width, original_height = img.size
        
#         # Convert RGBA to RGB if necessary
#         if img.mode in ('RGBA', 'LA', 'P'):
#             background = Image.new('RGB', img.size, (255, 255, 255))
#             if img.mode == 'P':
#                 img = img.convert('RGBA')
#             background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
#             img = background
        
#         # Check if image exceeds max dimensions
#         if original_width > max_width or original_height > max_height:
#             width_ratio = max_width / original_width
#             height_ratio = max_height / original_height
#             resize_ratio = min(width_ratio, height_ratio)
            
#             new_width = int(original_width * resize_ratio)
#             new_height = int(original_height * resize_ratio)
            
#             img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
#             output = BytesIO()
#             img.save(output, format='JPEG', quality=85, optimize=True)
#             output.seek(0)
#             return output.read(), True, (original_width, original_height), (new_width, new_height)
#         else:
#             output = BytesIO()
#             img.save(output, format='JPEG', quality=85, optimize=True)
#             output.seek(0)
#             return output.read(), False, (original_width, original_height), (original_width, original_height)
            
#     except Exception as e:
#         print(f"  ⚠ Error processing image: {str(e)}")
#         return image_data, False, (0, 0), (0, 0)

# def create_test_data(max_width=800, max_height=600):
#     """
#     Create 30 products with 4 ProductQuality entries for each product
#     """
#     from nextCart.models import Category, Product, ProductQuality
    
#     print("="*70)
#     print("CREATING 30 PRODUCTS WITH 4 PRODUCT QUALITIES EACH")
#     print("="*70)
#     print(f"Max dimensions: {max_width}x{max_height}")
#     print("="*70)
    
#     # Get or create categories
#     category_objects = {}
#     print("\nChecking categories...")
#     for cat_data in categories_data:
#         try:
#             # Try to get existing category
#             category = Category.objects.get(slug=cat_data["slug"])
#             created = False
#         except Category.DoesNotExist:
#             # Create new category
#             category = Category.objects.create(
#                 name=cat_data["name"],
#                 slug=cat_data["slug"]
#             )
#             created = True
        
#         category_objects[cat_data["name"]] = category
#         if created:
#             print(f"  ✓ Created: {category.name} (slug: {category.slug})")
#         else:
#             print(f"  ✓ Exists: {category.name} (slug: {category.slug})")
    
#     print(f"\n{'='*70}")
#     print("CREATING PRODUCTS AND PRODUCT QUALITIES")
#     print(f"{'='*70}\n")
    
#     # Statistics
#     total_products = 0
#     total_qualities = 0
#     failed_images = 0
    
#     # Create a copy of products_data to avoid modifying the original
#     products_data_copy = copy.deepcopy(products_data)
    
#     for i, prod_data in enumerate(products_data_copy, 1):
#         category_name = prod_data.pop("category_name")
#         image_urls = prod_data.pop("image_urls")
#         qualities_data = prod_data.pop("qualities")
        
#         print(f"[{i}/{len(products_data_copy)}] Creating: {prod_data['title']}")
        
#         # Calculate discount percentage if discount exists
#         if prod_data['discount']:
#             discount_percentage = str(round((prod_data['discount'] / prod_data['price']) * 100)) + "%"
#         else:
#             discount_percentage = None
        
#         # Generate slug
#         slug = slugify(prod_data['name'])
        
#         # Make sure slug is unique
#         base_slug = slug
#         counter = 1
#         while Product.objects.filter(slug=slug).exists():
#             slug = f"{base_slug}-{counter}"
#             counter += 1
        
#         # Create product
#         product = Product.objects.create(
#             category=category_objects[category_name],
#             slug=slug,
#             discount_percentage=discount_percentage,
#             search_categories=category_name,
#             is_active=True,
#             sold=random.randint(0, 200),
#             average_ratings=str(round(random.uniform(3.5, 5.0), 1)),
#             rating_count=random.randint(5, 150),
#             **prod_data
#         )
#         total_products += 1
        
#         # Create main product image (first image from URLs)
#         main_image_data = download_image(image_urls[0])
#         if main_image_data:
#             processed_data, was_resized, orig_dims, new_dims = smart_resize_image(
#                 main_image_data, max_width, max_height
#             )
#             filename = f"{slug}_main_{timezone.now().timestamp()}.jpg"
#             product.image.save(filename, ContentFile(processed_data), save=True)
#             print(f"  ✓ Main image: {new_dims[0]}x{new_dims[1]}")
#         else:
#             print(f"  ✗ Failed to download main image")
#             failed_images += 1
        
#         # Create 4 ProductQuality entries
#         for j, quality_data in enumerate(qualities_data):
#             # Use different images for different qualities
#             quality_image_url = image_urls[j % len(image_urls)]
#             quality_image_data = download_image(quality_image_url)
            
#             if quality_image_data:
#                 processed_data, was_resized, orig_dims, new_dims = smart_resize_image(
#                     quality_image_data, max_width, max_height
#                 )
                
#                 # Create ProductQuality
#                 product_quality = ProductQuality.objects.create(
#                     color=quality_data["color"],
#                     size=quality_data["size"]
#                 )
                
#                 # Save the image
#                 filename = f"{slug}_quality_{j+1}_{timezone.now().timestamp()}.jpg"
#                 product_quality.image.save(filename, ContentFile(processed_data), save=True)
#                 total_qualities += 1
#                 print(f"  ✓ Quality {j+1}: {quality_data['color'] or 'No Color'} - {quality_data['size'] or 'No Size'}")
#             else:
#                 # Create ProductQuality without image
#                 product_quality = ProductQuality.objects.create(
#                     color=quality_data["color"],
#                     size=quality_data["size"]
#                 )
#                 total_qualities += 1
#                 print(f"  ✓ Quality {j+1}: {quality_data['color'] or 'No Color'} - {quality_data['size'] or 'No Size'} (no image)")
#                 failed_images += 1
        
#         print(f"  ✓ Product created with {len(qualities_data)} qualities\n")
    
#     # Final Summary
#     print(f"\n{'='*70}")
#     print("SUMMARY")
#     print(f"{'='*70}")
#     print(f"✓ Total Categories: {Category.objects.count()}")
#     print(f"✓ Total Products Created: {total_products}")
#     print(f"✓ Total Product Qualities Created: {total_qualities}")
#     print(f"✗ Failed Image Downloads: {failed_images}")
#     print(f"📊 Average qualities per product: {total_qualities/total_products:.1f}")
#     print(f"{'='*70}\n")

# # Simple function to run
# def run_test_data_import():
#     """Run the test data import"""
#     create_test_data()

# if __name__ == "__main__":
#     run_test_data_import()


# from django.core.files.base import ContentFile
# from decimal import Decimal
# from django.utils import timezone
# from django.utils.text import slugify
# import requests
# from io import BytesIO
# from PIL import Image
# import random
# import copy

# # Categories data matching your Category model
# categories_data = [
#     {
#         "name": "ALL",
#         "slug": "all-categories"
#     },
#     {
#         "name": "CLOTHES",
#         "slug": "clothes-wear"
#     },
#     {
#         "name": "HOME", 
#         "slug": "home-interiors"
#     },
#     {
#         "name": "ELECTRONICS",
#         "slug": "electronics"
#     },
#     {
#         "name": "BEAUTY",
#         "slug": "beauty-health"
#     },
#     {
#         "name": "SPORTS",
#         "slug": "sports-outdoors"
#     }
# ]

# # Products data with working image URLs
# products_data = [
#     # Clothes - 6 products
#     {
#         "name": "Casual Blazer",
#         "title": "Men's Slim Blazer",
#         "category_name": "CLOTHES",
#         "description": "Elegant slim-fit blazer perfect for business casual occasions. Made from premium wool blend with comfortable stretch.",
#         "price": Decimal("89.99"),
#         "discount": Decimal("10.00"),
#         "stock": 45,
#         "default_size": "L",
#         "default_color": "Navy",
#         "materials": "70% Wool, 25% Polyester, 5% Elastane",
#         "care_instructions": "Dry clean only. Do not bleach.",
#         "main_image_url": "https://images.unsplash.com/photo-1594938371073-8c8d8dbee0c0",
#         "quality_image_urls": [
#             "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
#             "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
#             "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
#             "https://images.unsplash.com/photo-1594938371073-8c8d8dbee0c0"
#         ],
#         "qualities": [
#             {"color": "Navy", "size": "M"},
#             {"color": "Navy", "size": "L"},
#             {"color": "Black", "size": "M"},
#             {"color": "Black", "size": "L"}
#         ]
#     },
#     {
#         "name": "Knit Sweater",
#         "title": "Cozy Pullover",
#         "category_name": "CLOTHES",
#         "description": "Warm cable-knit sweater for cold weather comfort. Perfect for winter seasons with soft cotton blend.",
#         "price": Decimal("42.99"),
#         "discount": Decimal("5.00"),
#         "stock": 78,
#         "default_size": "M",
#         "default_color": "Burgundy",
#         "materials": "100% Cotton",
#         "care_instructions": "Machine wash cold. Tumble dry low.",
#         "main_image_url": "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
#         "quality_image_urls": [
#             "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
#             "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
#             "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
#             "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
#         ],
#         "qualities": [
#             {"color": "Burgundy", "size": "S"},
#             {"color": "Burgundy", "size": "M"},
#             {"color": "Navy", "size": "S"},
#             {"color": "Navy", "size": "M"}
#         ]
#     },
#     {
#         "name": "Cargo Shorts",
#         "title": "Summer Shorts",
#         "category_name": "CLOTHES",
#         "description": "Comfortable cargo shorts with multiple pockets. Ideal for outdoor activities and casual wear.",
#         "price": Decimal("34.99"),
#         "discount": None,
#         "stock": 120,
#         "default_size": "32",
#         "default_color": "Olive",
#         "materials": "100% Cotton Twill",
#         "care_instructions": "Machine wash warm. Do not iron prints.",
#         "main_image_url": "https://images.unsplash.com/photo-1506629905607-e48b0e67d879",
#         "quality_image_urls": [
#             "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
#             "https://images.unsplash.com/photo-1506629905607-e48b0e67d879",
#             "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
#             "https://images.unsplash.com/photo-1506629905607-e48b0e67d879"
#         ],
#         "qualities": [
#             {"color": "Olive", "size": "30"},
#             {"color": "Olive", "size": "32"},
#             {"color": "Black", "size": "30"},
#             {"color": "Black", "size": "32"}
#         ]
#     },
#     {
#         "name": "Athletic Leggings",
#         "title": "Workout Tights",
#         "category_name": "CLOTHES",
#         "description": "High-waist athletic leggings with moisture-wicking fabric. Perfect for yoga, gym, and running.",
#         "price": Decimal("38.99"),
#         "discount": Decimal("15.00"),
#         "stock": 95,
#         "default_size": "S",
#         "default_color": "Black",
#         "materials": "88% Nylon, 12% Spandex",
#         "care_instructions": "Machine wash cold. Lay flat to dry.",
#         "main_image_url": "https://images.unsplash.com/photo-1508296695146-257a814070b4",
#         "quality_image_urls": [
#             "https://images.unsplash.com/photo-1506629082955-511b1aa562c8",
#             "https://images.unsplash.com/photo-1508296695146-257a814070b4",
#             "https://images.unsplash.com/photo-1506629082955-511b1aa562c8",
#             "https://images.unsplash.com/photo-1508296695146-257a814070b4"
#         ],
#         "qualities": [
#             {"color": "Black", "size": "XS"},
#             {"color": "Black", "size": "S"},
#             {"color": "Navy", "size": "XS"},
#             {"color": "Navy", "size": "S"}
#         ]
#     },
#     {
#         "name": "Denim Jacket",
#         "title": "Classic Jean Jacket",
#         "category_name": "CLOTHES",
#         "description": "Timeless denim jacket with button closure. Vintage wash with comfortable fit for all seasons.",
#         "price": Decimal("59.99"),
#         "discount": Decimal("8.00"),
#         "stock": 60,
#         "default_size": "M",
#         "default_color": "Blue",
#         "materials": "100% Cotton Denim",
#         "care_instructions": "Machine wash cold. Wash inside out.",
#         "main_image_url": "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
#         "quality_image_urls": [
#             "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
#             "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
#             "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
#             "https://images.unsplash.com/photo-1544022613-e87ca75a784a"
#         ],
#         "qualities": [
#             {"color": "Blue", "size": "S"},
#             {"color": "Blue", "size": "M"},
#             {"color": "Black", "size": "S"},
#             {"color": "Black", "size": "M"}
#         ]
#     },
#     {
#         "name": "Ankle Boots",
#         "title": "Leather Boots",
#         "category_name": "CLOTHES",
#         "description": "Genuine leather ankle boots with side zipper. Comfortable for all-day wear with cushioned insoles.",
#         "price": Decimal("94.99"),
#         "discount": Decimal("12.00"),
#         "stock": 35,
#         "default_size": "9",
#         "default_color": "Brown",
#         "materials": "Genuine Leather, Rubber Sole",
#         "care_instructions": "Use leather conditioner. Protect from water.",
#         "main_image_url": "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
#         "quality_image_urls": [
#             "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
#             "https://images.unsplash.com/photo-1542280756-74b2f55e73ab",
#             "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
#             "https://images.unsplash.com/photo-1542280756-74b2f55e73ab"
#         ],
#         "qualities": [
#             {"color": "Brown", "size": "8"},
#             {"color": "Brown", "size": "9"},
#             {"color": "Black", "size": "8"},
#             {"color": "Black", "size": "9"}
#         ]
#     },
#     # Add more products as needed...
# ]

# def download_image(url, timeout=10):
#     """Download image from URL and return as bytes"""
#     try:
#         # Add parameters to get a properly sized image
#         if '?' not in url:
#             url += '?w=800&q=80&fit=crop'
        
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
#         }
#         response = requests.get(url, timeout=timeout, stream=True, headers=headers)
#         response.raise_for_status()
#         return response.content
#     except Exception as e:
#         print(f"  ⚠ Error downloading image from {url}: {str(e)}")
#         return None

# def smart_resize_image(image_data, max_width=800, max_height=600):
#     """Intelligently resize image ONLY if it exceeds max dimensions"""
#     try:
#         img = Image.open(BytesIO(image_data))
#         original_width, original_height = img.size
        
#         # Convert RGBA to RGB if necessary
#         if img.mode in ('RGBA', 'LA', 'P'):
#             background = Image.new('RGB', img.size, (255, 255, 255))
#             if img.mode == 'P':
#                 img = img.convert('RGBA')
#             background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
#             img = background
        
#         # Check if image exceeds max dimensions
#         if original_width > max_width or original_height > max_height:
#             width_ratio = max_width / original_width
#             height_ratio = max_height / original_height
#             resize_ratio = min(width_ratio, height_ratio)
            
#             new_width = int(original_width * resize_ratio)
#             new_height = int(original_height * resize_ratio)
            
#             img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
#             output = BytesIO()
#             img.save(output, format='JPEG', quality=85, optimize=True)
#             output.seek(0)
#             return output.read(), True, (original_width, original_height), (new_width, new_height)
#         else:
#             output = BytesIO()
#             img.save(output, format='JPEG', quality=85, optimize=True)
#             output.seek(0)
#             return output.read(), False, (original_width, original_height), (original_width, original_height)
            
#     except Exception as e:
#         print(f"  ⚠ Error processing image: {str(e)}")
#         return image_data, False, (0, 0), (0, 0)

# def create_test_data(max_width=800, max_height=600):
#     """
#     Create products with:
#     - Product.main_image (1 image)
#     - ProductImage (same 1 image for gallery)
#     - ProductQuality (4 different images for qualities)
#     """
#     from nextCart.models import Category, Product, ProductImage, ProductQuality
    
#     print("="*70)
#     print("CREATING PRODUCTS WITH IMAGES AND QUALITIES")
#     print("="*70)
#     print(f"Max dimensions: {max_width}x{max_height}")
#     print("="*70)
    
#     # Get or create categories
#     category_objects = {}
#     print("\nChecking categories...")
#     for cat_data in categories_data:
#         try:
#             # Try to get existing category
#             category = Category.objects.get(slug=cat_data["slug"])
#             created = False
#         except Category.DoesNotExist:
#             # Create new category
#             category = Category.objects.create(
#                 name=cat_data["name"],
#                 slug=cat_data["slug"]
#             )
#             created = True
        
#         category_objects[cat_data["name"]] = category
#         if created:
#             print(f"  ✓ Created: {category.name} (slug: {category.slug})")
#         else:
#             print(f"  ✓ Exists: {category.name} (slug: {category.slug})")
    
#     print(f"\n{'='*70}")
#     print("CREATING PRODUCTS, PRODUCT IMAGES AND PRODUCT QUALITIES")
#     print(f"{'='*70}\n")
    
#     # Statistics
#     total_products = 0
#     total_product_images = 0
#     total_qualities = 0
#     failed_images = 0
    
#     # Create a copy of products_data to avoid modifying the original
#     products_data_copy = copy.deepcopy(products_data)
    
#     for i, prod_data in enumerate(products_data_copy, 1):
#         category_name = prod_data.pop("category_name")
#         main_image_url = prod_data.pop("main_image_url")
#         quality_image_urls = prod_data.pop("quality_image_urls")
#         qualities_data = prod_data.pop("qualities")
        
#         print(f"[{i}/{len(products_data_copy)}] Creating: {prod_data['title']}")
        
#         # Calculate discount percentage if discount exists
#         if prod_data['discount']:
#             discount_percentage = str(round((prod_data['discount'] / prod_data['price']) * 100)) + "%"
#         else:
#             discount_percentage = None
        
#         # Generate slug
#         slug = slugify(prod_data['name'])
        
#         # Make sure slug is unique
#         base_slug = slug
#         counter = 1
#         while Product.objects.filter(slug=slug).exists():
#             slug = f"{base_slug}-{counter}"
#             counter += 1
        
#         # Create product
#         product = Product.objects.create(
#             category=category_objects[category_name],
#             slug=slug,
#             discount_percentage=discount_percentage,
#             search_categories=category_name,
#             is_active=True,
#             sold=random.randint(0, 200),
#             average_ratings=str(round(random.uniform(3.5, 5.0), 1)),
#             rating_count=random.randint(5, 150),
#             **prod_data
#         )
#         total_products += 1
        
#         # Download and save main image for Product
#         main_image_data = download_image(main_image_url)
#         if main_image_data:
#             processed_data, was_resized, orig_dims, new_dims = smart_resize_image(
#                 main_image_data, max_width, max_height
#             )
#             filename = f"{slug}_main_{timezone.now().timestamp()}.jpg"
#             product.image.save(filename, ContentFile(processed_data), save=True)
#             print(f"  ✓ Main product image: {new_dims[0]}x{new_dims[1]}")
            
#             # Create ProductImage with SAME main image
#             product_image = ProductImage.objects.create(
#                 product=product,
#                 alt_text=f"{prod_data['title']} - Main View"
#             )
#             product_image.image.save(filename, ContentFile(processed_data), save=True)
#             total_product_images += 1
#             print(f"  ✓ ProductImage (same as main): Main View")
#         else:
#             print(f"  ✗ Failed to download main product image")
#             failed_images += 1
        
#         # Create 4 ProductQuality entries with DIFFERENT images
#         for j, (quality_data, quality_image_url) in enumerate(zip(qualities_data, quality_image_urls)):
#             quality_image_data = download_image(quality_image_url)
            
#             if quality_image_data:
#                 processed_data, was_resized, orig_dims, new_dims = smart_resize_image(
#                     quality_image_data, max_width, max_height
#                 )
                
#                 # Create ProductQuality
#                 product_quality = ProductQuality.objects.create(
#                     color=quality_data["color"],
#                     size=quality_data["size"]
#                 )
                
#                 # Save the image
#                 filename = f"{slug}_quality_{j+1}_{timezone.now().timestamp()}.jpg"
#                 product_quality.image.save(filename, ContentFile(processed_data), save=True)
#                 total_qualities += 1
#                 print(f"  ✓ Quality {j+1}: {quality_data['color'] or 'No Color'} - {quality_data['size'] or 'No Size'}")
#             else:
#                 # Create ProductQuality without image
#                 product_quality = ProductQuality.objects.create(
#                     color=quality_data["color"],
#                     size=quality_data["size"]
#                 )
#                 total_qualities += 1
#                 print(f"  ✓ Quality {j+1}: {quality_data['color'] or 'No Color'} - {quality_data['size'] or 'No Size'} (no image)")
#                 failed_images += 1
        
#         print(f"  ✓ Product created with 1 main image and {len(qualities_data)} qualities\n")
    
#     # Final Summary
#     print(f"\n{'='*70}")
#     print("SUMMARY")
#     print(f"{'='*70}")
#     print(f"✓ Total Categories: {Category.objects.count()}")
#     print(f"✓ Total Products Created: {total_products}")
#     print(f"✓ Total Product Images Created: {total_product_images}")
#     print(f"✓ Total Product Qualities Created: {total_qualities}")
#     print(f"✗ Failed Image Downloads: {failed_images}")
#     print(f"{'='*70}\n")

# # Simple function to run
# def run_test_data_import():
#     """Run the test data import"""
#     create_test_data()

# if __name__ == "__main__":
#     run_test_data_import()

