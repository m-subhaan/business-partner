import { Client, StdioClientTransport } from './mcp-sdk-stub'

export class MCPClient {
  private clients: Map<string, Client> = new Map()
  private initialized = false

  async initialize() {
    if (this.initialized) return

    try {
      // Initialize QuickBooks MCP Server
      if (process.env.MCP_QUICKBOOKS_SERVER_PATH) {
        const qbTransport = new StdioClientTransport({
          command: 'node',
          args: [process.env.MCP_QUICKBOOKS_SERVER_PATH]
        })
        const qbClient = new Client({
          name: 'quickbooks-client',
          version: '1.0.0'
        }, {
          capabilities: {}
        })
        await qbClient.connect(qbTransport)
        this.clients.set('quickbooks', qbClient)
      }

      // Initialize HouseCall Pro MCP Server
      if (process.env.MCP_HOUSECALL_PRO_SERVER_PATH) {
        const hcpTransport = new StdioClientTransport({
          command: 'node',
          args: [process.env.MCP_HOUSECALL_PRO_SERVER_PATH]
        })
        const hcpClient = new Client({
          name: 'housecall-pro-client',
          version: '1.0.0'
        }, {
          capabilities: {}
        })
        await hcpClient.connect(hcpTransport)
        this.clients.set('housecall-pro', hcpClient)
      }

      // Initialize Gmail MCP Server
      if (process.env.MCP_GMAIL_SERVER_PATH) {
        const gmailTransport = new StdioClientTransport({
          command: 'node',
          args: [process.env.MCP_GMAIL_SERVER_PATH]
        })
        const gmailClient = new Client({
          name: 'gmail-client',
          version: '1.0.0'
        }, {
          capabilities: {}
        })
        await gmailClient.connect(gmailTransport)
        this.clients.set('gmail', gmailClient)
      }

      // Initialize SMS MCP Server
      if (process.env.MCP_SMS_SERVER_PATH) {
        const smsTransport = new StdioClientTransport({
          command: 'node',
          args: [process.env.MCP_SMS_SERVER_PATH]
        })
        const smsClient = new Client({
          name: 'sms-client',
          version: '1.0.0'
        }, {
          capabilities: {}
        })
        await smsClient.connect(smsTransport)
        this.clients.set('sms', smsClient)
      }

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize MCP clients:', error)
      throw error
    }
  }

  async getSchedule() {
    await this.initialize()
    const hcpClient = this.clients.get('housecall-pro')
    
    if (!hcpClient) {
      throw new Error('HouseCall Pro MCP client not available')
    }

    try {
      const result = await hcpClient.request({
        method: 'tools/call',
        params: {
          name: 'get_jobs',
          arguments: {
            date: new Date().toISOString().split('T')[0],
            status: 'scheduled'
          }
        }
      }, {})

      return result.content || []
    } catch (error) {
      console.error('Error fetching schedule:', error)
      return []
    }
  }

  async getRecentCustomers() {
    await this.initialize()
    const hcpClient = this.clients.get('housecall-pro')
    
    if (!hcpClient) {
      throw new Error('HouseCall Pro MCP client not available')
    }

    try {
      const result = await hcpClient.request({
        method: 'tools/call',
        params: {
          name: 'get_customers',
          arguments: {
            limit: 10,
            sort: 'updated_at',
            order: 'desc'
          }
        }
      }, {})

      return result.content || []
    } catch (error) {
      console.error('Error fetching customers:', error)
      return []
    }
  }

  async getFinancialSummary() {
    await this.initialize()
    const qbClient = this.clients.get('quickbooks')
    
    if (!qbClient) {
      throw new Error('QuickBooks MCP client not available')
    }

    try {
      const [revenue, invoices, expenses] = await Promise.all([
        qbClient.request({
          method: 'tools/call',
          params: {
            name: 'get_revenue_summary',
            arguments: {
              period: 'current_month'
            }
          }
        }, {}),
        qbClient.request({
          method: 'tools/call',
          params: {
            name: 'get_outstanding_invoices',
            arguments: {}
          }
        }, {}),
        qbClient.request({
          method: 'tools/call',
          params: {
            name: 'get_expenses_summary',
            arguments: {
              period: 'current_month'
            }
          }
        }, {})
      ])

      return {
        revenue: revenue.content,
        invoices: invoices.content,
        expenses: expenses.content
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
      return {}
    }
  }

  async getRecentCommunications() {
    await this.initialize()
    const gmailClient = this.clients.get('gmail')
    
    if (!gmailClient) {
      console.log('Gmail client not available, returning mock data')
      return { 
        emails: this.getMockEmails(),
        sms: [],
        source: 'mock'
      }
    }

    try {
      const emails = await gmailClient.request({
        method: 'tools/call',
        params: {
          name: 'get_recent_emails',
          arguments: {
            limit: 5,
            query: 'is:unread OR newer_than:1d'
          }
        }
      }, {})

      // Parse the actual email data from MCP response
      let emailData = []
      if (emails.content && emails.content[0] && emails.content[0].text) {
        try {
          const parsedData = JSON.parse(emails.content[0].text)
          emailData = parsedData.emails || []
        } catch (parseError) {
          console.error('Error parsing email data:', parseError)
          emailData = this.getMockEmails()
        }
      } else {
        emailData = this.getMockEmails()
      }

      return {
        emails: emailData,
        sms: [], // SMS would be handled by SMS MCP server
        source: emailData.length > 0 && !emailData[0].note ? 'real' : 'mock'
      }
    } catch (error) {
      console.error('Error fetching communications:', error)
      return { 
        emails: this.getMockEmails(),
        sms: [],
        source: 'mock'
      }
    }
  }

  async getEmails(limit = 5, query = 'is:unread OR newer_than:1d') {
    console.log('getEmails called with limit:', limit)
    
    // Always try to use mock data first until MCP servers are properly running
    let gmailClient = null
    
    try {
      await this.initialize()
      gmailClient = this.clients.get('gmail')
      console.log('Gmail client available after init:', !!gmailClient)
    } catch (initError) {
      console.log('MCP initialization failed, using mock data:', initError.message)
      gmailClient = null
    }
    
    // For now, force mock data since MCP servers aren't running
    if (!gmailClient || true) { // Force mock for development
      console.log('Using mock data (MCP servers not available)')
      const mockEmails = this.getMockEmails(limit)
      console.log('Mock emails generated:', mockEmails.length)
      return { 
        emails: mockEmails,
        source: 'mock'
      }
    }

    try {
      const emails = await gmailClient.request({
        method: 'tools/call',
        params: {
          name: 'get_recent_emails',
          arguments: {
            limit,
            query
          }
        }
      }, {})

      // Parse the actual email data from MCP response
      let emailData = []
      if (emails.content && emails.content[0] && emails.content[0].text) {
        try {
          const parsedData = JSON.parse(emails.content[0].text)
          emailData = parsedData.emails || []
        } catch (parseError) {
          console.error('Error parsing email data:', parseError)
          emailData = this.getMockEmails(limit)
        }
      } else {
        emailData = this.getMockEmails(limit)
      }

      return {
        emails: emailData,
        source: emailData.length > 0 && !emailData[0].note ? 'real' : 'mock'
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
      return { 
        emails: this.getMockEmails(limit),
        source: 'mock'
      }
    }
  }

  getMockEmails(limit = 5) {
    const allEmails = [
      {
        id: 'mock_001',
        subject: 'Service Reminder - HVAC Maintenance Due',
        from: 'Sarah Johnson <sarah.johnson@email.com>',
        to: 'business@company.com',
        date: new Date().toISOString(),
        snippet: 'Hi, I wanted to schedule my annual HVAC maintenance for next week. Could we set up an appointment?',
        unread: true,
        threadId: 'thread_001'
      },
      {
        id: 'mock_002',
        subject: 'Payment Confirmation - Invoice #1234',
        from: 'Robert Smith <robert.smith@email.com>',
        to: 'business@company.com',
        date: new Date(Date.now() - 3600000).toISOString(),
        snippet: 'Thank you for the excellent plumbing service yesterday. Payment has been processed successfully.',
        unread: false,
        threadId: 'thread_002'
      },
      {
        id: 'mock_003',
        subject: 'Equipment Issue - Urgent',
        from: 'Emily Davis <emily.davis@email.com>',
        to: 'business@company.com',
        date: new Date(Date.now() - 7200000).toISOString(),
        snippet: 'The electrical outlet installation seems to have an issue. The GFCI keeps tripping. Can someone come take a look?',
        unread: true,
        threadId: 'thread_003'
      },
      {
        id: 'mock_004',
        subject: 'Warranty Renewal Question',
        from: 'Michael Wilson <michael.wilson@email.com>',
        to: 'business@company.com',
        date: new Date(Date.now() - 86400000).toISOString(),
        snippet: 'I received a notice that my HVAC warranty is expiring soon. What are my options for renewal?',
        unread: true,
        threadId: 'thread_004'
      },
      {
        id: 'mock_005',
        subject: 'Schedule Change Request',
        from: 'Lisa Brown <lisa.brown@email.com>',
        to: 'business@company.com',
        date: new Date(Date.now() - 172800000).toISOString(),
        snippet: 'I need to reschedule our appointment for tomorrow to next week due to a family emergency.',
        unread: false,
        threadId: 'thread_005'
      },
      {
        id: 'mock_006',
        subject: 'New Customer Inquiry',
        from: 'James Martinez <james.martinez@email.com>',
        to: 'business@company.com',
        date: new Date(Date.now() - 259200000).toISOString(),
        snippet: 'Hi, I was referred by Sarah Johnson. I need HVAC installation for my new home. Can you provide a quote?',
        unread: true,
        threadId: 'thread_006'
      }
    ]
    
    return allEmails.slice(0, limit)
  }

  async sendSMS(to: string, message: string) {
    await this.initialize()
    const smsClient = this.clients.get('sms')
    
    if (!smsClient) {
      throw new Error('SMS MCP client not available')
    }

    try {
      const result = await smsClient.request({
        method: 'tools/call',
        params: {
          name: 'send_sms',
          arguments: {
            to,
            message
          }
        }
      }, {})

      return result.content
    } catch (error) {
      console.error('Error sending SMS:', error)
      throw error
    }
  }

  async sendEmail(to: string, subject: string, body: string) {
    await this.initialize()
    const gmailClient = this.clients.get('gmail')
    
    if (!gmailClient) {
      throw new Error('Gmail MCP client not available')
    }

    try {
      const result = await gmailClient.request({
        method: 'tools/call',
        params: {
          name: 'send_email',
          arguments: {
            to,
            subject,
            body
          }
        }
      }, {})

      return result.content
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  async getIntegrationStatus() {
    const status = {
      quickbooks: { status: 'disconnected', lastSync: null, error: null },
      'housecall-pro': { status: 'disconnected', lastSync: null, error: null },
      gmail: { status: 'disconnected', lastSync: null, error: null },
      sms: { status: 'disconnected', lastSync: null, error: null }
    }

    for (const [name, client] of this.clients.entries()) {
      try {
        // Test connection with a simple ping
        await client.request({ method: 'ping', params: {} }, {})
        status[name as keyof typeof status] = {
          status: 'connected',
          lastSync: new Date().toISOString(),
          error: null
        }
      } catch (error) {
        status[name as keyof typeof status] = {
          status: 'error',
          lastSync: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return status
  }

  async disconnect() {
    for (const [name, client] of this.clients.entries()) {
      try {
        await client.close()
      } catch (error) {
        console.error(`Error disconnecting ${name} client:`, error)
      }
    }
    this.clients.clear()
    this.initialized = false
  }
}