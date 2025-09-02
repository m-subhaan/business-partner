#!/bin/bash

# Setup script for Claude Business Partner with MCP servers
echo "🚀 Setting up Claude Business Partner with MCP servers..."

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOL'
# Claude API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# MCP Server Configurations (Absolute paths recommended for production)
MCP_QUICKBOOKS_SERVER_PATH=./mcp-servers/quickbooks-server.js
MCP_HOUSECALL_PRO_SERVER_PATH=./mcp-servers/housecall-pro-server.js
MCP_GMAIL_SERVER_PATH=./mcp-servers/gmail-server.js
MCP_SMS_SERVER_PATH=./mcp-servers/sms-server.js

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
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

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
EOL
    echo "✅ .env.local file created"
else
    echo "⚠️  .env.local already exists, skipping creation"
fi

# Make MCP servers executable
echo "🔧 Making MCP servers executable..."
chmod +x mcp-servers/*.js

# Install dependencies
echo "📦 Installing main dependencies..."
npm install

echo "📦 Installing MCP server dependencies..."
cd mcp-servers && npm install && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local and add your real API keys"
echo "2. Run 'npm run dev' to start the Next.js app"
echo "3. Run 'npm run mcp:start' in another terminal to start MCP servers"
echo ""
echo "🔗 API Keys needed:"
echo "- Anthropic Claude API: https://console.anthropic.com/"
echo "- QuickBooks: https://developer.intuit.com/"
echo "- HouseCall Pro: Contact HouseCall Pro for API access"
echo "- Google Gmail: https://console.cloud.google.com/"
echo "- Twilio SMS: https://console.twilio.com/"
echo ""
echo "📚 See SETUP_REAL_IMPLEMENTATION.md for detailed instructions"