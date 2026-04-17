from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
user = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'id', 'name', 'username', 'email', 'first_name', 'last_name' , 'date_joined' , 'profile_pic','phone_number' , 'date_of_birth' , 'language' , 'loyalty_points' ]

class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = '__all__'
        


class AddressInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = AddressInfo
        fields = '__all__'
        

class AddressInfoSerializers(serializers.ModelSerializer):

    class Meta:
        model = AddressInfo
        fields = '__all__'


           


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'



class ReviewCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewCategory
        fields = '__all__'



class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = '__all__'



class ReviewSerializerss(serializers.ModelSerializer):
    user = UserSerializer()

    
    class Meta:
        model = Review
        fields = '__all__'


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    
    images = ReviewImageSerializer(many=True, read_only=True)

    class Meta:
        model = Reviews
        fields = '__all__'

      

     

class ReviewSerializer1(serializers.ModelSerializer):
    
    images = ReviewImageSerializer(many=True, read_only=True)
    user = UserSerializer( )

    class Meta:
        model = Reviews
        fields = '__all__'

class ReviewsImageSerializers(serializers.ModelSerializer):
    class Meta:
        models = ReviewImage
        fields = "__all__"
        


class ProductQualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductQuality
        fields = ['color', 'custom_color', 'custom_color',  'size',  'custom_size', 'image']


        
        
class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['feature']        


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetail
        fields = ['material', 'core', 'origin', 'weight']

class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['id', 'key', 'value', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()
    quality =  ProductQualitySerializer( many=True)
    class Meta:
        model = ProductVariant
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer()
    features = ProductFeatureSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    details = ProductDetailSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields= '__all__'




class ProductSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Product
        fields = ['name', 'price']

class ProductVariantSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    quality =  ProductQualitySerializer( many=True)
    class Meta:
        model = ProductVariant
        fields = '__all__'


        
      


class CartItemSerializers(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = '__all__'
   
   
class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = '__all__'
class CartItemSerializer(serializers.ModelSerializer):
    cart = CartSerializer()
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = '__all__'
                





class OrderItemSerializer(serializers.ModelSerializer):
    products = ProductSerializers()
    class Meta:
        model = OrderItems
        fields = '__all__'

class ShippingAddressSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'





class OrderSerializerGet(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    shipping_address = ShippingAddressSerializer(many=True)
    # user = UserSerializer()
    
    class Meta:
        model = Order
        fields = '__all__'





class OrderSerializerGetViews(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    shipping_address = ShippingAddressSerializer(many=True)
    user = UserSerializer()
    
    class Meta:
        model = Order
        fields = '__all__'        



class OrderSerializerGets(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    shipping_address = ShippingAddressSerializer(many=True)
 
    class Meta:
        model = Order
        fields = '__all__'



class ShippingAddressSerializers(serializers.ModelSerializer):
    order = OrderSerializer( )
    
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'



class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'



class WishlistSerializers(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'        



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'



class RequestQuoteSerializer(serializers.ModelSerializer):    
    class Meta:
        model = RequestQuote
        fields = '__all__'



class ContactSerializer(serializers.ModelSerializer):
    class Meta:
       model = Contact
       fields = '__all__'



class HelpfulSerializer(serializers.Serializer):
    helpful = serializers.BooleanField()

class ReportSerializer(serializers.Serializer):
    reported = serializers.BooleanField()        
    
    
    

    
