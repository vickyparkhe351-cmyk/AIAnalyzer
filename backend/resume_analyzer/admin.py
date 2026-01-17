from django.contrib import admin
from .models import Resume, JobDescription, Analysis


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'original_filename', 'file_type', 'uploaded_at')
    list_filter = ('file_type', 'uploaded_at')
    search_fields = ('original_filename', 'user__email')


@admin.register(JobDescription)
class JobDescriptionAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'company', 'user__email')


@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ('resume', 'job_description', 'ats_score', 'created_at')
    list_filter = ('created_at', 'ats_score')
    search_fields = ('resume__original_filename', 'job_description__title')
