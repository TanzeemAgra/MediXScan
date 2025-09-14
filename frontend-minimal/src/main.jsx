import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  
  return (
    <div>
      <h1>MediXScan Test</h1>
      <p>API URL: {apiUrl}</p>
      <p>Backend: {import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)