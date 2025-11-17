import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyStats = ({ alerts, className = '' }) => {
  const calculateStats = () => {
    const total = alerts?.length;
    const active = alerts?.filter(a => a?.status === 'active')?.length;
    const responding = alerts?.filter(a => a?.status === 'responding')?.length;
    const resolved = alerts?.filter(a => a?.status === 'resolved')?.length;
    
    const critical = alerts?.filter(a => a?.priority === 'critical')?.length;
    const high = alerts?.filter(a => a?.priority === 'high')?.length;
    
    const avgResponseTime = alerts?.filter(a => a?.responseTimeMinutes)?.reduce((acc, a) => acc + a?.responseTimeMinutes, 0) / 
      alerts?.filter(a => a?.responseTimeMinutes)?.length || 0;

    const todayAlerts = alerts?.filter(a => {
      const alertDate = new Date(a.timestamp);
      const today = new Date();
      return alertDate?.toDateString() === today?.toDateString();
    })?.length;

    return {
      total,
      active,
      responding,
      resolved,
      critical,
      high,
      avgResponseTime: Math.round(avgResponseTime),
      todayAlerts
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      label: 'Active Alerts',
      value: stats?.active,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: stats?.todayAlerts > 0 ? `+${stats?.todayAlerts} today` : 'No new alerts'
    },
    {
      label: 'Responding',
      value: stats?.responding,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.responding > 0 ? 'In progress' : 'All clear'
    },
    {
      label: 'Resolved Today',
      value: stats?.resolved,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: `${Math.round((stats?.resolved / (stats?.total || 1)) * 100)}% success rate`
    },
    {
      label: 'Avg Response',
      value: stats?.avgResponseTime > 0 ? `${stats?.avgResponseTime}m` : 'N/A',
      icon: 'Timer',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats?.avgResponseTime > 0 ? 'Response time' : 'No data'
    }
  ];

  const priorityStats = [
    {
      label: 'Critical',
      count: stats?.critical,
      color: 'text-error',
      bgColor: 'bg-error'
    },
    {
      label: 'High',
      count: stats?.high,
      color: 'text-warning',
      bgColor: 'bg-warning'
    },
    {
      label: 'Medium',
      count: stats?.total - stats?.critical - stats?.high,
      color: 'text-primary',
      bgColor: 'bg-primary'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat?.label}</p>
                <p className="text-2xl font-bold text-card-foreground mt-1">{stat?.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat?.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Priority Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <span>Priority Breakdown</span>
        </h3>
        
        <div className="space-y-3">
          {priorityStats?.map((priority, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${priority?.bgColor}`}></div>
                <span className="text-sm text-card-foreground">{priority?.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-card-foreground">{priority?.count}</span>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${priority?.bgColor} transition-all duration-300`}
                    style={{ 
                      width: `${stats?.total > 0 ? (priority?.count / stats?.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Real-time Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-success" />
            <span>System Status</span>
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-success">
              {Math.round(((stats?.total - stats?.active) / (stats?.total || 1)) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">System Efficiency</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-primary">
              {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-muted-foreground">Last Updated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyStats;