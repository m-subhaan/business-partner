# MCP Servers Implementation

This directory contains fully functional MCP servers for integrating with various business systems.

## 🎯 What's Included

### 1. QuickBooks MCP Server (`quickbooks-server.js`)
**Financial data integration**
- ✅ Revenue summaries by period
- ✅ Outstanding invoices tracking
- ✅ Expense summaries
- ✅ Invoice creation
- ✅ Customer management
- 🔄 OAuth integration ready
- 📊 Mock data fallback

### 2. HouseCall Pro MCP Server (`housecall-pro-server.js`)
**Job management and scheduling**
- ✅ Daily job schedules
- ✅ Customer information
- ✅ Job history tracking
- ✅ Route optimization
- ✅ Follow-up task creation
- ✅ Customer notes management
- 📱 API integration ready

### 3. Gmail MCP Server (`gmail-server.js`)
**Email communication**
- ✅ Recent emails fetching
- ✅ Email sending
- ✅ Email search
- ✅ Thread management
- ✅ Mark as read/unread
- 🔐 OAuth2 integration
- 📧 Full Gmail API support

### 4. SMS MCP Server (`sms-server.js`)
**SMS communication via Twilio**
- ✅ Send individual SMS
- ✅ Bulk SMS sending
- ✅ Message status tracking
- ✅ Recent messages
- ✅ Scheduled reminders
- 📱 Twilio integration
- 💬 Two-way messaging

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# From project root
npm run setup
```

### 2. Configure Environment
Edit `.env.local` with your API keys:
```bash
# Each server needs its respective API keys
QUICKBOOKS_CLIENT_ID=your_client_id
HOUSECALL_PRO_API_KEY=your_api_key
GOOGLE_CLIENT_ID=your_google_client_id
TWILIO_ACCOUNT_SID=your_twilio_sid
```

### 3. Start MCP Servers
```bash
# Start all servers
npm run mcp:start

# Or start individually
npm run mcp:start:quickbooks
npm run mcp:start:housecall
npm run mcp:start:gmail
npm run mcp:start:sms
```

## 🔧 Server Architecture

Each MCP server follows this pattern:

```javascript
class MCPServer {
  constructor() {
    this.server = new Server(/* config */);
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // tools/list - Available tools
    // tools/call - Execute tools
    // ping - Health check
  }

  async run() {
    // Start stdio transport
  }
}
```

## 🛠️ Available Tools

### QuickBooks Tools
- `get_revenue_summary` - Financial performance
- `get_outstanding_invoices` - Payment tracking
- `get_expenses_summary` - Cost analysis
- `create_invoice` - Billing automation
- `get_customers` - Customer data

### HouseCall Pro Tools
- `get_jobs` - Schedule management
- `get_customers` - Customer info
- `get_customer` - Detailed customer
- `optimize_route` - Route planning
- `create_follow_up_task` - Task management
- `update_customer_notes` - Customer tracking

### Gmail Tools
- `get_recent_emails` - Email monitoring
- `send_email` - Email automation
- `search_emails` - Email discovery
- `get_email_thread` - Conversation tracking
- `mark_as_read` - Email management

### SMS Tools
- `send_sms` - Instant messaging
- `get_recent_messages` - Message history
- `send_bulk_sms` - Mass communication
- `schedule_reminder` - Automated reminders
- `get_message_status` - Delivery tracking

## 🔐 Authentication & Security

### QuickBooks OAuth Flow
1. Register app at [Intuit Developer](https://developer.intuit.com/)
2. Get Client ID and Secret
3. Implement OAuth callback
4. Store refresh tokens securely

### Google Gmail OAuth2
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Gmail API
3. Create OAuth2 credentials
4. Handle authorization flow

### Twilio API Key
1. Sign up at [Twilio](https://console.twilio.com/)
2. Get Account SID and Auth Token
3. Purchase phone number
4. Configure webhooks for inbound SMS

### HouseCall Pro API
1. Contact HouseCall Pro for API access
2. Get API key and documentation
3. Configure webhook endpoints

## 📊 Mock Data & Fallbacks

Each server includes comprehensive mock data:
- **Development**: Works without API keys
- **Testing**: Predictable responses
- **Fallback**: Graceful degradation
- **Demo**: Full feature showcase

## 🧪 Testing

### Test Individual Server
```bash
# Test QuickBooks server
echo '{"method": "tools/list", "params": {}}' | node mcp-servers/quickbooks-server.js

# Test tool execution
echo '{"method": "tools/call", "params": {"name": "get_revenue_summary", "arguments": {"period": "current_month"}}}' | node mcp-servers/quickbooks-server.js
```

### Health Checks
```bash
# Ping all servers
echo '{"method": "ping", "params": {}}' | node mcp-servers/quickbooks-server.js
```

## 🔄 Integration with Main App

The main application connects to these servers via:

1. **MCP Client** (`lib/mcp-client.ts`)
2. **API Routes** (`app/api/*`)
3. **React Components** (automatic fallback)

```typescript
// Example usage in main app
const mcpClient = new MCPClient();
await mcpClient.initialize();
const schedule = await mcpClient.getSchedule();
```

## 📈 Scaling & Production

### Deployment Options
1. **Same Server**: Run alongside Next.js
2. **Separate Containers**: Docker deployment
3. **Serverless**: AWS Lambda/Vercel Functions
4. **Microservices**: Independent scaling

### Monitoring
- Server health checks
- API rate limit tracking
- Error rate monitoring
- Performance metrics

### Security Best Practices
- Environment variable isolation
- API key rotation
- Request rate limiting
- Input validation
- Error message sanitization

## 🆘 Troubleshooting

### Common Issues

**Server Won't Start**
- Check Node.js version (14+)
- Verify package installations
- Check file permissions

**API Authentication Errors**
- Verify API keys in .env.local
- Check OAuth token expiry
- Validate redirect URIs

**Connection Timeouts**
- Increase MCP_TIMEOUT value
- Check network connectivity
- Verify API endpoints

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* node mcp-servers/quickbooks-server.js
```

## 🎉 Success Indicators

✅ All servers start without errors
✅ Health checks return "ok"
✅ Tools list properly
✅ Mock data returns correctly
✅ API integrations work with real keys
✅ Main app connects successfully

Your Claude Business Partner now has **real intelligence** with live business data! 🚀