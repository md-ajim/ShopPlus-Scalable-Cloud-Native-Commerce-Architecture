
from django.urls import path , include
from authUser.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)






from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
    path('to-factor/', include(tf_urls)),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')), 
    path('auth/', include('social_django.urls', namespace='social')), 
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')), 
    path('drf/', include('drf_social_oauth2.urls', namespace='drf')),
    path('register/' , CreateUserView.as_view(), name='register' ),
    path('verification/', VerifyOTPView.as_view(), name='verification' ),
    path('login/' , LogInView.as_view(), name='login' ),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('request-reset/' , RequestPasswordResetOTPView.as_view(), name='request-reset' ),
    path('verify-reset/' , VerifyResetOTPView.as_view(), name='VerifyResetOTPView' ),
    path('reset-password/' , ResetPasswordView.as_view(), name='reset-password' ),
    path('social-login/' , SocialLoginView.as_view(), name='social-login' ),
]
