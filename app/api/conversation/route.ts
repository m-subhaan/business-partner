import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { MCPClient } from '../../../lib/mcp-client'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const mcpClient = new MCPClient()

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    // Get business context from MCP servers, passing the current message for email detection
    const businessContext = await gatherBusinessContext(context, message)

    // Create system prompt with business context
    const systemPrompt = createSystemPrompt(businessContext)

    // Get Claude's response
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    })

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''

    // Generate contextual actions based on the response
    const actions = await generateContextualActions(message, assistantMessage, businessContext)

    return NextResponse.json({
      success: true,
      response: assistantMessage,
      actions,
      context: businessContext
    })

  } catch (error) {
    console.error('Conversation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}

async function gatherBusinessContext(requestContext?: any, currentMessage?: string) {
  try {
    // Check if this is an email-specific request - check both current message and context
    const userMessage = currentMessage || requestContext?.previousMessages?.[requestContext.previousMessages.length - 1]?.content || ''
    const isEmailRequest = userMessage.toLowerCase().includes('email') || userMessage.toLowerCase().includes('gmail')
    
    console.log('Email request detection:', { userMessage, isEmailRequest })
    
    let emailData = null
    if (isEmailRequest) {
      // Get more detailed email data for email requests
      const emailLimit = userMessage.match(/(\d+)/) ? parseInt(userMessage.match(/(\d+)/)[1]) : 5
      console.log('Fetching emails with limit:', emailLimit)
      emailData = await mcpClient.getEmails(emailLimit)
      console.log('Email data received:', emailData)
    }

    const [
      schedule,
      customers,
      financials,
      communications
    ] = await Promise.all([
      mcpClient.getSchedule(),
      mcpClient.getRecentCustomers(),
      mcpClient.getFinancialSummary(),
      emailData ? Promise.resolve({ emails: emailData.emails, sms: [], source: emailData.source }) : mcpClient.getRecentCommunications()
    ])

    console.log('Final communications data:', communications)

    return {
      schedule,
      customers,
      financials,
      communications,
      timestamp: new Date().toISOString(),
      requestContext,
      isEmailRequest
    }
  } catch (error) {
    console.error('Error gathering business context:', error)
    return {
      error: 'Unable to fetch complete business context',
      timestamp: new Date().toISOString()
    }
  }
}

function createSystemPrompt(businessContext: any) {
  const emailsInfo = businessContext.communications?.emails || []
  const dataSource = businessContext.communications?.source || 'unknown'
  
  let emailSection = ''
  if (businessContext.isEmailRequest && emailsInfo.length > 0) {
    emailSection = `

Recent Emails (${dataSource} data):
${emailsInfo.map((email: any, index: number) => `
${index + 1}. From: ${email.from}
   Subject: ${email.subject}
   Date: ${new Date(email.date).toLocaleString()}
   Status: ${email.unread ? 'Unread' : 'Read'}
   Preview: ${email.snippet}
   Email ID: ${email.id}
`).join('')}
`
  }

  return `You are Claude, an intelligent business partner for a service-based business. You have access to real-time business data and should provide helpful, actionable insights.

Current Business Context:
- Today's Schedule: ${JSON.stringify(businessContext.schedule, null, 2)}
- Recent Customers: ${JSON.stringify(businessContext.customers, null, 2)}
- Financial Summary: ${JSON.stringify(businessContext.financials, null, 2)}
- Recent Communications: ${JSON.stringify(businessContext.communications, null, 2)}
${emailSection}

Guidelines:
1. Be conversational and helpful
2. Provide specific, actionable recommendations
3. Reference real data from the business context
4. When showing emails, format them clearly with sender, subject, date, and status
5. For email requests, show the actual email data in a readable format
6. Suggest follow-up actions when appropriate
7. Prioritize urgent matters (overdue payments, warranty expirations, etc.)
8. Keep responses concise but informative
9. If showing mock data, mention this clearly to the user

${dataSource === 'mock' ? 'Note: Currently showing mock/demo data. In production, this would be your actual Gmail data.' : 'Note: This is live data from your Gmail account.'}

Always maintain a professional yet friendly tone as a trusted business advisor.`
}

async function generateContextualActions(userMessage: string, assistantResponse: string, businessContext: any) {
  const actions = []

  // Analyze the conversation to suggest relevant actions
  const lowerMessage = userMessage.toLowerCase()
  const lowerResponse = assistantResponse.toLowerCase()

  // Email-related actions
  if (lowerMessage.includes('email') || lowerMessage.includes('gmail')) {
    actions.push({
      id: 'mark-emails-read',
      label: 'Mark Unread as Read',
      type: 'button',
      action: 'mark-read'
    })
    
    actions.push({
      id: 'compose-email',
      label: 'Compose Reply',
      type: 'button',
      action: 'compose-email'
    })
    
    // Check if there are urgent emails
    const emails = businessContext.communications?.emails || []
    const urgentEmails = emails.filter((email: any) => 
      email.unread && (
        email.subject.toLowerCase().includes('urgent') || 
        email.snippet.toLowerCase().includes('urgent') ||
        email.subject.toLowerCase().includes('issue')
      )
    )
    
    if (urgentEmails.length > 0) {
      actions.push({
        id: 'respond-urgent',
        label: `Respond to ${urgentEmails.length} Urgent Email${urgentEmails.length > 1 ? 's' : ''}`,
        type: 'button',
        action: 'respond-urgent'
      })
    }
  }

  // Customer-related actions
  if (lowerMessage.includes('customer') || lowerResponse.includes('customer')) {
    actions.push({
      id: 'view-customer-details',
      label: 'View Customer Details',
      type: 'button',
      action: 'view-customer'
    })
  }

  // Schedule-related actions
  if (lowerMessage.includes('schedule') || lowerResponse.includes('appointment')) {
    actions.push({
      id: 'optimize-route',
      label: 'Optimize Route',
      type: 'button',
      action: 'optimize-route'
    })
  }

  // Financial actions
  if (lowerMessage.includes('payment') || lowerResponse.includes('invoice')) {
    actions.push({
      id: 'send-invoice-reminder',
      label: 'Send Payment Reminder',
      type: 'button',
      action: 'payment-reminder'
    })
  }

  return actions
}