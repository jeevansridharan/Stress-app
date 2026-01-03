import React from 'react'
import './QuickTips.css'

function QuickTips({ stressData }) {
  const getPersonalizedTips = () => {
    const tips = []

    if (stressData.stressLevel === 'high' || stressData.mood === 'high') {
      tips.push('Take regular breaks every 45-60 minutes')
      tips.push('Practice the 4-7-8 breathing exercise daily')
      tips.push('Consider talking to a counselor or trusted friend')
    }

    if (stressData.answers.q1 === 'yes') {
      tips.push('Create a study schedule and break tasks into smaller chunks')
      tips.push('Use the Pomodoro Technique: 25 minutes work, 5 minutes break')
    }

    if (stressData.answers.q2 === 'yes') {
      tips.push('Prioritize tasks using the Eisenhower Matrix')
      tips.push('Learn to say no to non-essential commitments')
    }

    if (stressData.answers.q3 === 'no') {
      tips.push('Aim for 7-9 hours of sleep each night')
      tips.push('Avoid screens 1 hour before bedtime')
      tips.push('Create a relaxing bedtime routine')
    }

    return tips
  }

  const generalTips = [
    { icon: '💧', title: 'Stay Hydrated', description: 'Drink 8 glasses of water daily' },
    { icon: '🏃', title: 'Exercise Regularly', description: 'At least 30 minutes, 3-5 times/week' },
    { icon: '🥗', title: 'Eat Balanced Meals', description: 'Include fruits, vegetables, and protein' },
    { icon: '🧘', title: 'Practice Mindfulness', description: '10 minutes of meditation daily' },
    { icon: '📱', title: 'Limit Screen Time', description: 'Take breaks from digital devices' },
    { icon: '👥', title: 'Connect with Others', description: 'Spend time with friends and family' }
  ]

  return (
    <div className="quick-tips">
      <h2>Quick Stress Management Tips</h2>

      <div className="personalized-section">
        <h3>Personalized for You</h3>
        <ul className="personalized-tips">
          {getPersonalizedTips().map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="general-section">
        <h3>General Wellness Tips</h3>
        <div className="tips-grid">
          {generalTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <span className="tip-icon">{tip.icon}</span>
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="emergency-section">
        <h3>⚠️ Need Immediate Help?</h3>
        <p>If you're experiencing severe stress or mental health crisis:</p>
        <ul>
          <li>Contact your campus counseling center</li>
          <li>Call National Suicide Prevention Lifeline: 988</li>
          <li>Text "HELLO" to 741741 (Crisis Text Line)</li>
        </ul>
      </div>
    </div>
  )
}

export default QuickTips
