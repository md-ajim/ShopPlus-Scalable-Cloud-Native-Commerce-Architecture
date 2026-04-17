from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import User, Group
from .models  import *
from django.contrib.admin import AdminSite
from unfold.sites import UnfoldAdminSite
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from unfold.admin import ModelAdmin
from simple_history.admin import SimpleHistoryAdmin

# Check if the models are registered before unregistering them
if admin.site.is_registered(User):
    admin.site.unregister(User)

if admin.site.is_registered(Group):
    admin.site.unregister(Group)
    
class UnfoldAdminPanel(SimpleHistoryAdmin , ModelAdmin):
    pass    

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass

@admin.register(AddressInfo)
class AddressInfoAdmin( UnfoldAdminPanel):
    pass


class MyAdminSite(UnfoldAdminSite):
    site_header = "NextCart Admin"

admin_site = MyAdminSite(name="myadmin")

@admin.register(ProductQuality)
class ProductQualityAdmin(UnfoldAdminPanel):
    pass




@admin.register(Review)
class ReviewAdmin(UnfoldAdminPanel):
    pass

@admin.register(Cart)
class CartAdmin(UnfoldAdminPanel):
    pass

@admin.register(CartItem)
class CartItemAdmin(UnfoldAdminPanel):
    pass

@admin.register(Order)
class OrderAdmin(UnfoldAdminPanel):
    pass


@admin.register(Coupon)
class CouponAdmin(UnfoldAdminPanel):
    pass

@admin.register(Wishlist)
class WishlistAdmin(UnfoldAdminPanel):
    pass




@admin.register(Payment)
class PaymentAdmin(UnfoldAdminPanel):
    pass   
   



@admin.register(RequestQuote)
class RequestQuoteAdmin(UnfoldAdminPanel):
    pass         

@admin.register(Community)
class CommunityAdmin(UnfoldAdminPanel):
    pass  


@admin.register(ReviewCategory)
class ReviewCategoryAdmin(UnfoldAdminPanel):
    pass  



class ProductVariantAdmin(UnfoldAdminPanel):
    filter_horizontal = ('quality',)  # Makes it easier to select multiple qualities
admin.site.register(ProductVariant, ProductVariantAdmin)



@admin.register(Product)
class ProductAdmin(UnfoldAdminPanel):
    list_display = ['name', 'price', 'stock']
    filter_horizontal = ('rating',)  # Makes it easier to select multiple qualities
    list_filter = ['category']

@admin.register(Category)
class CategoryAdmin(UnfoldAdminPanel):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
  
@admin.register(ProductFeature)
class ProductFeatureAdmin(UnfoldAdminPanel):
    extra = 1
    fields = ['product','feature']

   
@admin.register(ProductSpecification)
class ProductSpecificationAdmin(UnfoldAdminPanel):
    extra = 1
    fields = ['product', 'key', 'value', 'order']
    ordering = ['order']
    

@admin.register(ProductDetail)
class ProductDetailAdmin(UnfoldAdminPanel):
    pass


@admin.register(OrderItems)
class OrderItemAdmin(UnfoldAdminPanel):
    pass   

@admin.register(ShippingAddress)
class AddressInfoAdmin( UnfoldAdminPanel):
    pass

@admin.register(Contact)
class ContactAdmin(UnfoldAdminPanel):
    pass


@admin.register(Preferences)
class PreferencesAdmin(UnfoldAdminPanel):
    pass
