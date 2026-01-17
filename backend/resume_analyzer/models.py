from django.db import models
from django.conf import settings


class Resume(models.Model):
    """Resume model"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/')
    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10)  # PDF or DOCX
    extracted_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.user.email} - {self.original_filename}"


class JobDescription(models.Model):
    """Job Description model"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_descriptions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.company}"


class Analysis(models.Model):
    """Resume Analysis model"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='analyses')
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='analyses')
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='analyses')
    ats_score = models.FloatField()  # 0-100
    extracted_skills = models.JSONField(default=list)
    matched_skills = models.JSONField(default=list)
    missing_keywords = models.JSONField(default=list)
    recommendations = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Analyses'

    def __str__(self):
        return f"Analysis for {self.resume.original_filename} - Score: {self.ats_score}%"
