# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run server
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Upload a resume (PDF or DOCX)
4. Add a job description
5. Run an analysis
6. View results and history

## Troubleshooting

### NLTK Data Not Found
If you see NLTK errors, run:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### Port Already in Use
- Backend: Change port in `python manage.py runserver 8001`
- Frontend: Change port in `vite.config.js`

### CORS Errors
Make sure the frontend proxy is configured correctly in `vite.config.js`

### File Upload Errors
- Check file size (max 10MB)
- Ensure file is PDF or DOCX format
- Check media directory permissions
