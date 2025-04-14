from django.urls import path
from .views import InvestmentListCreateView, InvestmentDetailView, ClearInvestmentsView, InvestmentHistoryView

urlpatterns = [
    path('investments/', InvestmentListCreateView.as_view(), name='investment-list-create'),  # For listing and creating investments
    path('investments/<int:pk>/', InvestmentDetailView.as_view(), name='investment-detail'),  # For viewing/editing a single investment
    path('clear/', ClearInvestmentsView.as_view(), name='clear-investments'),  # For clearing all investments
    path('investments/<int:pk>/history/', InvestmentHistoryView.as_view(), name='investment-history'),
]
