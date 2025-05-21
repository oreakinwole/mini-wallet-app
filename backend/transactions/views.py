from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer
from wallets.models import Wallet
from django.db import transaction as db_transaction
from django.conf import settings
import hmac
import hashlib

class TransactionWebhookView(APIView):
    permission_classes = []  # No authentication for webhooks
    
    def post(self, request):
        # Verify webhook signature
        signature = request.headers.get('monnify-signature')
        computed_signature = hmac.new(
            settings.MONNIFY_SECRET_KEY.encode(),
            request.body,
            hashlib.sha512
        ).hexdigest()
        
        if signature != computed_signature:
            return Response({'error': 'Invalid signature'}, status=400)
        
        event_data = request.data
        event_type = event_data.get('eventType')
        
        if event_type == 'SUCCESSFUL_TRANSACTION':
            payment_reference = event_data['eventData']['paymentReference']
            
            with db_transaction.atomic():
                try:
                    # Find the transaction
                    transaction = Transaction.objects.select_for_update().get(
                        reference=payment_reference,
                        status='pending'
                    )
                    
                    # Update transaction status
                    transaction.status = 'successful'
                    transaction.metadata = event_data
                    transaction.save()
                    
                    # Update wallet balance
                    wallet = transaction.wallet
                    wallet.balance += transaction.amount
                    wallet.save()
                    
                    return Response({'status': 'success'})
                except Transaction.DoesNotExist:
                    return Response({'error': 'Transaction not found'}, status=404)
        
        return Response({'status': 'ignored'})