from rest_framework import serializers
from .models import Wallet
from transactions.serializers import TransactionSerializer

class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Wallet
        fields = ('id', 'balance', 'transactions', 'created_at', 'updated_at')
        read_only_fields = ('balance',)