'use client'

import { useState } from 'react'
import { 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { Customer, Job } from '@/types/business'

interface CustomerContextPanelProps {
  customerId?: string | null
}

// Mock customer data
const mockCustomers: Record<string, Customer & { jobs: Job[] }> = {
  'cust-1': {
    id: 'cust-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Oak Street, Springfield, IL 62701',
    rating: 5.0,
    totalJobs: 8,
    totalRevenue: 2850,
    lastServiceDate: '2024-01-15T09:00:00Z',
    paymentStatus: 'paid',
    warrantyExpiration: '2024-03-15',
    notes: [
      'Prefers morning appointments',
      'Has two HVAC units - main and guest house',
      'Always offers coffee to technicians',
      'Very satisfied with our service'
    ],
    tags: ['VIP', 'Referral Source', 'Maintenance Plan'],
    jobs: [
      {
        id: 'job-1',
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
        notes: ['Filter replaced', 'System running efficiently']
      }
    ]
  },
  'cust-4': {
    id: 'cust-4',
    name: 'Michael Wilson',
    email: 'mwilson@email.com',
    phone: '(555) 987-6543',
    address: '321 Maple Street, Springfield, IL 62702',
    rating: 4.2,
    totalJobs: 3,
    totalRevenue: 1250,
    lastServiceDate: '2023-12-10T14:00:00Z',
    paymentStatus: 'paid',
    warrantyExpiration: '2024-01-22',
    notes: [
      'Warranty expires next week',
      'Called twice about follow-up service',
      'Concerned about HVAC efficiency',
      'Prefers afternoon appointments'
    ],
    tags: ['Warranty Expiring', 'Follow-up Required'],
    jobs: [
      {
        id: 'job-4',
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
  }
}

export default function CustomerContextPanel({ customerId }: CustomerContextPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'history' | 'communication'>('overview')
  
  // If no customer selected, show search/recent customers
  if (!customerId) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Customer Context</h3>
          <p className="text-sm text-gray-500">Select a customer to view complete context</p>
        </div>
        <div className="card-content">
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Customer Selected</h4>
            <p className="text-gray-500 mb-6">Click on a customer from your schedule or search below</p>
            
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="mt-8">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Recent Customers</h5>
              <div className="space-y-2">
                {Object.values(mockCustomers).map((customer) => (
                  <button
                    key={customer.id}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const customer = mockCustomers[customerId]
  if (!customer) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Customer Not Found</h4>
            <p className="text-gray-500">The selected customer could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPaymentStatusColor = (status: Customer['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'status-success'
      case 'pending':
        return 'status-warning'
      case 'overdue':
        return 'status-danger'
      default:
        return 'status-info'
    }
  }

  const isWarrantyExpiring = customer.warrantyExpiration && 
    new Date(customer.warrantyExpiration) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Service History' },
    { id: 'communication', label: 'Communication' }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-xl font-semibold text-primary-700">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-gray-900">{customer.name}</h4>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-gray-600">
              <PhoneIcon className="w-4 h-4" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <EnvelopeIcon className="w-4 h-4" />
              <span className="text-sm">{customer.email}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 mt-1">
            <MapPinIcon className="w-4 h-4" />
            <span className="text-sm">{customer.address}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <StarIcon className="w-5 h-5 text-warning-500" />
            <span className="text-2xl font-bold text-gray-900">{customer.rating}</span>
          </div>
          <p className="text-sm text-gray-600">Customer Rating</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <WrenchScrewdriverIcon className="w-5 h-5 text-primary-500" />
            <span className="text-2xl font-bold text-gray-900">{customer.totalJobs}</span>
          </div>
          <p className="text-sm text-gray-600">Total Jobs</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="w-5 h-5 text-success-500" />
            <span className="text-2xl font-bold text-gray-900">${customer.totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-bold text-gray-900">{formatDate(customer.lastServiceDate)}</span>
          </div>
          <p className="text-sm text-gray-600">Last Service</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900">Payment Status</h5>
            <span className={`status-indicator ${getPaymentStatusColor(customer.paymentStatus)}`}>
              {customer.paymentStatus}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {customer.paymentStatus === 'paid' ? 'All payments up to date' : 
             customer.paymentStatus === 'pending' ? 'Payment processing' : 
             'Payment overdue - requires attention'}
          </p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900">Warranty Status</h5>
            {customer.warrantyExpiration ? (
              <span className={`status-indicator ${isWarrantyExpiring ? 'status-warning' : 'status-success'}`}>
                {isWarrantyExpiring ? 'Expiring Soon' : 'Active'}
              </span>
            ) : (
              <span className="status-indicator status-info">None</span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {customer.warrantyExpiration ? 
              `Expires ${formatDate(customer.warrantyExpiration)}` : 
              'No active warranty'}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h5 className="font-medium text-gray-900 mb-3">Customer Tags</h5>
        <div className="flex flex-wrap gap-2">
          {customer.tags.map((tag, index) => (
            <span key={index} className="status-indicator status-info">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <h5 className="font-medium text-gray-900 mb-3">Important Notes</h5>
        <div className="space-y-2">
          {customer.notes.map((note, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-4">
      <h5 className="font-medium text-gray-900">Service History</h5>
      {customer.jobs.map((job) => (
        <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h6 className="font-medium text-gray-900">{job.title}</h6>
              <p className="text-sm text-gray-600">{job.description}</p>
            </div>
            <span className={`status-indicator ${
              job.status === 'completed' ? 'status-success' :
              job.status === 'in-progress' ? 'status-info' :
              job.status === 'scheduled' ? 'status-warning' : 'status-danger'
            }`}>
              {job.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Date:</span> {formatDate(job.scheduledDate)}
            </div>
            <div>
              <span className="font-medium">Technician:</span> {job.technicianName}
            </div>
            <div>
              <span className="font-medium">Value:</span> ${job.actualValue || job.estimatedValue}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {job.estimatedDuration}min
            </div>
          </div>
          {job.notes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">{job.notes.join(' • ')}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderCommunication = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-900">Communication History</h5>
        <button className="btn-primary text-sm">
          Send Message
        </button>
      </div>
      <div className="text-center py-8">
        <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Communication history will appear here</p>
      </div>
    </div>
  )

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Customer Context</h3>
            <p className="text-sm text-gray-500">Complete customer information</p>
          </div>
          {isWarrantyExpiring && (
            <div className="flex items-center space-x-1 text-warning-600">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Warranty Expiring</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selectedTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="card-content">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'history' && renderHistory()}
        {selectedTab === 'communication' && renderCommunication()}
      </div>
    </div>
  )
}