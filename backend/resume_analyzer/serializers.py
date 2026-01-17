from rest_framework import serializers
from .models import Resume, JobDescription, Analysis


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ('id', 'file', 'original_filename', 'file_type', 'extracted_text', 'uploaded_at')
        read_only_fields = ('id', 'extracted_text', 'uploaded_at', 'file_type')


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = ('id', 'title', 'description', 'company', 'created_at')
        read_only_fields = ('id', 'created_at')


class AnalysisSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)
    job_description = JobDescriptionSerializer(read_only=True)

    class Meta:
        model = Analysis
        fields = (
            'id', 'resume', 'job_description', 'ats_score', 'extracted_skills',
            'matched_skills', 'missing_keywords', 'recommendations', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class AnalysisCreateSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField()
    job_description_id = serializers.IntegerField()
