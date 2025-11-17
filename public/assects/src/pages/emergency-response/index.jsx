import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Phone, MapPin, Clock, Filter, CheckCircle, XCircle } from 'lucide-react';
import Header from '../../components/ui/Header';
import EmergencyMap from './components/EmergencyMap';
import EmergencyAlertCard from './components/EmergencyAlertCard';


import EmergencyStats from './components/EmergencyStats';
import { useAuth } from '../../contexts/AuthContext';
import { emergencyService, realtimeService } from '../../services/transportService';

const EmergencyResponse = () => {
  const { user, userProfile } = useAuth();
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [realtimeChannel, setRealtimeChannel] = useState(null);

  // Load emergency alerts
  useEffect(() => {
    loadEmergencyAlerts();
    
    // Set up real-time subscription
    const channel = realtimeService?.subscribeToEmergencyAlerts((payload) => {
      console.log('Emergency alert update:', payload);
      // Reload alerts when there's a change
      loadEmergencyAlerts();
    });
    setRealtimeChannel(channel);

    return () => {
      if (channel) {
        realtimeService?.unsubscribe(channel);
      }
    };
  }, []);

  const loadEmergencyAlerts = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await emergencyService?.getActiveAlerts();
      if (result?.error) {
        throw result?.error;
      }
      setEmergencyAlerts(result?.data || []);
    } catch (error) {
      console.error('Error loading emergency alerts:', error);
      setError('Failed to load emergency alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleReportEmergency = async (emergencyData) => {
    try {
      const result = await emergencyService?.reportEmergency({
        ...emergencyData,
        reported_by: user?.id
      });
      
      if (result?.error) {
        throw result?.error;
      }

      // Refresh alerts list
      loadEmergencyAlerts();
      setShowReportModal(false);
      
      // Show success message
      alert('Emergency reported successfully. Authorities have been notified.');
    } catch (error) {
      console.error('Error reporting emergency:', error);
      alert('Failed to report emergency. Please try again.');
    }
  };

  const handleUpdateAlertStatus = async (alertId, status) => {
    try {
      const result = await emergencyService?.updateAlertStatus(
        alertId, 
        status,
        user?.id
      );
      
      if (result?.error) {
        throw result?.error;
      }

      // Refresh alerts list
      loadEmergencyAlerts();
      
      // Clear selection if this alert was selected and is now resolved
      if (selectedAlert?.id === alertId && status === 'resolved') {
        setSelectedAlert(null);
      }
    } catch (error) {
      console.error('Error updating alert status:', error);
      alert('Failed to update alert status. Please try again.');
    }
  };

  const filteredAlerts = emergencyAlerts?.filter(alert => 
    filterSeverity === 'all' || alert?.severity === filterSeverity
  ) || [];

  const severityColors = {
    low: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    medium: 'bg-orange-50 border-orange-200 text-orange-800',
    high: 'bg-red-50 border-red-200 text-red-800',
    critical: 'bg-red-100 border-red-300 text-red-900'
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3 text-red-600" />
              Emergency Response Center
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and respond to emergency situations in real-time
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Emergency
            </button>
            
            <a
              href="tel:911"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call 911
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Emergency Stats */}
        <div className="mb-8">
          <EmergencyStats alerts={emergencyAlerts} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Emergency Locations</h2>
                <p className="text-sm text-gray-600">Real-time emergency incidents on the map</p>
              </div>
              <div className="h-96">
                <EmergencyMap 
                  alerts={filteredAlerts}
                  selectedAlert={selectedAlert}
                  onSelectAlert={setSelectedAlert}
                  onAlertSelect={setSelectedAlert}
                />
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div>
            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Filter Alerts</h3>
              </div>
              <div className="p-4">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e?.target?.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Alerts ({filteredAlerts?.length || 0})
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredAlerts?.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredAlerts?.map((alert) => (
                      <div
                        key={alert?.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedAlert?.id === alert?.id ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                        }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors?.[alert?.severity] || severityColors?.medium}`}>
                                {getSeverityIcon(alert?.severity)}
                                <span className="ml-1 capitalize">{alert?.severity}</span>
                              </span>
                              <span className="ml-2 text-xs text-gray-500 capitalize">
                                {alert?.alert_type?.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {alert?.title}
                            </h4>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {alert?.description?.length > 100
                                ? `${alert?.description?.substring(0, 100)}...`
                                : alert?.description
                              }
                            </p>
                            
                            <div className="flex items-center text-xs text-gray-500 space-x-3">
                              {alert?.location && (
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {alert?.location}
                                </span>
                              )}
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(alert?.created_at)?.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons for operators/admins */}
                        {(userProfile?.role === 'admin' || userProfile?.role === 'operator') && (
                          <div className="mt-3 flex space-x-2">
                            {alert?.status === 'active' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e?.stopPropagation();
                                    handleUpdateAlertStatus(alert?.id, 'investigating');
                                  }}
                                  className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                >
                                  Investigate
                                </button>
                                <button
                                  onClick={(e) => {
                                    e?.stopPropagation();
                                    handleUpdateAlertStatus(alert?.id, 'resolved');
                                  }}
                                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                >
                                  Resolve
                                </button>
                              </>
                            )}
                            {alert?.status === 'investigating' && (
                              <button
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  handleUpdateAlertStatus(alert?.id, 'resolved');
                                }}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No active emergency alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Alert Details */}
        {selectedAlert && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Alert Details</h3>
              </div>
              <div className="p-6">
                <EmergencyAlertCard 
                  alert={selectedAlert}
                  onStatusUpdate={handleUpdateAlertStatus}
                  canManage={userProfile?.role === 'admin' || userProfile?.role === 'operator'}
                  onAction={handleUpdateAlertStatus}
                  onViewDetails={() => {}}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Report Emergency Modal */}
      {showReportModal && (
        <ReportEmergencyModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportEmergency}
        />
      )}
    </div>
  );
};

// Simple modal component for reporting emergencies
const ReportEmergencyModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    alert_type: 'other',
    severity: 'medium',
    title: '',
    description: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!formData?.title || !formData?.description) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-full overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Emergency</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Type *
              </label>
              <select
                value={formData?.alert_type}
                onChange={(e) => setFormData(prev => ({ ...prev, alert_type: e?.target?.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="accident">Accident</option>
                <option value="breakdown">Vehicle Breakdown</option>
                <option value="medical">Medical Emergency</option>
                <option value="security">Security Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity *
              </label>
              <select
                value={formData?.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e?.target?.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData?.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Brief description of the emergency"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Detailed description of the situation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData?.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e?.target?.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Where is this happening?"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Report Emergency
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;