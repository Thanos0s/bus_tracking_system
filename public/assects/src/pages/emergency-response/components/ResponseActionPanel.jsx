import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ResponseActionPanel = ({ selectedAlert, onAction, onClose }) => {
  const [activeTab, setActiveTab] = useState('communicate');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'communicate', label: 'Communicate', icon: 'MessageSquare' },
    { id: 'coordinate', label: 'Coordinate', icon: 'Users' },
    { id: 'document', label: 'Document', icon: 'FileText' }
  ];

  const handleQuickAction = async (actionType) => {
    setIsLoading(true);
    try {
      await onAction(selectedAlert?.id, actionType);
      // Show success feedback
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message?.trim()) return;
    
    setIsLoading(true);
    try {
      await onAction(selectedAlert?.id, 'send_message', { message });
      setMessage('');
      // Show success feedback
    } catch (error) {
      console.error('Message failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedAlert) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="AlertTriangle" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-card-foreground mb-2">No Alert Selected</h3>
        <p className="text-muted-foreground">Select an emergency alert to view response options</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">Response Actions</h3>
            <p className="text-sm text-muted-foreground">
              Bus {selectedAlert?.busId} • {selectedAlert?.type?.replace('_', ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <h4 className="font-medium text-sm text-card-foreground mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleQuickAction('call_driver')}
            loading={isLoading}
            iconName="Phone"
            iconPosition="left"
          >
            Call Driver
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('emergency_services')}
            loading={isLoading}
            iconName="Truck"
            iconPosition="left"
          >
            Emergency Services
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('dispatch_backup')}
            loading={isLoading}
            iconName="Bus"
            iconPosition="left"
          >
            Dispatch Backup
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('notify_passengers')}
            loading={isLoading}
            iconName="Users"
            iconPosition="left"
          >
            Notify Passengers
          </Button>
        </div>
      </div>
      {/* Tabbed Interface */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'communicate' && (
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-sm text-card-foreground mb-2">Send Message</h5>
              <Input
                type="text"
                placeholder="Type your message to the driver..."
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
                className="mb-2"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!message?.trim()}
                iconName="Send"
                iconPosition="left"
                fullWidth
              >
                Send Message
              </Button>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-card-foreground mb-2">Quick Messages</h5>
              <div className="space-y-2">
                {[
                  'Emergency services are on the way',
                  'Please remain calm and follow safety protocols',
                  'Backup bus has been dispatched',
                  'Contact control room immediately'
                ]?.map((quickMessage, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(quickMessage)}
                    className="w-full text-left p-2 text-sm text-muted-foreground hover:text-card-foreground hover:bg-muted/50 rounded border border-border transition-colors"
                  >
                    {quickMessage}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coordinate' && (
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-sm text-card-foreground mb-2">Emergency Services</h5>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('call_police')}
                  loading={isLoading}
                  iconName="Shield"
                  iconPosition="left"
                  fullWidth
                >
                  Contact Police (100)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('call_ambulance')}
                  loading={isLoading}
                  iconName="Heart"
                  iconPosition="left"
                  fullWidth
                >
                  Call Ambulance (108)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('call_fire')}
                  loading={isLoading}
                  iconName="Flame"
                  iconPosition="left"
                  fullWidth
                >
                  Fire Department (101)
                </Button>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-card-foreground mb-2">Transport Authority</h5>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('notify_supervisor')}
                  loading={isLoading}
                  iconName="User"
                  iconPosition="left"
                  fullWidth
                >
                  Notify Supervisor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('dispatch_maintenance')}
                  loading={isLoading}
                  iconName="Wrench"
                  iconPosition="left"
                  fullWidth
                >
                  Dispatch Maintenance
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'document' && (
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-sm text-card-foreground mb-2">Incident Report</h5>
              <Input
                type="text"
                placeholder="Add notes about the incident..."
                className="mb-2"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                fullWidth
              >
                Generate Report
              </Button>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-card-foreground mb-2">Evidence Collection</h5>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Camera"
                  iconPosition="left"
                  fullWidth
                >
                  Request Photos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mic"
                  iconPosition="left"
                  fullWidth
                >
                  Record Statement
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Status Update */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Last updated: {new Date()?.toLocaleTimeString()}
          </span>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleQuickAction('resolve')}
            loading={isLoading}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Mark Resolved
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResponseActionPanel;