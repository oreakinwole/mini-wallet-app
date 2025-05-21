from django.urls import path
from .views import TransactionWebhookView

urlpatterns = [
    path('transactions/webhook/', TransactionWebhookView.as_view(), name='transaction-webhook'),
]