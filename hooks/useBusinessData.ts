import { useState, useEffect } from 'react'

export interface BusinessData {
  schedule: any[]
  customers: any[]
  financials: any
  loading: boolean
  error: string | null
}

export function useBusinessData() {
  const [data, setData] = useState<BusinessData>({
    schedule: [],
    customers: [],
    financials: {},
    loading: true,
    error: null
  })

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))

      const [scheduleRes, customersRes, financialsRes] = await Promise.all([
        fetch('/api/data/schedule'),
        fetch('/api/data/customers'),
        fetch('/api/data/financials')
      ])

      const [scheduleData, customersData, financialsData] = await Promise.all([
        scheduleRes.json(),
        customersRes.json(),
        financialsRes.json()
      ])

      setData({
        schedule: scheduleData.success ? scheduleData.schedule : [],
        customers: customersData.success ? customersData.customers : [],
        financials: financialsData.success ? financialsData.financials : {},
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching business data:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch business data'
      }))
    }
  }

  const refreshData = () => {
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    ...data,
    refreshData
  }
}

export function useCustomerDetails(customerId: string | null) {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) {
      setCustomer(null)
      return
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/data/customers?id=${customerId}`)
        const data = await response.json()

        if (data.success) {
          setCustomer(data.customer)
        } else {
          setError('Failed to fetch customer details')
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
        setError('Failed to fetch customer details')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId])

  return { customer, loading, error }
}

export async function sendCommunication(type: 'email' | 'sms', to: string, subject?: string, message?: string) {
  try {
    const response = await fetch('/api/communications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        to,
        subject,
        message
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Communication error:', error)
    throw error
  }
}

export async function executeAction(action: string, parameters: any) {
  try {
    const response = await fetch('/api/actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        parameters
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Action execution error:', error)
    throw error
  }
}