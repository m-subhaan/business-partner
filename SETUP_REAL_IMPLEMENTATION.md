# Real Implementation Setup Guide

This guide will help you set up the Claude Business Partner with real API integrations.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Claude API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# MCP Server Configurations
MCP_QUICKBOOKS_SERVER_PATH=/path/to/quickbooks-mcp-server
MCP_HOUSECALL_PRO_SERVER_PATH=/path/to/housecall-pro-mcp-server
MCP_GMAIL_SERVER_PATH=/path/to/gmail-mcp-server
MCP_SMS_SERVER_PATH=/path/to/sms-mcp-server

# QuickBooks API
QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret
QUICKBOOKS_SANDBOX=true
QUICKBOOKS_REDIRECT_URI=http://localhost:3000/api/auth/quickbooks/callback

# HouseCall Pro API
HOUSECALL_PRO_API_KEY=your_housecall_pro_api_key
HOUSECALL_PRO_BASE_URL=https://api.housecallpro.com/v1

# Gmail API (Google Cloud)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application Settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# MCP Configuration
MCP_TIMEOUT=30000
MCP_MAX_RETRIES=3
```

### 3. API Key Setup

#### Anthropic Claude API
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add it to `ANTHROPIC_API_KEY`

#### QuickBooks API
1. Go to [Intuit Developer](https://developer.intuit.com/)
2. Create a new app
3. Get Client ID and Secret
4. Set up OAuth redirect URI

#### HouseCall Pro API
1. Contact HouseCall Pro for API access
2. Get your API key
3. Add to `HOUSECALL_PRO_API_KEY`

#### Google Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

#### Twilio SMS API
1. Go to [Twilio Console](https://console.twilio.com/)
2. Get Account SID and Auth Token
3. Purchase a phone number

## 🔧 MCP Server Setup

### Required MCP Servers

You'll need to set up MCP servers for each integration:

1. **QuickBooks MCP Server**
   - Handles financial data, invoices, payments
   - Tools: `get_revenue_summary`, `get_outstanding_invoices`, `create_invoice`

2. **HouseCall Pro MCP Server**
   - Manages jobs, customers, scheduling
   - Tools: `get_jobs`, `get_customers`, `get_customer`, `optimize_route`

3. **Gmail MCP Server**
   - Email communication
   - Tools: `get_recent_emails`, `send_email`

4. **SMS MCP Server**
   - SMS communication via Twilio
   - Tools: `send_sms`

### Example MCP Server Structure

Each MCP server should implement these methods:
- `tools/list` - List available tools
- `tools/call` - Execute a specific tool
- `ping` - Health check

## 🎯 API Endpoints Created

### Conversation API
- **POST** `/api/conversation` - Claude AI responses with business context

### Data APIs
- **GET** `/api/data/schedule` - Today's schedule from HouseCall Pro
- **GET** `/api/data/customers` - Customer list and details
- **GET** `/api/data/financials` - Financial summary from QuickBooks

### Integration APIs
- **GET** `/api/integrations/status` - MCP server connection status
- **POST** `/api/integrations/status` - Refresh integration status

### Communication APIs
- **POST** `/api/communications/send` - Send emails/SMS

### Action APIs
- **POST** `/api/actions` - Execute business actions (optimize route, send reminders, etc.)

## 🔄 How It Works

### 1. Frontend Makes API Call
```typescript
const response = await fetch('/api/conversation', {
  method: 'POST',
  body: JSON.stringify({ message: 'Show me today's schedule' })
})
```

### 2. API Gathers Business Context
```typescript
const businessContext = await Promise.all([
  mcpClient.getSchedule(),
  mcpClient.getRecentCustomers(),
  mcpClient.getFinancialSummary()
])
```

### 3. Claude Gets Context-Rich Prompt
```typescript
const systemPrompt = `You are a business assistant with access to:
- Today's Schedule: ${JSON.stringify(schedule)}
- Recent Customers: ${JSON.stringify(customers)}
- Financial Data: ${JSON.stringify(financials)}
...`
```

### 4. Claude Responds with Actions
```typescript
return {
  response: "Here's your schedule...",
  actions: [
    { label: 'Optimize Route', action: 'optimize-route' },
    { label: 'Send Reminder', action: 'send-reminder' }
  ]
}
```

## 🧪 Testing

### 1. Test MCP Connections
```bash
curl http://localhost:3000/api/integrations/status
```

### 2. Test Conversation API
```bash
curl -X POST http://localhost:3000/api/conversation \
  -H "Content-Type: application/json" \
  -d '{"message": "What'\''s my schedule today?"}'
```

### 3. Test Data APIs
```bash
curl http://localhost:3000/api/data/schedule
curl http://localhost:3000/api/data/customers
curl http://localhost:3000/api/data/financials
```

## 🚨 Fallback Behavior

The system is designed to gracefully fallback to mock data if:
- MCP servers are not available
- API keys are missing
- Network requests fail

This ensures the UI remains functional during development and setup.

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Rate Limits**: Implement proper rate limiting for external APIs
3. **Error Handling**: Sensitive information should not be exposed in error messages
4. **CORS**: Configure appropriate CORS settings for production

## 📱 Production Deployment

### Environment Variables
Set all environment variables in your production environment (Vercel, AWS, etc.)

### MCP Servers
Deploy MCP servers as separate services or containers

### Monitoring
Set up monitoring for:
- API response times
- MCP server health
- Error rates
- Usage metrics

## 🆘 Troubleshooting

### Common Issues

1. **MCP Connection Fails**
   - Check server paths in environment variables
   - Ensure MCP servers are running
   - Check server logs

2. **Claude API Errors**
   - Verify API key is correct
   - Check rate limits
   - Review prompt length

3. **Integration Timeouts**
   - Increase `MCP_TIMEOUT` value
   - Check network connectivity
   - Review MCP server performance

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.

## 🎉 Success!

Once configured, you'll have a fully functional business assistant that:
- Uses real Claude AI for responses
- Connects to actual business systems
- Provides real-time data and insights
- Executes actions on your behalf

The system will seamlessly blend AI intelligence with your business data to provide contextual, actionable insights.