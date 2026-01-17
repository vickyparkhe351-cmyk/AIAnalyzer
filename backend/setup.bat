@echo off
REM Setup script for AI Resume Analyzer Backend (Windows)

echo Setting up AI Resume Analyzer Backend...

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r ..\requirements.txt

REM Download NLTK data
echo Downloading NLTK data...
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo Setup complete!
echo To start the server, run: python manage.py runserver
