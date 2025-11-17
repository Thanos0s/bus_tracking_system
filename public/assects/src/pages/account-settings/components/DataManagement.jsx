import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataManagement = ({ userData, onDataAction }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [exportOptions, setExportOptions] = useState({
    profile: true,
    travelHistory: true,
    preferences: true,
    notifications: false
  });

  const dataStats = {
    totalTrips: 247,
    totalDistance: '1,847 km',
    dataSize: '2.3 MB',
    accountAge: '8 months',
    lastBackup: '2025-01-20',
    storageUsed: '2.3 MB',
    storageLimit: '50 MB'
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate data export
      const exportData = {
        profile: exportOptions?.profile ? userData : null,
        travelHistory: exportOptions?.travelHistory ? generateTravelHistory() : null,
        preferences: exportOptions?.preferences ? userData?.preferences : null,
        notifications: exportOptions?.notifications ? userData?.notifications : null,
        exportDate: new Date()?.toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smarttransit-data-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);

      onDataAction('export', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      onDataAction('export', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onDataAction('delete', 'success');
    } catch (error) {
      console.error('Account deletion failed:', error);
      onDataAction('delete', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDataAction('clearCache', 'success');
    } catch (error) {
      console.error('Cache clear failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTravelHistory = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)?.toISOString(),
      route: `Route ${Math.floor(Math.random() * 25) + 1}`,
      from: 'Sector 17',
      to: 'Railway Station',
      duration: `${Math.floor(Math.random() * 30) + 15} minutes`,
      distance: `${(Math.random() * 10 + 2)?.toFixed(1)} km`
    }));
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-6">Data Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{dataStats?.totalTrips}</div>
            <div className="text-sm text-muted-foreground">Total Trips</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">{dataStats?.totalDistance}</div>
            <div className="text-sm text-muted-foreground">Distance Traveled</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-warning">{dataStats?.dataSize}</div>
            <div className="text-sm text-muted-foreground">Data Size</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{dataStats?.accountAge}</div>
            <div className="text-sm text-muted-foreground">Account Age</div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">Storage Usage</span>
            <span className="text-sm text-muted-foreground">{dataStats?.storageUsed} / {dataStats?.storageLimit}</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: '4.6%' }}
            />
          </div>
        </div>
      </div>
      {/* Data Export */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-card-foreground">Export Your Data</h3>
            <p className="text-sm text-muted-foreground">Download a copy of your account data</p>
          </div>
          <Button
            variant="default"
            onClick={handleExportData}
            loading={isLoading}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export Data
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-card-foreground">Select data to export:</h4>
          
          {Object.entries(exportOptions)?.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <span className="font-medium text-card-foreground capitalize">
                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                </span>
                <p className="text-sm text-muted-foreground">
                  {key === 'profile' && 'Personal information and account details'}
                  {key === 'travelHistory' && 'Your trip history and route preferences'}
                  {key === 'preferences' && 'App settings and customizations'}
                  {key === 'notifications' && 'Notification history and preferences'}
                </p>
              </div>
              <Checkbox
                checked={value}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  [key]: e?.target?.checked
                }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Export Information</p>
              <p className="text-xs text-muted-foreground">
                Your data will be exported as a JSON file. This process may take a few minutes for large datasets.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Data Management Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-6">Data Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Clear Cache</h4>
              <p className="text-sm text-muted-foreground">Remove temporary files and cached data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              loading={isLoading}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
            >
              Clear Cache
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-card-foreground">Data Backup</h4>
              <p className="text-sm text-muted-foreground">
                Last backup: {new Date(dataStats.lastBackup)?.toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Cloud"
              iconPosition="left"
              iconSize={16}
            >
              Backup Now
            </Button>
          </div>
        </div>
      </div>
      {/* Account Deletion */}
      <div className="bg-card rounded-lg border border-error p-6">
        <div className="flex items-start space-x-3 mb-6">
          <Icon name="AlertTriangle" size={24} className="text-error mt-1" />
          <div>
            <h3 className="text-lg font-medium text-error">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
          >
            Delete My Account
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
              <h4 className="font-medium text-error mb-2">Confirm Account Deletion</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• All your personal data will be permanently deleted</li>
                <li>• Your travel history and preferences will be lost</li>
                <li>• You will lose access to saved routes and favorites</li>
                <li>• This action cannot be reversed</li>
              </ul>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-card-foreground">
                  Type "DELETE MY ACCOUNT" to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmation('');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                loading={isLoading}
                disabled={deleteConfirmation !== 'DELETE MY ACCOUNT'}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Delete Account Permanently
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;