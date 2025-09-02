# Claude Business Partner

An intelligent business management system that transforms Claude into a centralized business intelligence hub for service-based businesses.

## 🚀 Features

### Core System Architecture
- **MCP Client Layer**: Integrates QuickBooks, HouseCall Pro, Gmail, and SMS servers
- **Business Intelligence Engine**: Processes and analyzes data across all systems
- **Context Aggregation Layer**: Unifies customer information from multiple sources
- **Conversation Management**: Provides natural language interface for all interactions

### Key UI Components

#### 1. Unified Dashboard
- Real-time business metrics and KPIs
- Daily schedule with customer context
- Priority alerts and notifications
- Quick access to all business functions

#### 2. Intelligent Customer Context Panel
- Complete customer history across all systems
- Payment status and service records
- Warranty information and expiration tracking
- Customer ratings and interaction history

#### 3. Proactive Management Interface
- Automated recommendations for warranty renewals
- Weather-based scheduling adjustments
- Overdue payment handling suggestions
- Resource allocation optimization

#### 4. Real-time Decision Support
- Contextual suggestions for customer calls
- Scheduling optimization
- Pricing guidance based on market data
- Team management insights

#### 5. Advanced Analytics Views
- Revenue optimization insights
- Operational efficiency metrics
- Predictive business intelligence
- Performance trend analysis

#### 6. Natural Language Interface
- Single conversation interface with Claude
- Context-aware responses
- Action buttons for common tasks
- Voice input support

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons
- **Architecture**: Component-based with TypeScript interfaces

## 📁 Project Structure

```
claude-business-partner/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles and Tailwind
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── Dashboard.tsx            # Main dashboard component
│   ├── analytics/               # Analytics and reporting
│   │   └── AnalyticsView.tsx
│   ├── conversation/            # Claude chat interface
│   │   └── ConversationInterface.tsx
│   ├── customer/                # Customer management
│   │   └── CustomerContextPanel.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── AlertsPanel.tsx
│   │   ├── DailySchedule.tsx
│   │   └── MetricsOverview.tsx
│   ├── integrations/            # MCP integrations
│   │   └── MCPStatus.tsx
│   └── recommendations/         # AI recommendations
│       └── ProactiveRecommendations.tsx
├── types/                       # TypeScript type definitions
│   └── business.ts
└── [config files]              # Next.js, Tailwind, TypeScript configs
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9) - Main brand color
- **Success**: Green (#22c55e) - Positive actions, completed states
- **Warning**: Amber (#f59e0b) - Caution, pending states
- **Danger**: Red (#ef4444) - Errors, urgent items

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Primary, secondary, success, warning, danger variants
- **Status Indicators**: Color-coded badges for different states
- **Navigation**: Sidebar with icon-based menu items

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📊 Example Scenarios

### Customer Call Scenario
When Mrs. Johnson calls about her HVAC service, Claude instantly displays:
- Complete payment history (paid in full)
- Service records (5-star rating, last service 3 months ago)
- Warranty status (expires next month)
- Suggested actions (warranty renewal reminder)

### Proactive Management
- "3 customers have warranties expiring this month - send renewal reminders?"
- "Weather forecast shows rain tomorrow - reschedule outdoor jobs?"
- "Mike Rodriguez worked 50+ hours this week - redistribute workload?"

### Real-time Decision Support
- Route optimization to save 2 hours daily
- Pricing suggestions based on market data
- Team workload balancing recommendations
- Inventory optimization alerts

## 🔧 Customization

### Adding New Integrations
1. Define new integration type in `types/business.ts`
2. Add integration logic in `components/integrations/MCPStatus.tsx`
3. Update dashboard to display new data sources

### Extending Analytics
1. Add new chart types in `components/analytics/AnalyticsView.tsx`
2. Define new data structures in `types/business.ts`
3. Create mock data for development

### Custom Recommendations
1. Extend recommendation types in `types/business.ts`
2. Add new recommendation logic in `components/recommendations/ProactiveRecommendations.tsx`
3. Implement action handlers for new recommendation types

## 🎯 Future Enhancements

- Real MCP server integration
- Voice-to-text functionality
- Mobile responsive design optimization
- Advanced AI conversation capabilities
- Custom dashboard widgets
- Multi-tenant support
- Advanced reporting and exports

## 📝 License

This project is designed as a comprehensive UI demonstration for Claude Business Partner. All components are built with production-ready code and best practices.