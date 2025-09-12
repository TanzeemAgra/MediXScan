// Doctor Dashboard Component
// Role-based dashboard for Doctor users

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useRBAC } from '../hooks/useRBAC';

const DoctorDashboard = () => {
  const { 
    isDoctor, 
    canUploadScan, 
    canViewScan, 
    canViewReport, 
    canCreateReport,
    user,
    loading: rbacLoading 
  } = useRBAC();
  
  const [dashboardData, setDashboardData] = useState({});
  const [recentScans, setRecentScans] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Upload scan form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    patient_id: '',
    scan_type: '',
    scan_file: null,
    notes: '',
    priority: 'normal'
  });

  useEffect(() => {
    if (!rbacLoading) {
      loadDoctorDashboard();
    }
  }, [rbacLoading]);

  const loadDoctorDashboard = async () => {
    try {
      setLoading(true);
      
      // Load dashboard data
      const response = await api.get('/auth/dashboard/');
      setDashboardData(response.data);
      
      // Load recent scans if user can view them
      if (canViewScan) {
        // This would be implemented in your backend
        // const scansResponse = await api.get('/api/scans/recent/');
        // setRecentScans(scansResponse.data);
      }
      
      // Load pending reports if user can view them
      if (canViewReport) {
        // This would be implemented in your backend
        // const reportsResponse = await api.get('/api/reports/pending/');
        // setPendingReports(reportsResponse.data);
      }
      
    } catch (error) {
      console.error('Failed to load doctor dashboard:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadScan = async (e) => {
    e.preventDefault();
    
    if (!canUploadScan) {
      alert('You do not have permission to upload scans.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('patient_id', uploadForm.patient_id);
      formData.append('scan_type', uploadForm.scan_type);
      formData.append('scan_file', uploadForm.scan_file);
      formData.append('notes', uploadForm.notes);
      formData.append('priority', uploadForm.priority);

      const response = await api.post('/auth/upload-scan/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Scan uploaded successfully!');
        setShowUploadModal(false);
        setUploadForm({
          patient_id: '',
          scan_type: '',
          scan_file: null,
          notes: '',
          priority: 'normal'
        });
        loadDoctorDashboard(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to upload scan:', error);
      alert('Failed to upload scan: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewReport = async (reportId) => {
    if (!canViewReport) {
      alert('You do not have permission to view reports.');
      return;
    }

    try {
      const response = await api.get(`/auth/view-report/?report_id=${reportId}`);
      
      // This would typically open the report in a modal or new page
      console.log('Report data:', response.data);
      alert('Report loaded successfully! (This would typically open in a viewer)');
      
    } catch (error) {
      console.error('Failed to view report:', error);
      alert('Failed to view report: ' + (error.response?.data?.error || error.message));
    }
  };

  if (rbacLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-lg">Loading Doctor Dashboard...</span>
      </div>
    );
  }

  if (!isDoctor()) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <h3 className="font-bold">Access Denied</h3>
        <p>You must be logged in as a Doctor to access this dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={loadDoctorDashboard}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, Dr. {user?.full_name || user?.username}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Scans</h3>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData.doctor_stats?.total_scans || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Reports Generated</h3>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData.doctor_stats?.reports_generated || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboardData.doctor_stats?.pending_reviews || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Patients This Month</h3>
          <p className="text-3xl font-bold text-purple-600">
            {dashboardData.doctor_stats?.patients_this_month || 0}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        {canUploadScan && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Upload New Scan
          </button>
        )}
        
        {canViewReport && (
          <button
            onClick={() => handleViewReport('sample-report-id')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            View Reports
          </button>
        )}
        
        <button
          onClick={loadDoctorDashboard}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Recent Scans */}
      {canViewScan && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Scans</h2>
          </div>
          <div className="p-6">
            {recentScans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scan Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentScans.map((scan) => (
                      <tr key={scan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {scan.patient_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.scan_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            scan.status === 'completed' ? 'bg-green-100 text-green-800' :
                            scan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {scan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewReport(scan.report_id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent scans found.</p>
                {canUploadScan && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Upload your first scan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Scan Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Scan</h3>
              <form onSubmit={handleUploadScan}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.patient_id}
                      onChange={(e) => setUploadForm({...uploadForm, patient_id: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter patient ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scan Type</label>
                    <select
                      required
                      value={uploadForm.scan_type}
                      onChange={(e) => setUploadForm({...uploadForm, scan_type: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select scan type</option>
                      <option value="xray">X-Ray</option>
                      <option value="ct">CT Scan</option>
                      <option value="mri">MRI</option>
                      <option value="ultrasound">Ultrasound</option>
                      <option value="mammography">Mammography</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scan File</label>
                    <input
                      type="file"
                      required
                      accept=".dcm,.jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setUploadForm({...uploadForm, scan_file: e.target.files[0]})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: DICOM, JPG, PNG, PDF
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={uploadForm.priority}
                      onChange={(e) => setUploadForm({...uploadForm, priority: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={uploadForm.notes}
                      onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Additional notes or observations..."
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Upload Scan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
