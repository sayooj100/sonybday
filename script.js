/**
 * CONFIGURATION / DATA
 * All content can be edited here.
 */
const CONFIG = {
    birthdayPerson: "Sony",
    senderName: "Somesh",
    popperMessages: [
        "You're a rare gem! 💎",
        "Keep shining like a star! ⭐",
        "Our friendship is eternal! ♾️"
    ],
    // Music URL - Using a placeholder royalty-free track
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    // Interaction sounds (optional)
    sounds: {
        click: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
        pop: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
        fireworks: "https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3"
    },
    confettiColors: ['#FFB6C1', '#FFD700', '#FFFFFF', '#FF69B4']
};

/**
 * STATE MANAGEMENT
 */
let currentState = {
    currentPage: 1,
    isMuted: true,
    poppersClicked: 0,
    audio: null,
    particles: []
};

/**
 * INITIALIZATION
 */
window.addEventListener('DOMContentLoaded', () => {
    // Initialize Audio
    currentState.audio = new Audio(CONFIG.musicUrl);
    currentState.audio.loop = true;

    // Initialize Confetti Canvas
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        // Start Particle Animation Loop
        requestAnimationFrame(animateParticles);
    }

    // Remove Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        const app = document.getElementById('app');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (app) app.classList.add('ready'); // Reveal app only after loader is gone
            }, 800);
        }
    }, 1500);

    // Audio Toggle Listener
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) audioToggle.addEventListener('click', toggleAudio);
});

function playSound(type) {
    if (currentState.isMuted) return;
    const sfx = new Audio(CONFIG.sounds[type]);
    sfx.volume = 0.4;
    sfx.play().catch(e => console.log("Audio play blocked"));
}

/**
 * NAVIGATION
 */
function nextPage(pageNum) {
    const current = document.getElementById(`page-${pageNum}`);
    const next = document.getElementById(`page-${pageNum + 1}`);

    if (current && next) {
        playSound('click');
        current.classList.add('exit');
        setTimeout(() => {
            current.classList.remove('active', 'exit');
            next.classList.add('active');

            // Special page initializations
            if (pageNum + 1 === 5) startCountdown();
        }, 800);
    }
}

/**
 * PAGE 2: MAKE A WISH
 */
function makeWish() {
    const flame = document.getElementById('flame');
    const wishBtn = document.getElementById('wishBtn');

    if (flame) flame.classList.add('off');
    if (wishBtn) {
        wishBtn.innerText = "Wish made! ✨";
        wishBtn.style.background = "#FFD700";
    }

    playSound('fireworks');
    fireConfetti(0.3, { spread: 60, startVelocity: 20 });

    setTimeout(() => {
        nextPage(2);
    }, 1500);
}

/**
 * PAGE 3: PHOTO FLIP
 */
function flipCard(card) {
    if (!card.classList.contains('flipped')) playSound('click');
    card.classList.toggle('flipped');
    const nextBtn = document.getElementById('nextBtn3');
    if (nextBtn) nextBtn.classList.remove('hidden');
}

/**
 * PAGE 4: OPEN LETTER
 */
function openLetter() {
    const envelope = document.querySelector('.envelope');
    const nextBtn = document.getElementById('nextBtn4');

    if (envelope && !envelope.classList.contains('open')) {
        playSound('click');
        envelope.classList.add('open');
    }
    if (nextBtn) nextBtn.classList.remove('hidden');
}

/**
 * PAGE 5: COUNTDOWN
 */
function startCountdown() {
    const display = document.getElementById('countdown');
    const message = document.getElementById('birthday-message');
    let count = 3;

    if (!display) return;

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            display.innerText = count;
            display.style.transform = 'scale(1.2)';
            setTimeout(() => display.style.transform = 'scale(1)', 200);
        } else {
            clearInterval(timer);
            display.classList.add('hidden');
            if (message) message.classList.remove('hidden');
            playSound('fireworks');
            fireConfetti(0.5, { spread: 100, elementCount: 150 });
        }
    }, 1000);
}

/**
 * PAGE 6: PARTY POPPERS
 */
function pop(btn, index) {
    if (btn.classList.contains('popped')) return;

    btn.classList.add('popped');
    currentState.poppersClicked++;
    playSound('pop');

    // Show message
    const msgStack = document.getElementById('popper-messages');
    if (msgStack) {
        const msg = document.createElement('p');
        msg.className = 'popper-msg';
        msg.innerText = CONFIG.popperMessages[index];
        msgStack.innerHTML = '';
        msgStack.appendChild(msg);
    }

    // Confetti burst from button position
    const rect = btn.getBoundingClientRect();
    fireConfetti(0.2, {
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight }
    });

    if (currentState.poppersClicked === 3) {
        setTimeout(() => {
            const finale = document.getElementById('finale');
            if (finale) finale.classList.remove('hidden');
            playSound('fireworks');
            fireConfetti(1, { spread: 180, elementCount: 300 });
        }, 1000);
    }
}

/**
 * UTILS: CONFETTI
 */
function fireConfetti(intensity, options = {}) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const particleCount = options.elementCount || Math.floor(100 * intensity);

    for (let i = 0; i < particleCount; i++) {
        currentState.particles.push({
            x: (options.origin?.x || 0.5) * canvas.width,
            y: (options.origin?.y || 0.5) * canvas.height,
            vx: (Math.random() - 0.5) * (options.spread || 40) * (intensity + 0.5),
            vy: (Math.random() - 1) * 20 * (intensity + 0.5),
            size: Math.random() * 8 + 4,
            color: CONFIG.confettiColors[Math.floor(Math.random() * CONFIG.confettiColors.length)],
            rotation: Math.random() * 360,
            rSpeed: (Math.random() - 0.5) * 10,
            alpha: 1
        });
    }
}

function animateParticles() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = currentState.particles.length - 1; i >= 0; i--) {
        const p = currentState.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.rotation += p.rSpeed;
        p.alpha -= 0.01;

        if (p.alpha <= 0 || p.y > canvas.height + 10) {
            currentState.particles.splice(i, 1);
        } else {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }
    }
    requestAnimationFrame(animateParticles);
}

/**
 * UTILS: AUDIO
 */
function toggleAudio() {
    const btn = document.getElementById('audioToggle');
    if (!currentState.audio) return;

    if (currentState.audio.paused) {
        currentState.audio.play().catch(e => console.log("Audio play blocked by browser"));
        if (btn) btn.classList.remove('muted');
        currentState.isMuted = false;
    } else {
        currentState.audio.pause();
        if (btn) btn.classList.add('muted');
        currentState.isMuted = true;
    }
}

/**
 * ACTIONS
 */
function replay() {
    window.location.reload();
}

function share() {
    if (navigator.share) {
        navigator.share({
            title: `A Birthday Surprise for ${CONFIG.birthdayPerson}`,
            text: `Check out this special birthday surprise!`,
            url: window.location.href
        });
    } else {
        alert("Link copied! Share this special surprise with Sony.");
    }
}
