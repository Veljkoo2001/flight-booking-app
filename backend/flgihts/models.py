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

class Airline(models.Model):
    code = models.CharField(max_length=2, unique=True)  # JU, YM, itd.
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Flight(models.Model):
    FLIGHT_TYPE_CHOICES = [
        ('one_way', 'One Way'),
        ('round_trip', 'Round Trip'),
    ]
    
    flight_number = models.CharField(max_length=10)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='flights')
    from_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departures')
    to_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arrivals')
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    luggage_included = models.BooleanField(default=False)
    flight_type = models.CharField(max_length=10, choices=FLIGHT_TYPES, default='one-way')
    available_seats = models.IntegerField(default=50)
    
    class Meta:
        ordering = ['departure_time', 'price']
    
    def __str__(self):
        return f"{self.flight_number}: {self.from_airport.code} → {self.to_airport.code}"