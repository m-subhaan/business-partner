export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  rating: number
  totalJobs: number
  totalRevenue: number
  lastServiceDate: string
  paymentStatus: 'paid' | 'pending' | 'overdue'
  warrantyExpiration?: string
  notes: string[]
  tags: string[]
}

export interface Job {
  id: string
  customerId: string
  customerName: string
  title: string
  description: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledDate: string
  estimatedDuration: number
  estimatedValue: number
  actualValue?: number
  technicianId: string
  technicianName: string
  address: string
  coordinates?: { lat: number; lng: number }
  parts: Part[]
  notes: string[]
}

export interface Part {
  id: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  inStock: boolean
}

export interface Technician {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  currentLocation?: { lat: number; lng: number }
  availability: 'available' | 'busy' | 'off-duty'
  weeklyHours: number
  rating: number
}

export interface BusinessMetrics {
  dailyRevenue: number
  dailyRevenueTarget: number
  weeklyRevenue: number
  monthlyRevenue: number
  jobsToday: number
  jobsCompleted: number
  customerSatisfaction: number
  averageJobValue: number
  outstandingInvoices: number
  overduePayments: number
}

export interface Alert {
  id: string
  type: 'warning' | 'urgent' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  actionRequired: boolean
  actions?: AlertAction[]
}

export interface AlertAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
}

export interface WeatherForecast {
  date: string
  condition: string
  temperature: number
  precipitation: number
  impact: 'low' | 'medium' | 'high'
}

export interface Recommendation {
  id: string
  type: 'scheduling' | 'pricing' | 'customer' | 'inventory' | 'team'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  impact: string
  confidence: number
  actions: RecommendationAction[]
}

export interface RecommendationAction {
  id: string
  label: string
  type: 'accept' | 'reject' | 'modify'
}

export interface ConversationMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  context?: any
  actions?: MessageAction[]
}

export interface MessageAction {
  id: string
  label: string
  type: 'button' | 'link'
  action: string
}

export interface MCPIntegration {
  id: string
  name: string
  type: 'quickbooks' | 'housecall-pro' | 'gmail' | 'sms'
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  errorMessage?: string
}