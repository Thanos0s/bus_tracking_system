import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ 
  selectedRoute = null, 
  nearbyBuses = [], 
  onBusSelect, 
  userLocation = null,
  onLocationUpdate 
}) => {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ lat: 30.7333, lng: 76.7794 }); // Chandigarh
  const [zoomLevel, setZoomLevel] = useState(13);
  const [mapLayers, setMapLayers] = useState({
    buses: true,
    routes: true,
    stops: true,
    traffic: false
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock bus data with real-time positions
  const [liveBuses, setLiveBuses] = useState([
    {
      id: 'BUS001',
      routeNumber: '42A',
      currentLat: 30.7387,
      currentLng: 76.7810,
      heading: 45,
      speed: 35,
      capacity: 45,
      occupancy: 28,
      nextStop: 'Sector 17 Plaza',
      eta: '3 min',
      status: 'on_time',
      driver: 'Rajesh Kumar'
    },
    {
      id: 'BUS002',
      routeNumber: '15B',
      currentLat: 30.7295,
      currentLng: 76.7880,
      heading: 180,
      speed: 28,
      capacity: 40,
      occupancy: 35,
      nextStop: 'PGI Hospital',
      eta: '7 min',
      status: 'delayed',
      driver: 'Suresh Singh'
    },
    {
      id: 'BUS003',
      routeNumber: '8C',
      currentLat: 30.7420,
      currentLng: 76.7650,
      heading: 270,
      speed: 42,
      capacity: 50,
      occupancy: 15,
      nextStop: 'Railway Station',
      eta: '2 min',
      status: 'early',
      driver: 'Amit Sharma'
    }
  ]);

  // Mock bus stops
  const busStops = [
    {
      id: 'STOP001',
      name: 'Sector 17 Plaza',
      lat: 30.7395,
      lng: 76.7820,
      routes: ['42A', '15B', '8C'],
      amenities: ['shelter', 'seating', 'display']
    },
    {
      id: 'STOP002',
      name: 'PGI Hospital',
      lat: 30.7280,
      lng: 76.7890,
      routes: ['15B', '22D'],
      amenities: ['shelter', 'display']
    },
    {
      id: 'STOP003',
      name: 'Railway Station',
      lat: 30.7430,
      lng: 76.7640,
      routes: ['8C', '42A'],
      amenities: ['shelter', 'seating', 'display', 'restroom']
    }
  ];

  // Simulate real-time bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBuses(prevBuses => 
        prevBuses?.map(bus => ({
          ...bus,
          currentLat: bus?.currentLat + (Math.random() - 0.5) * 0.001,
          currentLng: bus?.currentLng + (Math.random() - 0.5) * 0.001,
          speed: Math.max(15, Math.min(50, bus?.speed + (Math.random() - 0.5) * 10)),
          occupancy: Math.max(0, Math.min(bus?.capacity, bus?.occupancy + Math.floor((Math.random() - 0.5) * 6)))
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(18, prev + 1));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(8, prev - 1));
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setMapCenter({ lat: userLocation?.latitude, lng: userLocation?.longitude });
      setZoomLevel(15);
    }
  };

  const toggleLayer = (layer) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev?.[layer]
    }));
  };

  const getBusStatusColor = (status) => {
    switch (status) {
      case 'on_time': return 'text-success';
      case 'delayed': return 'text-error';
      case 'early': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getOccupancyLevel = (occupancy, capacity) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return { level: 'low', color: 'text-success' };
    if (percentage < 80) return { level: 'medium', color: 'text-warning' };
    return { level: 'high', color: 'text-error' };
  };

  return (
    <div className={`relative bg-muted rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-200' : 'h-96 lg:h-[600px]'}`}>
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="SmartTransit Live Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
          className="absolute inset-0"
        />

        {/* Bus Overlays */}
        {mapLayers?.buses && liveBuses?.map(bus => (
          <div
            key={bus?.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${((bus?.currentLng - mapCenter?.lng + 0.02) / 0.04) * 100}%`,
              top: `${((mapCenter?.lat - bus?.currentLat + 0.02) / 0.04) * 100}%`
            }}
            onClick={() => {
              setSelectedBus(bus);
              onBusSelect?.(bus);
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Icon name="Bus" size={16} color="white" />
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs font-medium whitespace-nowrap shadow-md">
                {bus?.routeNumber}
              </div>
            </div>
          </div>
        ))}

        {/* Bus Stop Overlays */}
        {mapLayers?.stops && busStops?.map(stop => (
          <div
            key={stop?.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((stop?.lng - mapCenter?.lng + 0.02) / 0.04) * 100}%`,
              top: `${((mapCenter?.lat - stop?.lat + 0.02) / 0.04) * 100}%`
            }}
          >
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <Icon name="MapPin" size={12} color="white" />
            </div>
          </div>
        ))}

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((userLocation?.longitude - mapCenter?.lng + 0.02) / 0.04) * 100}%`,
              top: `${((mapCenter?.lat - userLocation?.latitude + 0.02) / 0.04) * 100}%`
            }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          </div>
        )}
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCenterOnUser}
          className="bg-card/90 backdrop-blur-sm"
          disabled={!userLocation}
        >
          <Icon name="Crosshair" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={16} />
        </Button>
      </div>
      {/* Layer Controls */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
        <h3 className="text-sm font-medium text-card-foreground">Map Layers</h3>
        {Object.entries(mapLayers)?.map(([layer, enabled]) => (
          <label key={layer} className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => toggleLayer(layer)}
              className="rounded"
            />
            <span className="capitalize text-card-foreground">{layer}</span>
          </label>
        ))}
      </div>
      {/* Selected Bus Info */}
      {selectedBus && (
        <div className="absolute bottom-4 left-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-card-foreground">Bus {selectedBus?.routeNumber}</h3>
              <p className="text-sm text-muted-foreground">ID: {selectedBus?.id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBus(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Next Stop</p>
              <p className="font-medium text-card-foreground">{selectedBus?.nextStop}</p>
              <p className={`text-xs ${getBusStatusColor(selectedBus?.status)}`}>
                ETA: {selectedBus?.eta}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Occupancy</p>
              <p className="font-medium text-card-foreground">
                {selectedBus?.occupancy}/{selectedBus?.capacity}
              </p>
              <p className={`text-xs ${getOccupancyLevel(selectedBus?.occupancy, selectedBus?.capacity)?.color}`}>
                {getOccupancyLevel(selectedBus?.occupancy, selectedBus?.capacity)?.level} capacity
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Speed</p>
              <p className="font-medium text-card-foreground">{selectedBus?.speed} km/h</p>
            </div>
            <div>
              <p className="text-muted-foreground">Driver</p>
              <p className="font-medium text-card-foreground">{selectedBus?.driver}</p>
            </div>
          </div>
        </div>
      )}
      {/* Real-time Update Indicator */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span className="text-card-foreground">Live</span>
      </div>
    </div>
  );
};

export default MapView;