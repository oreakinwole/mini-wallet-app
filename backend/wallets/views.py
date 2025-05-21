from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet
from .serializers import WalletSerializer
from transactions.models import Transaction
import uuid
import requests
from django.conf import settings

class WalletDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        wallet = Wallet.objects.get(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)

class InitiateWalletFundingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        amount = request.data.get('amount')
        if not amount:
            return Response({'error': 'Amount is required'}, status=400)
        
        wallet = Wallet.objects.get(user=request.user)
        reference = str(uuid.uuid4())
        
        # Create a pending transaction
        transaction = Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type='credit',
            status='pending',
            reference=reference,
            description='Wallet funding'
        )
        
        # Initialize Monnify payment
        monnify_url = "https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction"
        headers = {
            "Authorization": f"Bearer {settings.MONNIFY_API_KEY}"
        }
        
        payload = {
            "amount": float(amount),
            "customerName": f"{request.user.first_name} {request.user.last_name}",
            "customerEmail": request.user.email,
            "paymentReference": reference,
            "paymentDescription": "Wallet Funding",
            "currencyCode": "NGN",
            "contractCode": settings.MONNIFY_CONTRACT_CODE,
            "redirectUrl": settings.MONNIFY_REDIRECT_URL,
            "paymentMethods": ["CARD", "ACCOUNT_TRANSFER"]
        }
        
        try:
            response = requests.post(monnify_url, json=payload, headers=headers)
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('requestSuccessful'):
                return Response({
                    'checkoutUrl': response_data['responseBody']['checkoutUrl'],
                    'transactionReference': reference
                })
            else:
                transaction.status = 'failed'
                transaction.save()
                return Response({'error': 'Failed to initialize payment'}, status=400)
        except Exception as e:
            transaction.status = 'failed'
            transaction.save()
            return Response({'error': str(e)}, status=500)

