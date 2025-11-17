import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ProfileSection from './components/ProfileSection';
import NotificationPreferences from './components/NotificationPreferences';
import SecuritySettings from './components/SecuritySettings';
import PreferencesSettings from './components/PreferencesSettings';
import DataManagement from './components/DataManagement';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user data
  const mockUserData = {
    profile: {
      fullName: "Rajesh Kumar Singh",
      email: "rajesh.singh@email.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1990-05-15",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      emergencyContactName: "Priya Singh",
      emergencyContactPhone: "+91 98765 43211"
    },
    notifications: {
      masterEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      notifications: {
        busArrivals: {
          enabled: true,
          deliveryMethod: 'push',
          timing: '5min'
        },
        routeChanges: {
          enabled: true,
          deliveryMethod: 'push',
          timing: 'immediate'
        },
        emergencyAlerts: {
          enabled: true,
          deliveryMethod: 'all',
          timing: 'immediate'
        },
        serviceUpdates: {
          enabled: false,
          deliveryMethod: 'email',
          timing: 'immediate'
        },
        promotions: {
          enabled: false,
          deliveryMethod: 'email',
          timing: 'immediate'
        }
      }
    },
    security: {
      lastPasswordChange: "2024-12-15T10:30:00Z",
      twoFactorEnabled: true,
      activeSessions: 3
    },
    preferences: {
      language: 'en',
      theme: 'light',
      mapStyle: 'standard',
      distanceUnit: 'km',
      timeFormat: '12h',
      defaultLocation: 'Sector 17, Chandigarh',
      favoriteRoutes: ['route-1', 'route-2', 'route-3'],
      accessibility: {
        largeText: false,
        highContrast: false,
        voiceAnnouncements: true,
        reducedMotion: false
      },
      privacy: {
        locationSharing: true,
        usageAnalytics: true,
        crashReports: true
      }
    }
  };

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'User',
      description: 'Personal information and contact details'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'Bell',
      description: 'Alert preferences and delivery settings'
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'Shield',
      description: 'Password, 2FA, and session management'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: 'Settings',
      description: 'App settings and customization'
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: 'Database',
      description: 'Export, backup, and account deletion'
    }
  ];

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUserData(mockUserData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setUserData(prev => ({
      ...prev,
      profile: updatedProfile
    }));
  };

  const handleNotificationUpdate = (updatedNotifications) => {
    setUserData(prev => ({
      ...prev,
      notifications: updatedNotifications
    }));
  };

  const handleSecurityUpdate = (updatedSecurity) => {
    setUserData(prev => ({
      ...prev,
      security: updatedSecurity
    }));
  };

  const handlePreferencesUpdate = (updatedPreferences) => {
    setUserData(prev => ({
      ...prev,
      preferences: updatedPreferences
    }));
  };

  const handleDataAction = (action, result) => {
    if (action === 'delete' && result === 'success') {
      // Redirect to login or home page after account deletion
      navigate('/');
    }
    // Handle other data actions (export, clearCache, etc.)
  };

  const renderActiveSection = () => {
    if (isLoading || !userData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <Icon name="Loader" size={24} className="animate-spin text-primary" />
            <span className="text-muted-foreground">Loading settings...</span>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection
            userProfile={userData?.profile}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferences
            preferences={userData?.notifications}
            onPreferencesUpdate={handleNotificationUpdate}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            securityData={userData?.security}
            onSecurityUpdate={handleSecurityUpdate}
          />
        );
      case 'preferences':
        return (
          <PreferencesSettings
            preferences={userData?.preferences}
            onPreferencesUpdate={handlePreferencesUpdate}
          />
        );
      case 'data':
        return (
          <DataManagement
            userData={userData}
            onDataAction={handleDataAction}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <Icon name="Loader" size={32} className="animate-spin text-primary" />
            <span className="text-lg text-muted-foreground">Loading account settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/passenger-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
            >
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, preferences, and account security
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-semibold text-card-foreground mb-4">Settings</h2>
              <nav className="space-y-2">
                {settingSections?.map((section) => (
                  <button
                    key={section?.id}
                    onClick={() => setActiveSection(section?.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors touch-target
                      ${activeSection === section?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-card-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={section?.icon} size={20} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{section?.title}</div>
                      <div className="text-xs opacity-75 truncate">
                        {section?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium text-card-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveSection('data')}
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="HelpCircle"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Get Help
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Settings Navigation */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconPosition="left"
              iconSize={16}
            >
              {settingSections?.find(s => s?.id === activeSection)?.title || 'Settings Menu'}
            </Button>

            {isMobileMenuOpen && (
              <div className="mt-4 bg-card rounded-lg border border-border p-4">
                <div className="grid grid-cols-1 gap-2">
                  {settingSections?.map((section) => (
                    <button
                      key={section?.id}
                      onClick={() => {
                        setActiveSection(section?.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors touch-target
                        ${activeSection === section?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-card-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon name={section?.icon} size={20} />
                      <div>
                        <div className="font-medium">{section?.title}</div>
                        <div className="text-xs opacity-75">{section?.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-w-0">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;