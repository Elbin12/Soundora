# 🎧 Soundora - Full Stack Artist Search App

Soundora is a full-stack web application that allows users to search for artists using smart techniques like fuzzy search and abbreviation matching.

- 🔙 Backend: Django + Django REST Framework
- 🔜 Frontend: React (with Vite) + Tailwind CSS
- 🧠 Fuzzy & Abbreviation search powered by PostgreSQL `pg_trgm`

---

## 📦 Tech Stack

### 🔧 Backend
- Django
- Django REST Framework (DRF)
- PostgreSQL
- Trigram Similarity Search (`pg_trgm`)
- GIN Indexing for performance

### 💻 Frontend
- React (Vite)
- Tailwind CSS
- Axios for API calls

---

## 🔍 Features

- Search artists by full name or abbreviation (e.g. "MJ" → "Michael Jackson")
- Fuzzy matching for typo-tolerant search
- Top 10 results sorted by popularity
- Responsive and fast React frontend

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/Elbin12/Soundora.git
cd soundora
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
````
Create a .env file inside the backend directory:
```bash
SECRET_KEY = django-project secret key
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=db_password
DB_HOST=localhost
DB_PORT=5432

SPOTIFY_CLIENT_ID =your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

Enable pg_trgm in PostgreSQL
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Apply Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
### Populate the Database
```bash
python manage.py get_artists
python manage.py enrich_locations
```
### Run the server
```bash
python manage.py runserver
```

## 3. 💻 Frontend Setup (Vite + React)

```bash
cd frontend
npm install
```
Create a .env file inside the frontend directory:
```bash
VITE_BACKEND_URL = 'http://localhost:8000/api/'
```
Then run the development server:
```bash
npm run dev
```
## ✅ Success!
Once both servers are running, you can open your browser at http://localhost:5173