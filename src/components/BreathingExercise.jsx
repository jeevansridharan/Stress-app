import React, { useState, useEffect } from 'react'
import './BreathingExercise.css'

function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale')
  const [seconds, setSeconds] = useState(4)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev === 1) {
          // Move to next phase
          setPhase(currentPhase => {
            if (currentPhase === 'inhale') return 'hold'
            if (currentPhase === 'hold') return 'exhale'
            return 'inhale'
          })
          return currentPhase === 'hold' ? 7 : 4
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const toggleExercise = () => {
    if (isActive) {
      setIsActive(false)
      setPhase('inhale')
      setSeconds(4)
    } else {
      setIsActive(true)
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
      default: return ''
    }
  }

  return (
    <div className="breathing-exercise">
      <h2>Guided Breathing Exercise</h2>
      <p className="description">
        Follow the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.
      </p>

      <div className={`breathing-circle ${isActive ? phase : ''}`}>
        <div className="breathing-text">
          <div className="phase-text">{getPhaseText()}</div>
          <div className="seconds">{seconds}</div>
        </div>
      </div>

      <button className="control-btn" onClick={toggleExercise}>
        {isActive ? 'Stop Exercise' : 'Start Exercise'}
      </button>

      <div className="benefits">
        <h3>Benefits</h3>
        <ul>
          <li>Reduces anxiety and stress</li>
          <li>Improves focus and concentration</li>
          <li>Helps you fall asleep faster</li>
          <li>Lowers blood pressure</li>
        </ul>
      </div>
    </div>
  )
}

export default BreathingExercise
