import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RouteComparison = ({ routes, onSelectRoute, onClose }) => {
  const [selectedRoutes, setSelectedRoutes] = useState(routes?.slice(0, 3));
  const [comparisonMetric, setComparisonMetric] = useState('time');

  const comparisonMetrics = [
    { key: 'time', label: 'Travel Time', icon: 'Clock' },
    { key: 'cost', label: 'Cost', icon: 'DollarSign' },
    { key: 'comfort', label: 'Comfort', icon: 'Armchair' },
    { key: 'reliability', label: 'Reliability', icon: 'CheckCircle' }
  ];

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getMetricValue = (route, metric) => {
    switch (metric) {
      case 'time':
        return route?.totalDuration;
      case 'cost':
        return route?.estimatedCost;
      case 'comfort':
        return route?.comfortScore || 75;
      case 'reliability':
        return route?.reliability;
      default:
        return 0;
    }
  };

  const getMetricDisplay = (route, metric) => {
    const value = getMetricValue(route, metric);
    switch (metric) {
      case 'time':
        return formatDuration(value);
      case 'cost':
        return `₹${value}`;
      case 'comfort':
      case 'reliability':
        return `${value}%`;
      default:
        return value;
    }
  };

  const getBestRoute = (metric) => {
    return selectedRoutes?.reduce((best, current) => {
      const currentValue = getMetricValue(current, metric);
      const bestValue = getMetricValue(best, metric);
      
      if (metric === 'cost' || metric === 'time') {
        return currentValue < bestValue ? current : best;
      } else {
        return currentValue > bestValue ? current : best;
      }
    });
  };

  const getRouteRank = (route, metric) => {
    const sorted = [...selectedRoutes]?.sort((a, b) => {
      const aValue = getMetricValue(a, metric);
      const bValue = getMetricValue(b, metric);
      
      if (metric === 'cost' || metric === 'time') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    return sorted?.findIndex(r => r?.id === route?.id) + 1;
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-success bg-success/10';
      case 2: return 'text-warning bg-warning/10';
      case 3: return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-nav-strong max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Compare Routes</h2>
            <p className="text-sm text-muted-foreground">
              Compare up to 3 routes side by side
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

        {/* Metric Selector */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {comparisonMetrics?.map((metric) => (
              <Button
                key={metric?.key}
                variant={comparisonMetric === metric?.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComparisonMetric(metric?.key)}
                iconName={metric?.icon}
                iconPosition="left"
                iconSize={16}
              >
                {metric?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-auto max-h-96">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedRoutes?.map((route, index) => {
                const rank = getRouteRank(route, comparisonMetric);
                const isBest = getBestRoute(comparisonMetric)?.id === route?.id;
                
                return (
                  <div
                    key={route?.id}
                    className={`relative border rounded-lg p-4 transition-all ${
                      isBest ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    {/* Best Badge */}
                    {isBest && (
                      <div className="absolute -top-2 left-4 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
                        <Icon name="Crown" size={12} className="inline mr-1" />
                        Best {comparisonMetrics?.find(m => m?.key === comparisonMetric)?.label}
                      </div>
                    )}
                    {/* Route Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground capitalize">
                        {route?.type} Route
                      </h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getRankColor(rank)}`}>
                        #{rank}
                      </div>
                    </div>
                    {/* Key Metrics */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">
                          {formatDuration(route?.totalDuration)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost</span>
                        <span className="font-medium text-foreground">
                          ₹{route?.estimatedCost}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transfers</span>
                        <span className="font-medium text-foreground">
                          {route?.transfers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Walking</span>
                        <span className="font-medium text-foreground">
                          {route?.walkingDistance}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reliability</span>
                        <span className="font-medium text-foreground">
                          {route?.reliability}%
                        </span>
                      </div>
                    </div>
                    {/* Highlighted Metric */}
                    <div className={`p-3 rounded-md mb-4 ${
                      isBest ? 'bg-success/10 border border-success/20' : 'bg-muted'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {comparisonMetrics?.find(m => m?.key === comparisonMetric)?.label}
                        </span>
                        <span className={`font-bold ${isBest ? 'text-success' : 'text-foreground'}`}>
                          {getMetricDisplay(route, comparisonMetric)}
                        </span>
                      </div>
                    </div>
                    {/* Pros and Cons */}
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-medium text-success">Pros:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {route?.pros?.map((pro, i) => (
                          <li key={i} className="flex items-center space-x-1">
                            <Icon name="Check" size={10} className="text-success" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {route?.cons && route?.cons?.length > 0 && (
                        <>
                          <div className="text-xs font-medium text-error mt-2">Cons:</div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {route?.cons?.map((con, i) => (
                              <li key={i} className="flex items-center space-x-1">
                                <Icon name="X" size={10} className="text-error" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    {/* Select Button */}
                    <Button
                      variant={isBest ? 'default' : 'outline'}
                      size="sm"
                      fullWidth
                      onClick={() => onSelectRoute(route)}
                      iconName="Navigation"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Select Route
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {selectedRoutes?.length} of {routes?.length} available routes
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onSelectRoute(getBestRoute(comparisonMetric))}
                iconName="Crown"
                iconPosition="left"
                iconSize={16}
              >
                Select Best Route
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteComparison;