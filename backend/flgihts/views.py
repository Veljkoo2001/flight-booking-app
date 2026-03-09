from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from .utils import get_mock_flights

@api_view(['GET'])
def search_flights(request):
    """Pretraga letova na osnovu kriterijuma"""
    # Dohvatanje parametara
    from_city = request.query_params.get('from', '')
    to_city = request.query_params.get('to', '')
    departure_date = request.query_params.get('departureDate', '')
    return_date = request.query_params.get('returnDate', '')
    flight_type = request.query_params.get('flightType', 'one-way')
    luggage = request.query_params.get('luggage', 'false').lower() == 'true'
    
    print(f"Primljen zahtev: {request.query_params}")
    
    # Dohvatanje mock podataka
    all_flights = get_mock_flights()
    
    # Filtriranje letova
    filtered_flights = []
    
    for flight in all_flights:
        # Filtriranje po gradovima
        if from_city and flight['from'].lower() != from_city.lower():
            continue
        if to_city and flight['to'].lower() != to_city.lower():
            continue
            
        # Filtriranje po datumu polaska
        if departure_date:
            flight_departure_date = flight['departure'].split('T')[0]
            if flight_departure_date != departure_date:
                continue
        
        # Filtriranje po tipu leta
        if flight_type == 'one-way' and flight['flight_type'] != 'one-way':
            continue
        
        # Filtriranje po prtljagu
        if luggage and not flight['luggage_included']:
            continue
            
        filtered_flights.append(flight)
    
    # Sortiranje po ceni
    filtered_flights.sort(key=lambda x: x['price'])
    
    # Priprema odgovora
    response_data = {
        'outbound_flights': filtered_flights,
        'return_flights': []
    }
    
    # Ako je povratno putovanje, tražimo povratne letove
    if flight_type == 'return' and return_date:
        return_flights = []
        for flight in all_flights:
            if (flight['from'].lower() == to_city.lower() and 
                flight['to'].lower() == from_city.lower() and
                flight['flight_type'] == 'return'):
                flight_return_date = flight['departure'].split('T')[0]
                if flight_return_date == return_date:
                    # Provera prtljaga i za povratne letove
                    if luggage and not flight['luggage_included']:
                        continue
                    return_flights.append(flight)
        
        return_flights.sort(key=lambda x: x['price'])
        response_data['return_flights'] = return_flights
    
    return Response(response_data)

@api_view(['GET'])
def get_companies(request):
    """Vraća listu svih avio kompanija"""
    flights = get_mock_flights()
    companies = set()
    for flight in flights:
        companies.add(flight['company'])
    
    return Response(list(companies))

@api_view(['GET'])
def get_destinations(request):
    """Vraća listu svih destinacija"""
    flights = get_mock_flights()
    destinations = set()
    for flight in flights:
        destinations.add(flight['from'])
        destinations.add(flight['to'])
    
    return Response(list(destinations))

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'OK', 'message': 'Server radi!'})