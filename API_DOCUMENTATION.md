# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints (except registration and login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "password_confirm": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Get Profile
```http
GET /api/auth/profile/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Refresh Token
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "refresh_token_here"
}
```

### Resume Endpoints

#### List Resumes
```http
GET /api/resumes/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "file": "http://localhost:8000/media/resumes/resume.pdf",
      "original_filename": "resume.pdf",
      "file_type": "PDF",
      "extracted_text": "Full text content...",
      "uploaded_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Upload Resume
```http
POST /api/resumes/
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <PDF or DOCX file>
```

**Response:**
```json
{
  "id": 1,
  "file": "http://localhost:8000/media/resumes/resume.pdf",
  "original_filename": "resume.pdf",
  "file_type": "PDF",
  "extracted_text": "Full text content...",
  "uploaded_at": "2024-01-01T00:00:00Z"
}
```

#### Get Resume
```http
GET /api/resumes/{id}/
Authorization: Bearer <token>
```

#### Delete Resume
```http
DELETE /api/resumes/{id}/
Authorization: Bearer <token>
```

### Job Description Endpoints

#### List Job Descriptions
```http
GET /api/job-descriptions/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "title": "Senior Software Engineer",
      "description": "Full job description text...",
      "company": "Tech Corp",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Job Description
```http
POST /api/job-descriptions/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "description": "Full job description text...",
  "company": "Tech Corp"
}
```

#### Update Job Description
```http
PUT /api/job-descriptions/{id}/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description...",
  "company": "New Company"
}
```

#### Delete Job Description
```http
DELETE /api/job-descriptions/{id}/
Authorization: Bearer <token>
```

### Analysis Endpoints

#### Analyze Resume
```http
POST /api/analyze/
Authorization: Bearer <token>
Content-Type: application/json

{
  "resume_id": 1,
  "job_description_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "resume": {
    "id": 1,
    "original_filename": "resume.pdf",
    ...
  },
  "job_description": {
    "id": 1,
    "title": "Senior Software Engineer",
    ...
  },
  "ats_score": 75.5,
  "extracted_skills": ["Python", "Django", "React"],
  "matched_skills": ["Python", "Django"],
  "missing_keywords": ["AWS", "Docker", "Kubernetes"],
  "recommendations": "Your resume has a good ATS score...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### List Analyses
```http
GET /api/analyses/
Authorization: Bearer <token>
```

#### Get Analysis
```http
GET /api/analyses/{id}/
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Get Dashboard Stats
```http
GET /api/dashboard/stats/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_resumes": 5,
  "total_jobs": 3,
  "total_analyses": 10,
  "average_ats_score": 72.5,
  "recent_analyses": [
    {
      "id": 1,
      "ats_score": 75.5,
      ...
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```
