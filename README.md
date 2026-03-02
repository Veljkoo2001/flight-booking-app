# ✈️ Flight Booking App - Flight Reservation Application

[![Status: U izradi](https://img.shields.io/badge/Status-U%20izradi-yellow)](https://github.com/tvoj-username/flight-booking-app)
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2-green)](https://djangoproject.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com)

> ⚠️ **Važno napomena:** Important Note: This project is currently under active development. Features are being added and modified, and the code may change without prior notice.

## 📋 About the Project

**Flight Booking App** is a web application for searching and booking flight tickets. The application allows users to search for flights based on various criteria, browse available options, and make reservations.

### 🎯 Currently Implemented Features

- ✅ Flight search (from - to, date, trip type)
- ✅ Baggage filtering (with/without)
- ✅ Search results display with price sorting
- ✅ Support for one-way and round-trip travel
- ✅ Mock data for testing

### 🚧 Planned Features

- ⏳ Integration with a real database 
- ⏳ Booking and payment system
- ⏳ User accounts and authentication
- ⏳ Admin panel for flight management
- ⏳ Email confirmation system
- ⏳ Advanced filtering (by airline, departure time, etc.)
- ⏳ City autocomplete feature

## 🛠 Technologies

### Backend
- **Python 3.0+**
- **Django 4.2+** - Web framework
- **Django REST Framework** - For API development
- **SQLite** (development environment) / **PostgreSQL** (production – planned)

### Frontend
- **HTML5**
- **CSS3** with Bootstrap 5
- **JavaScript (ES6+)**
- **Bootstrap Icons**

### DevOps & Hosting
- **Git** & **GitHub** - Version control
- **Vercel** - Hosting platform (frontend and backend)

## 📁 Project Structure

```
├── 📁 backend
│   ├── 📁 flgihts
│   │   ├── 📁 migrations
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 admin.py
│   │   ├── 🐍 apps.py
│   │   ├── 🐍 models.py
│   │   ├── 🐍 serializers.py
│   │   ├── 🐍 urls.py
│   │   ├── 🐍 utils.py
│   │   └── 🐍 views.py
│   ├── 📁 flight_booking
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 settings.py
│   │   ├── 🐍 urls.py
│   │   └── 🐍 wsgi.py
│   ├── 🐍 manage.py
│   ├── 📄 requirements.txt
│   └── ⚙️ vercel.json
└── 📁 frontend
    ├── 📁 assets
    ├── 📁 css
    │   └── 🎨 style.css
    ├── 📁 js
    │   └── 📄 app.js
    ├── 🌐 index.html
    └── 🌐 results.html
```



