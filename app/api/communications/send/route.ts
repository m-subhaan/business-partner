import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '../../../../lib/mcp-client'

const mcpClient = new MCPClient()

export async function POST(request: NextRequest) {
  try {
    const { type, to, subject, message, customerId } = await request.json()

    let result
    
    if (type === 'email') {
      result = await mcpClient.sendEmail(to, subject, message)
    } else if (type === 'sms') {
      result = await mcpClient.sendSMS(to, message)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid communication type' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      result,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Communication send error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send communication' },
      { status: 500 }
    )
  }
}