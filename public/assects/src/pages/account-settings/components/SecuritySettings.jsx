import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ securityData, onSecurityUpdate }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securityData?.twoFactorEnabled);

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Chandigarh, Punjab',
      lastActive: '2025-01-23 14:30:00',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'Mobile App on Android',
      location: 'Chandigarh, Punjab',
      lastActive: '2025-01-23 12:15:00',
      current: false,
      ip: '192.168.1.101'
    },
    {
      id: 3,
      device: 'Safari on iPhone',
      location: 'Mohali, Punjab',
      lastActive: '2025-01-22 18:45:00',
      current: false,
      ip: '192.168.1.102'
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (passwordErrors?.[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm?.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm?.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm?.newPassword?.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordForm?.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      onSecurityUpdate({ ...securityData, lastPasswordChange: new Date()?.toISOString() });
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTwoFactorEnabled(enabled);
      onSecurityUpdate({ ...securityData, twoFactorEnabled: enabled });
    } catch (error) {
      console.error('Failed to update 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Handle session logout
    } catch (error) {
      console.error('Failed to logout session:', error);
    }
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Active now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Password & Security</h2>
            <p className="text-sm text-muted-foreground">
              Last changed: {new Date(securityData.lastPasswordChange)?.toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangePassword(!showChangePassword)}
            iconName="Key"
            iconPosition="left"
            iconSize={16}
          >
            Change Password
          </Button>
        </div>

        {showChangePassword && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm?.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
              error={passwordErrors?.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordForm?.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
              error={passwordErrors?.newPassword}
              description="Must be at least 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm?.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
              error={passwordErrors?.confirmPassword}
              required
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordErrors({});
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handlePasswordSubmit}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-card-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`status-dot ${twoFactorEnabled ? 'bg-success' : 'bg-muted-foreground'}`}></div>
            <span className="text-sm text-muted-foreground">
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Checkbox
              checked={twoFactorEnabled}
              onChange={(e) => handleTwoFactorToggle(e?.target?.checked)}
              disabled={isLoading}
            />
          </div>
        </div>

        {twoFactorEnabled && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={20} className="text-success" />
              <div>
                <p className="text-sm font-medium text-success">Two-Factor Authentication is Active</p>
                <p className="text-xs text-muted-foreground">
                  Your account is protected with SMS verification
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Active Sessions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-card-foreground">Active Sessions</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Icon 
                    name={session?.device?.includes('Mobile') ? 'Smartphone' : 'Monitor'} 
                    size={20} 
                    className="text-muted-foreground" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-card-foreground">{session?.device}</h4>
                    {session?.current && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session?.location}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatLastActive(session?.lastActive)} • {session?.ip}
                  </p>
                </div>
              </div>

              {!session?.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogoutSession(session?.id)}
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={14}
                >
                  Sign Out
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Security Tip</p>
              <p className="text-xs text-muted-foreground">
                If you see any suspicious activity, sign out all sessions and change your password immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;