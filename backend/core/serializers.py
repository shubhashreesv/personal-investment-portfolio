from django.contrib.auth.models import User
from rest_framework import serializers

# Serializer for user registration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Serializer for user login (using only username and password)
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
