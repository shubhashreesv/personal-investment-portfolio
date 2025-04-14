from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    asset = models.CharField(max_length=100)
    amount = models.FloatField()
    date = models.DateField()
    current_value = models.FloatField()
    value_history = models.JSONField(default=list)  # Store history of stock values as a JSON array
    
    @property
    def profit_loss(self):
        return self.current_value - self.amount

    def add_stock_value(self, value, date=None):
        """Add a new stock value to the value_history with an optional specified date."""
        if date is None:
            date = timezone.now().date()  # Default to today's date if no date is provided
        
        # Check if the value already exists for the given date
        for entry in self.value_history:
            if entry["date"] == date:
                entry["value"] = value  # Update the value for that specific date
                break
        else:
            # If no entry for that date, add a new one
            new_entry = {
                "date": date,
                "value": value
            }
            self.value_history.append(new_entry)

        self.save()

    def __str__(self):
        return f"{self.asset} - {self.amount} invested"

