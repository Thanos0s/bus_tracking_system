import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SavedTripsPanel = ({ onSelectTrip, onDeleteTrip, isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock saved trips data
  const savedTrips = [
    {
      id: 1,
      name: "Home to Office",
      origin: "Residential Area",
      destination: "Business District",
      category: "daily",
      frequency: "Daily",
      lastUsed: "2025-09-23T08:30:00",
      estimatedTime: 35,
      estimatedCost: 25,
      isFavorite: true,
      tags: ["work", "morning"]
    },
    {
      id: 2,
      name: "Weekend Shopping",
      origin: "Home",
      destination: "Shopping Mall",
      category: "leisure",
      frequency: "Weekly",
      lastUsed: "2025-09-21T14:15:00",
      estimatedTime: 28,
      estimatedCost: 20,
      isFavorite: false,
      tags: ["shopping", "weekend"]
    },
    {
      id: 3,
      name: "Hospital Visit",
      origin: "Home",
      destination: "City Hospital",
      category: "important",
      frequency: "Monthly",
      lastUsed: "2025-09-15T10:00:00",
      estimatedTime: 42,
      estimatedCost: 30,
      isFavorite: true,
      tags: ["medical", "important"]
    },
    {
      id: 4,
      name: "University Campus",
      origin: "Hostel",
      destination: "University Main Gate",
      category: "daily",
      frequency: "Daily",
      lastUsed: "2025-09-22T07:45:00",
      estimatedTime: 22,
      estimatedCost: 15,
      isFavorite: false,
      tags: ["education", "student"]
    },
    {
      id: 5,
      name: "Airport Transfer",
      origin: "Home",
      destination: "Airport Terminal",
      category: "travel",
      frequency: "Rarely",
      lastUsed: "2025-08-10T05:30:00",
      estimatedTime: 65,
      estimatedCost: 45,
      isFavorite: true,
      tags: ["travel", "airport"]
    }
  ];

  const categories = [
    { key: 'all', label: 'All Trips', icon: 'List' },
    { key: 'daily', label: 'Daily', icon: 'Calendar' },
    { key: 'leisure', label: 'Leisure', icon: 'Coffee' },
    { key: 'important', label: 'Important', icon: 'Star' },
    { key: 'travel', label: 'Travel', icon: 'Plane' }
  ];

  const filteredTrips = savedTrips?.filter(trip => {
    const matchesSearch = trip?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         trip?.origin?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         trip?.destination?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         trip?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || trip?.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatLastUsed = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date?.toLocaleDateString();
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getCategoryIcon = (category) => {
    const cat = categories?.find(c => c?.key === category);
    return cat ? cat?.icon : 'MapPin';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'daily': return 'text-primary bg-primary/10';
      case 'leisure': return 'text-success bg-success/10';
      case 'important': return 'text-warning bg-warning/10';
      case 'travel': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-nav-strong max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Saved Trips</h2>
            <p className="text-sm text-muted-foreground">
              {filteredTrips?.length} saved trip{filteredTrips?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-border space-y-4">
          <Input
            type="search"
            placeholder="Search trips, locations, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <Button
                key={category?.key}
                variant={selectedCategory === category?.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category?.key)}
                iconName={category?.icon}
                iconPosition="left"
                iconSize={14}
              >
                {category?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Trips List */}
        <div className="overflow-auto max-h-96">
          {filteredTrips?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No trips found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms' : 'Start planning trips to save them here'}
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filteredTrips?.map((trip) => (
                <div
                  key={trip?.id}
                  className="border border-border rounded-lg p-4 hover:shadow-nav-shadow transition-all cursor-pointer"
                  onClick={() => onSelectTrip(trip)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(trip?.category)}`}>
                        <Icon name={getCategoryIcon(trip?.category)} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{trip?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {trip?.origin} → {trip?.destination}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {trip?.isFavorite && (
                        <Icon name="Heart" size={16} className="text-warning" fill="currentColor" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDeleteTrip(trip?.id);
                        }}
                        className="text-muted-foreground hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">
                        {formatDuration(trip?.estimatedTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">
                        ₹{trip?.estimatedCost}
                      </div>
                      <div className="text-xs text-muted-foreground">Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">
                        {trip?.frequency}
                      </div>
                      <div className="text-xs text-muted-foreground">Frequency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">
                        {formatLastUsed(trip?.lastUsed)}
                      </div>
                      <div className="text-xs text-muted-foreground">Last Used</div>
                    </div>
                  </div>

                  {trip?.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {trip?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      onClick={(e) => {
                        e?.stopPropagation();
                        onSelectTrip(trip);
                      }}
                      iconName="Navigation"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Use This Trip
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredTrips?.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Tip: Click on any trip to use it for planning</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTripsPanel;