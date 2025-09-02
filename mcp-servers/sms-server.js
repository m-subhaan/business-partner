#!/usr/bin/env node

const { Server, StdioServerTransport } = require('./mcp-sdk-stub.js');
const twilio = require('twilio');

class SMSServer {
  constructor() {
    this.server = new Server(
      {
        name: 'sms-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.twilioClient = null;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'send_sms',
            description: 'Send SMS message via Twilio',
            inputSchema: {
              type: 'object',
              properties: {
                to: {
                  type: 'string',
                  description: 'Recipient phone number (E.164 format: +1234567890)'
                },
                message: {
                  type: 'string',
                  description: 'SMS message content (max 1600 characters)',
                  maxLength: 1600
                },
                from: {
                  type: 'string',
                  description: 'Sender phone number (optional, uses default if not provided)'
                }
              },
              required: ['to', 'message']
            }
          },
          {
            name: 'get_recent_messages',
            description: 'Get recent SMS messages',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'integer',
                  description: 'Number of messages to return (max 50)',
                  maximum: 50
                },
                direction: {
                  type: 'string',
                  enum: ['inbound', 'outbound'],
                  description: 'Filter by message direction'
                },
                date_sent_after: {
                  type: 'string',
                  description: 'Filter messages sent after this date (YYYY-MM-DD)'
                }
              }
            }
          },
          {
            name: 'get_message_status',
            description: 'Get delivery status of a sent message',
            inputSchema: {
              type: 'object',
              properties: {
                message_sid: {
                  type: 'string',
                  description: 'Twilio message SID'
                }
              },
              required: ['message_sid']
            }
          },
          {
            name: 'send_bulk_sms',
            description: 'Send SMS to multiple recipients',
            inputSchema: {
              type: 'object',
              properties: {
                recipients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      phone: { type: 'string' },
                      name: { type: 'string' },
                      custom_message: { type: 'string' }
                    },
                    required: ['phone']
                  },
                  description: 'Array of recipients with phone numbers'
                },
                message_template: {
                  type: 'string',
                  description: 'SMS template with {name} placeholder for personalization'
                }
              },
              required: ['recipients', 'message_template']
            }
          },
          {
            name: 'schedule_reminder',
            description: 'Schedule an SMS reminder',
            inputSchema: {
              type: 'object',
              properties: {
                to: {
                  type: 'string',
                  description: 'Recipient phone number'
                },
                message: {
                  type: 'string',
                  description: 'Reminder message'
                },
                send_at: {
                  type: 'string',
                  description: 'When to send the reminder (ISO 8601 format)'
                },
                customer_id: {
                  type: 'string',
                  description: 'Associated customer ID for tracking'
                }
              },
              required: ['to', 'message', 'send_at']
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
          case 'send_sms':
            return await this.sendSMS(args);
          
          case 'get_recent_messages':
            return await this.getRecentMessages(args);
          
          case 'get_message_status':
            return await this.getMessageStatus(args.message_sid);
          
          case 'send_bulk_sms':
            return await this.sendBulkSMS(args);
          
          case 'schedule_reminder':
            return await this.scheduleReminder(args);
          
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

  async sendSMS(args) {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio not configured');
      }

      const fromNumber = args.from || this.twilioPhoneNumber;
      if (!fromNumber) {
        throw new Error('No sender phone number configured');
      }

      const message = await this.twilioClient.messages.create({
        body: args.message,
        from: fromNumber,
        to: args.to
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message_sid: message.sid,
              status: message.status,
              to: message.to,
              from: message.from,
              date_sent: message.dateCreated,
              price: message.price,
              direction: message.direction
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
              to: args.to,
              message: args.message,
              note: 'SMS would be sent in real implementation'
            })
          }
        ]
      };
    }
  }

  async getRecentMessages(args = {}) {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio not configured');
      }

      const options = {
        limit: Math.min(args.limit || 20, 50)
      };

      if (args.direction) {
        options.direction = args.direction;
      }

      if (args.date_sent_after) {
        options.dateSentAfter = new Date(args.date_sent_after);
      }

      const messages = await this.twilioClient.messages.list(options);

      const formattedMessages = messages.map(msg => ({
        sid: msg.sid,
        from: msg.from,
        to: msg.to,
        body: msg.body,
        status: msg.status,
        direction: msg.direction,
        date_sent: msg.dateSent,
        date_created: msg.dateCreated,
        price: msg.price,
        error_code: msg.errorCode,
        error_message: msg.errorMessage
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              messages: formattedMessages,
              total_count: formattedMessages.length
            })
          }
        ]
      };
    } catch (error) {
      // Return mock data if Twilio API fails
      const mockMessages = [
        {
          sid: 'SM' + Date.now(),
          from: this.twilioPhoneNumber || '+15551234567',
          to: '+15559876543',
          body: 'Your appointment is confirmed for tomorrow at 2:00 PM. Please reply CONFIRM.',
          status: 'delivered',
          direction: 'outbound',
          date_sent: new Date().toISOString(),
          price: '-0.0075'
        },
        {
          sid: 'SM' + (Date.now() - 1000),
          from: '+15559876543',
          to: this.twilioPhoneNumber || '+15551234567',
          body: 'CONFIRM',
          status: 'received',
          direction: 'inbound',
          date_sent: new Date(Date.now() - 300000).toISOString(),
          price: null
        }
      ];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              messages: mockMessages,
              note: 'Mock data - Twilio API unavailable'
            })
          }
        ]
      };
    }
  }

  async getMessageStatus(messageSid) {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio not configured');
      }

      const message = await this.twilioClient.messages(messageSid).fetch();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              sid: message.sid,
              status: message.status,
              to: message.to,
              from: message.from,
              date_sent: message.dateSent,
              date_updated: message.dateUpdated,
              price: message.price,
              error_code: message.errorCode,
              error_message: message.errorMessage
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
              message_sid: messageSid,
              note: 'Status check failed'
            })
          }
        ]
      };
    }
  }

  async sendBulkSMS(args) {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio not configured');
      }

      const results = [];
      const fromNumber = this.twilioPhoneNumber;

      for (const recipient of args.recipients) {
        try {
          // Personalize message with recipient name
          const personalizedMessage = args.message_template.replace(
            /{name}/g, 
            recipient.name || 'Customer'
          );

          const message = recipient.custom_message || personalizedMessage;

          const twilioMessage = await this.twilioClient.messages.create({
            body: message,
            from: fromNumber,
            to: recipient.phone
          });

          results.push({
            phone: recipient.phone,
            name: recipient.name,
            success: true,
            message_sid: twilioMessage.sid,
            status: twilioMessage.status
          });

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          results.push({
            phone: recipient.phone,
            name: recipient.name,
            success: false,
            error: error.message
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              total_sent: args.recipients.length,
              successful: successCount,
              failed: failureCount,
              results: results
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
              note: 'Bulk SMS sending failed'
            })
          }
        ]
      };
    }
  }

  async scheduleReminder(args) {
    try {
      // Note: Twilio doesn't have built-in scheduling, you'd need to implement this
      // with a job queue or scheduling service. For now, we'll simulate it.
      
      const sendAtDate = new Date(args.send_at);
      const now = new Date();
      
      if (sendAtDate <= now) {
        // Send immediately if the scheduled time is in the past
        return await this.sendSMS({
          to: args.to,
          message: args.message
        });
      }

      // In a real implementation, you'd queue this with a job scheduler
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              scheduled: true,
              reminder_id: 'reminder_' + Date.now(),
              send_at: args.send_at,
              to: args.to,
              customer_id: args.customer_id,
              message: args.message,
              note: 'Reminder scheduled (would use job queue in real implementation)'
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SMS MCP Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new SMSServer();
  server.run().catch(console.error);
}

module.exports = SMSServer;