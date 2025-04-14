# backend/investments/models.py

from django.db import models
from django.contrib.auth.models import User

class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    asset = models.CharField(max_length=100)
    amount = models.FloatField()
    date = models.DateField()
    current_value = models.FloatField()

    @property
    def profit_loss(self):
        return self.current_value - self.amount
