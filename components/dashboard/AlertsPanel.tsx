'use client'

import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Alert } from '@/types/business'

// Mock data - in real app this would come from props or API
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Warranty Expiring Soon',
    message: '3 customers have warranties expiring this month. Send renewal reminders?',
    timestamp: '2024-01-15T10:30:00Z',
    actionRequired: true,
    actions: [
      { id: 'send-reminders', label: 'Send Reminders', type: 'primary' },
      { id: 'dismiss', label: 'Dismiss', type: 'secondary' }
    ]
  },
  {
    id: '2',
    type: 'warning',
    title: 'Weather Alert',
    message: 'Rain expected tomorrow. 2 outdoor jobs may need rescheduling.',
    timestamp: '2024-01-15T09:15:00Z',
    actionRequired: true,
    actions: [
      { id: 'reschedule', label: 'Auto-Reschedule', type: 'primary' },
      { id: 'contact-customers', label: 'Contact Customers', type: 'secondary' }
    ]
  },
  {
    id: '3',
    type: 'info',
    title: 'Team Update',
    message: 'Mike Rodriguez has completed 50+ hours this week. Consider redistributing workload.',
    timestamp: '2024-01-15T08:45:00Z',
    actionRequired: false
  },
  {
    id: '4',
    type: 'success',
    title: 'Payment Received',
    message: 'Robert Smith paid outstanding invoice #1234 ($275)',
    timestamp: '2024-01-15T07:20:00Z',
    actionRequired: false
  }
]

export default function AlertsPanel() {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return XCircleIcon
      case 'warning':
        return ExclamationTriangleIcon
      case 'info':
        return InformationCircleIcon
      case 'success':
        return CheckCircleIcon
      default:
        return InformationCircleIcon
    }
  }

  const getAlertColors = (type: Alert['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-danger-50',
          border: 'border-danger-200',
          icon: 'text-danger-600',
          title: 'text-danger-900'
        }
      case 'warning':
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          icon: 'text-warning-600',
          title: 'text-warning-900'
        }
      case 'info':
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          icon: 'text-primary-600',
          title: 'text-primary-900'
        }
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          icon: 'text-success-600',
          title: 'text-success-900'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900'
        }
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const urgentAlerts = mockAlerts.filter(alert => alert.type === 'urgent').length
  const actionableAlerts = mockAlerts.filter(alert => alert.actionRequired).length

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Priority Alerts</h3>
            <p className="text-sm text-gray-500">{actionableAlerts} require attention</p>
          </div>
          {urgentAlerts > 0 && (
            <span className="status-indicator status-danger">
              {urgentAlerts} urgent
            </span>
          )}
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {mockAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type)
            const colors = getAlertColors(alert.type)
            
            return (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-sm`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium ${colors.title}`}>
                        {alert.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {alert.message}
                    </p>
                    
                    {alert.actions && alert.actions.length > 0 && (
                      <div className="flex space-x-2">
                        {alert.actions.map((action) => (
                          <button
                            key={action.id}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                              action.type === 'primary'
                                ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{mockAlerts.length}</div>
              <div className="text-sm text-gray-500">Total Alerts</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary-600">{actionableAlerts}</div>
              <div className="text-sm text-gray-500">Need Action</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="btn-primary text-sm flex-1">
              Handle All
            </button>
            <button className="btn-secondary text-sm flex-1">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}