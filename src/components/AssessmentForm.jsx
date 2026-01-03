import React, { useState } from 'react'
import './AssessmentForm.css'

function AssessmentForm({ onComplete }) {
  const [step, setStep] = useState('start')
  const [selectedMood, setSelectedMood] = useState(null)
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null
  })
  const [feelings, setFeelings] = useState('')

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
  }

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }))
  }

  const analyzeSentiment = (text) => {
    if (!text || text.trim() === '') return 'neutral'
    
    text = text.toLowerCase()
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'fine', 'well', 'better', 
                           'calm', 'peaceful', 'relaxed', 'confident', 'excited', 'hopeful']
    const negativeWords = ['stressed', 'anxious', 'worried', 'overwhelmed', 'tired', 'exhausted',
                           'depressed', 'sad', 'bad', 'terrible', 'awful', 'nervous', 'frustrated']
    
    let positiveCount = 0
    let negativeCount = 0
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++
    })
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++
    })
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  const analyzeStress = () => {
    if (!selectedMood) {
      alert('Please select your mood level')
      return
    }
    
    if (!answers.q1 || !answers.q2 || !answers.q3) {
      alert('Please answer all three questions')
      return
    }
    
    const examStress = answers.q1 === 'yes'
    const overwhelmed = answers.q2 === 'yes'
    const notEnoughSleep = answers.q3 === 'no'
    const sentiment = analyzeSentiment(feelings)
    
    let stressLevel
    
    if (selectedMood === 'high') {
      stressLevel = 'high'
    } else if (selectedMood === 'low' && !examStress && !overwhelmed && !notEnoughSleep) {
      stressLevel = 'low'
    } else {
      stressLevel = 'moderate'
    }
    
    const stressData = {
      stressLevel,
      mood: selectedMood,
      answers,
      sentiment,
      feelings
    }
    
    // Save to localStorage history
    const history = JSON.parse(localStorage.getItem('stressHistory') || '[]')
    history.push({
      timestamp: new Date().toISOString(),
      stressLevel,
      mood: selectedMood,
      answers,
      sentiment,
      feelings
    })
    if (history.length > 30) history.shift()
    localStorage.setItem('stressHistory', JSON.stringify(history))
    
    onComplete(stressData)
  }

  if (step === 'start') {
    return (
      <div className="container active" id="startPage">
        <div className="start-card">
          <div className="icon-circle">
            <span className="icon-emoji">🧠</span>
          </div>
          <h1>Student Stress Analyzer</h1>
          <p className="subtitle">Anonymous and Confidential Assessment</p>
          <p className="description">
            Take a quick 2-minute assessment to understand your current stress level and get personalized wellness tips.
          </p>
          <button className="start-btn" onClick={() => setStep('input')}>
            Start Assessment →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container active" id="inputPage">
      <div className="form-card">
        <h2>How are you feeling today?</h2>
        
        <div className="mood-selector">
          <button 
            className={`mood-btn low ${selectedMood === 'low' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('low')}
          >
            <span className="mood-icon">😊</span>
            <span>Low Stress</span>
          </button>
          <button 
            className={`mood-btn moderate ${selectedMood === 'moderate' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('moderate')}
          >
            <span className="mood-icon">😐</span>
            <span>Moderate</span>
          </button>
          <button 
            className={`mood-btn high ${selectedMood === 'high' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('high')}
          >
            <span className="mood-icon">😰</span>
            <span>High Stress</span>
          </button>
        </div>

        <div className="questions">
          <div className="question">
            <p>1. Are you currently stressed about exams or assignments?</p>
            <div className="options">
              <label>
                <input 
                  type="radio" 
                  name="q1" 
                  value="yes"
                  onChange={() => handleAnswerChange('q1', 'yes')}
                />
                Yes
              </label>
              <label>
                <input 
                  type="radio" 
                  name="q1" 
                  value="no"
                  onChange={() => handleAnswerChange('q1', 'no')}
                />
                No
              </label>
            </div>
          </div>

          <div className="question">
            <p>2. Do you feel overwhelmed with your current workload?</p>
            <div className="options">
              <label>
                <input 
                  type="radio" 
                  name="q2" 
                  value="yes"
                  onChange={() => handleAnswerChange('q2', 'yes')}
                />
                Yes
              </label>
              <label>
                <input 
                  type="radio" 
                  name="q2" 
                  value="no"
                  onChange={() => handleAnswerChange('q2', 'no')}
                />
                No
              </label>
            </div>
          </div>

          <div className="question">
            <p>3. Are you getting enough sleep (7-8 hours)?</p>
            <div className="options">
              <label>
                <input 
                  type="radio" 
                  name="q3" 
                  value="yes"
                  onChange={() => handleAnswerChange('q3', 'yes')}
                />
                Yes
              </label>
              <label>
                <input 
                  type="radio" 
                  name="q3" 
                  value="no"
                  onChange={() => handleAnswerChange('q3', 'no')}
                />
                No
              </label>
            </div>
          </div>

          <div className="question">
            <p>How are you feeling overall? (Optional)</p>
            <textarea 
              id="feelings" 
              rows="4" 
              placeholder="Share your thoughts..."
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button className="submit-btn" onClick={analyzeStress}>
          Analyze My Stress Level
        </button>
      </div>
    </div>
  )
}

export default AssessmentForm
