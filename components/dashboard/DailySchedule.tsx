'use client'

import { 
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Job } from '@/types/business'

interface DailyScheduleProps {
  onCustomerSelect: (customerId: string) => void
}

// Mock data - in real app this would come from props or API
const mockJobs: Job[] = [
  {
    id: '1',
    customerId: 'cust-1',
    customerName: 'Sarah Johnson',
    title: 'HVAC Maintenance',
    description: 'Annual maintenance check for central AC unit',
    status: 'completed',
    priority: 'medium',
    scheduledDate: '2024-01-15T09:00:00Z',
    estimatedDuration: 120,
    estimatedValue: 350,
    actualValue: 375,
    technicianId: 'tech-1',
    technicianName: 'Mike Rodriguez',
    address: '123 Oak Street, Springfield',
    parts: [],
    notes: ['Customer very satisfied', 'Filter replaced']
  },
  {
    id: '2',
    customerId: 'cust-2',
    customerName: 'Robert Smith',
    title: 'Plumbing Repair',
    description: 'Kitchen sink leak repair',
    status: 'in-progress',
    priority: 'high',
    scheduledDate: '2024-01-15T11:30:00Z',
    estimatedDuration: 90,
    estimatedValue: 275,
    technicianId: 'tech-2',
    technicianName: 'Lisa Chen',
    address: '456 Pine Avenue, Springfield',
    parts: [
      { id: 'part-1', name: 'Pipe Joint', sku: 'PJ-001', quantity: 2, unitPrice: 15, inStock: true }
    ],
    notes: ['Urgent repair needed']
  },
  {
    id: '3',
    customerId: 'cust-3',
    customerName: 'Emily Davis',
    title: 'Electrical Installation',
    description: 'Install new outlet in garage',
    status: 'scheduled',
    priority: 'low',
    scheduledDate: '2024-01-15T14:00:00Z',
    estimatedDuration: 60,
    estimatedValue: 180,
    technicianId: 'tech-1',
    technicianName: 'Mike Rodriguez',
    address: '789 Elm Drive, Springfield',
    parts: [],
    notes: []
  },
  {
    id: '4',
    customerId: 'cust-4',
    customerName: 'Michael Wilson',
    title: 'Warranty Service',
    description: 'Follow-up on HVAC warranty claim',
    status: 'scheduled',
    priority: 'urgent',
    scheduledDate: '2024-01-15T16:00:00Z',
    estimatedDuration: 45,
    estimatedValue: 0,
    technicianId: 'tech-3',
    technicianName: 'David Park',
    address: '321 Maple Street, Springfield',
    parts: [],
    notes: ['Warranty expires next week', 'Customer called twice']
  }
]

export default function DailySchedule({ onCustomerSelect }: DailyScheduleProps) {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800'
      case 'in-progress':
        return 'bg-primary-100 text-primary-800'
      case 'scheduled':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-danger-100 text-danger-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Job['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-danger-600'
      case 'high':
        return 'text-warning-600'
      case 'medium':
        return 'text-primary-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const totalRevenue = mockJobs.reduce((sum, job) => sum + (job.actualValue || job.estimatedValue), 0)
  const completedJobs = mockJobs.filter(job => job.status === 'completed').length

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <p className="text-sm text-gray-500">{mockJobs.length} jobs • ${totalRevenue.toLocaleString()} revenue</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-lg font-semibold text-success-600">{completedJobs}/{mockJobs.length}</div>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {mockJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => onCustomerSelect(job.customerId)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      {job.priority === 'urgent' && (
                        <ExclamationTriangleIcon className="w-4 h-4 text-danger-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{job.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{job.address.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`status-indicator ${getStatusColor(job.status)}`}>
                    {job.status.replace('-', ' ')}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatTime(job.scheduledDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.estimatedDuration}min
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span>{job.technicianName}</span>
                  </div>
                  <div className={`text-sm font-medium ${getPriorityColor(job.priority)}`}>
                    {job.priority} priority
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <span>${job.actualValue || job.estimatedValue}</span>
                </div>
              </div>

              {job.notes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {job.notes.join(' • ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button className="btn-primary text-sm">
              Add Job
            </button>
            <button className="btn-secondary text-sm">
              View Calendar
            </button>
            <button className="btn-secondary text-sm">
              Route Optimizer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}