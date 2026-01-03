import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import './StressHistory.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function StressHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const storedHistory = localStorage.getItem('stressHistory')
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }

  const getStressLevelValue = (level) => {
    switch (level) {
      case 'low': return 1
      case 'moderate': return 2
      case 'high': return 3
      default: return 0
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const chartData = {
    labels: history.map(entry => formatDate(entry.timestamp)),
    datasets: [
      {
        label: 'Stress Level',
        data: history.map(entry => getStressLevelValue(entry.stressLevel)),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#2d3748'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y
            const labels = ['', 'Low Stress', 'Moderate Stress', 'High Stress']
            return labels[value]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const labels = ['', 'Low', 'Moderate', 'High']
            return labels[value]
          },
          color: '#4a5568',
          font: {
            size: 12
          }
        },
        grid: {
          color: '#e2e8f0'
        }
      },
      x: {
        ticks: {
          color: '#4a5568',
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  }

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('stressHistory')
      setHistory([])
    }
  }

  return (
    <div className="stress-history">
      <h2>Your Stress History</h2>
      <p className="description">Track your stress levels over time and identify patterns.</p>

      {history.length === 0 ? (
        <div className="no-history">
          <span className="no-history-icon">📊</span>
          <h3>No History Yet</h3>
          <p>Complete a stress assessment to start tracking your stress levels.</p>
        </div>
      ) : (
        <>
          <div className="chart-container">
            <div className="chart-wrapper">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="history-stats">
            <div className="stat-card">
              <span className="stat-icon">📈</span>
              <div className="stat-info">
                <h4>Total Assessments</h4>
                <p className="stat-value">{history.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <div className="stat-info">
                <h4>Latest Assessment</h4>
                <p className="stat-value">{formatDate(history[history.length - 1].timestamp)}</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <div className="stat-info">
                <h4>Average Level</h4>
                <p className="stat-value">
                  {history.length > 0 
                    ? (history.reduce((sum, entry) => sum + getStressLevelValue(entry.stressLevel), 0) / history.length).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="history-list">
            <h3>Recent Assessments</h3>
            <div className="history-items">
              {history.slice().reverse().slice(0, 10).map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">{formatDate(entry.timestamp)}</div>
                  <div className={`history-badge ${entry.stressLevel}`}>
                    {entry.stressLevel}
                  </div>
                  <div className="history-mood">Mood: {entry.mood}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="clear-btn" onClick={clearHistory}>
            Clear History
          </button>
        </>
      )}
    </div>
  )
}

export default StressHistory
