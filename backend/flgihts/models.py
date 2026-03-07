from django.db import models

class Airport(models.Model):
    code = models.CharField(max_length=3, unique=True)  # BEG, TIV, itd.
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    
    class Meta:
        ordering = ['city']
    
    def __str__(self):
        return f"{self.city} ({self.code})"

class Airline(models.Model):
    code = models.CharField(max_length=2, unique=True)  # JU, YM, itd.
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name