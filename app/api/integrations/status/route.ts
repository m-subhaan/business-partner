import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '../../../../lib/mcp-client'

const mcpClient = new MCPClient()

export async function GET() {
  try {
    const status = await mcpClient.getIntegrationStatus()
    
    return NextResponse.json({
      success: true,
      integrations: [
        {
          id: 'quickbooks',
          name: 'QuickBooks',
          type: 'quickbooks',
          status: status.quickbooks.status,
          lastSync: status.quickbooks.lastSync,
          errorMessage: status.quickbooks.error
        },
        {
          id: 'housecall-pro',
          name: 'HouseCall Pro',
          type: 'housecall-pro',
          status: status['housecall-pro'].status,
          lastSync: status['housecall-pro'].lastSync,
          errorMessage: status['housecall-pro'].error
        },
        {
          id: 'gmail',
          name: 'Gmail',
          type: 'gmail',
          status: status.gmail.status,
          lastSync: status.gmail.lastSync,
          errorMessage: status.gmail.error
        },
        {
          id: 'sms',
          name: 'SMS Service',
          type: 'sms',
          status: status.sms.status,
          lastSync: status.sms.lastSync,
          errorMessage: status.sms.error
        }
      ]
    })
  } catch (error) {
    console.error('Integration status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get integration status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { integrationId, action } = await request.json()

    if (action === 'refresh') {
      // Force refresh of specific integration
      await mcpClient.initialize()
      const status = await mcpClient.getIntegrationStatus()
      
      return NextResponse.json({
        success: true,
        integration: {
          id: integrationId,
          status: status[integrationId as keyof typeof status]?.status || 'error',
          lastSync: new Date().toISOString(),
          errorMessage: status[integrationId as keyof typeof status]?.error || null
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Integration action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform integration action' },
      { status: 500 }
    )
  }
}