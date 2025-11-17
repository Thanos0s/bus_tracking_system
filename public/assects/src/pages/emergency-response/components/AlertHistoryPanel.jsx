import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';

const AlertHistoryPanel = ({ alerts, onViewAlert, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const filteredAlerts = alerts?.filter(alert => {
      const matchesSearch = alert?.busId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           alert?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           alert?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesFilter = filterStatus === 'all' || alert?.status === filterStatus;
      return matchesSearch && matchesFilter;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'priority':
          const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
          return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
        case 'responseTime':
          return (b?.responseTimeMinutes || 0) - (a?.responseTimeMinutes || 0);
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return 'CheckCircle';
      case 'responding': return 'Clock';
      case 'active': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-success';
      case 'responding': return 'text-warning';
      case 'active': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'Ongoing';
    const diffMs = new Date(endTime) - new Date(startTime);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date?.toDateString() === now?.toDateString();
    
    if (isToday) {
      return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date?.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="History" size={20} className="text-primary" />
            <h3 className="font-semibold text-card-foreground">Alert History</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredAlerts?.length} of {alerts?.length} alerts
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by bus ID, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="responding">Responding</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
            >
              <option value="timestamp">Latest First</option>
              <option value="priority">Priority</option>
              <option value="responseTime">Response Time</option>
            </select>
          </div>
        </div>
      </div>
      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-card-foreground mb-2">No Alerts Found</h4>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'No emergency alerts in history'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onViewAlert(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon
                        name={getStatusIcon(alert?.status)}
                        size={16}
                        className={getStatusColor(alert?.status)}
                      />
                      <h4 className="font-medium text-sm text-card-foreground">
                        Bus {alert?.busId} • {alert?.type?.replace('_', ' ')?.toUpperCase()}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert?.priority)} bg-current/10`}>
                        {alert?.priority?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="block">Location</span>
                        <span className="font-medium text-card-foreground">{alert?.location}</span>
                      </div>
                      <div>
                        <span className="block">Time</span>
                        <span className="font-medium text-card-foreground">{formatTimestamp(alert?.timestamp)}</span>
                      </div>
                      <div>
                        <span className="block">Duration</span>
                        <span className="font-medium text-card-foreground">
                          {formatDuration(alert?.timestamp, alert?.resolvedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="block">Passengers</span>
                        <span className="font-medium text-card-foreground">{alert?.passengerCount}</span>
                      </div>
                    </div>

                    {alert?.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {alert?.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {alert?.responseTimeMinutes && (
                      <div className="text-xs text-center">
                        <div className="text-muted-foreground">Response</div>
                        <div className="font-medium text-card-foreground">{alert?.responseTimeMinutes}m</div>
                      </div>
                    )}
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Summary Stats */}
      {alerts?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-success">
                {alerts?.filter(a => a?.status === 'resolved')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warning">
                {alerts?.filter(a => a?.status === 'responding')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Responding</div>
            </div>
            <div>
              <div className="text-lg font-bold text-error">
                {alerts?.filter(a => a?.status === 'active')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertHistoryPanel;