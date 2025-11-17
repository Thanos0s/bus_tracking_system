import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferences = ({ preferences, onPreferencesUpdate }) => {
  const [settings, setSettings] = useState(preferences);
  const [isLoading, setIsLoading] = useState(false);

  const notificationTypes = [
    {
      id: 'busArrivals',
      title: 'Bus Arrivals',
      description: 'Get notified when your bus is approaching',
      icon: 'Bus',
      color: 'text-primary'
    },
    {
      id: 'routeChanges',
      title: 'Route Changes',
      description: 'Updates about route modifications and diversions',
      icon: 'Route',
      color: 'text-warning'
    },
    {
      id: 'emergencyAlerts',
      title: 'Emergency Alerts',
      description: 'Critical safety and emergency notifications',
      icon: 'AlertTriangle',
      color: 'text-error'
    },
    {
      id: 'serviceUpdates',
      title: 'Service Updates',
      description: 'General service announcements and updates',
      icon: 'Info',
      color: 'text-muted-foreground'
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Special offers and promotional content',
      icon: 'Gift',
      color: 'text-success'
    }
  ];

  const deliveryMethods = [
    { value: 'push', label: 'Push Notifications' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'all', label: 'All Methods' }
  ];

  const timingOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: '5min', label: '5 minutes before' },
    { value: '10min', label: '10 minutes before' },
    { value: '15min', label: '15 minutes before' }
  ];

  const handleNotificationToggle = (type, enabled) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: {
          ...prev?.notifications?.[type],
          enabled
        }
      }
    }));
  };

  const handleDeliveryMethodChange = (type, method) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: {
          ...prev?.notifications?.[type],
          deliveryMethod: method
        }
      }
    }));
  };

  const handleTimingChange = (type, timing) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: {
          ...prev?.notifications?.[type],
          timing
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPreferencesUpdate(settings);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async (type) => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const config = notificationTypes?.find(n => n?.id === type);
        new Notification(`Test: ${config.title}`, {
          body: config.description,
          icon: '/favicon.ico',
          tag: `test-${type}`
        });
      } else {
        alert('Please enable browser notifications first');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-card-foreground">Notification Preferences</h2>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          loading={isLoading}
          iconName="Save"
          iconPosition="left"
          iconSize={16}
        >
          Save Preferences
        </Button>
      </div>
      <div className="space-y-6">
        {/* Global Settings */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-card-foreground">Master Notifications</h3>
              <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
            </div>
            <Checkbox
              checked={settings?.masterEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, masterEnabled: e?.target?.checked }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Quiet Hours Start"
              options={[
                { value: '22:00', label: '10:00 PM' },
                { value: '23:00', label: '11:00 PM' },
                { value: '00:00', label: '12:00 AM' },
                { value: '01:00', label: '1:00 AM' }
              ]}
              value={settings?.quietHoursStart}
              onChange={(value) => setSettings(prev => ({ ...prev, quietHoursStart: value }))}
            />

            <Select
              label="Quiet Hours End"
              options={[
                { value: '06:00', label: '6:00 AM' },
                { value: '07:00', label: '7:00 AM' },
                { value: '08:00', label: '8:00 AM' },
                { value: '09:00', label: '9:00 AM' }
              ]}
              value={settings?.quietHoursEnd}
              onChange={(value) => setSettings(prev => ({ ...prev, quietHoursEnd: value }))}
            />
          </div>
        </div>

        {/* Individual Notification Types */}
        <div className="space-y-4">
          <h3 className="font-medium text-card-foreground">Notification Types</h3>
          
          {notificationTypes?.map((type) => {
            const typeSettings = settings?.notifications?.[type?.id] || {};
            
            return (
              <div key={type?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full bg-muted ${type?.color}`}>
                    <Icon name={type?.icon} size={20} />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-card-foreground">{type?.title}</h4>
                        <p className="text-sm text-muted-foreground">{type?.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestNotification(type?.id)}
                          iconName="Play"
                          iconSize={14}
                          disabled={!typeSettings?.enabled}
                        >
                          Test
                        </Button>
                        
                        <Checkbox
                          checked={typeSettings?.enabled || false}
                          onChange={(e) => handleNotificationToggle(type?.id, e?.target?.checked)}
                        />
                      </div>
                    </div>

                    {typeSettings?.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
                        <Select
                          label="Delivery Method"
                          options={deliveryMethods}
                          value={typeSettings?.deliveryMethod || 'push'}
                          onChange={(value) => handleDeliveryMethodChange(type?.id, value)}
                        />

                        {type?.id === 'busArrivals' && (
                          <Select
                            label="Notification Timing"
                            options={timingOptions}
                            value={typeSettings?.timing || '5min'}
                            onChange={(value) => handleTimingChange(type?.id, value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notification Statistics */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-card-foreground mb-3">Notification Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">98%</div>
              <div className="text-xs text-muted-foreground">Delivery Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">23</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">5</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;