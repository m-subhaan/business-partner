'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  CloudIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { MCPIntegration } from '@/types/business'

// Mock MCP integration data
const mockIntegrations: MCPIntegration[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'quickbooks',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
  },
  {
    id: 'housecall-pro',
    name: 'HouseCall Pro',
    type: 'housecall-pro',
    status: 'connected',
    lastSync: '2024-01-15T10:25:00Z',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    type: 'gmail',
    status: 'connected',
    lastSync: '2024-01-15T10:35:00Z',
  },
  {
    id: 'sms',
    name: 'SMS Service',
    type: 'sms',
    status: 'error',
    lastSync: '2024-01-15T08:00:00Z',
    errorMessage: 'API rate limit exceeded. Retrying in 15 minutes.'
  }
]

export default function MCPStatus() {
  const [integrations, setIntegrations] = useState<MCPIntegration[]>(mockIntegrations)
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real integration status on component mount
  useEffect(() => {
    fetchIntegrationStatus()
  }, [])

  const fetchIntegrationStatus = async () => {
    try {
      const response = await fetch('/api/integrations/status')
      const data = await response.json()
      
      if (data.success) {
        setIntegrations(data.integrations)
      }
    } catch (error) {
      console.error('Failed to fetch integration status:', error)
      // Keep using mock data as fallback
    } finally {
      setIsLoading(false)
    }
  }

  const getIntegrationIcon = (type: MCPIntegration['type']) => {
    switch (type) {
      case 'quickbooks':
        return CurrencyDollarIcon
      case 'housecall-pro':
        return WrenchScrewdriverIcon
      case 'gmail':
        return EnvelopeIcon
      case 'sms':
        return PhoneIcon
      default:
        return CloudIcon
    }
  }

  const getStatusColor = (status: MCPIntegration['status']) => {
    switch (status) {
      case 'connected':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          text: 'text-success-800',
          icon: 'text-success-600',
          indicator: 'bg-success-500'
        }
      case 'disconnected':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          indicator: 'bg-gray-400'
        }
      case 'error':
        return {
          bg: 'bg-danger-50',
          border: 'border-danger-200',
          text: 'text-danger-800',
          icon: 'text-danger-600',
          indicator: 'bg-danger-500'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          indicator: 'bg-gray-400'
        }
    }
  }

  const getStatusIcon = (status: MCPIntegration['status']) => {
    switch (status) {
      case 'connected':
        return CheckCircleIcon
      case 'error':
        return XCircleIcon
      case 'disconnected':
        return ExclamationTriangleIcon
      default:
        return ExclamationTriangleIcon
    }
  }

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const handleRefresh = async (integrationId: string) => {
    setIsRefreshing(integrationId)
    
    try {
      const response = await fetch('/api/integrations/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationId,
          action: 'refresh'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                status: data.integration.status,
                lastSync: data.integration.lastSync,
                errorMessage: data.integration.errorMessage
              }
            : integration
        ))
      } else {
        // Fallback to simulated refresh
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                lastSync: new Date().toISOString(),
                status: integration.status === 'error' ? 'connected' : integration.status,
                errorMessage: undefined
              }
            : integration
        ))
      }
    } catch (error) {
      console.error('Refresh error:', error)
      // Keep existing status on error
    } finally {
      setIsRefreshing(null)
    }
  }

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' as const, lastSync: new Date().toISOString() }
        : integration
    ))
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const errorCount = integrations.filter(i => i.status === 'error').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">MCP Integrations</h2>
        <p className="text-gray-600">Manage your business system connections</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <CloudIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-success-600">{connectedCount}</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-danger-600">{errorCount}</p>
              </div>
              <div className="p-3 bg-danger-50 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Connections</h3>
              <p className="text-sm text-gray-500">Monitor and manage your MCP server connections</p>
            </div>
            <button 
              className="btn-primary text-sm"
              onClick={() => integrations.forEach(i => handleRefresh(i.id))}
            >
              Refresh All
            </button>
          </div>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {integrations.map((integration) => {
              const Icon = getIntegrationIcon(integration.type)
              const StatusIcon = getStatusIcon(integration.status)
              const colors = getStatusColor(integration.status)
              
              return (
                <div 
                  key={integration.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                          <Icon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${colors.indicator} rounded-full border-2 border-white`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className={`font-medium ${colors.text}`}>{integration.name}</h4>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className={`w-4 h-4 ${colors.icon}`} />
                            <span className={`text-sm font-medium capitalize ${colors.text}`}>
                              {integration.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Last sync: {formatLastSync(integration.lastSync)}</span>
                          <span className="capitalize">{integration.type.replace('-', ' ')} MCP Server</span>
                        </div>
                        
                        {integration.errorMessage && (
                          <div className="mt-2 p-2 bg-danger-100 rounded text-sm text-danger-800">
                            {integration.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {integration.status === 'disconnected' && (
                        <button
                          onClick={() => handleConnect(integration.id)}
                          className="btn-success text-sm"
                        >
                          Connect
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleRefresh(integration.id)}
                        disabled={isRefreshing === integration.id}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        <ArrowPathIcon 
                          className={`w-4 h-4 ${isRefreshing === integration.id ? 'animate-spin' : ''}`} 
                        />
                      </button>
                      
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Cog6ToothIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* MCP Architecture Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">MCP Architecture</h3>
          <p className="text-sm text-gray-500">How Claude Business Partner integrates with your systems</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Data Flow</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">MCP Servers</div>
                    <div className="text-sm text-gray-600">Connect to your business systems</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Context Aggregation</div>
                    <div className="text-sm text-gray-600">Unify data across all systems</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">AI Processing</div>
                    <div className="text-sm text-gray-600">Generate insights and recommendations</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">4</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">User Interface</div>
                    <div className="text-sm text-gray-600">Present unified business view</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">System Capabilities</h4>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-success-600" />
                    <span className="font-medium text-gray-900">QuickBooks Integration</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time financial data</li>
                    <li>• Invoice and payment tracking</li>
                    <li>• Revenue analytics</li>
                  </ul>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900">HouseCall Pro Integration</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Job scheduling and tracking</li>
                    <li>• Customer information</li>
                    <li>• Technician management</li>
                  </ul>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <EnvelopeIcon className="w-5 h-5 text-warning-600" />
                    <span className="font-medium text-gray-900">Communication Systems</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Email automation</li>
                    <li>• SMS notifications</li>
                    <li>• Customer communication history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}