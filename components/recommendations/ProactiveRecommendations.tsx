'use client'

import { useState } from 'react'
import { 
  LightBulbIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  CloudIcon
} from '@heroicons/react/24/outline'
import { Recommendation } from '@/types/business'

interface ProactiveRecommendationsProps {
  expanded?: boolean
}

// Mock recommendations data
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'scheduling',
    priority: 'high',
    title: 'Route Optimization Opportunity',
    description: 'Your current route has you driving 45 miles between jobs today. I can optimize this to save 2 hours and reduce fuel costs by $15.',
    impact: 'Save 2 hours, reduce costs by $15',
    confidence: 92,
    actions: [
      { id: 'optimize', label: 'Optimize Route', type: 'accept' },
      { id: 'review', label: 'Review Changes', type: 'modify' },
      { id: 'dismiss', label: 'Keep Current', type: 'reject' }
    ]
  },
  {
    id: '2',
    type: 'customer',
    priority: 'high',
    title: 'Warranty Renewal Opportunities',
    description: '3 customers have warranties expiring this month. Historical data shows 85% renewal rate when contacted 2 weeks in advance.',
    impact: 'Potential $2,100 additional revenue',
    confidence: 85,
    actions: [
      { id: 'send-reminders', label: 'Send Reminders', type: 'accept' },
      { id: 'customize', label: 'Customize Messages', type: 'modify' },
      { id: 'later', label: 'Remind Later', type: 'reject' }
    ]
  },
  {
    id: '3',
    type: 'pricing',
    priority: 'medium',
    title: 'Price Adjustment Suggestion',
    description: 'Your HVAC maintenance pricing is 12% below market average. Similar businesses in your area charge $425 vs your $350.',
    impact: 'Increase revenue by 18% on maintenance jobs',
    confidence: 78,
    actions: [
      { id: 'adjust-pricing', label: 'Adjust Pricing', type: 'accept' },
      { id: 'analyze-more', label: 'More Analysis', type: 'modify' },
      { id: 'keep-current', label: 'Keep Current', type: 'reject' }
    ]
  },
  {
    id: '4',
    type: 'team',
    priority: 'medium',
    title: 'Workload Distribution Alert',
    description: 'Mike Rodriguez has worked 52 hours this week while Lisa Chen has 28 hours. Consider redistributing Thursday\'s jobs.',
    impact: 'Improve team balance and prevent burnout',
    confidence: 95,
    actions: [
      { id: 'redistribute', label: 'Redistribute Jobs', type: 'accept' },
      { id: 'review-schedule', label: 'Review Schedule', type: 'modify' },
      { id: 'monitor', label: 'Continue Monitoring', type: 'reject' }
    ]
  },
  {
    id: '5',
    type: 'inventory',
    priority: 'low',
    title: 'Parts Inventory Optimization',
    description: 'You\'re carrying $1,200 in slow-moving inventory. Consider returning or using these parts for upcoming jobs.',
    impact: 'Free up $1,200 in working capital',
    confidence: 68,
    actions: [
      { id: 'optimize-inventory', label: 'Optimize Now', type: 'accept' },
      { id: 'review-parts', label: 'Review Parts List', type: 'modify' },
      { id: 'keep-monitoring', label: 'Keep Monitoring', type: 'reject' }
    ]
  },
  {
    id: '6',
    type: 'scheduling',
    priority: 'high',
    title: 'Weather-Based Scheduling',
    description: 'Heavy rain expected Wednesday. 4 outdoor jobs scheduled may need indoor alternatives or rescheduling.',
    impact: 'Prevent job cancellations and maintain revenue',
    confidence: 88,
    actions: [
      { id: 'reschedule-outdoor', label: 'Reschedule Outdoor Jobs', type: 'accept' },
      { id: 'contact-customers', label: 'Contact Customers First', type: 'modify' },
      { id: 'monitor-weather', label: 'Monitor Weather', type: 'reject' }
    ]
  }
]

export default function ProactiveRecommendations({ expanded = false }: ProactiveRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations)
  const [selectedFilter, setSelectedFilter] = useState<'all' | Recommendation['type']>('all')

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'scheduling':
        return CalendarDaysIcon
      case 'pricing':
        return CurrencyDollarIcon
      case 'customer':
        return UserGroupIcon
      case 'inventory':
        return CubeIcon
      case 'team':
        return UsersIcon
      default:
        return LightBulbIcon
    }
  }

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-50 border-danger-200'
      case 'medium':
        return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'low':
        return 'text-primary-600 bg-primary-50 border-primary-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleAction = (recommendationId: string, actionId: string, actionType: 'accept' | 'reject' | 'modify') => {
    if (actionType === 'accept') {
      // Simulate accepting the recommendation
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId))
      console.log(`Accepted recommendation ${recommendationId} with action ${actionId}`)
    } else if (actionType === 'reject') {
      // Simulate rejecting the recommendation
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId))
      console.log(`Rejected recommendation ${recommendationId}`)
    } else {
      // Simulate modifying - for now just log
      console.log(`Modifying recommendation ${recommendationId} with action ${actionId}`)
    }
  }

  const filteredRecommendations = selectedFilter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === selectedFilter)

  const displayedRecommendations = expanded ? filteredRecommendations : filteredRecommendations.slice(0, 3)

  const filters = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'scheduling', label: 'Scheduling' },
    { id: 'customer', label: 'Customer' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'team', label: 'Team' },
    { id: 'inventory', label: 'Inventory' }
  ]

  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length
  const totalImpactValue = recommendations.reduce((sum, r) => {
    const match = r.impact.match(/\$(\d+(?:,\d+)*)/);
    return match ? sum + parseInt(match[1].replace(',', '')) : sum;
  }, 0)

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Proactive Recommendations</h3>
            <p className="text-sm text-gray-500">
              AI-powered insights for business optimization
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {highPriorityCount > 0 && (
              <span className="status-indicator status-danger">
                {highPriorityCount} high priority
              </span>
            )}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{recommendations.length}</div>
              <div className="text-xs text-gray-500">recommendations</div>
            </div>
          </div>
        </div>

        {/* Filters - only show in expanded view */}
        {expanded && (
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-3 py-1 text-sm font-medium rounded-lg whitespace-nowrap transition-colors duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filter.label}
                {filter.id !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({recommendations.filter(r => r.type === filter.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card-content">
        {/* Summary Stats - only show in expanded view */}
        {expanded && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
              <div className="text-sm text-gray-500">Active Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">${totalImpactValue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Potential Impact</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)}%
              </div>
              <div className="text-sm text-gray-500">Avg Confidence</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayedRecommendations.map((recommendation) => {
            const Icon = getRecommendationIcon(recommendation.type)
            const priorityClasses = getPriorityColor(recommendation.priority)
            
            return (
              <div 
                key={recommendation.id} 
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${priorityClasses}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {recommendation.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                          <span className="capitalize">{recommendation.type}</span>
                          <span>•</span>
                          <span className="capitalize">{recommendation.priority} priority</span>
                          <span>•</span>
                          <span>{recommendation.confidence}% confidence</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {recommendation.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1 text-sm text-success-700">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="font-medium">Impact:</span>
                      </div>
                      <span className="text-sm text-gray-600">{recommendation.impact}</span>
                    </div>

                    {/* Confidence Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Confidence Level</span>
                        <span>{recommendation.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${recommendation.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {recommendation.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleAction(recommendation.id, action.id, action.type)}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                            action.type === 'accept'
                              ? 'bg-success-600 hover:bg-success-700 text-white'
                              : action.type === 'modify'
                              ? 'bg-primary-600 hover:bg-primary-700 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!expanded && recommendations.length > 3 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <button className="btn-secondary text-sm">
              View All {recommendations.length} Recommendations
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button className="btn-primary text-sm">
              Accept All High Priority
            </button>
            <button className="btn-secondary text-sm">
              Customize Alerts
            </button>
            {expanded && (
              <button className="btn-secondary text-sm">
                Export Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}