// Store selected mood
let selectedMood = null;
let currentStressData = null;
let imageRotationInterval = null;

// Stress relief images array - Real calming photos
const reliefImages = [
    { src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop', caption: 'Peaceful ocean sunset brings tranquility.' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', caption: 'Forest path invites peaceful walks.' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: 'Majestic mountains inspire calmness.' },
    { src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop', caption: 'Serene lake reflects inner peace.' },
    { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop', caption: 'Flower fields bring joy and calm.' },
    { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', caption: 'Mountain peaks reach for serenity.' },
    { src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop', caption: 'Misty forest creates peaceful atmosphere.' },
    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', caption: 'Beach waves wash away worries.' },
    { src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop', caption: 'Lavender fields promote relaxation.' },
    { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop', caption: 'Green valleys soothe the soul.' },
    { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop', caption: 'Autumn leaves bring peaceful change.' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: 'Snow-covered peaks radiate purity.' },
    { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop', caption: 'Waterfall sounds calm the mind.' },
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop', caption: 'Nature trail leads to inner peace.' },
    { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', caption: 'Rolling hills create harmony.' },
    { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop', caption: 'Tropical paradise brings serenity.' },
    { src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=600&fit=crop', caption: 'Calm waters reflect tranquility.' },
    { src: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=600&fit=crop', caption: 'Misty mountains embrace stillness.' },
    { src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop', caption: 'Cherry blossoms symbolize renewal.' },
    { src: 'https://images.unsplash.com/photo-1445264718952-f95a5a68e8a0?w=800&h=600&fit=crop', caption: 'Zen garden promotes mindfulness.' }
];
let currentImageIndex = 0;

// Initialize history from localStorage
function getStressHistory() {
    const history = localStorage.getItem('stressHistory');
    return history ? JSON.parse(history) : [];
}

// Save stress result to history
function saveStressHistory(stressLevel, mood, answers, sentiment, feelings) {
    const history = getStressHistory();
    const entry = {
        timestamp: new Date().toISOString(),
        stressLevel: stressLevel,
        mood: mood,
        answers: answers,
        sentiment: sentiment,
        feelings: feelings
    };
    history.push(entry);
    
    // Keep only last 30 entries
    if (history.length > 30) {
        history.shift();
    }
    
    localStorage.setItem('stressHistory', JSON.stringify(history));
}

// Simple sentiment analysis using keywords
function analyzeSentiment(text) {
    if (!text || text.trim() === '') {
        return 'neutral';
    }
    
    text = text.toLowerCase();
    
    // Positive keywords
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'fine', 'well', 'better', 
                           'calm', 'peaceful', 'relaxed', 'confident', 'excited', 'hopeful',
                           'blessed', 'grateful', 'positive', 'okay', 'manageable'];
    
    // Negative keywords
    const negativeWords = ['stressed', 'anxious', 'worried', 'overwhelmed', 'tired', 'exhausted',
                           'depressed', 'sad', 'bad', 'terrible', 'awful', 'horrible', 'scared',
                           'afraid', 'nervous', 'pressured', 'struggling', 'difficult', 'hard',
                           'panic', 'fear', 'worried', 'upset', 'angry', 'frustrated'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

// Show input page
function showInputPage() {
    document.getElementById('startPage').classList.remove('active');
    document.getElementById('inputPage').classList.add('active');
}

// Select mood
function selectMood(mood) {
    selectedMood = mood;
    
    // Remove selected class from all mood buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    document.getElementById('mood' + mood.charAt(0).toUpperCase() + mood.slice(1)).classList.add('selected');
}

// Analyze stress based on inputs
function analyzeStress() {
    // Check if mood is selected
    if (!selectedMood) {
        alert('Please select your mood level');
        return;
    }
    
    // Check if all questions are answered
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    
    if (!q1 || !q2 || !q3) {
        alert('Please answer all three questions');
        return;
    }
    
    // Get answers
    const examStress = q1.value === 'yes';
    const overwhelmed = q2.value === 'yes';
    const notEnoughSleep = q3.value === 'no';
    
    // Get feelings text and analyze sentiment
    const feelings = document.getElementById('feelings').value;
    const sentiment = analyzeSentiment(feelings);
    
    // Calculate stress level based on simple logic
    let stressLevel;
    
    // If mood is high, stress is high
    if (selectedMood === 'high') {
        stressLevel = 'high';
    }
    // If mood is low and all answers are good
    else if (selectedMood === 'low' && !examStress && !overwhelmed && !notEnoughSleep) {
        stressLevel = 'low';
    }
    // If there are mixed answers or concerns
    else if (examStress || overwhelmed || notEnoughSleep) {
        stressLevel = selectedMood === 'low' ? 'medium' : 'high';
    }
    // Default to medium for mixed cases
    else {
        stressLevel = selectedMood === 'medium' ? 'medium' : 'low';
    }
    
    // Adjust stress level slightly based on sentiment
    if (sentiment === 'negative' && stressLevel === 'low') {
        stressLevel = 'medium';
    } else if (sentiment === 'positive' && stressLevel === 'high') {
        // Don't downgrade if clear high stress indicators
        if (!examStress && !overwhelmed && !notEnoughSleep) {
            stressLevel = 'medium';
        }
    }
    
    // Store data for history and personalized suggestions
    currentStressData = {
        stressLevel: stressLevel,
        mood: selectedMood,
        examStress: examStress,
        overwhelmed: overwhelmed,
        notEnoughSleep: notEnoughSleep,
        sentiment: sentiment,
        feelings: feelings
    };
    
    // Save to history
    saveStressHistory(stressLevel, selectedMood, {
        examStress: examStress,
        overwhelmed: overwhelmed,
        notEnoughSleep: notEnoughSleep
    }, sentiment, feelings);
    
    // Show result page
    showResult(stressLevel);
}

// Show result page
function showResult(stressLevel) {
    document.getElementById('inputPage').classList.remove('active');
    document.getElementById('resultPage').classList.add('active');
    
    const resultDiv = document.getElementById('stressResult');
    const badge = document.getElementById('stressLevelBadge');
    
    console.log('Stress Level:', stressLevel); // Debug log
    
    // Update badge
    badge.className = 'stress-badge';
    
    // Display stress level
    if (stressLevel === 'low') {
        resultDiv.innerHTML = '😊 Your stress level is: <strong>LOW</strong><br><small>You seem to be managing well! Keep up the good work.</small>';
        resultDiv.className = 'stress-result stress-low';
        badge.textContent = 'LOW STRESS';
        badge.classList.add('badge-low');
    } else if (stressLevel === 'medium') {
        resultDiv.innerHTML = '😐 Your stress level is: <strong>MEDIUM</strong><br><small>Take a moment to relax and use the tools below.</small>';
        resultDiv.className = 'stress-result stress-medium';
        badge.textContent = 'MEDIUM STRESS';
        badge.classList.add('badge-medium');
    } else {
        resultDiv.innerHTML = '😰 Your stress level is: <strong>HIGH</strong><br><small>Please take time for self-care. Use the relief tools below.</small>';
        resultDiv.className = 'stress-result stress-high';
        badge.textContent = 'HIGH STRESS';
        badge.classList.add('badge-high');
    }
    
    // Always show personalized suggestions for medium/high stress
    if (stressLevel !== 'low') {
        showPersonalizedSuggestions();
    }
}

/* ============================================
   DASHBOARD INTERACTIVE FEATURES
   ============================================ */

// Breathing Modal - Open/Close
function openBreathingModal() {
    document.getElementById('breathingModal').style.display = 'flex';
}

function closeBreathingModal() {
    stopBreathingCycle();
    document.getElementById('breathingModal').style.display = 'none';
}

// Breathing Animation Variables
let breathingInterval = null;
let breathingPhase = 0;

// Start Breathing Cycle
function startBreathingCycle() {
    stopBreathingCycle(); // Clear any existing cycle
    
    const circle = document.getElementById('breathingCircleModal');
    const text = document.getElementById('breathingText');
    const instruction = document.getElementById('breathingInstruction');
    const startBtn = document.getElementById('startBreathingModalBtn');
    const stopBtn = document.getElementById('stopBreathingModalBtn');
    
    // Toggle buttons
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    breathingPhase = 0;
    
    function breathingCycle() {
        circle.className = 'breathing-circle-modal';
        
        if (breathingPhase === 0) {
            // Breathe In - 4 seconds
            circle.classList.add('breathe-in');
            text.textContent = 'Breathe In';
            instruction.textContent = 'Inhale deeply through your nose (4 seconds)';
        } else if (breathingPhase === 1) {
            // Hold - 4 seconds
            circle.classList.add('hold');
            text.textContent = 'Hold';
            instruction.textContent = 'Hold your breath (4 seconds)';
        } else if (breathingPhase === 2) {
            // Breathe Out - 6 seconds
            circle.classList.add('breathe-out');
            text.textContent = 'Breathe Out';
            instruction.textContent = 'Exhale slowly through your mouth (6 seconds)';
        }
        
        breathingPhase = (breathingPhase + 1) % 3;
    }
    
    // Start immediately
    breathingCycle();
    
    // Set interval based on phase timing
    let phaseIndex = 0;
    const phaseDurations = [4000, 4000, 6000]; // Breathe In, Hold, Breathe Out
    
    function scheduleNext() {
        breathingInterval = setTimeout(() => {
            breathingCycle();
            phaseIndex = (phaseIndex + 1) % 3;
            scheduleNext();
        }, phaseDurations[phaseIndex]);
    }
    
    scheduleNext();
}

// Stop Breathing Cycle
function stopBreathingCycle() {
    if (breathingInterval) {
        clearTimeout(breathingInterval);
        breathingInterval = null;
    }
    
    const circle = document.getElementById('breathingCircleModal');
    const text = document.getElementById('breathingText');
    const instruction = document.getElementById('breathingInstruction');
    const startBtn = document.getElementById('startBreathingModalBtn');
    const stopBtn = document.getElementById('stopBreathingModalBtn');
    
    if (circle) {
        circle.className = 'breathing-circle-modal';
        text.textContent = 'Ready';
        instruction.textContent = 'Click Start to begin';
    }
    
    if (startBtn) startBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'none';
}

// Music Toggle
let isMusicPlaying = false;
let currentAudioIndex = 0;
const audioTracks = [
    { id: 'calmAudio1', name: 'Relaxing Melody' },
    { id: 'calmAudio2', name: 'Nature Sounds' },
    { id: 'calmAudio3', name: 'Slow Motion' },
    { id: 'calmAudio4', name: 'Sunny Day' },
    { id: 'calmAudio5', name: 'Piano Moment' }
];

function toggleMusic() {
    const currentAudio = document.getElementById(audioTracks[currentAudioIndex].id);
    const btn = document.getElementById('musicToggleBtn');
    
    if (isMusicPlaying) {
        currentAudio.pause();
        btn.textContent = '▶️ Play Music';
        btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        isMusicPlaying = false;
    } else {
        currentAudio.play();
        btn.textContent = `⏸️ ${audioTracks[currentAudioIndex].name}`;
        btn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        isMusicPlaying = true;
    }
}

// Change to next audio track
function nextAudioTrack() {
    // Pause current audio
    const currentAudio = document.getElementById(audioTracks[currentAudioIndex].id);
    const wasPlaying = isMusicPlaying;
    
    if (isMusicPlaying) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Move to next track
    currentAudioIndex = (currentAudioIndex + 1) % audioTracks.length;
    
    // Update button text
    const btn = document.getElementById('musicToggleBtn');
    if (wasPlaying) {
        const nextAudio = document.getElementById(audioTracks[currentAudioIndex].id);
        nextAudio.play();
        btn.textContent = `⏸️ ${audioTracks[currentAudioIndex].name}`;
    } else {
        btn.textContent = '▶️ Play Music';
    }
}
        btn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        isMusicPlaying = true;
    


// Visual Relief Toggle
function toggleVisuals() {
    const section = document.getElementById('visualsSection');
    const btn = document.getElementById('visualToggleBtn');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        btn.textContent = 'Hide Visuals';
        displayReliefImage(); // Show first image
    } else {
        section.style.display = 'none';
        btn.textContent = 'Show Visuals';
        stopImageRotation();
    }
}

// Tips Toggle
function toggleTips() {
    const section = document.getElementById('tipsSection');
    const btn = document.getElementById('tipsToggleBtn');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        btn.textContent = 'Hide Tips';
    } else {
        section.style.display = 'none';
        btn.textContent = 'View Tips';
    }
}

// Start image rotation for stress relief
function startImageRotation() {
    // Stop any existing rotation
    stopImageRotation();
    
    // Show image content area
    document.getElementById('imageContentArea').style.display = 'block';
    
    // Toggle buttons
    document.getElementById('startImagesBtn').style.display = 'none';
    document.getElementById('stopImagesBtn').style.display = 'inline-block';
    
    // Show first image immediately
    currentImageIndex = 0;
    displayReliefImage();
    
    // Rotate images every 45 seconds (between 30-60 seconds)
    imageRotationInterval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % reliefImages.length;
        displayReliefImage();
    }, 45000); // 45 seconds
}

// Display current relief image
function displayReliefImage() {
    const imgElement = document.getElementById('reliefImage');
    const captionElement = document.getElementById('reliefCaption');
    const currentImage = reliefImages[currentImageIndex];
    
    // Fade out effect
    imgElement.style.opacity = '0';
    
    setTimeout(() => {
        imgElement.src = currentImage.src;
        captionElement.textContent = currentImage.caption;
        // Fade in effect
        imgElement.style.opacity = '1';
    }, 500);
}

// Stop image rotation
function stopImageRotation() {
    if (imageRotationInterval) {
        clearInterval(imageRotationInterval);
        imageRotationInterval = null;
    }
    
    // Hide image content area
    const contentArea = document.getElementById('imageContentArea');
    if (contentArea) {
        contentArea.style.display = 'none';
    }
    
    // Toggle buttons
    const startBtn = document.getElementById('startImagesBtn');
    const stopBtn = document.getElementById('stopImagesBtn');
    if (startBtn) startBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'none';
}

// Show personalized suggestions based on stress type
function showPersonalizedSuggestions() {
    const suggestionsDiv = document.getElementById('personalizedSuggestions');
    const data = currentStressData;
    
    let suggestions = '<h2>📋 Personalized Tips for You</h2>';
    
    // Academic stress suggestions
    if (data.examStress) {
        suggestions += `
            <div class="suggestion-card academic">
                <h3>📚 Academic Stress Relief</h3>
                <ul>
                    <li><strong>Break it down:</strong> Divide study material into small, manageable chunks</li>
                    <li><strong>Pomodoro technique:</strong> Study for 25 minutes, then take a 5-minute break</li>
                    <li><strong>Create a schedule:</strong> Plan your study time and stick to realistic goals</li>
                    <li><strong>Ask for help:</strong> Reach out to classmates, tutors, or professors</li>
                    <li><strong>Practice active recall:</strong> Test yourself instead of just re-reading</li>
                </ul>
            </div>
        `;
    }
    
    // Emotional overwhelm suggestions
    if (data.overwhelmed) {
        suggestions += `
            <div class="suggestion-card emotional">
                <h3>💙 Emotional Wellness Tips</h3>
                <ul>
                    <li><strong>Practice mindfulness:</strong> Try 5 minutes of meditation or deep breathing</li>
                    <li><strong>Talk to someone:</strong> Share your feelings with a trusted friend or counselor</li>
                    <li><strong>Journal:</strong> Write down your thoughts and feelings</li>
                    <li><strong>Say no:</strong> It's okay to decline extra commitments</li>
                    <li><strong>Practice self-compassion:</strong> Be kind to yourself</li>
                </ul>
            </div>
        `;
    }
    
    // Sleep suggestions
    if (data.notEnoughSleep) {
        suggestions += `
            <div class="suggestion-card sleep">
                <h3>😴 Better Sleep Habits</h3>
                <ul>
                    <li><strong>Set a schedule:</strong> Go to bed and wake up at the same time daily</li>
                    <li><strong>Screen-free time:</strong> Avoid phones/laptops 1 hour before bed</li>
                    <li><strong>Create a routine:</strong> Wind down with relaxing activities</li>
                    <li><strong>Optimize environment:</strong> Keep bedroom cool, dark, and quiet</li>
                    <li><strong>Limit caffeine:</strong> Avoid coffee after 2 PM</li>
                </ul>
            </div>
        `;
    }
    
    // Sentiment-based encouragement
    if (data.sentiment === 'negative') {
        suggestions += `
            <div class="suggestion-card encouragement">
                <h3>💪 Remember</h3>
                <p>Your feelings are valid. Difficult times are temporary. You have the strength to get through this. Consider reaching out to campus counseling services for additional support.</p>
            </div>
        `;
    } else if (data.sentiment === 'positive') {
        suggestions += `
            <div class="suggestion-card encouragement">
                <h3>🌟 Keep It Up!</h3>
                <p>Your positive mindset is a great strength! Continue with the healthy habits that are working for you.</p>
            </div>
        `;
    }
    
    suggestionsDiv.innerHTML = suggestions;
}

// Play calm audio
function playCalm() {
    const audio = document.getElementById('calmAudio');
    // Auto-play is often blocked by browsers, so we'll just make it available
    // The user can click play when ready
}

// Breathing exercise timer variables (breathingInterval already declared at top)
let breathingTimeout = null;

// Start breathing exercise
function startBreathing(minutes) {
    const circle = document.getElementById('breathingCircle');
    const timerDisplay = document.getElementById('breathingTimer');
    const stopBtn = document.getElementById('stopBreathingBtn');
    
    // Clear any existing timers
    stopBreathing();
    
    // Start animation
    circle.classList.remove('paused');
    circle.classList.add('active');
    
    // Show stop button
    stopBtn.style.display = 'block';
    
    // Calculate total seconds
    let totalSeconds = minutes * 60;
    let remainingSeconds = totalSeconds;
    
    // Update timer display
    function updateTimer() {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (remainingSeconds <= 0) {
            stopBreathing();
            timerDisplay.textContent = 'Complete! 🎉';
            setTimeout(() => {
                timerDisplay.textContent = '';
            }, 3000);
        } else {
            remainingSeconds--;
        }
    }
    
    // Initial display
    updateTimer();
    
    // Update every second
    breathingInterval = setInterval(updateTimer, 1000);
    
    // Auto-stop after duration
    breathingTimeout = setTimeout(() => {
        stopBreathing();
    }, totalSeconds * 1000);
}

// Stop breathing exercise
function stopBreathing() {
    const circle = document.getElementById('breathingCircle');
    const timerDisplay = document.getElementById('breathingTimer');
    const stopBtn = document.getElementById('stopBreathingBtn');
    
    // Stop animation
    circle.classList.remove('active');
    circle.classList.add('paused');
    
    // Clear timers
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    
    if (breathingTimeout) {
        clearTimeout(breathingTimeout);
        breathingTimeout = null;
    }
    
    // Hide stop button
    stopBtn.style.display = 'none';
    
    // Clear timer display if not showing completion
    if (!timerDisplay.textContent.includes('Complete')) {
        timerDisplay.textContent = '';
    }
}

// Restart the assessment
function restart() {
    // Reset all inputs
    selectedMood = null;
    currentStressData = null;
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('feelings').value = '';
    
    // Stop all active features - stop all audio tracks
    audioTracks.forEach(track => {
        const audio = document.getElementById(track.id);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    isMusicPlaying = false;
    currentAudioIndex = 0;
    
    stopBreathingCycle();
    stopImageRotation();
    closeBreathingModal();
    
    // Reset UI
    document.getElementById('visualsSection').style.display = 'none';
    document.getElementById('tipsSection').style.display = 'none';
    
    // Go back to start page
    document.getElementById('resultPage').classList.remove('active');
    document.getElementById('historyPage').classList.remove('active');
    document.getElementById('startPage').classList.add('active');
}

// View stress history
function viewHistory() {
    document.getElementById('resultPage').classList.remove('active');
    document.getElementById('historyPage').classList.add('active');
    displayStressHistory();
}

// Back to result page
function backToResult() {
    document.getElementById('historyPage').classList.remove('active');
    document.getElementById('resultPage').classList.add('active');
}

// Display stress history chart
function displayStressHistory() {
    const history = getStressHistory();
    
    if (history.length === 0) {
        document.getElementById('historyInfo').innerHTML = '📊 No history yet. Complete more assessments to see your stress trend.';
        return;
    }
    
    // Get last 7 days of data
    const last7Days = history.slice(-7);
    
    // Prepare data for chart
    const labels = last7Days.map(entry => {
        const date = new Date(entry.timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const stressValues = last7Days.map(entry => {
        if (entry.stressLevel === 'low') return 1;
        if (entry.stressLevel === 'medium') return 2;
        return 3; // high
    });
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart('stressChart');
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Create chart
    const ctx = document.getElementById('stressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stress Level',
                data: stressValues,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: stressValues.map(val => {
                    if (val === 1) return '#28a745';
                    if (val === 2) return '#ffc107';
                    return '#dc3545';
                }),
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 3,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (value === 1) return 'Low';
                            if (value === 2) return 'Medium';
                            if (value === 3) return 'High';
                            return '';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            if (value === 1) return 'Stress: Low';
                            if (value === 2) return 'Stress: Medium';
                            return 'Stress: High';
                        }
                    }
                }
            }
        }
    });
    
    // Show history info
    const avgStress = (stressValues.reduce((a, b) => a + b, 0) / stressValues.length).toFixed(1);
    let avgLevel = 'Low';
    if (avgStress >= 2.5) avgLevel = 'High';
    else if (avgStress >= 1.5) avgLevel = 'Medium';
    
    document.getElementById('historyInfo').innerHTML = `
        📊 You've completed <strong>${history.length}</strong> assessment${history.length > 1 ? 's' : ''}.<br>
        Your average stress level: <strong>${avgLevel}</strong>
    `;
}
