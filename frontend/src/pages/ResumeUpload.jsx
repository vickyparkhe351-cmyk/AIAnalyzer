import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import './FileUpload.css'

const ResumeUpload = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes/')
      setResumes(response.data.results || response.data)
    } catch (err) {
      console.error('Error fetching resumes:', err)
    }
  }

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('/api/resumes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setSuccess('Resume uploaded successfully!')
      fetchResumes()
    } catch (err) {
      setError(err.response?.data?.file?.[0] || 'Failed to upload resume')
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return

    try {
      await axios.delete(`/api/resumes/${id}/`)
      setSuccess('Resume deleted successfully!')
      fetchResumes()
    } catch (err) {
      setError('Failed to delete resume')
    }
  }

  return (
    <div className="container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Upload Resume</h1>

      <div className="card">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          {loading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <p>Drag and drop a PDF or DOCX file here, or click to select</p>
              <p className="dropzone-hint">Supports: PDF, DOCX (Max 10MB)</p>
            </>
          )}
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Your Resumes</h2>
        {resumes.length === 0 ? (
          <p>No resumes uploaded yet.</p>
        ) : (
          <div className="file-list">
            {resumes.map((resume) => (
              <div key={resume.id} className="file-item">
                <div>
                  <strong>{resume.original_filename}</strong>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    Type: {resume.file_type} | Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(resume.id)}
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

export default ResumeUpload
