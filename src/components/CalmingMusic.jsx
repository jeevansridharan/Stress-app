import React, { useState } from 'react'
import './CalmingMusic.css'

function CalmingMusic() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const tracks = [
    { name: 'Peaceful Piano', url: 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3' },
    { name: 'Calm Waves', url: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3' },
    { name: 'Meditation Flow', url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3' }
  ]

  const toggleMusic = () => {
    const audio = document.getElementById('calmingAudio')
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const changeTrack = (index) => {
    const audio = document.getElementById('calmingAudio')
    audio.pause()
    setCurrentTrack(index)
    setIsPlaying(false)
  }

  return (
    <div className="calming-music">
      <h2>Calming Music</h2>
      <p className="description">Listen to soothing music to help reduce stress and anxiety.</p>

      <div className="music-player">
        <div className="now-playing">
          <span className="music-icon">🎵</span>
          <div className="track-info">
            <div className="track-name">{tracks[currentTrack].name}</div>
            <div className="track-status">{isPlaying ? 'Now Playing' : 'Paused'}</div>
          </div>
        </div>

        <audio 
          id="calmingAudio" 
          src={tracks[currentTrack].url}
          onEnded={() => setIsPlaying(false)}
        />

        <button className="play-btn" onClick={toggleMusic}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <div className="track-list">
        <h3>Available Tracks</h3>
        {tracks.map((track, index) => (
          <div 
            key={index}
            className={`track-item ${currentTrack === index ? 'active' : ''}`}
            onClick={() => changeTrack(index)}
          >
            <span className="track-number">{index + 1}</span>
            <span className="track-title">{track.name}</span>
            {currentTrack === index && isPlaying && <span className="playing-indicator">♪</span>}
          </div>
        ))}
      </div>

      <div className="music-benefits">
        <h3>Music Therapy Benefits</h3>
        <ul>
          <li>Reduces cortisol (stress hormone)</li>
          <li>Improves mood and emotional well-being</li>
          <li>Enhances concentration and productivity</li>
          <li>Promotes better sleep quality</li>
        </ul>
      </div>
    </div>
  )
}

export default CalmingMusic
