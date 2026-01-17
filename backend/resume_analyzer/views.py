from rest_framework import status, generics, serializers as drf_serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from .models import Resume, JobDescription, Analysis
from .serializers import (
    ResumeSerializer, JobDescriptionSerializer, AnalysisSerializer, AnalysisCreateSerializer
)
from .utils import (
    extract_text_from_pdf, extract_text_from_docx, extract_skills,
    calculate_ats_score, generate_recommendations
)
import os


class ResumeListCreateView(generics.ListCreateAPIView):
    """List and create resumes"""
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        if not file:
            raise drf_serializers.ValidationError({'file': 'File is required'})

        # Validate file type
        file_extension = os.path.splitext(file.name)[1].lower()
        if file_extension not in ['.pdf', '.docx']:
            raise drf_serializers.ValidationError({'file': 'Only PDF and DOCX files are allowed'})

        # Extract text based on file type
        file_path = file.temporary_file_path() if hasattr(file, 'temporary_file_path') else None
        if not file_path:
            # Save file temporarily
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                file_path = tmp.name

        try:
            if file_extension == '.pdf':
                extracted_text = extract_text_from_pdf(file_path)
            else:
                extracted_text = extract_text_from_docx(file_path)

            # Clean up temp file
            if os.path.exists(file_path) and not hasattr(file, 'temporary_file_path'):
                os.unlink(file_path)

            serializer.save(
                user=self.request.user,
                original_filename=file.name,
                file_type=file_extension[1:].upper(),
                extracted_text=extracted_text
            )
        except Exception as e:
            if os.path.exists(file_path) and not hasattr(file, 'temporary_file_path'):
                os.unlink(file_path)
            raise drf_serializers.ValidationError({'file': f'Error processing file: {str(e)}'})


class ResumeDetailView(generics.RetrieveDestroyAPIView):
    """Retrieve and delete resume"""
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


class JobDescriptionListCreateView(generics.ListCreateAPIView):
    """List and create job descriptions"""
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobDescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update and delete job description"""
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_resume(request):
    """Analyze resume against job description"""
    serializer = AnalysisCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    resume_id = serializer.validated_data['resume_id']
    job_description_id = serializer.validated_data['job_description_id']

    # Get resume and job description
    resume = get_object_or_404(Resume, id=resume_id, user=request.user)
    job_description = get_object_or_404(JobDescription, id=job_description_id, user=request.user)

    # Extract skills
    extracted_skills = extract_skills(resume.extracted_text)

    # Calculate ATS score
    analysis_result = calculate_ats_score(resume.extracted_text, job_description.description)

    # Match skills with job description
    job_skills = extract_skills(job_description.description)
    matched_skills = list(set(extracted_skills) & set(job_skills))

    # Generate recommendations
    recommendations = generate_recommendations(
        analysis_result['ats_score'],
        analysis_result['missing_keywords'],
        matched_skills
    )

    # Create analysis record
    analysis = Analysis.objects.create(
        user=request.user,
        resume=resume,
        job_description=job_description,
        ats_score=analysis_result['ats_score'],
        extracted_skills=extracted_skills,
        matched_skills=matched_skills,
        missing_keywords=analysis_result['missing_keywords'],
        recommendations=recommendations
    )

    return Response(AnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED)


class AnalysisListView(generics.ListAPIView):
    """List all analyses for current user"""
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Analysis.objects.filter(user=self.request.user)


class AnalysisDetailView(generics.RetrieveAPIView):
    """Retrieve analysis details"""
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Analysis.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    user = request.user

    total_resumes = Resume.objects.filter(user=user).count()
    total_jobs = JobDescription.objects.filter(user=user).count()
    total_analyses = Analysis.objects.filter(user=user).count()

    # Average ATS score
    analyses = Analysis.objects.filter(user=user)
    avg_score = analyses.aggregate(avg_score=Avg('ats_score'))['avg_score'] or 0

    # Recent analyses
    recent_analyses = analyses[:5]

    return Response({
        'total_resumes': total_resumes,
        'total_jobs': total_jobs,
        'total_analyses': total_analyses,
        'average_ats_score': round(avg_score, 2),
        'recent_analyses': AnalysisSerializer(recent_analyses, many=True).data
    })
