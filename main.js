// PhishGuard - Main JavaScript File
// Interactive functionality for cute cybersecurity tools

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeURLScanner();
    initializeEmailAnalyzer();
    initializeWebsiteAnalyzer();
    initializeURLAnalyzer();
    initializeQuizSystem();
    initializeAnimations();
    
    // Load user data
    loadUserStats();
}

// URL Scanner Functionality
function initializeURLScanner() {
    const urlInput = document.getElementById('urlInput');
    const scanBtn = document.getElementById('scanBtn');
    const scanResults = document.getElementById('scanResults');
    
    if (!urlInput || !scanBtn) return;
    
    scanBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        if (!url) {
            showNotification('Please enter a URL to scan!', 'warning');
            return;
        }
        
        if (!isValidURL(url)) {
            showNotification('Please enter a valid URL!', 'warning');
            return;
        }
        
        performURLScan(url);
    });
    
    // Allow Enter key to trigger scan
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            scanBtn.click();
        }
    });
}

function performURLScan(url) {
    const scanBtn = document.getElementById('scanBtn');
    const scanResults = document.getElementById('scanResults');
    
    // Show loading state
    scanBtn.innerHTML = '⏳ Scanning...';
    scanBtn.disabled = true;
    
    // Simulate scan process
    setTimeout(() => {
        const result = analyzeURL(url);
        displayScanResults(result);
        
        // Reset button
        scanBtn.innerHTML = '🔍 Scan';
        scanBtn.disabled = false;
        
        // Save to scan history
        saveScanHistory(url, result);
        updateUserStats();
    }, 2000);
}

function analyzeURL(url) {
    // Simulate URL analysis with realistic results
    const suspiciousPatterns = [
        /bit\.ly|tinyurl|short\.link/i,
        /secure.*login|verify.*account/i,
        /\.ru|\.tk|\.ml$/i,
        /paypal.*security|bank.*verification/i
    ];
    
    const safePatterns = [
        /google\.com|facebook\.com|twitter\.com/i,
        /\.edu|\.gov$/i,
        /https:\/\/(www\.)?[a-z]+\.(com|org|net)$/i
    ];
    
    let riskScore = 0;
    let reasons = [];
    
    // Check for suspicious patterns
    suspiciousPatterns.forEach(pattern => {
        if (pattern.test(url)) {
            riskScore += 30;
            reasons.push('Suspicious URL pattern detected');
        }
    });
    
    // Check for safe patterns
    safePatterns.forEach(pattern => {
        if (pattern.test(url)) {
            riskScore -= 20;
            reasons.push('Trusted domain pattern');
        }
    });
    
    // Check URL length and complexity
    if (url.length > 100 || url.includes('%') || url.includes('@')) {
        riskScore += 15;
        reasons.push('Complex or encoded URL structure');
    }
    
    // Check for HTTPS
    if (url.startsWith('https://')) {
        riskScore -= 10;
        reasons.push('Secure HTTPS connection');
    } else {
        riskScore += 20;
        reasons.push('Insecure HTTP connection');
    }
    
    // Determine result
    let resultType = 'safe';
    let message = 'This website appears to be secure!';
    let mascot = 'teddy-guardian';
    
    if (riskScore > 60) {
        resultType = 'dangerous';
        message = 'High risk detected! Avoid this site.';
        mascot = 'teddy-guardian-danger';
    } else if (riskScore > 30) {
        resultType = 'suspicious';
        message = 'Proceed with caution - suspicious elements found.';
        mascot = 'panda-detective';
    }
    
    return {
        url: url,
        type: resultType,
        score: Math.max(0, Math.min(100, riskScore)),
        message: message,
        mascot: mascot,
        reasons: reasons,
        timestamp: new Date().toISOString()
    };
}

function displayScanResults(result) {
    const scanResults = document.getElementById('scanResults');
    if (!scanResults) return;
    
    let resultClass = 'scan-result-safe';
    let icon = '✅';
    
    if (result.type === 'dangerous') {
        resultClass = 'scan-result-danger';
        icon = '🚫';
    } else if (result.type === 'suspicious') {
        resultClass = 'scan-result-warning';
        icon = '⚠️';
    }
    
    scanResults.innerHTML = `
        <div class="${resultClass} rounded-2xl p-6 text-white">
            <div class="flex items-center justify-center space-x-4">
                <img src="resources/${result.mascot === 'teddy-guardian-danger' ? 'teddy-guardian' : result.mascot}.png" 
                     alt="Mascot" class="w-16 h-16">
                <div class="text-left">
                    <h3 class="text-2xl font-bold">${icon} ${result.message}</h3>
                    <p class="text-lg">Risk Score: ${result.score}/100</p>
                    ${result.reasons.length > 0 ? `<p class="text-sm mt-2">Key indicators: ${result.reasons.slice(0, 2).join(', ')}</p>` : ''}
                </div>
            </div>
        </div>
    `;
    
    scanResults.classList.remove('hidden');
    
    // Animate the result appearance
    anime({
        targets: scanResults,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        easing: 'easeOutBounce'
    });
}

// Email Analyzer Functionality
function initializeEmailAnalyzer() {
    const analyzeEmailBtn = document.getElementById('analyzeEmailBtn');
    const emailInput = document.getElementById('emailInput');
    const emailResults = document.getElementById('emailResults');
    
    if (!analyzeEmailBtn || !emailInput) return;
    
    analyzeEmailBtn.addEventListener('click', function() {
        const emailContent = emailInput.value.trim();
        if (!emailContent) {
            showNotification('Please paste email content to analyze!', 'warning');
            return;
        }
        
        analyzeEmail(emailContent);
    });
}

function analyzeEmail(content) {
    const analyzeEmailBtn = document.getElementById('analyzeEmailBtn');
    const emailResults = document.getElementById('emailResults');
    
    // Show loading state
    analyzeEmailBtn.innerHTML = '⏳ Analyzing Email...';
    analyzeEmailBtn.disabled = true;
    
    setTimeout(() => {
        const result = performEmailAnalysis(content);
        displayEmailResults(result);
        
        // Reset button
        analyzeEmailBtn.innerHTML = '🔍 Analyze Email';
        analyzeEmailBtn.disabled = false;
        
        if (emailResults) {
            emailResults.classList.remove('hidden');
            
            anime({
                targets: emailResults,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 800,
                easing: 'easeOutQuart'
            });
        }
    }, 2500);
}

function performEmailAnalysis(content) {
    const phishingIndicators = {
        urgentLanguage: /(urgent|immediate|act now|limited time|expires soon|verify now)/i,
        suspiciousLinks: /(bit\.ly|tinyurl|click here|suspicious.*link)/i,
        personalInfoRequest: /(password|social security|credit card|bank account|verify.*identity)/i,
        threateningLanguage: /(account will be closed|suspended|terminate|legal action)/i,
        spoofedBrands: /(paypal.*security|bank.*verification|amazon.*confirm)/i
    };
    
    let riskScore = 0;
    let detectedIssues = [];
    
    // Check for urgent language
    if (phishingIndicators.urgentLanguage.test(content)) {
        riskScore += 25;
        detectedIssues.push({
            type: 'urgent-language',
            severity: 'high',
            description: 'Urgent language detected',
            example: content.match(phishingIndicators.urgentLanguage)[0]
        });
    }
    
    // Check for suspicious links
    if (phishingIndicators.suspiciousLinks.test(content)) {
        riskScore += 20;
        detectedIssues.push({
            type: 'suspicious-links',
            severity: 'high',
            description: 'Suspicious link patterns found',
            example: 'Shortened URLs or suspicious domains'
        });
    }
    
    // Check for personal info requests
    if (phishingIndicators.personalInfoRequest.test(content)) {
        riskScore += 30;
        detectedIssues.push({
            type: 'personal-info',
            severity: 'critical',
            description: 'Requests for personal information',
            example: content.match(phishingIndicators.personalInfoRequest)[0]
        });
    }
    
    // Check for threatening language
    if (phishingIndicators.threateningLanguage.test(content)) {
        riskScore += 25;
        detectedIssues.push({
            type: 'threatening-language',
            severity: 'high',
            description: 'Threatening or intimidating language',
            example: content.match(phishingIndicators.threateningLanguage)[0]
        });
    }
    
    // Check for brand spoofing
    if (phishingIndicators.spoofedBrands.test(content)) {
        riskScore += 20;
        detectedIssues.push({
            type: 'brand-spoofing',
            severity: 'high',
            description: 'Possible brand impersonation',
            example: content.match(phishingIndicators.spoofedBrands)[0]
        });
    }
    
    let resultType = 'safe';
    if (riskScore > 60) {
        resultType = 'dangerous';
    } else if (riskScore > 30) {
        resultType = 'suspicious';
    }
    
    return {
        type: resultType,
        score: Math.min(100, riskScore),
        issues: detectedIssues,
        recommendations: generateEmailRecommendations(resultType, detectedIssues),
        timestamp: new Date().toISOString()
    };
}

function displayEmailResults(result) {
    const emailResults = document.getElementById('emailResults');
    if (!emailResults) return;
    
    // Results are already in the HTML, just need to update them
    // This is a simplified version - in a real app, you'd build this dynamically
}

function generateEmailRecommendations(type, issues) {
    const recommendations = [];
    
    if (type === 'dangerous' || type === 'suspicious') {
        recommendations.push("Do not click any links in this email");
        recommendations.push("Do not download any attachments");
        recommendations.push("Delete the email immediately");
        
        if (issues.some(issue => issue.type === 'brand-spoofing')) {
            recommendations.push("Contact the organization directly using official channels");
        }
    } else {
        recommendations.push("This email appears legitimate but stay vigilant");
        recommendations.push("Always verify sender addresses");
    }
    
    return recommendations;
}

// Website Analyzer Functionality
function initializeWebsiteAnalyzer() {
    const analyzeWebsiteBtn = document.getElementById('analyzeWebsiteBtn');
    const websiteInput = document.getElementById('websiteInput');
    const websiteResults = document.getElementById('websiteResults');
    
    if (!analyzeWebsiteBtn || !websiteInput) return;
    
    analyzeWebsiteBtn.addEventListener('click', function() {
        const websiteUrl = websiteInput.value.trim();
        if (!websiteUrl) {
            showNotification('Please enter a website URL!', 'warning');
            return;
        }
        
        analyzeWebsite(websiteUrl);
    });
}

function analyzeWebsite(url) {
    const analyzeWebsiteBtn = document.getElementById('analyzeWebsiteBtn');
    const websiteResults = document.getElementById('websiteResults');
    
    // Show loading state
    analyzeWebsiteBtn.innerHTML = '⏳ Analyzing Website...';
    analyzeWebsiteBtn.disabled = true;
    
    setTimeout(() => {
        const result = performWebsiteAnalysis(url);
        
        // Reset button
        analyzeWebsiteBtn.innerHTML = '🔒 Check Website Security';
        analyzeWebsiteBtn.disabled = false;
        
        if (websiteResults) {
            websiteResults.classList.remove('hidden');
            
            anime({
                targets: websiteResults,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 800,
                easing: 'easeOutQuart'
            });
        }
    }, 3000);
}

function performWebsiteAnalysis(url) {
    // Simulate comprehensive website analysis
    const analysis = {
        sslCertificate: Math.random() > 0.3, // 70% chance of valid SSL
        domainAge: Math.floor(Math.random() * 10), // 0-10 years
        malwareDetection: Math.random() > 0.9, // 10% chance of malware
        reputationScore: Math.floor(Math.random() * 100),
        suspiciousContent: Math.random() > 0.8, // 20% chance of suspicious content
        blacklisted: Math.random() > 0.95 // 5% chance of being blacklisted
    };
    
    let riskScore = 0;
    let securityFeatures = [];
    
    if (!analysis.sslCertificate) {
        riskScore += 30;
    } else {
        securityFeatures.push('Valid SSL Certificate');
    }
    
    if (analysis.domainAge < 1) {
        riskScore += 25;
    } else if (analysis.domainAge > 5) {
        riskScore -= 10;
        securityFeatures.push(`Domain established for ${analysis.domainAge} years`);
    }
    
    if (analysis.malwareDetection) {
        riskScore += 50;
    } else {
        securityFeatures.push('No malware detected');
    }
    
    if (analysis.suspiciousContent) {
        riskScore += 20;
    }
    
    if (analysis.blacklisted) {
        riskScore += 40;
    } else {
        securityFeatures.push('Not blacklisted');
    }
    
    const reputation = analysis.reputationScore;
    if (reputation > 80) {
        riskScore -= 15;
        securityFeatures.push('Good reputation score');
    } else if (reputation < 30) {
        riskScore += 20;
    }
    
    return {
        url: url,
        riskScore: Math.max(0, Math.min(100, riskScore)),
        securityFeatures: securityFeatures,
        isSafe: riskScore < 30,
        timestamp: new Date().toISOString()
    };
}

// Advanced URL Analyzer
function initializeURLAnalyzer() {
    const analyzeUrlBtn = document.getElementById('analyzeUrlBtn');
    const advancedUrlInput = document.getElementById('advancedUrlInput');
    const urlAnalysisProgress = document.getElementById('urlAnalysisProgress');
    const urlAnalysisResults = document.getElementById('urlAnalysisResults');
    
    if (!analyzeUrlBtn || !advancedUrlInput) return;
    
    analyzeUrlBtn.addEventListener('click', function() {
        const url = advancedUrlInput.value.trim();
        if (!url) {
            showNotification('Please enter a URL for analysis!', 'warning');
            return;
        }
        
        performAdvancedAnalysis(url);
    });
}

function performAdvancedAnalysis(url) {
    const analyzeUrlBtn = document.getElementById('analyzeUrlBtn');
    const urlAnalysisProgress = document.getElementById('urlAnalysisProgress');
    const urlAnalysisResults = document.getElementById('urlAnalysisResults');
    const analysisProgress = document.getElementById('analysisProgress');
    const analysisStatus = document.getElementById('analysisStatus');
    
    // Show progress
    analyzeUrlBtn.innerHTML = '⏳ Analyzing...';
    analyzeUrlBtn.disabled = true;
    
    if (urlAnalysisProgress) {
        urlAnalysisProgress.classList.remove('hidden');
    }
    
    // Simulate progressive analysis
    const steps = [
        { progress: 20, status: 'Checking domain reputation...' },
        { progress: 40, status: 'Analyzing URL structure...' },
        { progress: 60, status: 'Scanning threat databases...' },
        { progress: 80, status: 'Checking SSL certificate...' },
        { progress: 100, status: 'Analysis complete!' }
    ];
    
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            
            if (analysisProgress) {
                analysisProgress.style.width = step.progress + '%';
            }
            
            if (analysisStatus) {
                analysisStatus.textContent = step.status;
            }
            
            currentStep++;
        } else {
            clearInterval(progressInterval);
            
            setTimeout(() => {
                if (urlAnalysisProgress) {
                    urlAnalysisProgress.classList.add('hidden');
                }
                
                if (urlAnalysisResults) {
                    urlAnalysisResults.classList.remove('hidden');
                    
                    anime({
                        targets: urlAnalysisResults,
                        opacity: [0, 1],
                        translateY: [-20, 0],
                        duration: 800,
                        easing: 'easeOutQuart'
                    });
                }
                
                // Reset button
                analyzeUrlBtn.innerHTML = '🔍 Deep Analysis';
                analyzeUrlBtn.disabled = false;
            }, 500);
        }
    }, 500);
}

// Quiz System
function initializeQuizSystem() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const isCorrect = this.dataset.correct === 'true';
            handleQuizAnswer(this, isCorrect);
        });
    });
}

function handleQuizAnswer(selectedOption, isCorrect) {
    // Disable all options
    const allOptions = selectedOption.parentNode.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.6';
    });
    
    // Highlight selected answer
    if (isCorrect) {
        selectedOption.style.background = 'linear-gradient(135deg, #98FB98, #9CAF88)';
        selectedOption.style.color = 'white';
        selectedOption.innerHTML += ' ✅';
        
        // Show success animation
        anime({
            targets: selectedOption,
            scale: [1, 1.05, 1],
            duration: 600,
            easing: 'easeOutBounce'
        });
        
        showNotification('Great job! That was the correct answer! 🎉', 'success');
    } else {
        selectedOption.style.background = 'linear-gradient(135deg, #FFB6C1, #FF69B4)';
        selectedOption.style.color = 'white';
        selectedOption.innerHTML += ' ❌';
        
        // Show correct answer
        allOptions.forEach(opt => {
            if (opt.dataset.correct === 'true') {
                opt.style.background = 'linear-gradient(135deg, #98FB98, #9CAF88)';
                opt.style.color = 'white';
                opt.innerHTML += ' ✅';
            }
        });
        
        showNotification('Not quite right, but keep learning! The correct answer is highlighted. 📚', 'info');
    }
    
    // Update progress (simplified)
    updateQuizProgress(isCorrect);
}

function updateQuizProgress(isCorrect) {
    // In a real app, this would track progress across multiple questions
    if (isCorrect) {
        // Animate a teddy bear collection or progress indicator
        const progressElements = document.querySelectorAll('.quiz-progress .text-2xl');
        if (progressElements.length > 0) {
            anime({
                targets: progressElements[Math.floor(Math.random() * progressElements.length)],
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
                duration: 800,
                easing: 'easeOutBounce'
            });
        }
    }
}

// Animation System
function initializeAnimations() {
    // Animate mascot bounces
    const bouncingMascots = document.querySelectorAll('.mascot-bounce');
    bouncingMascots.forEach(mascot => {
        // Add subtle rotation to make it more dynamic
        anime({
            targets: mascot,
            rotate: [-2, 2, -2],
            duration: 3000,
            loop: true,
            easing: 'easeInOutSine'
        });
    });
    
    // Animate floating hearts
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        anime({
            targets: heart,
            translateY: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
            duration: 2000 + (index * 200),
            loop: true,
            easing: 'easeInOutSine',
            delay: index * 300
        });
    });
    
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'easeOutQuart',
                        delay: Math.random() * 200
                    });
                }
            });
        }, { threshold: 0.1 });
        
        featureCards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    }
}

// Utility Functions
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${getNotificationIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        warning: '⚠️',
        error: '🚫',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// User Stats and Data Management
function loadUserStats() {
    const stats = getUserStats();
    
    // Update stats display
    const scansToday = document.getElementById('scansToday');
    const threatsBlocked = document.getElementById('threatsBlocked');
    const safetyScore = document.getElementById('safetyScore');
    
    if (scansToday) scansToday.textContent = stats.scansToday;
    if (threatsBlocked) threatsBlocked.textContent = stats.threatsBlocked;
    if (safetyScore) safetyScore.textContent = stats.safetyScore + '%';
}

function getUserStats() {
    const defaultStats = {
        scansToday: Math.floor(Math.random() * 200) + 50,
        threatsBlocked: Math.floor(Math.random() * 30) + 5,
        safetyScore: Math.floor(Math.random() * 20) + 85,
        totalScans: Math.floor(Math.random() * 1000) + 500,
        quizScore: Math.floor(Math.random() * 40) + 60
    };
    
    return JSON.parse(localStorage.getItem('phishguard-stats')) || defaultStats;
}

function updateUserStats() {
    const stats = getUserStats();
    stats.scansToday += 1;
    
    // Simulate threat detection
    if (Math.random() > 0.7) {
        stats.threatsBlocked += 1;
    }
    
    // Update safety score
    stats.safetyScore = Math.min(100, stats.safetyScore + Math.floor(Math.random() * 3));
    
    localStorage.setItem('phishguard-stats', JSON.stringify(stats));
    loadUserStats();
}

function saveScanHistory(url, result) {
    const history = JSON.parse(localStorage.getItem('phishguard-history')) || [];
    
    history.unshift({
        url: url,
        result: result,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 scans
    if (history.length > 10) {
        history.splice(10);
    }
    
    localStorage.setItem('phishguard-history', JSON.stringify(history));
}

// Export functions for global access
window.PhishGuard = {
    showNotification,
    analyzeURL,
    getUserStats,
    updateUserStats
};