# AI Resume Analyzer

A production-ready full-stack web application for analyzing resumes against job descriptions using AI/NLP techniques. The application provides ATS (Applicant Tracking System) scoring, skill extraction, keyword matching, and personalized recommendations.

## Features

### Backend (Django + DRF)
- ✅ User authentication with JWT tokens
- ✅ Resume upload (PDF/DOCX) with text extraction
- ✅ Job description management
- ✅ NLP-based skill extraction
- ✅ ATS score calculation (0-100%)
- ✅ Keyword matching and missing keywords detection
- ✅ Analysis history per user
- ✅ RESTful API endpoints

### Frontend (React)
- ✅ Modern, responsive UI with gradient design
- ✅ User authentication (Login/Register)
- ✅ Dashboard with statistics and charts
- ✅ Drag-and-drop file upload
- ✅ Resume and job description management
- ✅ Real-time analysis results
- ✅ Analysis history with visualizations

## Tech Stack

**Backend:**
- Django 4.2.7
- Django REST Framework 3.14.0
- JWT Authentication
- NLTK & spaCy for NLP
- scikit-learn for text similarity
- pdfplumber & python-docx for file parsing

**Frontend:**
- React 18.2.0
- React Router 6.20.0
- Axios for API calls
- Recharts for data visualization
- React Dropzone for file uploads
- Vite for build tooling

## Project Structure

```
proj/
├── backend/
│   ├── config/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/            # User authentication app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── resume_analyzer/    # Main app
│   │   ├── models.py        # Resume, JobDescription, Analysis models
│   │   ├── views.py         # API views
│   │   ├── serializers.py   # DRF serializers
│   │   ├── utils.py         # NLP and analysis functions
│   │   └── urls.py
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth context
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── requirements.txt
└── README.md
```

## Database Schema

### User Model (Custom)
- `id`: Primary key
- `email`: Unique email address (used for login)
- `username`: Username
- `password`: Hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Resume Model
- `id`: Primary key
- `user`: Foreign key to User
- `file`: FileField (PDF/DOCX)
- `original_filename`: Original file name
- `file_type`: PDF or DOCX
- `extracted_text`: Extracted text content
- `uploaded_at`: Upload timestamp

### JobDescription Model
- `id`: Primary key
- `user`: Foreign key to User
- `title`: Job title
- `description`: Full job description text
- `company`: Company name (optional)
- `created_at`: Creation timestamp

### Analysis Model
- `id`: Primary key
- `user`: Foreign key to User
- `resume`: Foreign key to Resume
- `job_description`: Foreign key to JobDescription
- `ats_score`: Float (0-100)
- `extracted_skills`: JSON array of skills
- `matched_skills`: JSON array of matched skills
- `missing_keywords`: JSON array of missing keywords
- `recommendations`: Text recommendations
- `created_at`: Analysis timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get current user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Resumes
- `GET /api/resumes/` - List user's resumes
- `POST /api/resumes/` - Upload new resume
- `GET /api/resumes/{id}/` - Get resume details
- `DELETE /api/resumes/{id}/` - Delete resume

### Job Descriptions
- `GET /api/job-descriptions/` - List user's job descriptions
- `POST /api/job-descriptions/` - Create job description
- `GET /api/job-descriptions/{id}/` - Get job description details
- `PUT /api/job-descriptions/{id}/` - Update job description
- `DELETE /api/job-descriptions/{id}/` - Delete job description

### Analysis
- `POST /api/analyze/` - Analyze resume against job description
- `GET /api/analyses/` - List all analyses
- `GET /api/analyses/{id}/` - Get analysis details
- `GET /api/dashboard/stats/` - Get dashboard statistics

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r ../requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

6. Download NLTK data (first time only):
```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

7. Run the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Resume**: Upload a PDF or DOCX resume file
3. **Add Job Description**: Add a job description you want to match against
4. **Analyze**: Select a resume and job description to analyze
5. **View Results**: See ATS score, matched skills, missing keywords, and recommendations
6. **View History**: Check your analysis history with charts and trends

## Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## Production Deployment

### Backend
- Set `DEBUG=False` in settings.py
- Use a production database (PostgreSQL recommended)
- Configure proper CORS settings
- Use environment variables for sensitive data
- Set up static file serving (WhiteNoise or CDN)

### Frontend
- Build the production bundle: `npm run build`
- Serve static files through a web server (Nginx, Apache)
- Configure API proxy or CORS for backend communication

## Algorithm Details

### ATS Score Calculation
The ATS score is calculated using a combination of:
- **Keyword Matching (70%)**: Percentage of job description keywords found in resume
- **Semantic Similarity (30%)**: TF-IDF vectorization and cosine similarity

### Skill Extraction
Skills are extracted by matching against a comprehensive list of technical skills including:
- Programming languages
- Web frameworks
- Databases
- Cloud platforms
- DevOps tools
- Data science libraries

### Recommendations
Recommendations are generated based on:
- ATS score thresholds
- Missing keywords
- Skill match count

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
