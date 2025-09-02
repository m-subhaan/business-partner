'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  ExclamationTriangleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import MetricsOverview from './dashboard/MetricsOverview'
import DailySchedule from './dashboard/DailySchedule'
import AlertsPanel from './dashboard/AlertsPanel'
import ConversationInterface from './conversation/ConversationInterface'
import CustomerContextPanel from './customer/CustomerContextPanel'
import ProactiveRecommendations from './recommendations/ProactiveRecommendations'
import AnalyticsView from './analytics/AnalyticsView'
import MCPStatus from './integrations/MCPStatus'

type ViewType = 'dashboard' | 'conversation' | 'customer' | 'recommendations' | 'analytics' | 'settings'

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [unreadAlerts, setUnreadAlerts] = useState(3)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'conversation', label: 'Claude Chat', icon: ChatBubbleLeftRightIcon },
    { id: 'customer', label: 'Customer Context', icon: CalendarDaysIcon },
    { id: 'recommendations', label: 'Recommendations', icon: ExclamationTriangleIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MetricsOverview />
              </div>
              <div>
                <AlertsPanel />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DailySchedule onCustomerSelect={setSelectedCustomerId} />
              <ProactiveRecommendations />
            </div>
          </div>
        )
      case 'conversation':
        return <ConversationInterface />
      case 'customer':
        return <CustomerContextPanel customerId={selectedCustomerId} />
      case 'recommendations':
        return <ProactiveRecommendations expanded />
      case 'analytics':
        return <AnalyticsView />
      case 'settings':
        return <MCPStatus />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Claude Business Partner</h1>
              <p className="text-xs text-gray-500">Intelligent Business Hub</p>
            </div>
          </div>
        </div>

        <nav className="px-3 pb-6">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id as ViewType)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeView === item.id
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {item.id === 'conversation' && unreadAlerts > 0 && (
                      <span className="ml-auto bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadAlerts}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Quick Status */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">System Status</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeView === 'conversation' ? 'Claude Chat' : activeView}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <BellIcon className="w-6 h-6" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadAlerts}
                  </span>
                )}
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0">
          {activeView === 'conversation' ? (
            <div className="h-full">
              {renderContent()}
            </div>
          ) : (
            <div className="overflow-y-auto p-6 h-full">
              {renderContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}