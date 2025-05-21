from rest_framework import serializers
from .models import User
from wallets.models import Wallet

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # Create wallet for new user
        Wallet.objects.create(user=user)
        return user