from django.urls import path
from .views import WalletDetailView, InitiateWalletFundingView

urlpatterns = [
    path('wallet/', WalletDetailView.as_view(), name='wallet-detail'),
    path('wallet/fund/', InitiateWalletFundingView.as_view(), name='wallet-fund'),
]