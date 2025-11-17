import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyMap = ({ alerts, selectedAlert, onAlertSelect, className = '' }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 30.7333, lng: 76.7794 }); // Chandigarh
  const [zoomLevel, setZoomLevel] = useState(12);

  useEffect(() => {
    if (selectedAlert && selectedAlert?.coordinates) {
      setMapCenter(selectedAlert?.coordinates);
      setZoomLevel(15);
    }
  }, [selectedAlert]);

  const getAlertMarkerColor = (alert) => {
    switch (alert?.priority) {
      case 'critical': return '#EF4444'; // red
      case 'high': return '#F59E0B'; // amber
      case 'medium': return '#3B82F6'; // blue
      default: return '#6B7280'; // gray
    }
  };

  const generateMapUrl = () => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/view';
    const apiKey = 'demo'; // Mock API key for demo
    const center = `${mapCenter?.lat},${mapCenter?.lng}`;
    
    return `https://www.google.com/maps?q=${center}&z=${zoomLevel}&output=embed`;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleCenterOnAlert = (alert) => {
    setMapCenter(alert?.coordinates);
    setZoomLevel(15);
    onAlertSelect(alert);
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="font-semibold text-card-foreground">Emergency Locations</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              iconName="Minus"
            />
            <span className="text-xs font-mono px-2">{zoomLevel}x</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              iconName="Plus"
            />
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Emergency Response Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
          className="border-0"
        />
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMapCenter({ lat: 30.7333, lng: 76.7794 });
              setZoomLevel(12);
            }}
            iconName="Home"
          />
        </div>

        {/* Alert Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {alerts?.map((alert, index) => (
            <div
              key={alert?.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                onClick={() => handleCenterOnAlert(alert)}
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110 ${
                  selectedAlert?.id === alert?.id ? 'ring-2 ring-white ring-offset-2' : ''
                }`}
                style={{ backgroundColor: getAlertMarkerColor(alert) }}
                title={`${alert?.type} - Bus ${alert?.busId}`}
              >
                {index + 1}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Map Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span className="text-xs text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {alerts?.length} active alert{alerts?.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      {/* Selected Alert Info */}
      {selectedAlert && (
        <div className="p-4 bg-muted/50 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm text-card-foreground">
                Bus {selectedAlert?.busId} - {selectedAlert?.type?.replace('_', ' ')?.toUpperCase()}
              </h4>
              <p className="text-xs text-muted-foreground">
                {selectedAlert?.location} • {selectedAlert?.passengerCount} passengers
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAlertSelect(null)}
              iconName="X"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyMap;