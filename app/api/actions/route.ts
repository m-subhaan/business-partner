import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '../../../lib/mcp-client'

const mcpClient = new MCPClient()

export async function POST(request: NextRequest) {
  try {
    const { action, parameters } = await request.json()

    let result

    switch (action) {
      case 'optimize-route':
        result = await optimizeRoute(parameters)
        break
      
      case 'send-payment-reminder':
        result = await sendPaymentReminder(parameters)
        break
      
      case 'schedule-follow-up':
        result = await scheduleFollowUp(parameters)
        break
      
      case 'update-customer-notes':
        result = await updateCustomerNotes(parameters)
        break
      
      case 'generate-invoice':
        result = await generateInvoice(parameters)
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Action API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to execute action' },
      { status: 500 }
    )
  }
}

async function optimizeRoute(parameters: any) {
  await mcpClient.initialize()
  const hcpClient = mcpClient['clients'].get('housecall-pro')
  
  if (!hcpClient) {
    throw new Error('HouseCall Pro client not available')
  }

  const result = await hcpClient.request({
    method: 'tools/call',
    params: {
      name: 'optimize_route',
      arguments: {
        date: parameters.date || new Date().toISOString().split('T')[0],
        technician_id: parameters.technicianId
      }
    }
  }, {})

  return result.content
}

async function sendPaymentReminder(parameters: any) {
  const { customerId, invoiceId, amount } = parameters
  
  // Get customer contact info
  const customer = await getCustomerInfo(customerId)
  
  // Send email reminder
  const emailResult = await mcpClient.sendEmail(
    customer.email,
    `Payment Reminder - Invoice ${invoiceId}`,
    `Dear ${customer.name},\n\nThis is a friendly reminder that your invoice ${invoiceId} for $${amount} is now due.\n\nPlease contact us if you have any questions.\n\nThank you!`
  )

  // Optionally send SMS if email fails or for urgent reminders
  let smsResult = null
  if (customer.phone && parameters.urgent) {
    smsResult = await mcpClient.sendSMS(
      customer.phone,
      `Payment reminder: Invoice ${invoiceId} for $${amount} is now due. Please contact us to arrange payment.`
    )
  }

  return { emailResult, smsResult }
}

async function scheduleFollowUp(parameters: any) {
  await mcpClient.initialize()
  const hcpClient = mcpClient['clients'].get('housecall-pro')
  
  if (!hcpClient) {
    throw new Error('HouseCall Pro client not available')
  }

  const result = await hcpClient.request({
    method: 'tools/call',
    params: {
      name: 'create_follow_up_task',
      arguments: {
        customer_id: parameters.customerId,
        description: parameters.description,
        due_date: parameters.dueDate,
        priority: parameters.priority || 'medium'
      }
    }
  }, {})

  return result.content
}

async function updateCustomerNotes(parameters: any) {
  await mcpClient.initialize()
  const hcpClient = mcpClient['clients'].get('housecall-pro')
  
  if (!hcpClient) {
    throw new Error('HouseCall Pro client not available')
  }

  const result = await hcpClient.request({
    method: 'tools/call',
    params: {
      name: 'update_customer_notes',
      arguments: {
        customer_id: parameters.customerId,
        notes: parameters.notes,
        append: parameters.append || true
      }
    }
  }, {})

  return result.content
}

async function generateInvoice(parameters: any) {
  await mcpClient.initialize()
  const qbClient = mcpClient['clients'].get('quickbooks')
  
  if (!qbClient) {
    throw new Error('QuickBooks client not available')
  }

  const result = await qbClient.request({
    method: 'tools/call',
    params: {
      name: 'create_invoice',
      arguments: {
        customer_id: parameters.customerId,
        line_items: parameters.lineItems,
        due_date: parameters.dueDate
      }
    }
  }, {})

  return result.content
}

async function getCustomerInfo(customerId: string) {
  await mcpClient.initialize()
  const hcpClient = mcpClient['clients'].get('housecall-pro')
  
  if (!hcpClient) {
    throw new Error('HouseCall Pro client not available')
  }

  const result = await hcpClient.request({
    method: 'tools/call',
    params: {
      name: 'get_customer',
      arguments: { id: customerId }
    }
  }, {})

  return result.content
}