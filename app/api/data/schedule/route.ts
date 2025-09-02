import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '../../../../lib/mcp-client'

const mcpClient = new MCPClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    const schedule = await mcpClient.getSchedule()
    
    return NextResponse.json({
      success: true,
      schedule,
      date
    })
  } catch (error) {
    console.error('Schedule API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}