from django.urls import path
from . import views

urlpatterns = [
    path('flights/search/', views.search_flights, name='search-flights'),
    path('flights/companies/', views.get_companies, name='get-companies'),
    path('flights/destinations/', views.get_destinations, name='get-destinations'),
    path('health/', views.health_check, name='health-check'),
]