'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { ConversationMessage, MessageAction } from '@/types/business'

// Mock conversation data
const mockMessages: ConversationMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content: "Good morning! I'm Claude, your business partner. I've reviewed your schedule for today - you have 6 jobs lined up with a potential revenue of $2,400. How can I help you start your day?",
    timestamp: '2024-01-15T08:00:00Z',
    actions: [
      { id: 'view-schedule', label: 'View Schedule', type: 'button', action: 'view-schedule' },
      { id: 'check-weather', label: 'Check Weather Impact', type: 'button', action: 'weather' }
    ]
  },
  {
    id: '2',
    type: 'user',
    content: "What's my day look like?",
    timestamp: '2024-01-15T08:02:00Z'
  },
  {
    id: '3',
    type: 'assistant',
    content: "Here's your complete day overview:\n\n**Today's Schedule:**\n• 9:00 AM - Sarah Johnson (HVAC Maintenance) - $350 ✅ COMPLETED\n• 11:30 AM - Robert Smith (Plumbing Repair) - $275 🔄 IN PROGRESS\n• 2:00 PM - Emily Davis (Electrical Installation) - $180\n• 4:00 PM - Michael Wilson (Warranty Service) - $0 ⚠️ URGENT\n\n**Key Insights:**\n• Weather: 20% chance of rain this afternoon\n• Michael Wilson's warranty expires next week - he's called twice\n• You're 80% to your daily revenue target\n• Mike Rodriguez is working 50+ hours this week\n\nAnything specific you'd like me to help with?",
    timestamp: '2024-01-15T08:02:30Z',
    actions: [
      { id: 'customer-context', label: 'Michael Wilson Details', type: 'button', action: 'customer-wilson' },
      { id: 'team-management', label: 'Manage Team Hours', type: 'button', action: 'team-hours' }
    ]
  }
]

const quickActions = [
  { icon: CalendarDaysIcon, label: 'Schedule', action: 'What\'s my schedule today?' },
  { icon: UserGroupIcon, label: 'Customers', action: 'Show me customer updates' },
  { icon: ChartBarIcon, label: 'Metrics', action: 'How are we performing today?' },
  { icon: DocumentTextIcon, label: 'Reports', action: 'Generate daily report' }
]

const suggestedQuestions = [
  "Who is my next customer and what's their history?",
  "Are there any urgent issues I should know about?",
  "How can I optimize my route today?",
  "What customers need follow-up calls?",
  "Show me this week's performance metrics"
]

export default function ConversationInterface() {
  const [messages, setMessages] = useState<ConversationMessage[]>(mockMessages)
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Call real Claude API
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: {
            previousMessages: messages.slice(-5), // Send last 5 messages for context
            timestamp: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          actions: data.actions || []
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Fallback to mock response if API fails
        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I'm experiencing some technical difficulties. Let me try to help you with the information I have available.",
          timestamp: new Date().toISOString(),
          actions: []
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Conversation API error:', error)
      
      // Fallback to mock response
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(text),
        timestamp: new Date().toISOString(),
        actions: generateMockActions(text)
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase()
    
    if (lowerText.includes('customer') || lowerText.includes('johnson') || lowerText.includes('smith')) {
      return "I can see you're asking about customers. Here's what I found:\n\n**Sarah Johnson** - Just completed her HVAC maintenance. She's been a customer for 3 years, always pays on time, and has a 5-star rating. Her warranty is valid until March 2024.\n\n**Robert Smith** - Currently in progress with plumbing repair. He's had 2 previous jobs with us, total value $850. Payment history is good, but he tends to call multiple times for updates.\n\nWould you like detailed context on any specific customer?"
    }
    
    if (lowerText.includes('schedule') || lowerText.includes('next') || lowerText.includes('appointment')) {
      return "Your next appointment is at 2:00 PM with Emily Davis for electrical installation at 789 Elm Drive. \n\n**Customer Context:**\n• New customer, first job with us\n• Requested quote last week via online form\n• Lives 15 minutes from your current location\n• Simple outlet installation, should take ~1 hour\n\n**Preparation:**\n• Standard electrical supplies needed\n• No special access requirements\n• Customer will be home after 2 PM\n\nWould you like me to send her a courtesy text confirming the appointment?"
    }
    
    if (lowerText.includes('weather') || lowerText.includes('rain')) {
      return "Weather update for today:\n\n🌤️ **Current:** Partly cloudy, 72°F\n🌧️ **This afternoon:** 20% chance of light rain starting around 3 PM\n\n**Impact on your schedule:**\n• Emily Davis (2 PM) - Indoor work, no impact\n• Michael Wilson (4 PM) - Indoor work, no impact\n\n**Tomorrow:** Heavy rain expected, may affect outdoor jobs. I'm monitoring your Wednesday schedule and can proactively reschedule if needed.\n\nShould I set up weather alerts for the rest of the week?"
    }
    
    return "I understand you're asking about that. Based on your current business data and schedule, I can help you with detailed insights. What specific aspect would you like me to focus on - customer information, scheduling optimization, financial metrics, or team management?"
  }

  const generateMockActions = (userText: string): MessageAction[] => {
    const lowerText = userText.toLowerCase()
    
    if (lowerText.includes('customer')) {
      return [
        { id: 'view-customer', label: 'View Full Profile', type: 'button', action: 'customer-profile' },
        { id: 'contact-customer', label: 'Send Message', type: 'button', action: 'contact' }
      ]
    }
    
    if (lowerText.includes('schedule')) {
      return [
        { id: 'optimize-route', label: 'Optimize Route', type: 'button', action: 'route' },
        { id: 'send-reminder', label: 'Send Reminder', type: 'button', action: 'reminder' }
      ]
    }
    
    return []
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input implementation would go here
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Claude Business Assistant</h2>
            <p className="text-sm text-gray-500">Your intelligent business partner</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`rounded-lg px-4 py-3 ${
                message.type === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action) => (
                      <button
                        key={action.id}
                        className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                          message.type === 'user'
                            ? 'bg-primary-500 hover:bg-primary-400 text-white'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                        }`}
                        onClick={() => handleSendMessage(action.label)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Claude is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={() => handleSendMessage(action.action)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>

        {/* Suggested Questions */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="text-xs px-2 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-md transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Claude anything about your business..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition-colors duration-200 ${
              isListening 
                ? 'bg-danger-600 hover:bg-danger-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}