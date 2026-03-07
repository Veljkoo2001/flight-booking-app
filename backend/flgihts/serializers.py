from rest_framework import serializers
from .models import Airport, Airline, Flight

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ['code', 'name', 'city', 'country']

class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = ['code', 'name']

class FlightSerializer(serializers.ModelSerializer):
    airline_name = serializers.CharField(source='airline.name', read_only=True)
    airline_code = serializers.CharField(source='airline.code', read_only=True)
    from_city = serializers.CharField(source='from_airport.city', read_only=True)
    from_code = serializers.CharField(source='from_airport.code', read_only=True)
    to_city = serializers.CharField(source='to_airport.city', read_only=True)
    to_code = serializers.CharField(source='to_airport.code', read_only=True)
    
    class Meta:
        model = Flight
        fields = [
            'id', 'flight_number', 'airline', 'airline_name', 'airline_code',
            'from_airport', 'from_city', 'from_code',
            'to_airport', 'to_city', 'to_code',
            'departure_time', 'arrival_time', 'price',
            'luggage_included', 'flight_type', 'available_seats'
        ]