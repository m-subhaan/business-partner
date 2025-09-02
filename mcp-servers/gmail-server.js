#!/usr/bin/env node

const { Server, StdioServerTransport } = require('./mcp-sdk-stub.js');
const { google } = require('googleapis');

class GmailServer {
  constructor() {
    this.server = new Server(
      {
        name: 'gmail-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.gmail = null;
    this.oauth2Client = null;

    this.setupGoogleAuth();
    this.setupToolHandlers();
  }

  setupGoogleAuth() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // In a real implementation, you'd have stored refresh tokens
    // For now, we'll check if credentials are available
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
      
      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    }
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'get_recent_emails',
            description: 'Get recent emails from Gmail',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'integer',
                  description: 'Number of emails to return (max 50)',
                  maximum: 50
                },
                query: {
                  type: 'string',
                  description: 'Gmail search query (e.g., "is:unread", "from:customer@email.com")'
                },
                include_body: {
                  type: 'boolean',
                  description: 'Whether to include email body content'
                }
              }
            }
          },
          {
            name: 'send_email',
            description: 'Send an email via Gmail',
            inputSchema: {
              type: 'object',
              properties: {
                to: {
                  type: 'string',
                  description: 'Recipient email address'
                },
                subject: {
                  type: 'string',
                  description: 'Email subject'
                },
                body: {
                  type: 'string',
                  description: 'Email body content'
                },
                cc: {
                  type: 'string',
                  description: 'CC email addresses (comma-separated)'
                },
                reply_to: {
                  type: 'string',
                  description: 'Reply-to email address'
                }
              },
              required: ['to', 'subject', 'body']
            }
          },
          {
            name: 'search_emails',
            description: 'Search emails with specific criteria',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Gmail search query'
                },
                max_results: {
                  type: 'integer',
                  description: 'Maximum number of results'
                }
              },
              required: ['query']
            }
          },
          {
            name: 'get_email_thread',
            description: 'Get full email thread/conversation',
            inputSchema: {
              type: 'object',
              properties: {
                thread_id: {
                  type: 'string',
                  description: 'Gmail thread ID'
                }
              },
              required: ['thread_id']
            }
          },
          {
            name: 'mark_as_read',
            description: 'Mark emails as read',
            inputSchema: {
              type: 'object',
              properties: {
                message_ids: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Array of Gmail message IDs to mark as read'
                }
              },
              required: ['message_ids']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_recent_emails':
            return await this.getRecentEmails(args);
          
          case 'send_email':
            return await this.sendEmail(args);
          
          case 'search_emails':
            return await this.searchEmails(args);
          
          case 'get_email_thread':
            return await this.getEmailThread(args.thread_id);
          
          case 'mark_as_read':
            return await this.markAsRead(args.message_ids);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });

    // Handle ping for health checks
    this.server.setRequestHandler('ping', async () => {
      return { status: 'ok' };
    });
  }

  async getRecentEmails(args = {}) {
    try {
      if (!this.gmail) {
        throw new Error('Gmail not authenticated');
      }

      const query = args.query || 'in:inbox';
      const maxResults = Math.min(args.limit || 10, 50);

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });

      const messages = response.data.messages || [];
      const emailDetails = [];

      // Get details for each message
      for (const message of messages.slice(0, maxResults)) {
        try {
          const messageDetail = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: args.include_body ? 'full' : 'metadata'
          });

          const headers = messageDetail.data.payload.headers;
          const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

          const emailData = {
            id: message.id,
            threadId: messageDetail.data.threadId,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            to: getHeader('To'),
            date: getHeader('Date'),
            snippet: messageDetail.data.snippet,
            unread: messageDetail.data.labelIds?.includes('UNREAD') || false
          };

          if (args.include_body) {
            emailData.body = this.extractEmailBody(messageDetail.data.payload);
          }

          emailDetails.push(emailData);
        } catch (error) {
          console.error(`Error getting message ${message.id}:`, error.message);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              emails: emailDetails,
              total_found: response.data.resultSizeEstimate
            })
          }
        ]
      };
    } catch (error) {
      // Return mock data if Gmail API fails
      const mockEmails = [
        {
          id: 'msg_001',
          threadId: 'thread_001',
          subject: 'Service Reminder - HVAC Maintenance Due',
          from: 'sarah.johnson@email.com',
          to: 'me@business.com',
          date: new Date().toISOString(),
          snippet: 'Hi, I wanted to schedule my annual HVAC maintenance...',
          unread: true
        },
        {
          id: 'msg_002',
          threadId: 'thread_002',
          subject: 'Payment Confirmation - Invoice #1234',
          from: 'robert.smith@email.com',
          to: 'me@business.com',
          date: new Date(Date.now() - 3600000).toISOString(),
          snippet: 'Thank you for the excellent service. Payment has been processed...',
          unread: false
        }
      ];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              emails: mockEmails,
              note: 'Mock data - Gmail API unavailable'
            })
          }
        ]
      };
    }
  }

  async sendEmail(args) {
    try {
      if (!this.gmail) {
        throw new Error('Gmail not authenticated');
      }

      const email = this.createEmailMessage(args);
      
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: email
        }
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message_id: response.data.id,
              thread_id: response.data.threadId
            })
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message,
              note: 'Email would be sent in real implementation'
            })
          }
        ]
      };
    }
  }

  async searchEmails(args) {
    try {
      if (!this.gmail) {
        throw new Error('Gmail not authenticated');
      }

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: args.query,
        maxResults: args.max_results || 25
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              messages: response.data.messages || [],
              result_size_estimate: response.data.resultSizeEstimate
            })
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              messages: [],
              error: error.message,
              note: 'Search unavailable - Gmail API not accessible'
            })
          }
        ]
      };
    }
  }

  async getEmailThread(threadId) {
    try {
      if (!this.gmail) {
        throw new Error('Gmail not authenticated');
      }

      const response = await this.gmail.users.threads.get({
        userId: 'me',
        id: threadId
      });

      const thread = response.data;
      const messages = thread.messages.map(message => {
        const headers = message.payload.headers;
        const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        return {
          id: message.id,
          subject: getHeader('Subject'),
          from: getHeader('From'),
          date: getHeader('Date'),
          snippet: message.snippet,
          body: this.extractEmailBody(message.payload)
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              thread_id: threadId,
              messages,
              message_count: messages.length
            })
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: error.message,
              note: 'Thread retrieval failed'
            })
          }
        ]
      };
    }
  }

  async markAsRead(messageIds) {
    try {
      if (!this.gmail) {
        throw new Error('Gmail not authenticated');
      }

      const promises = messageIds.map(id => 
        this.gmail.users.messages.modify({
          userId: 'me',
          id,
          requestBody: {
            removeLabelIds: ['UNREAD']
          }
        })
      );

      await Promise.all(promises);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              marked_read: messageIds.length
            })
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            })
          }
        ]
      };
    }
  }

  createEmailMessage(args) {
    const email = [
      `To: ${args.to}`,
      `Subject: ${args.subject}`,
      args.cc ? `Cc: ${args.cc}` : '',
      args.reply_to ? `Reply-To: ${args.reply_to}` : '',
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      args.body
    ].filter(line => line !== '').join('\r\n');

    return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  extractEmailBody(payload) {
    if (payload.body && payload.body.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          return Buffer.from(part.body.data, 'base64').toString();
        }
        if (part.parts) {
          const nestedBody = this.extractEmailBody(part);
          if (nestedBody) return nestedBody;
        }
      }
    }

    return '';
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Gmail MCP Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new GmailServer();
  server.run().catch(console.error);
}

module.exports = GmailServer;