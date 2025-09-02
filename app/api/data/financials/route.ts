import { NextRequest, NextResponse } from 'next/server'
import { MCPClient } from '../../../../lib/mcp-client'

const mcpClient = new MCPClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'current_month'
    
    const financials = await mcpClient.getFinancialSummary()
    
    return NextResponse.json({
      success: true,
      financials,
      period
    })
  } catch (error) {
    console.error('Financials API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial data' },
      { status: 500 }
    )
  }
}