import React, { useState, useRef, useEffect } from 'react'
import './SupportChatbot.css'

function SupportChatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m here to support you. How are you feeling today?',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase()

    // Crisis keywords
    if (input.match(/\b(suicide|kill myself|end it all|want to die|hurt myself)\b/)) {
      return "I'm really concerned about what you're sharing. Please reach out to someone who can help right away:\n\n📞 National Suicide Prevention Lifeline: 988\n💬 Crisis Text Line: Text HELLO to 741741\n🏥 Campus Counseling Center\n\nYou don't have to face this alone. Your life matters."
    }

    // High distress
    if (input.match(/\b(can't cope|giving up|hopeless|desperate|breaking down)\b/)) {
      return "I hear that you're going through a really tough time right now. It's important to talk to someone who can provide proper support. Please consider:\n\n• Contacting your campus counseling center\n• Talking to a trusted friend or family member\n• Calling a crisis helpline: 988\n\nIn the meantime, try taking slow, deep breaths. You're not alone."
    }

    // Stress and anxiety
    if (input.match(/\b(stress|stressed|anxious|anxiety|worried|nervous)\b/)) {
      return "It sounds like you're experiencing stress. That's completely normal, especially as a student. Here are some things that might help:\n\n• Try the Breathing Exercise in our sidebar\n• Take a 10-minute break every hour\n• Listen to calming music\n• Write down what's worrying you\n\nWould you like guidance on a breathing exercise?"
    }

    // Exams and assignments
    if (input.match(/\b(exam|test|assignment|deadline|homework|study|studying)\b/)) {
      return "Academic pressure can be overwhelming! Here are some strategies:\n\n• Break tasks into smaller chunks\n• Use the Pomodoro Technique (25 min work, 5 min break)\n• Create a study schedule\n• Prioritize the most important tasks first\n• Remember: Your best is good enough\n\nCheck out our Quick Tips section for more study strategies!"
    }

    // Sleep issues
    if (input.match(/\b(sleep|tired|exhausted|insomnia|can't sleep|sleepless)\b/)) {
      return "Sleep is so important for managing stress! Try these tips:\n\n• Aim for 7-9 hours per night\n• Avoid screens 1 hour before bed\n• Create a relaxing bedtime routine\n• Keep your room cool and dark\n• Try our Visual Relief images before bed\n\nGood sleep helps your brain process information and reduces stress."
    }

    // Overwhelmed
    if (input.match(/\b(overwhelmed|too much|can't handle|drowning)\b/)) {
      return "Feeling overwhelmed is a sign you're taking on a lot. Let's break it down:\n\n• List everything you need to do\n• Identify what's urgent vs. important\n• Delegate or ask for help where possible\n• Say no to non-essential commitments\n• Take one thing at a time\n\nRemember: You don't have to do everything perfectly."
    }

    // Breathing exercise request
    if (input.match(/\b(breath|breathing|breathe|calm down)\b/)) {
      return "Great choice! Let's do a quick breathing exercise:\n\n1️⃣ Breathe in slowly through your nose for 4 seconds\n2️⃣ Hold your breath for 7 seconds\n3️⃣ Exhale slowly through your mouth for 8 seconds\n4️⃣ Repeat 3-4 times\n\nYou can also use our interactive Breathing Exercise feature in the sidebar for a guided experience!"
    }

    // Feeling better/positive
    if (input.match(/\b(better|good|great|thanks|helped|feeling better)\b/)) {
      return "That's wonderful to hear! Remember, you can come back anytime you need support. Keep taking care of yourself! 🌟\n\nIs there anything else I can help you with?"
    }

    // Greetings
    if (input.match(/\b(hi|hello|hey)\b/)) {
      return "Hello! I'm here to listen and support you. What's on your mind today?"
    }

    // Gratitude
    if (input.match(/\b(thank you|thanks)\b/)) {
      return "You're very welcome! Remember, reaching out for support is a sign of strength. I'm here whenever you need to talk. 💙"
    }

    // Resources request
    if (input.match(/\b(help|resource|support|who can i talk to)\b/)) {
      return "Here are some resources available to you:\n\n📚 Campus Counseling Center - Free confidential support\n📞 Crisis Hotline: 988\n💬 Crisis Text Line: Text HELLO to 741741\n👥 Student Health Services\n🏛️ Academic Advisor\n\nDon't hesitate to reach out to any of these. You deserve support!"
    }

    // Default response
    const defaultResponses = [
      "I'm here to listen. Can you tell me more about what you're experiencing?",
      "Thank you for sharing. What's the biggest challenge you're facing right now?",
      "It's okay to feel how you're feeling. What would help you most right now?",
      "I understand this is difficult. Have you tried any of our wellness tools in the sidebar?",
      "Sometimes talking helps. What's been on your mind lately?"
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = () => {
    if (inputText.trim() === '') return

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Generate and add bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: generateResponse(inputText),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="support-chatbot">
      <div className="chatbot-header">
        <h2>💬 Support Chatbot</h2>
        <p className="chatbot-subtitle">A safe space to talk about stress and get support</p>
        <div className="chatbot-disclaimer">
          <span className="disclaimer-icon">ℹ️</span>
          <span>This is a supportive chatbot. For emergencies, call 988 or contact campus counseling.</span>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows="2"
            className="chat-input"
          />
          <button 
            onClick={handleSend}
            className="send-button"
            disabled={inputText.trim() === ''}
          >
            <span className="send-icon">📤</span>
            Send
          </button>
        </div>
      </div>

      <div className="chatbot-footer">
        <p>🌟 Remember: You're not alone. Explore our other wellness tools in the sidebar!</p>
      </div>
    </div>
  )
}

export default SupportChatbot
