#!/bin/bash

# Setup script for AI Resume Analyzer Backend

echo "Setting up AI Resume Analyzer Backend..."

# Create virtual environment
echo "Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r ../requirements.txt

# Download NLTK data
echo "Downloading NLTK data..."
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Setup complete!"
echo "To start the server, run: python manage.py runserver"
