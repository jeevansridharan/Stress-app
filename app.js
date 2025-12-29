// Store selected mood
let selectedMood = null;
let currentStressData = null;

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
    const reliefSection = document.getElementById('reliefSection');
    const suggestionsDiv = document.getElementById('personalizedSuggestions');
    
    // Display stress level
    if (stressLevel === 'low') {
        resultDiv.innerHTML = '😊 Your stress level is: LOW<br><small>You seem to be managing well!</small>';
        resultDiv.className = 'stress-result stress-low';
        reliefSection.style.display = 'none';
        suggestionsDiv.style.display = 'none';
    } else if (stressLevel === 'medium') {
        resultDiv.innerHTML = '😐 Your stress level is: MEDIUM<br><small>Take a moment to relax</small>';
        resultDiv.className = 'stress-result stress-medium';
        reliefSection.style.display = 'block';
        suggestionsDiv.style.display = 'block';
        showPersonalizedSuggestions();
        playCalm();
    } else {
        resultDiv.innerHTML = '😰 Your stress level is: HIGH<br><small>Please take some time for yourself</small>';
        resultDiv.className = 'stress-result stress-high';
        reliefSection.style.display = 'block';
        suggestionsDiv.style.display = 'block';
        showPersonalizedSuggestions();
        playCalm();
    }
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

// Breathing exercise timer variables
let breathingInterval = null;
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
    
    // Stop audio if playing
    const audio = document.getElementById('calmAudio');
    audio.pause();
    audio.currentTime = 0;
    
    // Stop breathing exercise
    stopBreathing();
    
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
