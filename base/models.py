from django.db import models
from datetime import datetime, timezone, timedelta
# Create your models here.
class APIkey(models.Model):
    username = models.CharField(blank=False, max_length=150)
    apikey = models.CharField(blank=False, max_length=20, unique=True)
    plan = models.CharField(max_length=20, default='starter')
    transactions_left = models.IntegerField(default=100)
    creation_date = models.DateTimeField(blank=True, default=datetime.now(timezone.utc))
    expiration_date = models.DateTimeField(blank=True, default=datetime.now(timezone.utc) + timedelta(days=30))
    expired = models.BooleanField(default=False)
class Transaction(models.Model):
    username = models.CharField(blank=False, max_length=150)
    date = models.DateTimeField(blank=True, default=datetime.now(timezone.utc))
    result = models.JSONField(blank=False, default=dict)