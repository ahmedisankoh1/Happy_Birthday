// Accordion functionality
function toggleAccordion(sectionNumber) {
    const content = document.getElementById(`content-${sectionNumber}`);
    const icon = document.getElementById(`icon-${sectionNumber}`);
    
    // Close all other accordion sections
    for (let i = 1; i <= 5; i++) {
        if (i !== sectionNumber) {
            const otherContent = document.getElementById(`content-${i}`);
            const otherIcon = document.getElementById(`icon-${i}`);
            
            otherContent.classList.remove('active');
            otherIcon.classList.remove('active');
            otherIcon.textContent = '+';
        }
    }
    
    // Toggle current section
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.classList.remove('active');
        icon.textContent = '+';
    } else {
        content.classList.add('active');
        icon.classList.add('active');
        icon.textContent = '×';
    }
}

// Confetti and hearts animation
let confettiInterval;

function createConfetti() {
    const container = document.getElementById('confetti-container');
    const isMobile = window.innerWidth <= 768;
    
    // Create hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'confetti heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        // Smaller size on mobile for better performance
        if (isMobile) {
            heart.style.fontSize = '16px';
        }
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 5000);
    }
    
    // Create colorful confetti pieces
    function createConfettiPiece() {
        const piece = document.createElement('div');
        const colors = ['💖', '🌸', '🎀', '💕', '🌺', '🦋', '✨', '🌙', '⭐'];
        piece.innerHTML = colors[Math.floor(Math.random() * colors.length)];
        piece.className = 'confetti';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        // Adjust size for mobile
        const size = isMobile ? (Math.random() * 6 + 12) : (Math.random() * 10 + 15);
        piece.style.fontSize = size + 'px';
        
        container.appendChild(piece);
        
        // Remove piece after animation
        setTimeout(() => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        }, 5000);
    }
    
    // Generate confetti continuously with mobile optimization
    const interval = isMobile ? 1000 : 800; // Slower on mobile
    confettiInterval = setInterval(() => {
        createHeart();
        createConfettiPiece();
        
        // Occasionally create multiple pieces at once (less frequent on mobile)
        const multipleChance = isMobile ? 0.2 : 0.3;
        if (Math.random() < multipleChance) {
            setTimeout(() => createConfettiPiece(), 100);
            if (!isMobile) {
                setTimeout(() => createHeart(), 200);
            }
        }
    }, interval);
}

// Initialize confetti when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start confetti animation
    createConfetti();
    
    // Add smooth scroll behavior for better user experience
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Improve mobile scrolling
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Add click animation to accordion headers with better mobile support
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        // Remove hover effects on touch devices
        if ('ontouchstart' in window) {
            header.style.filter = 'none';
        }
        
        header.addEventListener('click', function() {
            // Add a small scale animation on click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Add touch feedback
        header.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        header.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
    
    // Add entrance animation to accordion items
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200 + 500); // Stagger the animations
    });
    
    // Add entrance animation to title
    const title = document.querySelector('.main-title');
    title.style.opacity = '0';
    title.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        title.style.transition = 'all 0.8s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 200);
    
    // Optimize confetti for mobile performance
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Reduce confetti frequency on mobile for better performance
        clearInterval(confettiInterval);
        confettiInterval = setInterval(() => {
            if (Math.random() < 0.7) { // Reduce frequency
                createHeart();
            }
            if (Math.random() < 0.5) {
                createConfettiPiece();
            }
        }, 1200); // Slower interval
    }
});

// Add keyboard navigation support for accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('accordion-header')) {
            event.preventDefault();
            activeElement.click();
        }
    }
});

// Add touch support for better mobile experience
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    // This could be used for future enhancements like swiping between sections
    if (Math.abs(swipeDistance) > swipeThreshold) {
        // Swipe detected - could add navigation features here
    }
}

// Add a special birthday surprise - random sparkle effects
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.fontSize = '20px';
    sparkle.style.animation = 'sparkleEffect 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Add sparkle effect CSS animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleEffect {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Add sparkle effect on accordion clicks
document.addEventListener('click', function(event) {
    if (event.target.closest('.accordion-header')) {
        createSparkle(event.clientX, event.clientY);
    }
});
