from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from PIL import Image
from django.core.files.storage import default_storage
import os
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.validators import MinValueValidator , MaxValueValidator
from django.utils.timezone import localtime
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField



class User(AbstractUser):
    name = models.CharField(max_length=255 , blank=True, null=True)
    is_vendor = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    date_of_birth = models.CharField(max_length=50, blank=True, null=True)
    language = models.CharField(max_length=10, default='en-US')
    loyalty_points = models.PositiveIntegerField(default=0)
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",  # Updated to avoid clash
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",  # Updated to avoid clash
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
    address = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.username
    
    

class ShippingInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255, blank=True, null=True)  # Optional field
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    shipping_method = models.CharField(max_length=100)
    delivery_date = models.DateField(blank=True, null=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.country}"    
    


class AddressInfo(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE , default=1)
    phone = PhoneNumberField()
    address = models.CharField(max_length=200 )
    city = models.CharField(max_length=200 , null=True , blank=True)
    state = models.CharField(max_length=300 , null=True , blank=True)
    zip = models.CharField(max_length=10, null=True , blank=True)
    country = models.CharField(max_length=100)
    isDefault = models.BooleanField(null=True , blank=True)
    newsletter= models.BooleanField( null=True , blank=True)
    smsMarketing= models.BooleanField(null=True , blank=True)
    emailMarketing =   models.BooleanField( null=True , blank=True)
    
    def __str__(self):
        return f'This user is {self.name}'




class Category (models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')

    def __str__(self):
        return self.name


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("ALL", "All Categories"),
        ("CLOTHES", "Clothes and Wear"),
        ("HOME", "Home Interiors"),
        ("ELECTRONICS", "Electronics"),
        ("BEAUTY", "Beauty & Health"),
        ("SPORTS", "Sports & Outdoors"),
    ]
    # Basic Info
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=50, blank=True, null=True)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    discount_percentage = models.CharField( max_length=10, null=True , blank=True)
    discount_start_date = models.DateField(blank=True , null=True)
    discount_end_date = models.DateField(blank=True , null=True)



    # Inventory
    stock = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    sold = models.PositiveIntegerField(default=0 , null=True, blank=True)
    average_ratings = models.CharField(max_length=5 , null=True , blank=True)
    
    # Media
    image = models.ImageField(upload_to='main_product/images/', blank=True, null=True)
    video_url = models.URLField(null=True, blank=True)
    
    # Categories
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    search_categories = models.CharField(choices=CATEGORY_CHOICES, max_length=20, default="ALL")
    
     # Attributes
    default_size = models.CharField(max_length=10, blank=True, null=True)
    default_color = models.CharField(max_length=50, blank=True, null=True)
    materials = models.TextField(null=True, blank=True)
    care_instructions = models.TextField(null=True, blank=True)
    
    # Ratings (changed from M2M to computed property)
    rating = models.ManyToManyField('Review', related_name='ratings', blank=True)
    rating_count = models.PositiveIntegerField(default=0 , null=True , blank=True)
   
    
    
     # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

            

    @property
    def average_rating(self):
        from django.db.models import Avg
        return self.reviews.aggregate(Avg('rating')) ['rating__avg'] or 0
    @property
    def current_price(self):
        """Calculate price after discount"""
        if self.discount:
            return self.price * (1 - self.discount/100)
        return self.price

    def __str__(self):
        return f"{self.name} ({self.get_search_categories_display()})"

    def __str__(self):
        return self.name
    

    def get_specifications_dict(self):
        return { spec.key : spec for  spec in self.specifications.all().by_order('order')}
    def get_variant_data(self):
        variants =[]
        
        for variant in self.variants.all():
            variant_data = {
                'id': variant.id,
                'stock': variant.stock,
                'price': float(self.price) + float(variant.price_modifier),
                'qualities': []
            }
            
            for quality in variant_data:
                quality['qualities'].append({
                    'color': quality.color,
                    'color_code': quality.color_code,
                    'size': quality.size,
                    'size_code': quality.size_code,
                    'image': quality.image.url if quality.image else None
                })
                variants.append(variant_data)
        return variants 
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'



class ProductFeature(models.Model):
    product = models.ForeignKey(
        Product, 
        related_name='features',
        on_delete=models.CASCADE
    )
    feature = models.CharField(max_length=200 , default='Slim Fit Design')
    def __str__(self):
        return f"{self.product.name} - {self.feature}"

class ProductDetail(models.Model):
    product = models.ForeignKey( Product, related_name='details', on_delete=models.CASCADE)
    material = models.CharField(max_length=200)
    core = models.TextField(max_length=100)
    origin = models.CharField(max_length=10)
    weight = models.CharField(max_length=50)
    
    def __str__(self):
        return f'Details for {self.product.title}'


class ProductSpecification(models.Model):
    product = models.ForeignKey(
        Product, 
        related_name='specifications',
        on_delete=models.CASCADE
    )
    key = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    order = models.PositiveSmallIntegerField(default=0)
    def get_product_name(self):
        return self.product.name
    get_product_name.short_description = 'Product'

    class Meta:
        ordering = ['order']
        unique_together = ['product', 'key']

    def __str__(self):
        return f"{self.product.name} - {self.key}: {self.value}"    
   


class RequestQuote(models.Model):
    item_needed = models.CharField(max_length=255)
    details = models.TextField()
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_needed} - {self.quantity}"
       


class ProductQuality(models.Model):
   
    COLOR_CHOICES = [
        ("Black", "#000000"),
        ("White", "#FFFFFF"),
        ("Red", "#FF0000"),
        ("Magenta", "#FF00FF"),
        ("Maroon", "#800000"),
        ("Navy", "#000080"),
        ("Olive", "#808000"),
        ("Teal", "#008080"),
        ("Lime", "#00FF00"),
        ("Beige", "#F5F5DC"),
        ("Gold", "#FFD700"),
        ("Silver", "#C0C0C0"),
        ("Violet", "#EE82EE"),
        ("Indigo", "#4B0082"),
        ("Turquoise", "#40E0D0"),
        ("Lavender", "#E6E6FA"),
        ("Crimson", "#DC143C"),
        ("Coral", "#FF7F50"),
        ("Peach", "#FFE5B4"),
        ("Mint", "#98FF98"),
        ("Ivory", "#FFFFF0"),
        ("Charcoal", "#36454F"),
        ("Burgundy", "#800020"),
        ("Rose", "#FF007F"),
        ("Emerald", "#50C878"),
        ("Saffron", "#F4C430"),
        ("Azure", "#007FFF"),
    ]

    SIZE_CHOICES = [
        ("XS", "Extra Small"),
        ("S", "Small"),
        ("M", "Medium"),
        ("L", "Large"),
        ("XL", "Extra Large"),
        ("XXL", "Double Extra Large"),
        ("XXXL", "Triple Extra Large"),
        ('2 Inches' , '2 inches'),
        ('4 Inches' , '4 inches'),
        ('6 Inches' , '6 inches'),
        ("6 x 8 inch", "7 x 9 inch"),
        ("8 x 11 inch", "8 x 11 inch"),
        ("7 x 9 inch", "7 x 9 inch"),
        ("9 x 12 inch", "9 x 12 inch"),
        ("10 x 15 inch", "12 x 16 inch")
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE , default=1,  related_name='product_quality')
    color = models.CharField(
        max_length=100,
        choices=[(name, name) for name, _ in COLOR_CHOICES],
        null=True,
        blank=True,
    )
    
    custom_color = models.CharField(max_length=255 , null=True , blank=True)
 
  



    color_code = models.CharField(
        max_length=7,
        null=True,
        blank=True,
    )
    size = models.CharField(
        max_length=100,
        choices=[(name, name) for name, _ in SIZE_CHOICES],
        null=True,
        blank=True,
    )


    custom_size = models.CharField(max_length=255 , null=True , blank=True)

    image = models.ImageField(
        upload_to="variant_images/images/", max_length=100, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.color:
            self.color_code = dict(self.COLOR_CHOICES).get(self.color)
        if self.size:
            self.size_code = dict(self.SIZE_CHOICES).get(self.size)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.color or 'No Color'} ({self.custom_color or 'No Code'}) - {self.size or 'No Size'} ({self.custom_size or 'No Code'}) - ({ self.product.name})"

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    quality = models.ManyToManyField(ProductQuality, blank=True, related_name='variants')  # Allow multiple qualities
    stock = models.PositiveIntegerField(default=0)  # Track stock per variant
    price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    def __str__(self):
        qualities = ", ".join([str(q) for q in self.quality.all()])
        return f"{self.product.name} - {qualities if qualities else 'No Quality'}"





class ShippingAddress(models.Model):
    SHIPPING_MODEL_CHOICES = [
        ('standard', 'Standard'),
        ('express', 'Express'),
        ('overnight', 'Overnight'),
        ]
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    address = models.TextField()
    apartment =models.CharField(max_length=100 , null= True , blank= True)
    city = models.CharField(max_length=100)
    country =models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postalCode = models.CharField( max_length=20)
    phone = models.CharField( max_length=20)
    saveInfo = models.BooleanField()
    order = models.ForeignKey('Order', on_delete=models.CASCADE , related_name='shipping_address' ,  default=1 )
    shipping_method = models.CharField(max_length=20 , choices=SHIPPING_MODEL_CHOICES)
    
    class Meta:
        unique_together =['order']
    
    def __str__(self):
        return f'{ self.firstName} { self.lastName} - {self.shipping_method}'
      



class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    uniqId =models.CharField( default='ORD001', max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10 , decimal_places=2 , default=0 )
    shipping_cost =  models.DecimalField(max_digits=10 , decimal_places=2 , default=0)
    payment_status = models.BooleanField(default=False)
    
    def convertFormatCreated (self):
      return localtime(self.created_at)
    def convertFormatUpdated(self):
       return localtime(self.updated_at)     

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"



       
class OrderItems(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    products = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='products', default=1)
    image = models.ImageField(upload_to='order_items/', default='image.png')
    quantity = models.PositiveIntegerField()
    color = models.CharField(max_length=20,default='black')
    size = models.CharField(max_length=20,default='M')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.products.name} x {self.quantity}"



class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.CharField(max_length=50 , null=True , blank=True)
    size = models.CharField(max_length=50, null=True, blank=True)
    image = models.URLField(default='https://via.placeholder.com/150')  # Default image if no variant image is uploaded
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=50)  # E.g., "Credit Card", "PayPal"
    payment_status = models.BooleanField(default=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id}"


class Review(models.Model):
    SORTING_CHOICES = [
        ('newest', 'Newest'),
        ('oldest', 'Oldest'),
        ('highest-rating', 'Highest Rating'),
        ('lowest-rating', 'Lowest Rating'),
        ('most-helpful', 'Most Helpful'),
    ]

    sort_by = models.CharField(max_length=50, choices=SORTING_CHOICES, default='newest')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  # Scale 1-5
    comment = models.TextField()
    category = models.ForeignKey('ReviewCategory', on_delete=models.SET_NULL, null=True, blank=True)
    community = models.ForeignKey('Community', on_delete=models.SET_NULL, null=True, blank=True)
    helpful_votes = models.PositiveIntegerField(default=0)
    reported = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Reviews(models.Model):
    rating = models.PositiveSmallIntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],  # 1–5 star rating
        default=0
    )
    title = models.CharField(max_length=255, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='review' , default=1)
    name = models.CharField(max_length=150)
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='reviews', default=1 )
    email = models.EmailField()
    text = models.TextField()
    # images
    created_at = models.DateTimeField(auto_now_add=True)  # auto timestamp
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.title or 'Review'} ({self.rating}⭐)"



    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"



# class ReviewImage(models.Model):
#     review = models.ForeignKey(Reviews , on_delete=models.CASCADE, related_name='images')
#     image = models.ImageField( upload_to='review-images/' , null=True , blank=True)
#     def ___str___(self):
#         return f"{self.review.name} - {self.image}"

class ReviewImage(models.Model):
    review = models.ForeignKey(
        Reviews,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to='review-image')

    def __str__(self):
        return f"Image for Review {self.review.id}"

    

class Wishlist(models.Model):
    name = models.CharField(max_length=100 , default="Wishlist")
    color = models.CharField(max_length=50, null=True, blank=True)
    size = models.CharField(max_length=50, null=True, blank=True)
    quantity = models.PositiveIntegerField( default=1)
    price = models.CharField(max_length=50, null=True, blank=True)
    image = models.URLField(default='https://via.placeholder.com/150' , null=True , blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist item for {self.user.username}"


class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    max_uses = models.PositiveIntegerField(default=1)  # Maximum redemptions
    discount = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage discount
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    def save(self, *args, **kwargs):
        if self.valid_to <= self.valid_from:
            raise ValueError("valid_to must be greater than valid_from.")
        super().save(*args, **kwargs)





class ReviewCategory(models.Model):
    CATEGORY_CHOICES = [
        ('most_recent', 'Most Recent'),
        ('top_rated', 'Top Rated'),
        ('most_helpful', 'Most Helpful'),
    ]

    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return dict(self.CATEGORY_CHOICES).get(self.name, self.name)
    


class Community(models.Model):
    REPORT_CHOICES = [
        ('spam', 'Spam'),
        ('inappropriate', 'Inappropriate'),
        ('other', 'Other'),
    ]
    Helpful = models.PositiveIntegerField(default=0)
    Unhelpful = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    report = models.CharField(max_length=20, choices=REPORT_CHOICES, default='other')

class SortingOption(models.Model):
    name = models.CharField(max_length=50, unique=True)  # e.g., "Newest", "Oldest"
    value = models.CharField(max_length=50, unique=True)  # e.g., "newest", "oldest"
    order_by = models.CharField(max_length=100)  # e.g., "-created_at", "rating"

    def __str__(self):
        return self.name
    


class Contact( models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(max_length=10000)
    def __str___(self):
        return self.name
    

class Preferences(models.Model):
    address = models.ForeignKey(AddressInfo , related_name='preferences', on_delete=models.CASCADE, default=1)
    newsletter= models.BooleanField( null=True , blank=True)
    smsMarketing= models.BooleanField(null=True , blank=True)
    emailMarketing =   models.BooleanField( null=True , blank=True)

    def __str__(self):
        return f'It is enable notification in preferences {self.newsletter}'
        
    

# class Deal(models.Model):
#   type = models.CharField( max_length=50 , null=True , blank=True)
#   discount = models.IntegerField( max_length=2)
#   label = models.CharField(max_length=100 , null= True blank= True)

