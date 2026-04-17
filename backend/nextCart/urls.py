from django.urls import path
from .views import *
from authUser.views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register('product', ProductView)
router.register('category', CategoryView)
router.register('productvariant', ProductVariantViews)
# router.register('productimage', ProductImageView)
router.register('review', ReviewView)
router.register('cart', CartView)
router.register('cartitem', CartItemView)
router.register('order', OrderView)
router.register('shippingAddress' , ShippingAddressInfo)
router.register('orderitem', OrderItemView)
router.register('coupon', CouponView)
router.register('wishlist', WishlistView)
router.register('payment', PaymentView)
router.register('requestquote', RequestQuoteView)
router.register('community', CommunityView)
router.register('reviewcategory', ReviewCategoryView)
router.register('users', UserView)
router.register('ShippingInfo' , ShippingInfoView)
router.register('addressInfo', AddressInfoSerializerViews)
router.register('contact', ContactViewSet)
from .views import MarkHelpfulView, ReportReviewView

urlpatterns = router.urls


urlpatterns += [
    path('productvariant/', ProductVariantView.as_view() , name='productvariant'),
    path('reviews/get/', ReviewViewGet.as_view() , name='reviewget'),
    path('reviews/', ReviewViews.as_view(), name='reviews' ),
    path('reviews/<int:review_id>/helpful/', MarkHelpfulView.as_view(), name='mark_helpful'),
    path('reviews/<int:review_id>/report/', ReportReviewView.as_view(), name='report_review'),
    path('cartItems/', CartItemViews.as_view() , name='cartitem'),
    path('wishlistItems/', WishlistViews.as_view({'get': 'list'}) , name='wishlistitem'),
    path('order', CreateOrder.as_view(), name='orders'),
    path('shipping/', ShippingAddressGetInfo.as_view({ 'get':'list'}) , name='get shipping' ),
    path('addressInfo/',AddressInfoSerializerViewsGet.as_view(), name='address'),
    path('getOrder/' ,OrderViewGet.as_view({'get':'list'}) , name ='get order'),


]