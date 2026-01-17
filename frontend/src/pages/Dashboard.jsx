import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats/')
      setStats(response.data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  // Prepare chart data
  const scoreData = stats.recent_analyses.map((analysis, index) => ({
    name: `Analysis ${index + 1}`,
    score: analysis.ats_score
  }))

  return (
    <div className="container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Dashboard</h1>

      <div className="grid">
        <div className="stats-card">
          <h3>{stats.total_resumes}</h3>
          <p>Total Resumes</p>
        </div>
        <div className="stats-card">
          <h3>{stats.total_jobs}</h3>
          <p>Job Descriptions</p>
        </div>
        <div className="stats-card">
          <h3>{stats.total_analyses}</h3>
          <p>Total Analyses</p>
        </div>
        <div className="stats-card">
          <h3>{stats.average_ats_score}%</h3>
          <p>Average ATS Score</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '2rem' }}>Recent ATS Scores</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Recent Analyses</h2>
        {stats.recent_analyses.length === 0 ? (
          <p>No analyses yet. Upload a resume and job description to get started!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recent_analyses.map((analysis) => (
              <div
                key={analysis.id}
                style={{
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  borderLeft: '4px solid #667eea'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{analysis.resume.original_filename}</strong>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                      {analysis.job_description.title} - {analysis.job_description.company}
                    </p>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {analysis.ats_score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
