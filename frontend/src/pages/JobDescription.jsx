import React, { useState, useEffect } from 'react'
import axios from 'axios'

const JobDescription = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: ''
  })
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/job-descriptions/')
      setJobs(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching job descriptions:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post('/api/job-descriptions/', formData)
      setSuccess('Job description saved successfully!')
      setFormData({ title: '', company: '', description: '' })
      fetchJobs()
    } catch (err) {
      setError('Failed to save job description')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job description?')) return

    try {
      await axios.delete(`/api/job-descriptions/${id}/`)
      setSuccess('Job description deleted successfully!')
      fetchJobs()
    } catch (err) {
      setError('Failed to delete job description')
    }
  }

  return (
    <div className="container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Job Description</h1>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Job Description</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Tech Corp"
            />
          </div>
          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Paste the full job description here..."
            />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Job Description'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Your Job Descriptions</h2>
        {jobs.length === 0 ? (
          <p>No job descriptions saved yet.</p>
        ) : (
          <div className="file-list">
            {jobs.map((job) => (
              <div key={job.id} className="file-item">
                <div>
                  <strong>{job.title}</strong>
                  {job.company && <p style={{ color: '#666', marginTop: '0.25rem' }}>{job.company}</p>}
                  <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Created: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDescription
