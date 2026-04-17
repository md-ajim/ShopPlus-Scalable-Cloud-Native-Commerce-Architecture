import django_filters

from .models import Product
from django.db.models import Q
class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__name',lookup_expr='iexact',label='Category')
    search = django_filters.CharFilter(method='custom_search',label='Product Search')
    # search_category = django_filters.MultipleChoiceFilter(field_name='product__search_categories', choices =Product.CATEGORY_CHOICES, label='Category Group',)
    rating = django_filters.CharFilter(field_name="rating__rating", lookup_expr="icontains")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")  # Minimum price
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")  # Maximum price
    min_rating = django_filters.NumberFilter(field_name="average_ratings", lookup_expr="gte")  # Minimum rating
    max_rating = django_filters.NumberFilter(field_name="average_ratings", lookup_expr="lte")  # Maximum rating
    search_category = django_filters.CharFilter(method='filter_search_category')





    class Meta:
        model = Product
        fields = ['category', 'search', 'search_category', 'min_price', 'max_price', 'min_rating', 'max_rating']

    def filter_search_category(self, queryset, name, value):
        categories = [cat.strip() for cat in value.split(',')]
        return queryset.filter(search_categories__in=categories)


    def custom_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) 
            # Q(alt_text__icontains=value)
            
        )
    
    


