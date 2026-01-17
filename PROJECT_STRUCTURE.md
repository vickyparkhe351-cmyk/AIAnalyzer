# Project Structure

```
proj/
├── backend/                          # Django Backend
│   ├── accounts/                    # User Authentication App
│   │   ├── __init__.py
│   │   ├── admin.py                 # Admin interface for User model
│   │   ├── apps.py                  # App configuration
│   │   ├── models.py                # Custom User model
│   │   ├── serializers.py           # User registration/login serializers
│   │   ├── urls.py                  # Authentication routes
│   │   ├── views.py                 # Auth views (register, login, profile)
│   │   └── migrations/              # Database migrations
│   │       └── __init__.py
│   │
│   ├── config/                      # Django Project Settings
│   │   ├── __init__.py
│   │   ├── settings.py              # Django settings (DB, apps, middleware)
│   │   ├── urls.py                  # Root URL configuration
│   │   ├── wsgi.py                  # WSGI config for production
│   │   └── asgi.py                  # ASGI config for async
│   │
│   ├── resume_analyzer/             # Main Application
│   │   ├── __init__.py
│   │   ├── admin.py                 # Admin for Resume, Job, Analysis
│   │   ├── apps.py                  # App configuration
│   │   ├── models.py                # Resume, JobDescription, Analysis models
│   │   ├── serializers.py           # DRF serializers for all models
│   │   ├── urls.py                  # API routes
│   │   ├── utils.py                 # NLP functions, file parsing, ATS scoring
│   │   ├── views.py                 # API views (CRUD + analysis)
│   │   └── migrations/              # Database migrations
│   │       └── __init__.py
│   │
│   ├── manage.py                    # Django management script
│   ├── setup.sh                     # Linux/Mac setup script
│   └── setup.bat                    # Windows setup script
│
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Navbar.css           # Navbar styles
│   │   │   └── PrivateRoute.jsx     # Protected route wrapper
│   │   │
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # Dashboard with stats & charts
│   │   │   ├── ResumeUpload.jsx     # Resume upload page
│   │   │   ├── JobDescription.jsx   # Job description management
│   │   │   ├── Analysis.jsx         # Analysis page & results
│   │   │   ├── History.jsx          # Analysis history
│   │   │   ├── Auth.css             # Auth page styles
│   │   │   └── FileUpload.css       # File upload styles
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # Global app styles
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Base styles
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # NPM dependencies
│   └── vite.config.js               # Vite configuration
│
├── requirements.txt                 # Python dependencies
├── .gitignore                       # Git ignore rules
├── README.md                        # Main documentation
├── SETUP.md                         # Setup instructions
├── API_DOCUMENTATION.md             # API endpoint documentation
└── DATABASE_SCHEMA.md               # Database schema documentation
```

## Key Files Description

### Backend Core Files

**config/settings.py**
- Django project configuration
- Database settings (SQLite for dev)
- REST Framework settings
- JWT authentication
- CORS configuration
- Media/Static file settings

**resume_analyzer/models.py**
- `Resume`: Stores uploaded resume files
- `JobDescription`: Stores job postings
- `Analysis`: Stores analysis results

**resume_analyzer/utils.py**
- `extract_text_from_pdf()`: PDF text extraction
- `extract_text_from_docx()`: DOCX text extraction
- `extract_skills()`: NLP skill extraction
- `calculate_ats_score()`: ATS scoring algorithm
- `generate_recommendations()`: AI recommendations

**resume_analyzer/views.py**
- API views for all CRUD operations
- Resume upload handling
- Analysis endpoint
- Dashboard statistics

### Frontend Core Files

**src/App.jsx**
- Main app component
- React Router setup
- Route definitions
- Auth provider wrapper

**src/context/AuthContext.jsx**
- Authentication state management
- Login/Register/Logout functions
- JWT token handling
- User profile management

**src/pages/Dashboard.jsx**
- Statistics display
- Charts (Recharts)
- Recent analyses list

**src/pages/Analysis.jsx**
- Resume/Job selection
- Analysis execution
- Results display with visualizations

## Data Flow

1. **User Registration/Login** → JWT tokens stored
2. **Resume Upload** → File saved, text extracted
3. **Job Description Added** → Stored in database
4. **Analysis Request** → Skills extracted, ATS calculated
5. **Results Displayed** → Charts, recommendations shown
6. **History Stored** → All analyses saved per user

## Technology Stack Summary

**Backend:**
- Django 4.2.7
- Django REST Framework 3.14.0
- JWT Authentication
- NLTK & scikit-learn for NLP
- pdfplumber & python-docx for parsing

**Frontend:**
- React 18.2.0
- React Router 6.20.0
- Axios for HTTP
- Recharts for visualization
- React Dropzone for uploads
- Vite for build tooling

## File Sizes & Complexity

- **Backend**: ~15 files, ~2000 lines of code
- **Frontend**: ~20 files, ~1500 lines of code
- **Documentation**: 5 comprehensive markdown files
