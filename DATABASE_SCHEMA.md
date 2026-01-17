# Database Schema

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email (UK)  │
│ username    │
│ password    │
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       │                  │                  │
┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
│   Resume    │   │JobDescription│   │  Analysis   │
├─────────────┤   ├──────────────┤   ├─────────────┤
│ id (PK)     │   │ id (PK)      │   │ id (PK)     │
│ user (FK)   │   │ user (FK)    │   │ user (FK)   │
│ file        │   │ title        │   │ resume (FK) │
│ filename    │   │ description  │   │ job_desc(FK)│
│ file_type   │   │ company      │   │ ats_score   │
│ text        │   │ created_at   │   │ skills (JSON)│
│ uploaded_at │   └──────────────┘   │ matched (JSON)│
└─────────────┘                      │ missing (JSON)│
                                     │ recommendations│
                                     │ created_at    │
                                     └───────────────┘
```

## Tables

### accounts_user
Custom user model extending Django's AbstractUser.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| email | String(254) | Unique, Not Null | User email (login) |
| username | String(150) | Not Null | Username |
| password | String(128) | Not Null | Hashed password |
| first_name | String(150) | | First name |
| last_name | String(150) | | Last name |
| is_active | Boolean | Default: True | Account status |
| is_staff | Boolean | Default: False | Staff access |
| is_superuser | Boolean | Default: False | Admin access |
| created_at | DateTime | Auto | Creation timestamp |
| updated_at | DateTime | Auto | Update timestamp |

### resume_analyzer_resume
Stores uploaded resume files and extracted text.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| user_id | Integer | FK → User, Not Null | Owner |
| file | FileField | Not Null | Uploaded file |
| original_filename | String(255) | Not Null | Original filename |
| file_type | String(10) | Not Null | PDF or DOCX |
| extracted_text | Text | | Extracted text content |
| uploaded_at | DateTime | Auto | Upload timestamp |

**Indexes:**
- `user_id` (Foreign Key)
- `uploaded_at` (for ordering)

### resume_analyzer_jobdescription
Stores job descriptions for matching.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| user_id | Integer | FK → User, Not Null | Owner |
| title | String(255) | Not Null | Job title |
| description | Text | Not Null | Full job description |
| company | String(255) | | Company name |
| created_at | DateTime | Auto | Creation timestamp |

**Indexes:**
- `user_id` (Foreign Key)
- `created_at` (for ordering)

### resume_analyzer_analysis
Stores analysis results.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto | Primary key |
| user_id | Integer | FK → User, Not Null | Owner |
| resume_id | Integer | FK → Resume, Not Null | Analyzed resume |
| job_description_id | Integer | FK → JobDescription, Not Null | Target job |
| ats_score | Float | Not Null | ATS score (0-100) |
| extracted_skills | JSON | Default: [] | Skills from resume |
| matched_skills | JSON | Default: [] | Skills matching job |
| missing_keywords | JSON | Default: [] | Missing keywords |
| recommendations | Text | | AI recommendations |
| created_at | DateTime | Auto | Analysis timestamp |

**Indexes:**
- `user_id` (Foreign Key)
- `resume_id` (Foreign Key)
- `job_description_id` (Foreign Key)
- `created_at` (for ordering)
- `ats_score` (for filtering/sorting)

## Relationships

1. **User → Resume**: One-to-Many
   - One user can have multiple resumes
   - Cascade delete: Deleting user deletes all their resumes

2. **User → JobDescription**: One-to-Many
   - One user can have multiple job descriptions
   - Cascade delete: Deleting user deletes all their job descriptions

3. **User → Analysis**: One-to-Many
   - One user can have multiple analyses
   - Cascade delete: Deleting user deletes all their analyses

4. **Resume → Analysis**: One-to-Many
   - One resume can be analyzed multiple times
   - Cascade delete: Deleting resume deletes all related analyses

5. **JobDescription → Analysis**: One-to-Many
   - One job description can be used in multiple analyses
   - Cascade delete: Deleting job description deletes all related analyses

## Data Flow

1. User uploads resume → `Resume` record created with extracted text
2. User adds job description → `JobDescription` record created
3. User requests analysis → `Analysis` record created with:
   - Skills extracted from resume text
   - ATS score calculated
   - Keywords matched/missing
   - Recommendations generated

## JSON Fields

### extracted_skills
```json
["Python", "Django", "React", "PostgreSQL"]
```

### matched_skills
```json
["Python", "Django"]
```

### missing_keywords
```json
["AWS", "Docker", "Kubernetes", "CI/CD"]
```

## Query Examples

### Get user's recent analyses
```python
Analysis.objects.filter(user=user).order_by('-created_at')[:10]
```

### Get average ATS score
```python
Analysis.objects.filter(user=user).aggregate(Avg('ats_score'))
```

### Get resumes with analyses
```python
Resume.objects.filter(user=user, analyses__isnull=False).distinct()
```
