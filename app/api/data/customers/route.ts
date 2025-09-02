import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '../../../../lib/mcp-client'

const mcpClient = new MCPClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('id')
    
    if (customerId) {
      // Get specific customer details
      const customer = await getCustomerDetails(customerId)
      return NextResponse.json({
        success: true,
        customer
      })
    } else {
      // Get recent customers
      const customers = await mcpClient.getRecentCustomers()
      return NextResponse.json({
        success: true,
        customers
      })
    }
  } catch (error) {
    console.error('Customers API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

async function getCustomerDetails(customerId: string) {
  // This would integrate with HouseCall Pro MCP server to get detailed customer info
  await mcpClient.initialize()
  const hcpClient = mcpClient['clients'].get('housecall-pro')
  
  if (!hcpClient) {
    throw new Error('HouseCall Pro client not available')
  }

  try {
    const customer = await hcpClient.request({
      method: 'tools/call',
      params: {
        name: 'get_customer',
        arguments: { id: customerId }
      }
    }, {})

    const jobHistory = await hcpClient.request({
      method: 'tools/call',
      params: {
        name: 'get_customer_jobs',
        arguments: { customer_id: customerId }
      }
    }, {})

    return {
      ...customer.content,
      jobHistory: jobHistory.content
    }
  } catch (error) {
    console.error('Error fetching customer details:', error)
    throw error
  }
}