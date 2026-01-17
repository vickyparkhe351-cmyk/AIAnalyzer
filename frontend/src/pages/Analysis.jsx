import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Analysis = () => {
  const [resumes, setResumes] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedResume, setSelectedResume] = useState('')
  const [selectedJob, setSelectedJob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resumesRes, jobsRes] = await Promise.all([
        axios.get('/api/resumes/'),
        axios.get('/api/job-descriptions/')
      ])
      setResumes(resumesRes.data.results || resumesRes.data)
      setJobs(jobsRes.data.results || jobsRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!selectedResume || !selectedJob) {
      setError('Please select both a resume and job description')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await axios.post('/api/analyze/', {
        resume_id: parseInt(selectedResume),
        job_description_id: parseInt(selectedJob)
      })
      setAnalysis(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  if (analysis) {
    return (
      <div className="container">
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Analysis Results</h1>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#667eea', marginBottom: '1rem' }}>
              {analysis.ats_score}%
            </div>
            <h2>ATS Score</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Extracted Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.extracted_skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#e7f3ff',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      color: '#667eea'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem' }}>Matched Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.matched_skills.length > 0 ? (
                  analysis.matched_skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#d4edda',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: '#155724'
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={{ color: '#666' }}>No matched skills</p>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Missing Keywords</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {analysis.missing_keywords.length > 0 ? (
                analysis.missing_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f8d7da',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      color: '#721c24'
                    }}
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p style={{ color: '#666' }}>No missing keywords - great job!</p>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem' }}>Recommendations</h3>
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{analysis.recommendations}</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                setAnalysis(null)
                setSelectedResume('')
                setSelectedJob('')
              }}
              className="btn btn-secondary"
            >
              New Analysis
            </button>
            <button
              onClick={() => navigate('/history')}
              className="btn btn-primary"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Analyze Resume</h1>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Select Resume and Job Description</h2>
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>Select Resume *</label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              required
            >
              <option value="">Choose a resume...</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.original_filename}
                </option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="error" style={{ marginTop: '0.5rem' }}>
                No resumes uploaded. <a href="/upload" style={{ color: '#667eea' }}>Upload one here</a>
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Select Job Description *</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              required
            >
              <option value="">Choose a job description...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.company || 'No company'}
                </option>
              ))}
            </select>
            {jobs.length === 0 && (
              <p className="error" style={{ marginTop: '0.5rem' }}>
                No job descriptions saved. <a href="/job-description" style={{ color: '#667eea' }}>Add one here</a>
              </p>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading || resumes.length === 0 || jobs.length === 0}>
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Analysis
