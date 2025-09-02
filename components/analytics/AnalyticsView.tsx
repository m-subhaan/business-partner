'use client'

import { useState } from 'react'
import { 
  ChartBarIcon,
  ArrowArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock analytics data
const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000, jobs: 120 },
  { month: 'Feb', revenue: 52000, target: 50000, jobs: 135 },
  { month: 'Mar', revenue: 48000, target: 50000, jobs: 128 },
  { month: 'Apr', revenue: 61000, target: 55000, jobs: 148 },
  { month: 'May', revenue: 58000, target: 55000, jobs: 142 },
  { month: 'Jun', revenue: 67000, target: 60000, jobs: 156 },
  { month: 'Jul', revenue: 71000, target: 60000, jobs: 165 },
  { month: 'Aug', revenue: 69000, target: 65000, jobs: 159 },
  { month: 'Sep', revenue: 73000, target: 65000, jobs: 168 },
  { month: 'Oct', revenue: 76000, target: 70000, jobs: 172 },
  { month: 'Nov', revenue: 74000, target: 70000, jobs: 169 },
  { month: 'Dec', revenue: 82000, target: 75000, jobs: 185 }
]

const dailyPerformanceData = [
  { day: 'Mon', revenue: 2400, jobs: 8, efficiency: 85 },
  { day: 'Tue', revenue: 3200, jobs: 10, efficiency: 92 },
  { day: 'Wed', revenue: 2800, jobs: 9, efficiency: 88 },
  { day: 'Thu', revenue: 3600, jobs: 12, efficiency: 95 },
  { day: 'Fri', revenue: 3100, jobs: 11, efficiency: 90 },
  { day: 'Sat', revenue: 2200, jobs: 7, efficiency: 82 },
  { day: 'Sun', revenue: 1800, jobs: 5, efficiency: 78 }
]

const serviceTypeData = [
  { name: 'HVAC', value: 45, revenue: 234000, color: '#0ea5e9' },
  { name: 'Plumbing', value: 28, revenue: 145000, color: '#22c55e' },
  { name: 'Electrical', value: 18, revenue: 98000, color: '#f59e0b' },
  { name: 'General Repair', value: 9, revenue: 52000, color: '#ef4444' }
]

const customerSatisfactionData = [
  { month: 'Jan', satisfaction: 4.2, reviews: 45 },
  { month: 'Feb', satisfaction: 4.3, reviews: 52 },
  { month: 'Mar', satisfaction: 4.1, reviews: 48 },
  { month: 'Apr', satisfaction: 4.5, reviews: 61 },
  { month: 'May', satisfaction: 4.4, reviews: 58 },
  { month: 'Jun', satisfaction: 4.6, reviews: 67 },
  { month: 'Jul', satisfaction: 4.7, reviews: 71 },
  { month: 'Aug', satisfaction: 4.6, reviews: 69 },
  { month: 'Sep', satisfaction: 4.8, reviews: 73 },
  { month: 'Oct', satisfaction: 4.7, reviews: 76 },
  { month: 'Nov', satisfaction: 4.8, reviews: 74 },
  { month: 'Dec', satisfaction: 4.9, reviews: 82 }
]

export default function AnalyticsView() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'jobs' | 'satisfaction' | 'efficiency'>('revenue')

  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ]

  const metrics = [
    { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
    { id: 'jobs', label: 'Jobs', icon: ChartBarIcon },
    { id: 'satisfaction', label: 'Satisfaction', icon: UserGroupIcon },
    { id: 'efficiency', label: 'Efficiency', icon: ClockIcon }
  ]

  // Calculate key insights
  const currentMonthRevenue = revenueData[revenueData.length - 1].revenue
  const previousMonthRevenue = revenueData[revenueData.length - 2].revenue
  const revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
  
  const avgSatisfaction = customerSatisfactionData[customerSatisfactionData.length - 1].satisfaction
  const totalRevenue = revenueData.reduce((sum, month) => sum + month.revenue, 0)
  const totalJobs = revenueData.reduce((sum, month) => sum + month.jobs, 0)
  const avgJobValue = Math.round(totalRevenue / totalJobs)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>
          <p className="text-gray-600">Advanced insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id as any)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selectedTimeframe === timeframe.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+{revenueGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{totalJobs.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+12%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last year</span>
                </div>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Job Value</p>
                <p className="text-2xl font-bold text-gray-900">${avgJobValue}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+8%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avgSatisfaction}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">+0.2</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <p className="text-sm text-gray-500">Monthly revenue vs targets</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  name="Actual Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Service Distribution</h3>
            <p className="text-sm text-gray-500">Revenue by service type</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {serviceTypeData.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm text-gray-600">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${service.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
            <p className="text-sm text-gray-500">Daily revenue and job count</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#0ea5e9" name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="jobs" fill="#22c55e" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
            <p className="text-sm text-gray-500">Monthly satisfaction ratings</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={customerSatisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <Tooltip formatter={(value) => [value, "Rating"]} />
                <Area 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#22c55e" 
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          <p className="text-sm text-gray-500">AI-powered business intelligence</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="flex items-center space-x-2 mb-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-success-600" />
                <h4 className="font-medium text-success-900">Revenue Growth</h4>
              </div>
              <p className="text-sm text-success-800">
                Your revenue has grown {revenueGrowth}% compared to last month, primarily driven by increased HVAC services during peak season.
              </p>
            </div>

            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                <h4 className="font-medium text-primary-900">Peak Performance</h4>
              </div>
              <p className="text-sm text-primary-800">
                Thursday is your most profitable day with 95% efficiency. Consider scheduling high-value jobs on Thursdays.
              </p>
            </div>

            <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
              <div className="flex items-center space-x-2 mb-2">
                <UserGroupIcon className="w-5 h-5 text-warning-600" />
                <h4 className="font-medium text-warning-900">Customer Retention</h4>
              </div>
              <p className="text-sm text-warning-800">
                Customer satisfaction is at an all-time high (4.9/5), but focus on converting one-time customers to maintenance plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}