import React from 'react'
import './StressOverview.css'

function StressOverview({ stressData, onRestart }) {
  const getStressInfo = () => {
    switch (stressData.stressLevel) {
      case 'low':
        return {
          icon: '😊',
          color: '#4ade80',
          title: 'Low Stress Level',
          message: 'Great! Your stress level is manageable.',
          advice: 'Keep maintaining your current routine and self-care habits.'
        }
      case 'moderate':
        return {
          icon: '😐',
          color: '#fbbf24',
          title: 'Moderate Stress Level',
          message: 'You\'re experiencing some stress.',
          advice: 'Try incorporating relaxation techniques into your daily routine.'
        }
      case 'high':
        return {
          icon: '😰',
          color: '#f87171',
          title: 'High Stress Level',
          message: 'Your stress levels are elevated.',
          advice: 'Consider taking breaks and using stress management techniques below.'
        }
      default:
        return {}
    }
  }

  const info = getStressInfo()

  return (
    <div className="stress-overview">
      <div className="result-header">
        <div className="result-icon" style={{ background: info.color }}>
          {info.icon}
        </div>
        <h2>{info.title}</h2>
        <p className="result-message">{info.message}</p>
        <p className="result-advice">{info.advice}</p>
      </div>

      <div className="wellness-tools">
        <h3>Wellness Tools</h3>
        <p>Explore these features using the sidebar to help manage your stress:</p>
        <div className="tool-cards">
          <div className="tool-card">
            <span className="tool-icon">🫁</span>
            <h4>Breathing Exercise</h4>
            <p>Guided breathing to calm your mind</p>
          </div>
          <div className="tool-card">
            <span className="tool-icon">🎵</span>
            <h4>Calming Music</h4>
            <p>Relaxing tracks to soothe stress</p>
          </div>
          <div className="tool-card">
            <span className="tool-icon">🌅</span>
            <h4>Visual Relief</h4>
            <p>Calming images for mental peace</p>
          </div>
          <div className="tool-card">
            <span className="tool-icon">💡</span>
            <h4>Quick Tips</h4>
            <p>Personalized stress management tips</p>
          </div>
        </div>
      </div>

      <button className="restart-btn" onClick={onRestart}>
        Take Assessment Again
      </button>
    </div>
  )
}

export default StressOverview
