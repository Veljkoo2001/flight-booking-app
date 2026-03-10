// Konfiguracija
const API_BASE_URL = 'http://localhost:5000/api'; // Promeniti kada bude na produkciji

// Čekanje da DOM učita
document.addEventListener('DOMContentLoaded', function() {
    
    // Provera da li smo na stranici sa formom (index.html)
    const searchForm = document.getElementById('flightSearchForm');
    if (searchForm) {
        initSearchForm();
    }
    
    // Provera da li smo na stranici sa rezultatima (results.html)
    if (window.location.pathname.includes('results.html')) {
        loadSearchResults();
    }
});

// Inicijalizacija forme za pretragu
function initSearchForm() {
    const form = document.getElementById('flightSearchForm');
    const returnDateGroup = document.getElementById('returnDateGroup');
    const returnRadio = document.getElementById('return');
    const oneWayRadio = document.getElementById('oneWay');
    const departureDate = document.getElementById('departureDate');
    
    // Postavi minimalni datum na današnji
    const today = new Date().toISOString().split('T')[0];
    departureDate.min = today;
    if (document.getElementById('returnDate')) {
        document.getElementById('returnDate').min = today;
    }
    
    // Prikaz/sakrivanje datuma povratka
    function toggleReturnDate() {
        if (returnRadio.checked) {
            returnDateGroup.style.display = 'block';
            document.getElementById('returnDate').required = true;
        } else {
            returnDateGroup.style.display = 'none';
            document.getElementById('returnDate').required = false;
        }
    }
    
    returnRadio.addEventListener('change', toggleReturnDate);
    oneWayRadio.addEventListener('change', toggleReturnDate);
    
    // Validacija i slanje forme
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Osnovna validacija
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();
        const departureDate = document.getElementById('departureDate').value;
        
        if (!fromCity || !toCity || !departureDate) {
            alert('Molimo popunite sva obavezna polja.');
            return;
        }
        
        if (fromCity.toLowerCase() === toCity.toLowerCase()) {
            alert('Grad polaska i dolaska ne mogu biti isti.');
            return;
        }
        
        if (returnRadio.checked) {
            const returnDate = document.getElementById('returnDate').value;
            if (!returnDate) {
                alert('Molimo izaberite datum povratka.');
                return;
            }
            if (returnDate < departureDate) {
                alert('Datum povratka ne može biti pre datuma polaska.');
                return;
            }
        }
        
        // Prikupljanje podataka za pretragu
        const searchParams = new URLSearchParams({
            from: fromCity,
            to: toCity,
            departureDate: departureDate,
            flightType: returnRadio.checked ? 'return' : 'one-way',
            luggage: document.querySelector('input[name="luggage"]:checked').value
        });
        
        if (returnRadio.checked) {
            searchParams.append('returnDate', document.getElementById('returnDate').value);
        }
        
        // Preusmeravanje na stranicu sa rezultatima
        window.location.href = `results.html?${searchParams.toString()}`;
    });
}

// Učitavanje rezultata pretrage
async function loadSearchResults() {
    // Dohvatanje parametara iz URL-a
    const urlParams = new URLSearchParams(window.location.search);
    
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const departureDate = urlParams.get('departureDate');
    const returnDate = urlParams.get('returnDate');
    const flightType = urlParams.get('flightType');
    const luggage = urlParams.get('luggage');
    
    // Prikaz kriterijuma pretrage
    displaySearchCriteria(from, to, departureDate, returnDate, flightType, luggage);
    
    try {
        // Pravljenje URL-a za API poziv
        const apiUrl = new URL(`${API_BASE_URL}/flights/search`);
        apiUrl.searchParams.append('from', from);
        apiUrl.searchParams.append('to', to);
        apiUrl.searchParams.append('departureDate', departureDate);
        apiUrl.searchParams.append('flightType', flightType);
        apiUrl.searchParams.append('luggage', luggage);
        
        if (returnDate) {
            apiUrl.searchParams.append('returnDate', returnDate);
        }
        
        // API poziv
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Sakrivanje spinnera
        document.getElementById('loadingSpinner').style.display = 'none';
        
        // Prikaz rezultata
        displayFlightResults(data, flightType);
        
    } catch (error) {
        console.error('Greška pri učitavanju letova:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('noResults').innerHTML = `
            <i class="bi bi-exclamation-triangle"></i>
            Došlo je do greške pri učitavanju letova. Molimo pokušajte ponovo.
        `;
    }
}

// Prikaz kriterijuma pretrage
function displaySearchCriteria(from, to, departureDate, returnDate, flightType, luggage) {
    const criteriaDiv = document.getElementById('searchCriteria');
    
    const formattedDeparture = new Date(departureDate).toLocaleDateString('sr-RS');
    let criteriaText = `
        <i class="bi bi-info-circle"></i>
        <strong>Pretraga:</strong> ${from} → ${to} | 
        <strong>Polazak:</strong> ${formattedDeparture}
    `;
    
    if (flightType === 'return' && returnDate) {
        const formattedReturn = new Date(returnDate).toLocaleDateString('sr-RS');
        criteriaText += ` | <strong>Povratak:</strong> ${formattedReturn}`;
    }
    
    criteriaText += ` | <strong>Prtljag:</strong> ${luggage === 'true' ? 'Sa' : 'Bez'}`;
    
    criteriaDiv.innerHTML = criteriaText;
}

// Prikaz rezultata letova
function displayFlightResults(data, flightType) {
    const outboundList = document.getElementById('outboundFlightsList');
    const returnList = document.getElementById('returnFlightsList');
    const resultsContainer = document.getElementById('resultsContainer');
    const noResults = document.getElementById('noResults');
    const flightTabs = document.getElementById('flightTabs');
    
    // Čišćenje prethodnih rezultata
    outboundList.innerHTML = '';
    returnList.innerHTML = '';
    
    // Provera da li ima odlaznih letova
    const hasOutbound = data.outbound_flights && data.outbound_flights.length > 0;
    
    if (!hasOutbound) {
        resultsContainer.style.display = 'block';
        noResults.style.display = 'block';
        return;
    }
    
    // Prikaz odlaznih letova
    data.outbound_flights.forEach(flight => {
        outboundList.appendChild(createFlightCard(flight, 'outbound'));
    });
    
    // Ako je povratno putovanje
    if (flightType === 'return') {
        flightTabs.style.display = 'flex';
        
        if (data.return_flights && data.return_flights.length > 0) {
            data.return_flights.forEach(flight => {
                returnList.appendChild(createFlightCard(flight, 'return'));
            });
        } else {
            returnList.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning">
                        Nema dostupnih povratnih letova za izabrani datum.
                    </div>
                </div>
            `;
        }
    }
    
    resultsContainer.style.display = 'block';
}

// Kreiranje kartice za let
function createFlightCard(flight, type) {
    const col = document.createElement('div');
    col.className = 'col-12';
    
    const departureTime = new Date(flight.departure).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
    const arrivalTime = new Date(flight.arrival).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
    const flightDate = new Date(flight.departure).toLocaleDateString('sr-RS');
    
    col.innerHTML = `
        <div class="flight-card">
            <div class="row align-items-center">
                <div class="col-md-3">
                    <div class="flight-company">
                        <i class="bi bi-building"></i> ${flight.company}
                    </div>
                    <div class="text-muted small">Let ${flight.company_code} ${flight.id}</div>
                </div>
                <div class="col-md-3">
                    <div class="flight-time">
                        ${departureTime} - ${arrivalTime}
                    </div>
                    <div class="text-muted">
                        ${flight.from_code} → ${flight.to_code}
                    </div>
                </div>
                <div class="col-md-2">
                    <span class="badge ${flight.luggage_included ? 'bg-success' : 'bg-secondary'} flight-badge">
                        <i class="bi ${flight.luggage_included ? 'bi-check-circle' : 'bi-x-circle'}"></i>
                        ${flight.luggage_included ? 'Sa prtljagom' : 'Bez prtljaga'}
                    </span>
                </div>
                <div class="col-md-2">
                    <div class="text-muted small">Preostalo mesta: ${flight.available_seats}</div>
                </div>
                <div class="col-md-2 text-end">
                    <div class="flight-price">${flight.price} €</div>
                    <button class="btn btn-sm btn-primary mt-2" onclick="selectFlight(${flight.id}, '${type}')">
                        Izaberi
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Selektovanje leta (placeholder za rezervaciju)
function selectFlight(flightId, type) {
    alert(`Izabrali ste let ${flightId} (${type === 'outbound' ? 'odlazni' : 'povratni'}).\nOvo je placeholder za proces rezervacije.`);
    // Ovde bi išla logika za rezervaciju
}

// Formatiranje datuma za prikaz
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('sr-RS', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}