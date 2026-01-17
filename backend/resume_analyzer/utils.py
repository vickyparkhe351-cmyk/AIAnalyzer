"""
Utility functions for resume parsing and analysis
"""
import pdfplumber
from docx import Document
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    return text


def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
    return text


def extract_skills(text):
    """
    Extract skills from resume text using NLP
    Common technical skills keywords
    """
    # Common technical skills
    skill_keywords = [
        # Programming Languages
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
        'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash',
        # Web Technologies
        'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
        'spring', 'asp.net', 'laravel', 'rails', 'next.js', 'nuxt.js',
        # Databases
        'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'cassandra', 'elasticsearch',
        # Cloud & DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd', 'terraform',
        'ansible', 'chef', 'puppet', 'linux', 'unix',
        # Data Science & ML
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas',
        'numpy', 'data analysis', 'data visualization', 'tableau', 'power bi',
        # Mobile
        'android', 'ios', 'react native', 'flutter', 'xamarin',
        # Other
        'agile', 'scrum', 'jira', 'confluence', 'rest api', 'graphql', 'microservices',
        'api development', 'software development', 'web development', 'mobile development'
    ]

    text_lower = text.lower()
    extracted_skills = []

    # Extract skills by matching keywords
    for skill in skill_keywords:
        if skill in text_lower:
            extracted_skills.append(skill.title())

    # Remove duplicates and return
    return list(set(extracted_skills))


def calculate_ats_score(resume_text, job_description):
    """
    Calculate ATS (Applicant Tracking System) score
    Returns score (0-100) and missing keywords
    """
    # Preprocess texts
    resume_clean = preprocess_text(resume_text)
    job_clean = preprocess_text(job_description)

    # Extract keywords from job description
    job_keywords = extract_keywords(job_description)
    resume_keywords = extract_keywords(resume_text)

    # Calculate keyword match percentage
    matched_keywords = set(job_keywords) & set(resume_keywords)
    missing_keywords = set(job_keywords) - set(resume_keywords)

    keyword_score = (len(matched_keywords) / len(job_keywords) * 100) if job_keywords else 0

    # Calculate semantic similarity using TF-IDF
    if resume_clean and job_clean:
        vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        try:
            tfidf_matrix = vectorizer.fit_transform([resume_clean, job_clean])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            semantic_score = similarity * 100
        except:
            semantic_score = 0
    else:
        semantic_score = 0

    # Combined score (70% keyword match, 30% semantic similarity)
    ats_score = (keyword_score * 0.7) + (semantic_score * 0.3)

    return {
        'ats_score': round(min(100, max(0, ats_score)), 2),
        'matched_keywords': list(matched_keywords),
        'missing_keywords': list(missing_keywords)[:20],  # Limit to top 20
    }


def extract_keywords(text):
    """Extract important keywords from text"""
    # Remove special characters and convert to lowercase
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    keywords = [token for token in tokens if token not in stop_words and len(token) > 2]
    
    # Return unique keywords
    return list(set(keywords))


def preprocess_text(text):
    """Preprocess text for analysis"""
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()


def generate_recommendations(ats_score, missing_keywords, matched_skills):
    """Generate recommendations based on analysis"""
    recommendations = []

    if ats_score < 50:
        recommendations.append("Your resume has a low ATS score. Consider adding more relevant keywords from the job description.")
    elif ats_score < 70:
        recommendations.append("Your resume has a moderate ATS score. Try to incorporate more missing keywords to improve your chances.")
    else:
        recommendations.append("Great! Your resume has a good ATS score. Keep up the good work!")

    if missing_keywords:
        recommendations.append(f"Consider adding these keywords: {', '.join(missing_keywords[:5])}")

    if len(matched_skills) < 5:
        recommendations.append("Try to highlight more technical skills relevant to the job description.")

    return "\n".join(recommendations)
