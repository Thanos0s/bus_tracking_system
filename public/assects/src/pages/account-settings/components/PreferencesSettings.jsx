import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const PreferencesSettings = ({ preferences, onPreferencesUpdate }) => {
  const [settings, setSettings] = useState(preferences);
  const [isLoading, setIsLoading] = useState(false);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'ur', label: 'اردو (Urdu)' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'system', label: 'System Default' }
  ];

  const mapStyleOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'satellite', label: 'Satellite' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const distanceUnitOptions = [
    { value: 'km', label: 'Kilometers (km)' },
    { value: 'mi', label: 'Miles (mi)' }
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12-hour (AM/PM)' },
    { value: '24h', label: '24-hour' }
  ];

  const favoriteRoutes = [
    { id: 'route-1', name: 'Route 15: Sector 17 - Railway Station', frequency: 'Daily' },
    { id: 'route-2', name: 'Route 8: PGI - IT Park', frequency: 'Weekdays' },
    { id: 'route-3', name: 'Route 22: University - Mall Road', frequency: 'Weekends' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAccessibilityChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      accessibility: {
        ...prev?.accessibility,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev?.privacy,
        [key]: value
      }
    }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPreferencesUpdate(settings);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavoriteRoute = (routeId) => {
    setSettings(prev => ({
      ...prev,
      favoriteRoutes: prev?.favoriteRoutes?.filter(route => route !== routeId)
    }));
  };

  return (
    <div className="space-y-6">
      {/* General Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">General Preferences</h2>
          <Button
            variant="default"
            size="sm"
            onClick={handleSavePreferences}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Language"
            description="Choose your preferred language"
            options={languageOptions}
            value={settings?.language}
            onChange={(value) => handleSettingChange('language', value)}
          />

          <Select
            label="Theme"
            description="Select your preferred theme"
            options={themeOptions}
            value={settings?.theme}
            onChange={(value) => handleSettingChange('theme', value)}
          />

          <Select
            label="Map Style"
            description="Default map display style"
            options={mapStyleOptions}
            value={settings?.mapStyle}
            onChange={(value) => handleSettingChange('mapStyle', value)}
          />

          <Select
            label="Distance Unit"
            description="Unit for displaying distances"
            options={distanceUnitOptions}
            value={settings?.distanceUnit}
            onChange={(value) => handleSettingChange('distanceUnit', value)}
          />

          <Select
            label="Time Format"
            description="How time should be displayed"
            options={timeFormatOptions}
            value={settings?.timeFormat}
            onChange={(value) => handleSettingChange('timeFormat', value)}
          />

          <Input
            label="Default Location"
            type="text"
            value={settings?.defaultLocation}
            onChange={(e) => handleSettingChange('defaultLocation', e?.target?.value)}
            description="Your most common starting location"
          />
        </div>
      </div>
      {/* Accessibility Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-6">Accessibility Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Large Text</h4>
              <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
            </div>
            <Checkbox
              checked={settings?.accessibility?.largeText}
              onChange={(e) => handleAccessibilityChange('largeText', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">High Contrast</h4>
              <p className="text-sm text-muted-foreground">Enhance color contrast for better visibility</p>
            </div>
            <Checkbox
              checked={settings?.accessibility?.highContrast}
              onChange={(e) => handleAccessibilityChange('highContrast', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Voice Announcements</h4>
              <p className="text-sm text-muted-foreground">Audio announcements for bus arrivals</p>
            </div>
            <Checkbox
              checked={settings?.accessibility?.voiceAnnouncements}
              onChange={(e) => handleAccessibilityChange('voiceAnnouncements', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Reduced Motion</h4>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Checkbox
              checked={settings?.accessibility?.reducedMotion}
              onChange={(e) => handleAccessibilityChange('reducedMotion', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-6">Privacy & Data</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Location Sharing</h4>
              <p className="text-sm text-muted-foreground">Allow app to access your location for better service</p>
            </div>
            <Checkbox
              checked={settings?.privacy?.locationSharing}
              onChange={(e) => handlePrivacyChange('locationSharing', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Usage Analytics</h4>
              <p className="text-sm text-muted-foreground">Help improve the app by sharing anonymous usage data</p>
            </div>
            <Checkbox
              checked={settings?.privacy?.usageAnalytics}
              onChange={(e) => handlePrivacyChange('usageAnalytics', e?.target?.checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Crash Reports</h4>
              <p className="text-sm text-muted-foreground">Automatically send crash reports to help fix issues</p>
            </div>
            <Checkbox
              checked={settings?.privacy?.crashReports}
              onChange={(e) => handlePrivacyChange('crashReports', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Favorite Routes */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-card-foreground">Favorite Routes</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Add Route
          </Button>
        </div>

        <div className="space-y-3">
          {favoriteRoutes?.map((route) => (
            <div key={route?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Route" size={20} className="text-primary" />
                <div>
                  <h4 className="font-medium text-card-foreground">{route?.name}</h4>
                  <p className="text-sm text-muted-foreground">Used {route?.frequency}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Star"
                  iconSize={16}
                  className="text-warning"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavoriteRoute(route?.id)}
                  iconName="Trash2"
                  iconSize={16}
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;