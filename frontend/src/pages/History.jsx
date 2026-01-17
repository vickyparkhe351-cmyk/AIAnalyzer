import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const History = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get('/api/analyses/')
      setAnalyses(response.data.results || response.data)
    } catch (err) {
      setError('Failed to load analysis history')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading history...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  const chartData = analyses.map((analysis, index) => ({
    name: `Analysis ${index + 1}`,
    score: analysis.ats_score
  }))

  return (
    <div className="container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Analysis History</h1>

      {analyses.length === 0 ? (
        <div className="card">
          <p>No analyses found. <Link to="/analyze" style={{ color: '#667eea' }}>Create your first analysis</Link></p>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 style={{ marginBottom: '2rem' }}>ATS Score Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
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
            <h2 style={{ marginBottom: '1rem' }}>All Analyses</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  style={{
                    padding: '1.5rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem' }}>{analysis.resume.original_filename}</h3>
                      <p style={{ color: '#666' }}>
                        <strong>Job:</strong> {analysis.job_description.title}
                        {analysis.job_description.company && ` - ${analysis.job_description.company}`}
                      </p>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Analyzed: {new Date(analysis.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                        {analysis.ats_score}%
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>ATS Score</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <strong>Matched Skills ({analysis.matched_skills.length}):</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {analysis.matched_skills.slice(0, 10).map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: '#d4edda',
                            borderRadius: '15px',
                            fontSize: '0.85rem',
                            color: '#155724'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {analysis.matched_skills.length > 10 && (
                        <span style={{ color: '#666' }}>+{analysis.matched_skills.length - 10} more</span>
                      )}
                    </div>
                  </div>

                  {analysis.missing_keywords.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>Missing Keywords ({analysis.missing_keywords.length}):</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {analysis.missing_keywords.slice(0, 10).map((keyword, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#f8d7da',
                              borderRadius: '15px',
                              fontSize: '0.85rem',
                              color: '#721c24'
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                        {analysis.missing_keywords.length > 10 && (
                          <span style={{ color: '#666' }}>+{analysis.missing_keywords.length - 10} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default History
