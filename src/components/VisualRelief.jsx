import React, { useState, useEffect } from 'react'
import './VisualRelief.css'

function VisualRelief() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  const reliefImages = [
    { src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', caption: 'Peaceful ocean sunset brings tranquility.' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', caption: 'Forest path invites peaceful walks.' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: 'Majestic mountains inspire calmness.' },
    { src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop', caption: 'Serene lake reflects inner peace.' },
    { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop', caption: 'Flower fields bring joy and calm.' },
    { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', caption: 'Mountain peaks reach for serenity.' },
    { src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop', caption: 'Misty forest creates peaceful atmosphere.' },
    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', caption: 'Beach waves wash away worries.' }
  ]

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reliefImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, reliefImages.length])

  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % reliefImages.length)
  }

  const prevImage = () => {
    setCurrentIndex(prev => (prev - 1 + reliefImages.length) % reliefImages.length)
  }

  return (
    <div className="visual-relief">
      <h2>Visual Relief</h2>
      <p className="description">View calming nature images to help reduce stress and promote relaxation.</p>

      <div className="image-viewer">
        <img 
          src={reliefImages[currentIndex].src} 
          alt="Calming nature scene"
          className="relief-image"
        />
        <div className="image-caption">{reliefImages[currentIndex].caption}</div>
        
        <div className="image-controls">
          <button className="nav-btn" onClick={prevImage}>← Previous</button>
          <button 
            className="autoplay-btn" 
            onClick={() => setIsAutoPlay(!isAutoPlay)}
          >
            {isAutoPlay ? '⏸ Pause' : '▶ Auto Play'}
          </button>
          <button className="nav-btn" onClick={nextImage}>Next →</button>
        </div>

        <div className="image-counter">
          {currentIndex + 1} / {reliefImages.length}
        </div>
      </div>

      <div className="visual-benefits">
        <h3>Visual Therapy Benefits</h3>
        <ul>
          <li>Reduces mental fatigue and eye strain</li>
          <li>Lowers heart rate and blood pressure</li>
          <li>Improves mood and emotional state</li>
          <li>Provides mental escape from stressors</li>
        </ul>
      </div>
    </div>
  )
}

export default VisualRelief
