# backend/investments/serializers.py

from rest_framework import serializers
from .models import Investment

class InvestmentSerializer(serializers.ModelSerializer):
    profit_loss = serializers.SerializerMethodField()

    class Meta:
        model = Investment
        fields = ['id', 'asset', 'amount', 'date', 'current_value', 'profit_loss']

    def get_profit_loss(self, obj):
        return obj.profit_loss
