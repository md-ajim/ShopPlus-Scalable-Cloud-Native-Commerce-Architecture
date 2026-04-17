from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import password_validation
from .models import *
from django.contrib.auth import get_user_model
from nextCart.models import *
User = get_user_model()





class SocialSerializer(serializers.Serializer):
    provider = serializers.CharField(max_length=255, required=True)
    access_token = serializers.CharField(max_length=4096, required=True, trim_whitespace=True)



class OTPSerializer(serializers.Serializer):

    class Meta:
        model = OTP
        fields = '__all__'


from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")
        return data



class VerifyOTPSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True)

    def validate_password(self, value ):
        password_validation.validate_password( value)
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )
             
        return value
    
    otp = serializers.CharField(max_length=6)  # Adjust the length based on your OTP logic
    class Meta:
        model = User
        fields = [ "username", "email", "password" , 'otp']  
        




class  ShippingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingInfo
        fields = '__all__'


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)



class FCMTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMToken
        fields = "__all__"
