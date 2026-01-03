import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import AssessmentForm from './components/AssessmentForm'
import StressOverview from './components/StressOverview'
import StressHistory from './components/StressHistory'
import BreathingExercise from './components/BreathingExercise'
import CalmingMusic from './components/CalmingMusic'
import VisualRelief from './components/VisualRelief'
import QuickTips from './components/QuickTips'
import SupportChatbot from './components/SupportChatbot'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('assessment')
  const [stressData, setStressData] = useState(null)

  const handleAssessmentComplete = (data) => {
    setStressData(data)
    setActiveSection('overview')
  }

  const handleRestart = () => {
    setStressData(null)
    setActiveSection('assessment')
  }

  return (
    <div className="app">
      {!stressData ? (
        <AssessmentForm onComplete={handleAssessmentComplete} />
      ) : (
        <div className="dashboard-container">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <main className="main-content">
            {activeSection === 'overview' && (
              <StressOverview stressData={stressData} onRestart={handleRestart} />
            )}
            {activeSection === 'history' && <StressHistory />}
            {activeSection === 'breathing' && <BreathingExercise />}
            {activeSection === 'music' && <CalmingMusic />}
            {activeSection === 'visual' && <VisualRelief />}
            {activeSection === 'tips' && <QuickTips stressData={stressData} />}
            {activeSection === 'chatbot' && <SupportChatbot />}
          </main>
        </div>
      )}
    </div>
  )
}

export default App
