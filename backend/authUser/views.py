from django.utils.decorators import method_decorator
from rest_framework.views import csrf_exempt
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken , RefreshToken
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode , urlsafe_base64_encode
from django.utils.encoding import force_bytes , force_str
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from django.http.response import HttpResponse
from django.contrib.auth import authenticate, login
from social_django.utils import load_backend, load_strategy
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend ,AuthForbidden , AuthTokenError 
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import generics
from requests import HTTPError
from django.contrib.auth.tokens import default_token_generator
import random
from  authUser.serializers import *
from nextCart.serializers import *
from django_otp.plugins.otp_email.models import EmailDevice
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import ModelViewSet 
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from django.core.mail import send_mail
from .models import FCMDevice




from django.contrib.auth import get_user_model

User = get_user_model()



@method_decorator(csrf_exempt, name='dispatch')
class SocialLoginView(generics.GenericAPIView):
    """Log in using social providers like Apple or Google etc"""
    serializer_class = SocialSerializer
    permission_classes = [AllowAny]
 
    def post(self, request):
        """Authenticate user through the provider and access_token"""
        print(request, 'request')
        serializer = self.serializer_class(data=request.data)
        print(serializer, 'serializer')
        serializer.is_valid(raise_exception=True)
        
        provider = serializer.validated_data.get('provider')
        access_token = serializer.validated_data.get('access_token')
        
        strategy = load_strategy(request)
        print(strategy, 'strategy')
        
        try:
            backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)
            print(backend, 'backend')
        except MissingBackend:
            return Response({'error': 'Please provide a valid provider'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if isinstance(backend, BaseOAuth2):
                user = backend.do_auth(access_token)
                if user:
                    print(f"User authenticated: {user}")
                else:
                    print(f"User not authenticated, user is: {user}")
        except AuthForbidden as error:
            print(f"AuthForbidden: {str(error)}")
            return Response({"error": "Your credentials aren't allowed.", "details": str(error)}, status=status.HTTP_403_FORBIDDEN)
        except HTTPError as error:
            return Response({"error": {"access_token": "Invalid token", "details": str(error)}}, status=status.HTTP_400_BAD_REQUEST)
        except AuthTokenError as error:
            return Response({"error": "Invalid credentials", "details": str(error)}, status=status.HTTP_400_BAD_REQUEST)
 
        if user and user.is_active:
            login(request, user)
            # token = jwt_encode_handler(jwt_payload_handler(user))
            refresh = RefreshToken.for_user(user)
            response_data = {
                'user_id':user.id,
                "email": user.email,
                "username": user.username,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(data=response_data, status=status.HTTP_200_OK)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)




# Helper Functions
def generate_otp():
    return str(random.randint(100000, 999999))

def store_otp_in_cache(email, otp):
    cache_key = f"otp_{email}"
    cache.set(cache_key, otp, timeout=600)  # Timeout in seconds (10 minutes)

def send_activation_email(username, email, otp):
    subject = "Verify Your Email"
    message = f"Hello {username},\n\nYour OTP for email verification is: {otp}.\nIt is valid for 10 minutes.\n\nThank you for registering with us!"
    from_email = "your_email@example.com"
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)


def verify_otp(email, otp):
    cache_key = f"otp_{email}"
    stored_otp = cache.get(cache_key)
    return stored_otp == otp

# Create User View
class CreateUserView(generics.CreateAPIView):
    serializer_class = SendOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')

        # Generate and store OTP
        otp = generate_otp()
        store_otp_in_cache(email, otp)
        

        # Send OTP email
        send_activation_email(username, email, otp)

        return Response({"message": "OTP sent to email." , "email": email , "username": username , "otp": otp}, status=status.HTTP_200_OK)

# OTP Verification View
class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer  # Use the new serializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validate input data

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # Add your OTP verification logic
        if verify_otp(email, otp):  # Assume `verify_otp` checks the OTP
            user = User.objects.filter(username=username, email=email).first()
            if not user:
                # Create the user if they don't exist
                user = User(username=username, email=email)
                user.set_password(password)  # Hash the password
                user.is_active = True
                user.save()

            # Authenticate the user
            authenticated_user = authenticate(username=username, password=password)
            if not authenticated_user:
                return Response({"error": "Authentication failed."}, status=401)

            # Login the user
            login(request, authenticated_user)

            # Generate tokens
            refresh = RefreshToken.for_user(authenticated_user)
            response_data = {
                'user_id': authenticated_user.id,
                "email": authenticated_user.email,
                "username": authenticated_user.username,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            return Response(data=response_data, status=201)
        # else:
        return Response({"error": "Invalid or expired OTP."}, status=400)



class LogInView(generics.GenericAPIView):
    serializer_class = LoginSerializer  
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({"error": "User account is inactive."}, status=status.HTTP_400_BAD_REQUEST)

        # Log the user in
        login(request, user)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        response_data = {
            'user_id': user.id,
            "email": user.email,
            "username": user.username,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return Response(data=response_data, status=status.HTTP_200_OK)
    



class RequestPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        # Create or get an EmailDevice for OTP
        device, created = EmailDevice.objects.get_or_create(user=user, confirmed=True)
        device.generate_challenge()  # Sends OTP email

        return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)    
    

class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            device = EmailDevice.objects.get(user=user)
        except (User.DoesNotExist, EmailDevice.DoesNotExist):
            return Response({"error": "Invalid email or OTP device."}, status=status.HTTP_404_NOT_FOUND)

        # Verify OTP
        if device.verify_token(otp):
            return Response({"message": "OTP verified. You can reset your password now."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        



class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        if not email or not new_password:
            return Response({"error": "Email and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Update user's password
        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
    





class  ShippingInfoView(ModelViewSet):
    serializer_class = ShippingInfoSerializer
    queryset = ShippingInfo.objects.all()
    # permission_classes = [IsAuthenticated]


class FCMDeviceTokenView(APIView):
    permission_classes =  [IsAuthenticated]
    def post(self, request):
        token = request.data.get('fcm_token')
        


class SaveFCMToken(APIView):

    def post(self, request):
        token = request.data.get("token")

        FCMToken.objects.update_or_create(
            user=request.user,
            defaults={"token": token}
        )

        return Response({"message": "Saved"})   