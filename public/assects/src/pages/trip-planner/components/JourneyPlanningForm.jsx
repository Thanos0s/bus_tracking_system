import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const JourneyPlanningForm = ({ onPlanJourney, isLoading = false }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureType: 'now',
    departureTime: '',
    departureDate: '',
    preferences: {
      fastest: true,
      leastTransfers: false,
      mostComfortable: false,
      accessible: false
    }
  });

  const [suggestions, setSuggestions] = useState({
    origin: [],
    destination: []
  });

  const [showSuggestions, setShowSuggestions] = useState({
    origin: false,
    destination: false
  });

  // Mock bus stops and landmarks for autocomplete
  const mockLocations = [
    { id: 1, name: "Central Bus Station", type: "station", address: "Main Street, City Center" },
    { id: 2, name: "Railway Station", type: "station", address: "Station Road" },
    { id: 3, name: "City Hospital", type: "landmark", address: "Hospital Road" },
    { id: 4, name: "University Campus", type: "landmark", address: "University Avenue" },
    { id: 5, name: "Shopping Mall", type: "landmark", address: "Mall Road" },
    { id: 6, name: "Airport Terminal", type: "station", address: "Airport Road" },
    { id: 7, name: "Government Office Complex", type: "landmark", address: "Civil Lines" },
    { id: 8, name: "Industrial Area Gate", type: "station", address: "Industrial Road" },
    { id: 9, name: "Sports Stadium", type: "landmark", address: "Stadium Road" },
    { id: 10, name: "Old City Market", type: "landmark", address: "Market Street" }
  ];

  const departureOptions = [
    { value: 'now', label: 'Leave Now' },
    { value: 'scheduled', label: 'Schedule Departure' }
  ];

  useEffect(() => {
    // Set default departure time to current time + 5 minutes
    const now = new Date();
    now?.setMinutes(now?.getMinutes() + 5);
    const defaultTime = now?.toTimeString()?.slice(0, 5);
    const defaultDate = now?.toISOString()?.split('T')?.[0];
    
    setFormData(prev => ({
      ...prev,
      departureTime: defaultTime,
      departureDate: defaultDate
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Handle autocomplete suggestions
    if (field === 'origin' || field === 'destination') {
      if (value?.length > 1) {
        const filtered = mockLocations?.filter(location =>
          location?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
          location?.address?.toLowerCase()?.includes(value?.toLowerCase())
        );
        setSuggestions(prev => ({
          ...prev,
          [field]: filtered?.slice(0, 5)
        }));
        setShowSuggestions(prev => ({
          ...prev,
          [field]: true
        }));
      } else {
        setShowSuggestions(prev => ({
          ...prev,
          [field]: false
        }));
      }
    }
  };

  const handleSuggestionSelect = (field, location) => {
    setFormData(prev => ({
      ...prev,
      [field]: location?.name
    }));
    setShowSuggestions(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handlePreferenceChange = (preference, checked) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev?.preferences,
        [preference]: checked
      }
    }));
  };

  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev?.destination,
      destination: prev?.origin
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.origin && formData?.destination) {
      onPlanJourney(formData);
    }
  };

  const isFormValid = formData?.origin && formData?.destination;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-nav-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="Route" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Plan Your Journey</h2>
          <p className="text-sm text-muted-foreground">Find the best route for your trip</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origin and Destination */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="From"
              type="text"
              placeholder="Enter pickup location"
              value={formData?.origin}
              onChange={(e) => handleInputChange('origin', e?.target?.value)}
              required
              className="pr-12"
            />
            <div className="absolute right-3 top-9 text-muted-foreground">
              <Icon name="MapPin" size={16} />
            </div>
            
            {/* Origin Suggestions */}
            {showSuggestions?.origin && suggestions?.origin?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-nav-strong z-50">
                {suggestions?.origin?.map((location) => (
                  <button
                    key={location?.id}
                    type="button"
                    onClick={() => handleSuggestionSelect('origin', location)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                  >
                    <Icon 
                      name={location?.type === 'station' ? 'Bus' : 'MapPin'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <div>
                      <div className="text-sm font-medium text-popover-foreground">
                        {location?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {location?.address}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwapLocations}
              className="rounded-full"
              iconName="ArrowUpDown"
              iconSize={16}
            >
              Swap
            </Button>
          </div>

          <div className="relative">
            <Input
              label="To"
              type="text"
              placeholder="Enter destination"
              value={formData?.destination}
              onChange={(e) => handleInputChange('destination', e?.target?.value)}
              required
              className="pr-12"
            />
            <div className="absolute right-3 top-9 text-muted-foreground">
              <Icon name="MapPin" size={16} />
            </div>
            
            {/* Destination Suggestions */}
            {showSuggestions?.destination && suggestions?.destination?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-nav-strong z-50">
                {suggestions?.destination?.map((location) => (
                  <button
                    key={location?.id}
                    type="button"
                    onClick={() => handleSuggestionSelect('destination', location)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                  >
                    <Icon 
                      name={location?.type === 'station' ? 'Bus' : 'MapPin'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <div>
                      <div className="text-sm font-medium text-popover-foreground">
                        {location?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {location?.address}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Departure Time */}
        <div className="space-y-4">
          <Select
            label="Departure"
            options={departureOptions}
            value={formData?.departureType}
            onChange={(value) => handleInputChange('departureType', value)}
          />

          {formData?.departureType === 'scheduled' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData?.departureDate}
                onChange={(e) => handleInputChange('departureDate', e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                required
              />
              <Input
                label="Time"
                type="time"
                value={formData?.departureTime}
                onChange={(e) => handleInputChange('departureTime', e?.target?.value)}
                required
              />
            </div>
          )}
        </div>

        {/* Journey Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Journey Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Checkbox
              label="Fastest Route"
              description="Minimize total travel time"
              checked={formData?.preferences?.fastest}
              onChange={(e) => handlePreferenceChange('fastest', e?.target?.checked)}
            />
            <Checkbox
              label="Least Transfers"
              description="Minimize bus changes"
              checked={formData?.preferences?.leastTransfers}
              onChange={(e) => handlePreferenceChange('leastTransfers', e?.target?.checked)}
            />
            <Checkbox
              label="Most Comfortable"
              description="Prefer newer buses"
              checked={formData?.preferences?.mostComfortable}
              onChange={(e) => handlePreferenceChange('mostComfortable', e?.target?.checked)}
            />
            <Checkbox
              label="Accessible Route"
              description="Wheelchair accessible"
              checked={formData?.preferences?.accessible}
              onChange={(e) => handlePreferenceChange('accessible', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!isFormValid}
          iconName="Search"
          iconPosition="left"
          iconSize={20}
        >
          Find Routes
        </Button>
      </form>
    </div>
  );
};

export default JourneyPlanningForm;