/**
 * UnderLess Sidebar Module
 * SIMPLIFIED: No slide animation, just instant update with subtle fade
 */

const UnderlessSidebar = (function () {
    'use strict';

    let root = null;
    let isOpen = false;
    let isSettingsOpen = false;
    let isLoseModalOpen = false;
    let isUOHActive = false;

    // Game state
    let score = 0;
    let currentLeft = null;
    let currentRight = null;
    let isRevealed = false;
    let usedArtists = [];
    let gameOver = false;

    let settingsModal = null;
    let loseModal = null;

    // Sounds
    let gameOverSound = null;
    let clickSound = null;

    // DOM elements
    let cardLeft, cardRight;
    let imgLeft, imgRight;
    let nameLeft, nameRight;
    let countLeft, countRight;
    let listenersLeftSection, listenersRightSection;
    let scoreDisplay;
    let overlayLeftWrong, overlayLeftCorrect;
    let overlayRightWrong, overlayRightCorrect;

    // ========================================
    // UTILITIES
    // ========================================

    function formatNumber(num) {
        return num.toLocaleString('es-AR');
    }

    function getStoredVolume(key, defaultVal) {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            const val = parseFloat(stored);
            if (!isNaN(val) && val >= 0 && val <= 1) return val;
        }
        return defaultVal;
    }

    // ========================================
    // SMART ARTIST SELECTION ALGORITHM
    // ========================================

    // Fisher-Yates shuffle for true randomness
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Sort artists into difficulty tiers based on listener count
    function getArtistTiers() {
        if (typeof UNDERLESS_ARTISTS === 'undefined' || !Array.isArray(UNDERLESS_ARTISTS)) {
            return { easy: [], medium: [], hard: [] };
        }

        const sorted = [...UNDERLESS_ARTISTS].sort((a, b) => b.monthly_listeners - a.monthly_listeners);
        const third = Math.ceil(sorted.length / 3);

        return {
            high: sorted.slice(0, third),      // Top third (most listeners)
            medium: sorted.slice(third, third * 2),  // Middle third
            low: sorted.slice(third * 2)       // Bottom third (least listeners)
        };
    }

    // Get difficulty based on current score (with some randomness for spice)
    function getDifficulty() {
        // Add some randomness to make it spicy
        const spiceRoll = Math.random();

        if (score < 3) {
            // Early game: usually easy, but 30% chance of harder matchup
            if (spiceRoll < 0.3) return 'medium';
            return 'easy';
        }
        if (score < 7) {
            // Mid game: usually medium, 20% chance easier, 20% chance harder
            if (spiceRoll < 0.2) return 'easy';
            if (spiceRoll > 0.8) return 'hard';
            return 'medium';
        }
        if (score < 12) {
            // Late game: usually hard, 25% chance of expert
            if (spiceRoll < 0.25) return 'expert';
            return 'hard';
        }
        return 'expert';  // After 12: expert mode
    }

    // Find a good opponent for the current left artist
    function findMatchingArtist(leftArtist) {
        if (!leftArtist) return null;

        const available = UNDERLESS_ARTISTS.filter(a =>
            !usedArtists.includes(a.name) && a.name !== leftArtist.name
        );

        if (available.length === 0) return null;

        const difficulty = getDifficulty();
        const leftListeners = leftArtist.monthly_listeners;

        // Calculate "closeness" ratio for each artist
        const withRatios = available.map(a => {
            const ratio = Math.max(a.monthly_listeners, leftListeners) /
                Math.min(a.monthly_listeners, leftListeners);
            return { artist: a, ratio };
        });

        // Sort by closeness (ratio closer to 1 = more similar)
        withRatios.sort((a, b) => a.ratio - b.ratio);

        let candidates;

        switch (difficulty) {
            case 'easy':
                // Pick from the most different artists (easier to guess)
                candidates = withRatios.slice(-Math.ceil(withRatios.length * 0.5));
                break;
            case 'medium':
                // Pick from middle range
                candidates = withRatios.slice(
                    Math.floor(withRatios.length * 0.25),
                    Math.ceil(withRatios.length * 0.75)
                );
                break;
            case 'hard':
                // Pick from more similar artists
                candidates = withRatios.slice(0, Math.ceil(withRatios.length * 0.5));
                break;
            case 'expert':
                // Pick from the most similar artists (hardest)
                candidates = withRatios.slice(0, Math.ceil(withRatios.length * 0.3));
                break;
            default:
                candidates = withRatios;
        }

        // If candidates is empty, use all available
        if (candidates.length === 0) candidates = withRatios;

        // Randomly pick from candidates
        const shuffled = shuffleArray(candidates);
        return shuffled[0].artist;
    }

    // Get a random artist for the initial left card
    // Only avoid the last ~20 artists (flexible, allows some repeats)
    const MEMORY_LIMIT = 20;

    function getInitialArtist() {
        if (typeof UNDERLESS_ARTISTS === 'undefined' || !Array.isArray(UNDERLESS_ARTISTS)) {
            return null;
        }

        // Only consider recent artists to avoid
        const recentArtists = usedArtists.slice(-MEMORY_LIMIT);
        let available = UNDERLESS_ARTISTS.filter(a => !recentArtists.includes(a.name));

        // If too few available, be more flexible (only avoid last 5)
        if (available.length < 3) {
            const veryRecent = usedArtists.slice(-5);
            available = UNDERLESS_ARTISTS.filter(a => !veryRecent.includes(a.name));
        }

        // Trim the used artists list to prevent it growing forever
        if (usedArtists.length > MEMORY_LIMIT * 2) {
            usedArtists = usedArtists.slice(-MEMORY_LIMIT);
            saveGameState();
        }

        if (available.length === 0) {
            // Ultimate fallback: pick any artist except current ones
            available = UNDERLESS_ARTISTS.filter(a =>
                a.name !== (currentLeft?.name) && a.name !== (currentRight?.name)
            );
        }

        if (available.length === 0) return null;

        // Shuffle and pick one
        const shuffled = shuffleArray(available);
        return shuffled[0];
    }

    // Main function to get next artist (used for right card)
    function getRandomArtist() {
        // If we have a current left artist, find a matching opponent
        if (currentLeft) {
            const match = findMatchingArtist(currentLeft);
            if (match) return match;
        }

        // Fallback to initial artist selection
        return getInitialArtist();
    }

    function animateCount(element, targetValue, duration = 1200) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 2);
            element.textContent = formatNumber(Math.floor(targetValue * easeOut));

            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    function playGameOverSound() {
        try {
            if (!gameOverSound) {
                gameOverSound = new Audio('sounds/sound_game_over.mp3');
            }
            gameOverSound.currentTime = 0;
            gameOverSound.volume = getStoredVolume('underless_music_vol', 1);
            gameOverSound.play().catch(() => { });
        } catch (e) { }
    }

    let winSound = null;
    function playWinSound() {
        try {
            if (!winSound) {
                winSound = new Audio('sounds/sound_win.mp3');
            }
            winSound.currentTime = 0;
            winSound.volume = getStoredVolume('underless_music_vol', 1);
            winSound.play().catch(() => { });
        } catch (e) { }
    }

    function playClickSound() {
        try {
            if (!clickSound) {
                clickSound = new Audio('sounds/sound_click.mp3');
            }
            clickSound.currentTime = 0;
            clickSound.volume = getStoredVolume('underless_music_vol', 1);
            clickSound.play().catch(() => { });
        } catch (e) { }
    }

    function stopMainMusic() {
        if (typeof audioPlayer !== 'undefined' && audioPlayer) {
            try {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            } catch (e) { }
        }
    }

    // ========================================
    // GAME STATE PERSISTENCE
    // ========================================

    function saveMode(mode) {
        localStorage.setItem('underless_mode', mode);
    }

    function getSavedMode() {
        return localStorage.getItem('underless_mode') || 'normal';
    }

    function saveGameState(pendingChoice = null) {
        const state = {
            score: score,
            usedArtists: usedArtists,
            currentLeft: currentLeft,
            currentRight: currentRight,
            pendingChoice: pendingChoice  // Saves the choice to prevent F5 exploit
        };
        localStorage.setItem('underless_uoh_state', JSON.stringify(state));
    }

    function loadGameState() {
        try {
            const saved = localStorage.getItem('underless_uoh_state');
            if (saved) {
                const state = JSON.parse(saved);
                score = state.score || 0;
                usedArtists = state.usedArtists || [];
                currentLeft = state.currentLeft || null;
                currentRight = state.currentRight || null;

                // Return pending choice if exists (anti-F5 exploit)
                return { loaded: true, pendingChoice: state.pendingChoice || null };
            }
        } catch (e) { }
        return { loaded: false, pendingChoice: null };
    }

    function clearGameState() {
        localStorage.removeItem('underless_uoh_state');
    }

    // ========================================
    // SIDEBAR
    // ========================================

    function openSidebar() {
        if (!root) return;
        root.classList.add('underless-open');
        isOpen = true;
        console.log('Sidebar opened');
    }

    function closeSidebar() {
        if (!root) return;
        root.classList.remove('underless-open');
        isOpen = false;
        console.log('Sidebar closed');
    }

    function toggleSidebar() {
        console.log('toggleSidebar called, isOpen:', isOpen);
        isOpen ? closeSidebar() : openSidebar();
    }

    // ========================================
    // SETTINGS
    // ========================================

    function openSettingsModal() {
        if (settingsModal) {
            settingsModal.classList.add('show');
            isSettingsOpen = true;
        }
    }

    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.classList.remove('show');
            isSettingsOpen = false;
        }
    }

    function initSettingsSliders() {
        const musicSlider = document.getElementById('underless-music-vol');
        if (musicSlider) {
            const savedVol = getStoredVolume('underless_music_vol', 1);
            musicSlider.value = savedVol;

            // Apply saved volume to audio player immediately
            if (typeof audioPlayer !== 'undefined') {
                audioPlayer.volume = savedVol;
            }

            musicSlider.addEventListener('input', function () {
                const val = parseFloat(this.value);
                localStorage.setItem('underless_music_vol', val);
                if (typeof audioPlayer !== 'undefined') audioPlayer.volume = val;
            });
        }
    }

    // ========================================
    // MODE SELECTION
    // ========================================

    // Check if normal mode has a modal blocking interaction
    function isNormalModeBlocked() {
        // Check for game over modal
        const gameOverModal = document.getElementById('gameover-modal');
        if (gameOverModal && (gameOverModal.style.display === 'flex' || gameOverModal.classList.contains('show'))) {
            return true;
        }

        // Check for win modal
        const winModal = document.getElementById('win-modal');
        if (winModal && (winModal.style.display === 'flex' || winModal.classList.contains('show'))) {
            return true;
        }

        // Check for any visible modals with common patterns
        const anyModal = document.querySelector('.modal.show, .modal[style*="display: flex"], .game-over-overlay.show');
        if (anyModal) return true;

        return false;
    }

    function selectMode(mode, skipSave) {
        // Block mode switch if normal mode has a modal open
        if (isNormalModeBlocked() && mode === 'underorhigher') {
            console.log('Mode switch blocked - modal is open');
            closeSidebar();
            return;
        }

        const options = root.querySelectorAll('.underless-mode-option');
        options.forEach(opt => opt.classList.remove('active'));

        if (mode === 'normal') {
            const normalOpt = root.querySelector('.underless-mode-normal');
            if (normalOpt) normalOpt.classList.add('active');
            exitUnderOrHigher();
            closeSidebar();

            // Restore audio volume from settings when returning to normal mode
            const savedVol = getStoredVolume('underless_music_vol', 1);
            if (typeof audioPlayer !== 'undefined' && audioPlayer) {
                audioPlayer.volume = savedVol;
            }

            if (!skipSave) saveMode('normal');
        } else if (mode === 'underorhigher') {
            const uohOpt = root.querySelector('.underless-mode-underorhigher');
            if (uohOpt) uohOpt.classList.add('active');
            closeSidebar();
            stopMainMusic();
            startUnderOrHigher();
            if (!skipSave) saveMode('underorhigher');
        }
    }

    // ========================================
    // UNDER OR HIGHER GAME
    // ========================================

    function initUOHElements() {
        cardLeft = document.getElementById('uoh-card-left');
        cardRight = document.getElementById('uoh-card-right');
        imgLeft = document.getElementById('uoh-img-left');
        imgRight = document.getElementById('uoh-img-right');
        nameLeft = document.getElementById('uoh-name-left');
        nameRight = document.getElementById('uoh-name-right');
        countLeft = document.getElementById('uoh-count-left');
        countRight = document.getElementById('uoh-count-right');

        listenersLeftSection = cardLeft ? cardLeft.querySelector('.listeners-section') : null;
        listenersRightSection = cardRight ? cardRight.querySelector('.listeners-section') : null;

        scoreDisplay = document.getElementById('uoh-score-display');
        overlayLeftWrong = document.getElementById('uoh-overlay-left-wrong');
        overlayLeftCorrect = document.getElementById('uoh-overlay-left-correct');
        overlayRightWrong = document.getElementById('uoh-overlay-right-wrong');
        overlayRightCorrect = document.getElementById('uoh-overlay-right-correct');
    }

    function startUnderOrHigher() {
        const gameContainer = root.querySelector('.underless-uoh-game');
        if (!gameContainer) return;

        initUOHElements();

        const stateResult = loadGameState();
        const hasState = stateResult.loaded;
        const pendingChoice = stateResult.pendingChoice;

        if (!hasState || !currentLeft || !currentRight) {
            score = 0;
            usedArtists = [];

            // Get first artist randomly
            const artist1 = getInitialArtist();
            if (artist1) {
                usedArtists.push(artist1.name);
                currentLeft = artist1;
            }

            // Get second artist using smart matching
            const artist2 = getRandomArtist();
            if (artist2) {
                usedArtists.push(artist2.name);
                currentRight = artist2;
            }

            if (!currentLeft || !currentRight) return;

            saveGameState();
        }

        gameOver = false;
        isRevealed = false;

        isUOHActive = true;
        gameContainer.classList.add('active');

        updateLeftCard(currentLeft, true);
        updateRightCard(currentRight, false);
        updateScoreDisplay();
        resetOverlays();

        // ANTI-EXPLOIT: Process pending choice if user F5'd during result
        if (pendingChoice && currentLeft && currentRight) {
            console.log('Processing pending choice after F5:', pendingChoice);
            // Immediately process the choice they made before F5
            setTimeout(() => {
                const leftListeners = currentLeft.monthly_listeners || 0;
                const rightListeners = currentRight.monthly_listeners || 0;
                const leftHasMore = leftListeners >= rightListeners;
                const correct = (pendingChoice === 'left' && leftHasMore) || (pendingChoice === 'right' && !leftHasMore);

                if (correct) {
                    handleCorrectGuess(pendingChoice);
                } else {
                    handleWrongGuess(pendingChoice);
                }
            }, 500);  // Small delay so UI loads first
        }
    }

    function exitUnderOrHigher() {
        const gameContainer = root.querySelector('.underless-uoh-game');
        if (gameContainer) gameContainer.classList.remove('active');
        isUOHActive = false;
        gameOver = true;
    }

    function updateLeftCard(artist, showListeners) {
        if (!artist) return;
        if (imgLeft) imgLeft.src = artist.img;
        if (nameLeft) nameLeft.textContent = artist.name;
        if (countLeft) countLeft.textContent = formatNumber(artist.monthly_listeners);

        if (listenersLeftSection) {
            if (showListeners) {
                listenersLeftSection.classList.add('revealed');
            } else {
                listenersLeftSection.classList.remove('revealed');
            }
        }
    }

    function updateRightCard(artist, showListeners) {
        if (!artist) return;
        if (imgRight) imgRight.src = artist.img;
        if (nameRight) nameRight.textContent = artist.name;

        // Only set the real count if we're showing listeners, otherwise hide it
        if (countRight) {
            countRight.textContent = showListeners ? formatNumber(artist.monthly_listeners) : "?";
        }

        if (listenersRightSection) {
            if (showListeners) {
                listenersRightSection.classList.add('revealed');
            } else {
                listenersRightSection.classList.remove('revealed');
            }
        }
    }

    function updateScoreDisplay() {
        if (scoreDisplay) scoreDisplay.textContent = score;
    }

    function resetOverlays() {
        isRevealed = false;
        if (overlayLeftWrong) overlayLeftWrong.classList.remove('show');
        if (overlayLeftCorrect) overlayLeftCorrect.classList.remove('show');
        if (overlayRightWrong) overlayRightWrong.classList.remove('show');
        if (overlayRightCorrect) overlayRightCorrect.classList.remove('show');
    }

    function handleCardClick(side) {
        if (isRevealed || gameOver || !isUOHActive) return;
        isRevealed = true;

        playClickSound();

        // ANTI-EXPLOIT: Save choice immediately before showing result
        // This prevents the F5 peek exploit
        saveGameState(side);

        // Reveal right listeners
        if (listenersRightSection) listenersRightSection.classList.add('revealed');

        // Animate count
        if (countRight && currentRight) {
            animateCount(countRight, currentRight.monthly_listeners, 1500);
        }

        // Check result
        const leftListeners = currentLeft ? currentLeft.monthly_listeners : 0;
        const rightListeners = currentRight ? currentRight.monthly_listeners : 0;
        const leftHasMore = leftListeners >= rightListeners;
        const correct = (side === 'left' && leftHasMore) || (side === 'right' && !leftHasMore);

        // Wait for count animation
        setTimeout(() => {
            if (correct) {
                handleCorrectGuess(side);
            } else {
                handleWrongGuess(side);
            }
        }, 2000);
    }

    function handleCorrectGuess(side) {
        score++;
        updateScoreDisplay();
        playWinSound();

        // Show overlay
        if (side === 'left' && overlayLeftCorrect) {
            overlayLeftCorrect.classList.add('show');
        } else if (side === 'right' && overlayRightCorrect) {
            overlayRightCorrect.classList.add('show');
        }

        // Wait, then update (simple instant change)
        setTimeout(() => {
            // Hide overlays
            if (overlayLeftCorrect) overlayLeftCorrect.classList.remove('show');
            if (overlayRightCorrect) overlayRightCorrect.classList.remove('show');

            // RIGHT becomes LEFT
            currentLeft = currentRight;
            usedArtists.push(currentLeft.name);

            // Get new RIGHT
            currentRight = getRandomArtist();
            if (currentRight) usedArtists.push(currentRight.name);

            saveGameState();

            // Update cards instantly
            updateLeftCard(currentLeft, true);
            updateRightCard(currentRight, false);

            resetOverlays();
        }, 1500);
    }

    function handleWrongGuess(side) {
        if (side === 'left' && overlayLeftWrong) {
            overlayLeftWrong.classList.add('show');
        } else if (side === 'right' && overlayRightWrong) {
            overlayRightWrong.classList.add('show');
        }

        gameOver = true;
        playGameOverSound();
        clearGameState();

        setTimeout(() => {
            showLoseModal();
        }, 1000);
    }

    // ========================================
    // LOSE SCREEN (INLINE)
    // ========================================

    function showLoseModal() {
        // Hide artists, show inline lose screen
        const loseScreen = document.getElementById('uoh-lose-screen');
        const cardLeftEl = document.getElementById('uoh-card-left');
        const cardRightEl = document.getElementById('uoh-card-right');
        const vsEl = document.querySelector('#underless-sidebar-root .vs-divider');

        if (cardLeftEl) cardLeftEl.style.display = 'none';
        if (cardRightEl) cardRightEl.style.display = 'none';
        if (vsEl) vsEl.style.display = 'none';

        if (loseScreen) {
            const scoreValue = loseScreen.querySelector('#uoh-lose-score-value');
            if (scoreValue) scoreValue.textContent = score;
            loseScreen.classList.add('show');
        }
        isLoseModalOpen = true;
    }

    function hideLoseModal() {
        // Show artists again, hide lose screen
        const loseScreen = document.getElementById('uoh-lose-screen');
        const cardLeftEl = document.getElementById('uoh-card-left');
        const cardRightEl = document.getElementById('uoh-card-right');
        const vsEl = document.querySelector('#underless-sidebar-root .vs-divider');

        if (loseScreen) loseScreen.classList.remove('show');
        if (cardLeftEl) cardLeftEl.style.display = '';
        if (cardRightEl) cardRightEl.style.display = '';
        if (vsEl) vsEl.style.display = '';
        isLoseModalOpen = false;
    }

    function playAgain() {
        // Keep cards hidden, just hide lose screen
        const loseScreen = document.getElementById('uoh-lose-screen');
        if (loseScreen) loseScreen.classList.remove('show');

        clearGameState();

        // Update data first
        score = 0;
        usedArtists = [];
        gameOver = false;
        isRevealed = false;

        const artist1 = getRandomArtist();
        if (artist1) usedArtists.push(artist1.name);
        const artist2 = getRandomArtist();
        if (artist2) usedArtists.push(artist2.name);

        currentLeft = artist1;
        currentRight = artist2;
        saveGameState();

        // Update card data while still hidden
        updateLeftCard(currentLeft, true);
        updateRightCard(currentRight, false);
        updateScoreDisplay();
        resetOverlays();

        // Now show cards with new data
        setTimeout(() => {
            const cardLeftEl = document.getElementById('uoh-card-left');
            const cardRightEl = document.getElementById('uoh-card-right');
            const vsEl = document.querySelector('#underless-sidebar-root .vs-divider');

            if (cardLeftEl) cardLeftEl.style.display = '';
            if (cardRightEl) cardRightEl.style.display = '';
            if (vsEl) vsEl.style.display = '';
            isLoseModalOpen = false;
        }, 100);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    function attachEventListeners() {
        // Normal mode hamburger
        const hamburger = root.querySelector('.underless-hamburger');
        if (hamburger) hamburger.addEventListener('click', function () {
            playClickSound();
            toggleSidebar();
        });

        const overlay = root.querySelector('.underless-overlay');
        if (overlay) overlay.addEventListener('click', closeSidebar);

        const settingsBtn = root.querySelector('.underless-settings-btn');
        if (settingsBtn) settingsBtn.addEventListener('click', function () {
            playClickSound();
            openSettingsModal();
        });

        settingsModal = document.getElementById('underless-settings-modal');
        if (settingsModal) {
            const closeBtn = settingsModal.querySelector('.close-x');
            if (closeBtn) closeBtn.addEventListener('click', closeSettingsModal);
            settingsModal.addEventListener('click', e => {
                if (e.target === settingsModal) closeSettingsModal();
            });
        }

        const normalMode = root.querySelector('.underless-mode-normal');
        if (normalMode) normalMode.addEventListener('click', () => {
            playClickSound();
            selectMode('normal');
        });

        const uohMode = root.querySelector('.underless-mode-underorhigher');
        if (uohMode) uohMode.addEventListener('click', () => {
            playClickSound();
            selectMode('underorhigher');
        });

        // Card clicks
        document.addEventListener('click', function (e) {
            if (!isUOHActive) return;

            const clickedLeft = e.target.closest('#uoh-card-left');
            const clickedRight = e.target.closest('#uoh-card-right');

            if (clickedLeft) handleCardClick('left');
            else if (clickedRight) handleCardClick('right');
        });

        // Lose modal
        loseModal = document.getElementById('underless-lose-modal');
        if (loseModal) {
            const closeBtn = loseModal.querySelector('.close-x');
            if (closeBtn) closeBtn.addEventListener('click', function () {
                hideLoseModal();
                exitUnderOrHigher();
                selectMode('normal');
            });

            const playAgainBtn = loseModal.querySelector('.underless-play-again-btn');
            if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);
        }

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (isLoseModalOpen) {
                    hideLoseModal();
                    exitUnderOrHigher();
                    selectMode('normal');
                } else if (isSettingsOpen) {
                    closeSettingsModal();
                } else if (isOpen) {
                    closeSidebar();
                }
            }
        });
    }

    // ========================================
    // INIT
    // ========================================

    function init() {
        root = document.getElementById('underless-sidebar-root');
        if (!root) return;

        attachEventListeners();
        initSettingsSliders();

        // Restore saved mode
        const savedMode = getSavedMode();
        if (savedMode === 'underorhigher') {
            const gameContainer = root.querySelector('.underless-uoh-game');
            if (gameContainer) gameContainer.classList.add('active');
            selectMode('underorhigher', true);
        }

        console.log('UnderlessSidebar: Initialized');
    }

    return {
        init,
        openSidebar, closeSidebar, toggleSidebar,
        openSettingsModal, closeSettingsModal,
        selectMode, handleCardClick,
        showLoseModal, hideLoseModal, playAgain,
        playWinSound  // Exposed for normal mode to use
    };
})();

// GLOBAL FUNCTIONS for onclick handlers in HTML
window.toggleSidebar = function () {
    console.log('Global toggleSidebar called');
    UnderlessSidebar.toggleSidebar();
};

window.openUOHSidebar = function () {
    console.log('Global openUOHSidebar called');
    UnderlessSidebar.toggleSidebar();
};

// ========================================
// ARTIST SEARCH PANEL (PC only)
// ========================================

let isArtistSearchOpen = false;

window.toggleArtistSearch = function () {
    const panel = document.getElementById('uoh-artist-search-panel');
    const overlay = document.getElementById('uoh-artist-search-overlay');
    if (!panel) return;

    isArtistSearchOpen = !isArtistSearchOpen;

    if (isArtistSearchOpen) {
        panel.classList.add('open');
        if (overlay) overlay.classList.add('show');
        populateArtistList();

        // Focus search input
        const input = document.getElementById('uoh-artist-search-input');
        if (input) {
            setTimeout(() => input.focus(), 300);
        }
    } else {
        panel.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        // Clear search input
        const input = document.getElementById('uoh-artist-search-input');
        if (input) input.value = '';
    }
};

function closeArtistSearch() {
    const panel = document.getElementById('uoh-artist-search-panel');
    const overlay = document.getElementById('uoh-artist-search-overlay');
    if (panel && isArtistSearchOpen) {
        panel.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        isArtistSearchOpen = false;
        // Clear search input
        const input = document.getElementById('uoh-artist-search-input');
        if (input) input.value = '';
    }
}

function populateArtistList(filter = '') {
    const listContainer = document.getElementById('uoh-artist-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (typeof UNDERLESS_ARTISTS === 'undefined' || !Array.isArray(UNDERLESS_ARTISTS)) {
        listContainer.innerHTML = '<p style="color:#888;padding:20px;text-align:center;">No hay artistas disponibles</p>';
        return;
    }

    // Artists to exclude from the list
    const excludedArtists = ['playboi carti', 'bbtrickz', 'cosmic kid'];

    // Sort alphabetically and exclude certain artists
    const sorted = [...UNDERLESS_ARTISTS]
        .filter(a => !excludedArtists.includes(a.name.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Filter if search query
    const filtered = filter
        ? sorted.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))
        : sorted;

    if (filtered.length === 0 && filter) {
        listContainer.innerHTML = '<p style="color:#888;padding:20px;text-align:center;">No se encontraron artistas</p>';
        // Still add the "Agregar artista" button
        addAgregarArtistaItem(listContainer);
        return;
    }

    // Add "Agregar artista" at the top
    addAgregarArtistaItem(listContainer);

    filtered.forEach(artist => {
        const item = document.createElement('div');
        item.className = 'uoh-artist-item';
        item.innerHTML = `
            <img src="${artist.img}" alt="${artist.name}" onerror="this.src='img/img_artista/default.png'">
            <div class="uoh-artist-item-info">
                <p class="uoh-artist-item-name">${artist.name}</p>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function addAgregarArtistaItem(container) {
    const addItem = document.createElement('div');
    addItem.className = 'uoh-artist-item uoh-add-artist';
    addItem.innerHTML = `
        <img src="img/add_artist.png" alt="Agregar artista" onerror="this.style.background='#444'">
        <div class="uoh-artist-item-info">
            <p class="uoh-artist-item-name">Agregar artista</p>
        </div>
    `;
    addItem.addEventListener('click', () => {
        window.open('https://x.com/Invalame/status/1997739527235047739', '_blank');
    });
    container.appendChild(addItem);
}

// Initialize search input listener and click outside handler
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('uoh-artist-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            populateArtistList(this.value);
        });
    }

    // Close panel when clicking outside
    document.addEventListener('click', function (e) {
        if (!isArtistSearchOpen) return;

        const panel = document.getElementById('uoh-artist-search-panel');
        const searchBtn = document.getElementById('uoh-search-btn');

        // Don't close if clicking inside panel or on the search button
        if (panel && panel.contains(e.target)) return;
        if (searchBtn && searchBtn.contains(e.target)) return;

        closeArtistSearch();
    });
});

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UnderlessSidebar.init);
} else {
    UnderlessSidebar.init();
}

