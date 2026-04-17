from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet 
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import filters
from .filters import ProductFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny 
from rest_framework import status
from .models import *
from .serializers import *
from .models import Review
from .serializers import ReportSerializer
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import HelpfulSerializer
from rest_framework import generics
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
class MarkHelpfulView(APIView):
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = HelpfulSerializer(data=request.data)
        if serializer.is_valid():
            helpful = serializer.validated_data["helpful"]
            if helpful:
                review.helpful_votes += 1
            else:
                review.helpful_votes -= 1
            review.save()
            return Response({"helpful_votes": review.helpful_votes}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class AddressInfoSerializerViews(ModelViewSet):
    queryset = AddressInfo.objects.all()
    serializer_class = AddressInfoSerializer



class AddressInfoSerializerViewsGet(generics.ListCreateAPIView):
    serializer_class = AddressInfoSerializers
    queryset = AddressInfo.objects.all()


    
        

class ReportReviewView(APIView):
    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            reported = serializer.validated_data["reported"]
            review.reported = reported
            review.save()
            return Response({"reported": review.reported}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryView(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductView(ModelViewSet):
    permission_classes = (AllowAny,)
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_class = ProductFilter  
    # search_fields = ['name', 'category__name', 'description', 'search_categories',]  
    
    ordering_fields = [
        'price',    
        'created_at',    
        'rating__rating',  
        'order_count',  # ✅ Change 'trending' to 'order_count'
    ]
    
    ordering = ['-created_at']




class ProductVariantView(APIView):
    permission_classes = (AllowAny,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = ProductVariantSerializer(data=request.data)
        print(request.FILES.getlist('images'))
        if serializer.is_valid():
            for image in request.FILES.getlist('images'):
                ProductVariant.objects.create(product=serializer.instance, image=image)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
          

class ReviewViews(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():
            review = serializer.save()

            # Save multiple images
            for image in request.FILES.getlist('images'):
                ReviewImage.objects.create(
                    review=review,
                    image=image
                )

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)







class ProductVariantViews(ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    





class ReviewView(ModelViewSet):
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    
    queryset = Review.objects.all()
    serializer_class = ReviewSerializerss

class ReviewViewGet(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer1
    queryset = Reviews.objects.all()

class ReviewCategoryView(ModelViewSet):
    queryset = ReviewCategory.objects.all()
    serializer_class = ReviewCategorySerializer



class CommunityView(ModelViewSet):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

class CartView(ModelViewSet):
    queryset = Cart.objects.all()    
    serializer_class = CartSerializer

class CartItemView(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    pagination_class = None   # Disables pagination for this view
    def get_queryset(self):
        return CartItem.objects.all()
    

class CartItemViews(generics.ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializers
    def get_queryset(self):
        return CartItem.objects.all()
    



class OrderView(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializerGet



class OrderViewGet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializerGetViews


class OrderItemView(ModelViewSet):
    queryset = OrderItems.objects.all()
    serializer_class = OrderItemSerializer

class CouponView(ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer


class WishlistView(ModelViewSet):

    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    pagination_class = None   # Disables pagination for this view
    def get_queryset(self):
        return Wishlist.objects.all()
    




class WishlistViews(ModelViewSet):

    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializers




class PaymentView(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer





@method_decorator(csrf_exempt, name='dispatch')
class RequestQuoteView(ModelViewSet):
    queryset = RequestQuote.objects.all()
    serializer_class = RequestQuoteSerializer





class UserView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class CreateOrder(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        user = serializer.validated_data.get('user')
        cart = Cart.objects.get(user=user)
        order = serializer.save(user=user)
        for item in cart.items.all():
            OrderItems.objects.create(
                order=order,
                products=item.product,
                image = item.image,
                color=item.color or 'black',
                size=item.size or 'M',
                quantity=item.quantity,
                unit_price=item.product.price
                
            )
            
        cart.items.all().delete()


class  ShippingAddressInfo(ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    
                
class  ShippingAddressGetInfo(ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializers        
        
      

class ContactViewSet(ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer





