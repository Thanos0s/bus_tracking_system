import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import StopHeader from './components/StopHeader';
import RealTimeArrivals from './components/RealTimeArrivals';
import StopLocationMap from './components/StopLocationMap';
import ServiceAlerts from './components/ServiceAlerts';
import ReportIssueModal from './components/ReportIssueModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BusStopInformation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stopId = searchParams?.get('stopId') || 'stop_001';
  
  const [stopData, setStopData] = useState(null);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('arrivals');

  // Mock stop data
  const mockStopData = {
    id: 'stop_001',
    name: 'Central Plaza Bus Stop',
    code: 'CP001',
    zone: 'Zone A',
    address: 'Sector 17, Central Plaza, Near McDonald\'s',
    landmark: 'Central Plaza Shopping Complex',
    coordinates: {
      lat: 30.7333,
      lng: 76.7794
    },
    isOperational: true,
    lastUpdated: new Date(),
    routes: [
      { id: 'route_15a', number: '15A', destination: 'City Center', color: '#2563eb' },
      { id: 'route_22b', number: '22B', destination: 'Railway Station', color: '#dc2626' },
      { id: 'route_8c', number: '8C', destination: 'University Campus', color: '#16a34a' },
      { id: 'route_45d', number: '45D', destination: 'Airport Terminal', color: '#f59e0b' }
    ],
    amenities: ['shelter', 'seating', 'lighting', 'cctv'],
    accessibility: ['wheelchair', 'audio_announcements', 'tactile_paving'],
    operatingHours: {
      start: '05:00',
      end: '23:30'
    },
    facilities: {
      hasWaitingShed: true,
      hasBenches: true,
      hasLighting: true,
      hasCCTV: true,
      hasTicketCounter: false,
      hasWiFi: false
    }
  };

  const mockNearbyStops = [
    {
      id: 'stop_002',
      name: 'Mall Road Junction',
      code: 'MR002',
      distance: 250,
      routeCount: 6,
      coordinates: { lat: 30.7340, lng: 76.7800 }
    },
    {
      id: 'stop_003',
      name: 'Sector 18 Market',
      code: 'S18003',
      distance: 400,
      routeCount: 4,
      coordinates: { lat: 30.7320, lng: 76.7780 }
    },
    {
      id: 'stop_004',
      name: 'Government Hospital',
      code: 'GH004',
      distance: 650,
      routeCount: 8,
      coordinates: { lat: 30.7350, lng: 76.7820 }
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch stop data
    const fetchStopData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStopData(mockStopData);
      setNearbyStops(mockNearbyStops);
      setIsLoading(false);
    };

    fetchStopData();
  }, [stopId]);

  const handleSetAlert = (arrivalData) => {
    if (arrivalData) {
      alert(`Alert set for Route ${arrivalData?.routeNumber} to ${arrivalData?.destination}\n\nYou'll be notified 5 minutes before arrival.`);
    } else {
      alert('General arrival alerts enabled for this stop.\n\nYou\'ll receive notifications for all buses arriving in the next 30 minutes.');
    }
  };

  const handleViewRoute = (routeNumber) => {
    navigate(`/route-details?routeId=${routeNumber}`);
  };

  const handleNavigateToStop = (stopId) => {
    navigate(`/bus-stop-information?stopId=${stopId}`);
  };

  const handleShareLocation = () => {
    if (navigator.share && stopData) {
      navigator.share({
        title: stopData?.name,
        text: `Bus Stop: ${stopData?.name} (${stopData?.code})`,
        url: window.location?.href
      });
    } else if (stopData) {
      navigator.clipboard?.writeText(window.location?.href);
      alert('Stop location link copied to clipboard!');
    }
  };

  const tabs = [
    { id: 'arrivals', label: 'Live Arrivals', icon: 'Clock', count: null },
    { id: 'map', label: 'Location', icon: 'Map', count: null },
    { id: 'alerts', label: 'Service Alerts', icon: 'AlertCircle', count: 2 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading stop information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stopData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Icon name="MapPinOff" size={64} className="text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Stop Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested bus stop could not be found or may have been removed.
            </p>
            <Button
              onClick={() => navigate('/passenger-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={() => navigate('/passenger-dashboard')}
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
          <Icon name="ChevronRight" size={16} />
          <span className="text-foreground">Bus Stop Information</span>
        </nav>

        {/* Stop Header */}
        <div className="mb-6">
          <StopHeader
            stopData={stopData}
            onReportIssue={() => setIsReportModalOpen(true)}
            onSetAlert={() => handleSetAlert()}
            onShareLocation={handleShareLocation}
          />
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.count && (
                  <span className="bg-error text-error-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {tab?.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Desktop: Always show arrivals, Mobile: Show based on active tab */}
            <div className={`${activeTab !== 'arrivals' ? 'md:block hidden' : ''}`}>
              <RealTimeArrivals
                stopId={stopId}
                onSetAlert={handleSetAlert}
                onViewRoute={handleViewRoute}
              />
            </div>

            {/* Service Alerts - Desktop: Always show, Mobile: Show based on active tab */}
            <div className={`${activeTab !== 'alerts' ? 'md:block hidden' : ''}`}>
              <ServiceAlerts stopId={stopId} />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Location Map - Desktop: Always show, Mobile: Show based on active tab */}
            <div className={`${activeTab !== 'map' ? 'md:block hidden' : ''}`}>
              <StopLocationMap
                stopData={stopData}
                nearbyStops={nearbyStops}
                onNavigateToStop={handleNavigateToStop}
              />
            </div>

            {/* Quick Actions Card - Desktop only */}
            <div className="hidden md:block bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/trip-planner')}
                  iconName="Route"
                  iconPosition="left"
                  iconSize={16}
                >
                  Plan Trip from Here
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleSetAlert()}
                  iconName="Bell"
                  iconPosition="left"
                  iconSize={16}
                >
                  Set Arrival Alerts
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setIsReportModalOpen(true)}
                  iconName="Flag"
                  iconPosition="left"
                  iconSize={16}
                >
                  Report Issue
                </Button>
              </div>
            </div>

            {/* Stop Statistics - Desktop only */}
            <div className="hidden md:block bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Stop Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Daily Passengers</span>
                  <span className="font-medium text-foreground">~2,400</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Peak Hours</span>
                  <span className="font-medium text-foreground">8-10 AM, 5-7 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average Wait</span>
                  <span className="font-medium text-foreground">8 minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Routes Served</span>
                  <span className="font-medium text-foreground">{stopData?.routes?.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Floating Action Button */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsReportModalOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg"
            iconName="Flag"
            iconSize={24}
          />
        </div>
      </div>
      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        stopData={stopData}
      />
    </div>
  );
};

export default BusStopInformation;