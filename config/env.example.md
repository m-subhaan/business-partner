# Environment Configuration

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

## Required Dependencies

Add these to your package.json:

```bash
npm install @anthropic-ai/sdk @mcp/sdk axios twilio googleapis intuit-oauth nodemailer
```