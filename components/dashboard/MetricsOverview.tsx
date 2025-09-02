'use client'

import { 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { BusinessMetrics } from '@/types/business'

// Mock data - in real app this would come from props or API
const mockMetrics: BusinessMetrics = {
  dailyRevenue: 2400,
  dailyRevenueTarget: 3000,
  weeklyRevenue: 12500,
  monthlyRevenue: 47800,
  jobsToday: 6,
  jobsCompleted: 4,
  customerSatisfaction: 4.8,
  averageJobValue: 425,
  outstandingInvoices: 8,
  overduePayments: 2
}

export default function MetricsOverview() {
  const revenueProgress = (mockMetrics.dailyRevenue / mockMetrics.dailyRevenueTarget) * 100
  const jobsProgress = (mockMetrics.jobsCompleted / mockMetrics.jobsToday) * 100

  const metrics = [
    {
      title: 'Daily Revenue',
      value: `$${mockMetrics.dailyRevenue.toLocaleString()}`,
      target: `/ $${mockMetrics.dailyRevenueTarget.toLocaleString()}`,
      progress: revenueProgress,
      icon: CurrencyDollarIcon,
      color: revenueProgress >= 80 ? 'success' : revenueProgress >= 60 ? 'warning' : 'danger',
      trend: '+12%'
    },
    {
      title: 'Jobs Today',
      value: `${mockMetrics.jobsCompleted}`,
      target: `/ ${mockMetrics.jobsToday}`,
      progress: jobsProgress,
      icon: CalendarDaysIcon,
      color: jobsProgress >= 80 ? 'success' : jobsProgress >= 60 ? 'warning' : 'danger',
      trend: '+2'
    },
    {
      title: 'Customer Rating',
      value: mockMetrics.customerSatisfaction.toFixed(1),
      target: '/ 5.0',
      progress: (mockMetrics.customerSatisfaction / 5) * 100,
      icon: UserGroupIcon,
      color: 'success',
      trend: '+0.2'
    },
    {
      title: 'Avg Job Value',
      value: `$${mockMetrics.averageJobValue}`,
      target: '',
      progress: 85,
      icon: ArrowTrendingUpIcon,
      color: 'success',
      trend: '+8%'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          progress: 'bg-success-500'
        }
      case 'warning':
        return {
          bg: 'bg-warning-50',
          text: 'text-warning-700',
          progress: 'bg-warning-500'
        }
      case 'danger':
        return {
          bg: 'bg-danger-50',
          text: 'text-danger-700',
          progress: 'bg-danger-500'
        }
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          progress: 'bg-gray-500'
        }
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Today's Overview</h3>
        <p className="text-sm text-gray-500">Real-time business metrics</p>
      </div>
      <div className="card-content">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const colors = getColorClasses(metric.color)
            
            return (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {metric.trend}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    {metric.target && (
                      <span className="text-sm text-gray-500">{metric.target}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  {metric.progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${colors.progress}`}
                        style={{ width: `${Math.min(metric.progress, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${mockMetrics.weeklyRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${mockMetrics.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              {mockMetrics.overduePayments > 0 ? (
                <>
                  <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />
                  <span className="text-2xl font-bold text-warning-600">{mockMetrics.overduePayments}</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 text-success-600" />
                  <span className="text-2xl font-bold text-success-600">0</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  )
}