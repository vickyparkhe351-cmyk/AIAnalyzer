from django.urls import path
from . import views

urlpatterns = [
    path('resumes/', views.ResumeListCreateView.as_view(), name='resume-list-create'),
    path('resumes/<int:pk>/', views.ResumeDetailView.as_view(), name='resume-detail'),
    path('job-descriptions/', views.JobDescriptionListCreateView.as_view(), name='job-description-list-create'),
    path('job-descriptions/<int:pk>/', views.JobDescriptionDetailView.as_view(), name='job-description-detail'),
    path('analyze/', views.analyze_resume, name='analyze-resume'),
    path('analyses/', views.AnalysisListView.as_view(), name='analysis-list'),
    path('analyses/<int:pk>/', views.AnalysisDetailView.as_view(), name='analysis-detail'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
