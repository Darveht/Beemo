// Yahoo OAuth Configuration
const YAHOO_CLIENT_ID = 'dj0yJmk9bDdrb2lTMFNWT0tDJmQ9WVdrOVNHaHlkMHhZUkV3bWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWU5';
// Configuración para Netlify
const YAHOO_REDIRECT_URI = 'https://beemotv.netlify.app';

// Auth State Management
let currentUser = null;
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

// Initialize Auth on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();

    // Auth screen event listeners
    setupAuthEventListeners();

    // Check if user is already authenticated
    if (isAuthenticated) {
        showMainApp();
    } else {
        showWelcomeScreen();
    }

    // Check for OAuth callback
    handleOAuthCallback();
});

function initializeAuth() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const mainApp = document.getElementById('mainApp');

    // Ensure all screens are properly positioned
    if (isAuthenticated) {
        welcomeScreen.style.display = 'none';
        loginScreen.style.display = 'none';
        registerScreen.style.display = 'none';
        mainApp.style.display = 'block';
        mainApp.classList.add('active');
    }
}

function setupAuthEventListeners() {
    // Welcome screen buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Back buttons
    const loginBackBtn = document.getElementById('loginBackBtn');
    const registerBackBtn = document.getElementById('registerBackBtn');

    // Switch between login/register
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // Yahoo auth buttons
    const yahooLoginBtn = document.getElementById('yahooLoginBtn');
    const yahooRegisterBtn = document.getElementById('yahooRegisterBtn');

    // Enter app button
    const enterAppBtn = document.getElementById('enterAppBtn');

    if (loginBtn) loginBtn.addEventListener('click', showLoginScreen);
    if (registerBtn) registerBtn.addEventListener('click', showRegisterScreen);
    if (loginBackBtn) loginBackBtn.addEventListener('click', showWelcomeScreen);
    if (registerBackBtn) registerBackBtn.addEventListener('click', showWelcomeScreen);
    if (switchToRegister) switchToRegister.addEventListener('click', showRegisterScreen);
    if (switchToLogin) switchToLogin.addEventListener('click', showLoginScreen);
    if (yahooLoginBtn) yahooLoginBtn.addEventListener('click', () => startYahooAuth('login'));
    if (yahooRegisterBtn) yahooRegisterBtn.addEventListener('click', () => startYahooAuth('register'));
    if (enterAppBtn) enterAppBtn.addEventListener('click', enterMainApp);
}

function showWelcomeScreen() {
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('registerScreen').classList.remove('active');

    setTimeout(() => {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('registerScreen').style.display = 'none';
    }, 300);
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('registerScreen').classList.remove('active');

    setTimeout(() => {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('registerScreen').style.display = 'none';
    }, 50);
}

function showRegisterScreen() {
    document.getElementById('registerScreen').style.display = 'block';
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('loginScreen').classList.remove('active');

    setTimeout(() => {
        document.getElementById('registerScreen').classList.add('active');
        document.getElementById('loginScreen').style.display = 'none';
    }, 50);
}

function startYahooAuth(type) {
    // Store auth type for callback
    localStorage.setItem('authType', type);

    // Sistema de autenticación simulada (temporal mientras configuras Yahoo)
    showAuthLoading('Conectando con Yahoo...');

    // Simular proceso de autenticación real
    setTimeout(() => {
        // Simular respuesta exitosa de Yahoo
        const mockUserData = {
            id: 'yahoo_' + Math.random().toString(36).substring(7),
            email: 'usuario@yahoo.com',
            name: 'Usuario Beemo',
            provider: 'yahoo',
            authenticated_at: Date.now()
        };

        handleAuthSuccess(mockUserData);
    }, 2500); // Tiempo realista de autenticación

    return;

    // Código real de Yahoo OAuth (comentado temporalmente)
    /*
    const yahooAuthUrl = `https://api.login.yahoo.com/oauth2/request_auth?` +
        `client_id=${YAHOO_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(YAHOO_REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `state=${generateRandomState()}`;

    // Redirect to Yahoo OAuth
    window.location.href = yahooAuthUrl;
    */
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauthState', state);
    return state;
}

function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
        console.error('OAuth error:', error);
        showAuthError('Error al autenticar con Yahoo. Por favor intenta de nuevo.');
        return;
    }

    if (code && state) {
        const storedState = localStorage.getItem('oauthState');
        if (state !== storedState) {
            console.error('State mismatch');
            showAuthError('Error de seguridad. Por favor intenta de nuevo.');
            return;
        }

        // Exchange code for token (simulated)
        exchangeCodeForToken(code);
    }
}

async function exchangeCodeForToken(code) {
    try {
        // In a real implementation, this would be done on your backend
        // For demo purposes, we'll simulate a successful auth

        showAuthLoading('Completando autenticación...');

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate successful auth
        const mockUserData = {
            id: 'yahoo_' + Math.random().toString(36).substring(7),
            email: 'usuario@yahoo.com',
            name: 'Usuario Beemo',
            provider: 'yahoo'
        };

        handleAuthSuccess(mockUserData);

    } catch (error) {
        console.error('Token exchange error:', error);
        showAuthError('Error al completar la autenticación. Por favor intenta de nuevo.');
    }
}

function handleAuthSuccess(userData) {
    currentUser = userData;
    isAuthenticated = true;

    // Store auth state
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('authTimestamp', Date.now().toString());

    // Clean up OAuth params from URL
    const url = new URL(window.location);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url.pathname);

    // Clean up localStorage
    localStorage.removeItem('oauthState');
    localStorage.removeItem('authType');

    // Show success modal
    showAuthSuccessModal();
}

function showAuthSuccessModal() {
    const modal = document.getElementById('authSuccessModal');
    modal.classList.add('active');
}

function enterMainApp() {
    const modal = document.getElementById('authSuccessModal');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const mainApp = document.getElementById('mainApp');

    modal.classList.remove('active');

    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        loginScreen.style.display = 'none';
        registerScreen.style.display = 'none';
        mainApp.style.display = 'block';

        setTimeout(() => {
            mainApp.classList.add('active');
        }, 50);
    }, 300);
}

function showMainApp() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const mainApp = document.getElementById('mainApp');

    welcomeScreen.style.display = 'none';
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    mainApp.style.display = 'block';
    mainApp.classList.add('active');
}

function showAuthLoading(message) {
    showNotification(message, 'info');
}

function showAuthError(message) {
    showNotification(message, 'error');

    // Reset auth screens
    setTimeout(() => {
        const loginLoading = document.getElementById('loginLoading');
        const registerLoading = document.getElementById('registerLoading');
        const yahooLoginBtn = document.getElementById('yahooLoginBtn');
        const yahooRegisterBtn = document.getElementById('yahooRegisterBtn');

        if (loginLoading) loginLoading.style.display = 'none';
        if (registerLoading) registerLoading.style.display = 'none';
        if (yahooLoginBtn) yahooLoginBtn.style.display = 'flex';
        if (yahooRegisterBtn) yahooRegisterBtn.style.display = 'flex';

        showWelcomeScreen();
    }, 3000);
}

// Logout function
function logout() {
    currentUser = null;
    isAuthenticated = false;

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authTimestamp');

    // Reload page to show welcome screen
    window.location.reload();
}

// Add logout button functionality to header (can be added later)
function addLogoutToHeader() {
    const navRight = document.querySelector('.nav-right');
    if (navRight && isAuthenticated) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
        `;
        logoutBtn.onclick = logout;
        navRight.appendChild(logoutBtn);
    }
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.borderBottomColor = '#1d9bf0';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.85)';
        header.style.borderBottomColor = '#2f3336';
    }
});

// Watch history management
let watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '{}');

function addToWatchHistory(title, episode, progress) {
    watchHistory[title] = {
        episode: episode,
        progress: progress,
        timestamp: Date.now(),
        thumbnail: getCurrentSeriesThumbnail(title)
    };
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
    updateContinueWatchingSection();
}

function getCurrentSeriesThumbnail(title) {
    const thumbnails = {
        'El Emperador Eterno': 'https://via.placeholder.com/280x400/3a3a3a/fff?text=Continuar+1',
        'Amor en la Dinastía Tang': 'https://via.placeholder.com/280x400/3a3a3a/fff?text=Continuar+2',
        'La Médica Imperial': 'https://via.placeholder.com/280x400/3a3a3a/fff?text=Continuar+3'
    };
    return thumbnails[title] || 'https://via.placeholder.com/280x400/3a3a3a/fff?text=Serie';
}

function updateContinueWatchingSection() {
    const continueSection = document.querySelector('.continue-section');
    const continueCards = continueSection.parentElement;
    
    if (Object.keys(watchHistory).length === 0) {
        continueCards.style.display = 'none';
        return;
    }
    
    continueCards.style.display = 'block';
    
    const sortedHistory = Object.entries(watchHistory)
        .sort(([,a], [,b]) => b.timestamp - a.timestamp)
        .slice(0, 3);
    
    continueSection.innerHTML = sortedHistory.map(([title, data]) => `
        <div class="content-card continue-card" onclick="showTikTokPlayer('${title}', ${data.episode})">
            <img src="${data.thumbnail}" alt="${title}">
            <div class="progress-indicator">
                <div class="progress-fill" style="width: ${data.progress}%"></div>
            </div>
            <div class="card-info">
                <h3>${title}</h3>
                <p>Episodio ${data.episode} de 45</p>
            </div>
            <button class="play-btn" onclick="event.stopPropagation(); showTikTokPlayer('${title}', ${data.episode})">▶</button>
        </div>
    `).join('');
}

// Función para obtener títulos de episodios
function getEpisodeTitle(seriesTitle, episodeNumber) {
    const episodeTitles = {
        'La Niña de los Cuatro CEO': {
            1: 'El Encuentro Destinado',
            2: 'Primeras Impresiones',
            3: 'La Propuesta Inesperada',
            4: 'Secretos del Pasado',
            5: 'Conflictos de Poder'
        }
    };
    
    return episodeTitles[seriesTitle]?.[episodeNumber] || 'Continuación de la Historia';
}

// TikTok Style Video Player
function showTikTokPlayer(title, startEpisode = 1) {
    // Prevent scroll issues
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Buscar información de la serie
    const seriesData = getAllSeries().find(series => series.title === title);
    const hasRealVideo = seriesData && seriesData.videoUrl;

    const player = document.createElement('div');
    player.className = 'tiktok-player';
    
    if (hasRealVideo) {
        player.innerHTML = `
            <div class="video-container-tiktok">
                <button class="close-player">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
                <video 
                    id="mainVideo" 
                    width="100%" 
                    height="100%" 
                    autoplay 
                    muted="false"
                    playsinline
                    webkit-playsinline
                    controls="false"
                    preload="metadata"
                    style="object-fit: cover; background: #000;"
                >
                    <source src="${seriesData.videoUrl}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
                <div class="video-info-tiktok">
                    <h3 class="video-title-tiktok">${title}</h3>
                    <p class="video-description-tiktok">Episodio ${startEpisode} - "${getEpisodeTitle(title, startEpisode)}"</p>
                    <div class="video-progress-tiktok">
                        <div class="video-progress-fill" id="videoProgressBar"></div>
                    </div>
                </div>
                <div class="video-controls-tiktok">
                    <button class="tiktok-btn like-btn" id="likeBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    <button class="tiktok-btn play-pause-btn" id="playPauseBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path id="playPauseIcon" d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <button class="tiktok-btn mute-btn" id="muteBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path id="muteIcon" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                    </button>
                    <button class="tiktok-btn episodes-btn" id="episodesBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                        </svg>
                    </button>
                </div>
                <div class="play-control-overlay" id="playControlOverlay" style="display: none;">
                    <button class="video-play-btn" id="videoPlayBtn">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <p style="color: white; margin-top: 1rem; font-size: 1.1rem;">Toca para reproducir</p>
                </div>
            </div>
        `;
    } else {
        player.innerHTML = `
            <div class="video-container-tiktok">
                <button class="close-player">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
                <div class="video-placeholder-tiktok">
                    <div class="video-info-tiktok">
                        <h3 class="video-title-tiktok">${title}</h3>
                        <p class="video-description-tiktok">Episodio ${startEpisode} - "El Despertar"</p>
                        <div class="video-progress-tiktok">
                            <div class="video-progress-fill"></div>
                        </div>
                    </div>
                    <div class="video-controls-tiktok">
                        <button class="tiktok-btn like-btn" id="likeBtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <button class="tiktok-btn play-pause-btn" id="playPauseBtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <button class="tiktok-btn mute-btn" id="muteBtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        </button>
                        <button class="tiktok-btn episodes-btn" id="episodesBtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    document.body.appendChild(player);
    setTimeout(() => player.classList.add('active'), 100);

    // Configurar controles de video real si existe
    if (hasRealVideo) {
        const video = document.getElementById('mainVideo');
        const progressBar = document.getElementById('videoProgressBar');
        const playControl = document.getElementById('playControlOverlay');
        const playBtn = document.getElementById('videoPlayBtn');

        // Detectar si es iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Configurar video para iOS
        if (isIOS) {
            video.muted = true;
            video.autoplay = false;
            playControl.style.display = 'flex';
        } else {
            video.muted = false;
            playControl.style.display = 'none';
        }

        // Función para iniciar reproducción
        const startPlayback = async () => {
            try {
                video.muted = false;
                video.volume = 1.0;
                await video.play();
                playControl.style.display = 'none';
                setTimeout(() => {
                    video.muted = false;
                }, 100);
            } catch (error) {
                console.log('Error al reproducir video:', error);
                try {
                    video.muted = true;
                    await video.play();
                    playControl.style.display = 'none';
                } catch (fallbackError) {
                    console.log('Error en fallback:', fallbackError);
                }
            }
        };

        // Event listeners para reproducción
        if (playBtn) {
            playBtn.addEventListener('click', startPlayback);
            playControl.addEventListener('click', startPlayback);
        }

        // Intentar reproducción automática
        if (!isIOS) {
            video.play().catch(() => {
                playControl.style.display = 'flex';
            });
        }

        // Actualizar barra de progreso
        video.addEventListener('timeupdate', () => {
            if (video.duration > 0) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Actualizar historial de visualización
                if (video.currentTime % 5 === 0) {
                    addToWatchHistory(title, currentEpisode, progress);
                }
            }
        });

        // Mostrar animación 2 segundos antes del final
        let animationTriggered = false;
        video.addEventListener('timeupdate', () => {
            if (video.duration > 0) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Actualizar historial de visualización
                if (video.currentTime % 5 === 0) {
                    addToWatchHistory(title, currentEpisode, progress);
                }
                
                // Activar animación 2 segundos antes del final
                const timeLeft = video.duration - video.currentTime;
                if (timeLeft <= 2 && timeLeft > 1.5 && !animationTriggered) {
                    animationTriggered = true;
                    // Pausar el video
                    video.pause();
                    
                    showChapterEndAnimation(() => {
                        handleEpisodeTransition(currentEpisode + 1, title, player);
                        animationTriggered = false;
                    });
                }
            }
        });
        
        // Mantener el evento ended como respaldo
        video.addEventListener('ended', () => {
            if (!animationTriggered) {
                showChapterEndAnimation(() => {
                    handleEpisodeTransition(currentEpisode + 1, title, player);
                });
            }
        });

        // Bloquear controles nativos del video
        video.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        video.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    // Simulate video progress tracking
    let currentEpisode = startEpisode;
    let watchTime = 0;
    const watchInterval = setInterval(() => {
        watchTime += 1;
        const progress = Math.min((watchTime / 60) * 100, 100); // 60 seconds = 100%
        
        // Update watch history every 5 seconds
        if (watchTime % 5 === 0) {
            addToWatchHistory(title, currentEpisode, progress);
        }
        
        // Auto advance to next episode after 60 seconds
        if (watchTime >= 60) {
            showChapterEndAnimation(() => {
                watchTime = 0;
                handleEpisodeTransition(currentEpisode + 1, title, player);
            });
        }
    }, 1000);

    // Event listeners
    const closeBtn = player.querySelector('.close-player');
    const likeBtn = player.querySelector('#likeBtn');
    const playPauseBtn = player.querySelector('#playPauseBtn');
    const muteBtn = player.querySelector('#muteBtn');
    const episodesBtn = player.querySelector('#episodesBtn');

    closeBtn.addEventListener('click', () => {
        clearInterval(watchInterval);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        player.classList.remove('active');
        setTimeout(() => document.body.removeChild(player), 300);
    });

    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
        showNotification(likeBtn.classList.contains('liked') ? 'Agregado a favoritos' : 'Removido de favoritos');
    });

    let isPlaying = hasRealVideo ? false : true;
    playPauseBtn.addEventListener('click', () => {
        if (hasRealVideo) {
            const video = document.getElementById('mainVideo');
            const playPauseIcon = document.getElementById('playPauseIcon');
            
            if (video.paused) {
                video.play();
                isPlaying = true;
                playPauseIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            } else {
                video.pause();
                isPlaying = false;
                playPauseIcon.setAttribute('d', 'M8 5v14l11-7z');
            }
        } else {
            isPlaying = !isPlaying;
            const playPauseIcon = playPauseBtn.querySelector('path');
            playPauseIcon.setAttribute('d', isPlaying ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z');
        }
    });

    let isMuted = false;
    muteBtn.addEventListener('click', () => {
        if (hasRealVideo) {
            const video = document.getElementById('mainVideo');
            const muteIcon = document.getElementById('muteIcon');
            
            isMuted = !video.muted;
            video.muted = isMuted;
            
            muteIcon.setAttribute('d', isMuted ? 
                'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' :
                'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
            );
        } else {
            isMuted = !isMuted;
            const muteIcon = muteBtn.querySelector('path');
            muteIcon.setAttribute('d', isMuted ?
                'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' :
                'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
            );
        }
    });

    episodesBtn.addEventListener('click', () => {
        showEpisodesModal(title);
    });
}

function showEpisodesModal(seriesTitle) {
    const modal = document.createElement('div');
    modal.className = 'episodes-modal';
    modal.innerHTML = `
        <div class="episodes-header">
            <h3 class="episodes-title">${seriesTitle} - Episodios</h3>
            <button class="episodes-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>
        </div>
        <div class="episodes-list">
            ${generateEpisodesList()}
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);

    const closeBtn = modal.querySelector('.episodes-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    });

    // Episode selection with monetization
    const episodeItems = modal.querySelectorAll('.episode-item');
    episodeItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const episodeNum = index + 1;
            if (handleEpisodeClick(episodeNum)) {
                episodeItems.forEach(ep => ep.classList.remove('current'));
                item.classList.add('current');
                modal.classList.remove('active');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });
    });
}

function generateEpisodesList() {
    let episodes = '';
    for (let i = 1; i <= 45; i++) {
        const isLocked = i > 8 && !unlockedEpisodes.includes(i);
        const canUnlock = isLocked && userCoins >= 30;
        const lockIcon = isLocked ? `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="lock-icon">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
            </svg>
        ` : '';

        episodes += `
            <div class="episode-item ${i === 1 ? 'current' : ''} ${isLocked ? 'locked' : ''} ${canUnlock ? 'can-unlock' : ''}" data-episode="${i}">
                <div class="episode-number">
                    ${i} 
                    ${lockIcon}
                    ${canUnlock ? '<span class="auto-unlock-indicator">Auto-desbloquear</span>' : ''}
                </div>
                <div class="episode-info">
                    <h4>Episodio ${i}</h4>
                    <p>1 min • ${Math.floor(Math.random() * 2) + 8}.${Math.floor(Math.random() * 9)}</p>
                    ${isLocked && !canUnlock ? '<p class="unlock-cost">30 monedas</p>' : ''}
                    ${canUnlock ? '<p class="unlock-ready">¡Listo para desbloquear!</p>' : ''}
                </div>
            </div>
        `;
    }
    return episodes;
}

// Auto-unlock detection
function updateAutoUnlockStatus() {
    const autoUnlockStatus = document.getElementById('autoUnlockStatus');
    const lockedEpisodes = [];

    for (let i = 9; i <= 45; i++) {
        if (!unlockedEpisodes.includes(i)) {
            lockedEpisodes.push(i);
        }
    }

    const canAutoUnlock = lockedEpisodes.length > 0 && userCoins >= 30;

    if (canAutoUnlock && autoUnlockStatus) {
        autoUnlockStatus.style.display = 'block';
    } else if (autoUnlockStatus) {
        autoUnlockStatus.style.display = 'none';
    }
}

// Modern notification system
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';

    const icons = {
        success: '✓',
        info: 'i',
        warning: '!',
        error: '×'
    };

    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.success}</span>
        <span>${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        if (container.contains(notification)) {
            container.removeChild(notification);
        }
    }, 3000);
}

// Search modal functionality
function showSearchModal() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');

    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
}

function hideSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').style.display = 'none';
}

// Stripe Integration
const stripe = Stripe('pk_test_51RF622RCIbJ5KY2omXVZiiIrOdzRWt7oPCxx6klyoMVfudhBZwdOoaDvLRpDslpTlsfw792JwuKowkFh6s1QFbf500EruqKvnl');

// Expanded search functionality
function showExpandedSearch() {
    const modal = document.getElementById('expandedSearchModal');
    const input = document.getElementById('expandedSearchInput');

    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);

    // Load all series initially
    displayExpandedSearchResults(getAllSeries());
}

function hideExpandedSearch() {
    const modal = document.getElementById('expandedSearchModal');
    modal.classList.remove('active');
    document.getElementById('expandedSearchInput').value = '';
}

function getAllSeries() {
    return [
        { 
            title: 'La Niña de los Cuatro CEO', 
            rating: '9.5', 
            episodes: '45 eps', 
            year: '2024', 
            genre: 'Romance Empresarial', 
            thumbnail: 'https://via.placeholder.com/280x400/ff1493/fff?text=La+Niña+CEO',
            description: 'Una joven prodigio se convierte en la protegida de cuatro poderosos CEOs, navegando el mundo empresarial mientras descubre el amor.',
            videoUrl: 'https://www.dropbox.com/scl/fi/su7cuwd60sz89hsonies4/copy_7675023E-5F80-4FA6-9FC0-E017CD157EE5.mov?rlkey=56om33xqkm4j4rngju9jqvp5o&st=3hzprvjo&raw=1'
        },
        { 
            title: 'Amor en la Dinastía Tang', 
            rating: '8.9', 
            episodes: '30 eps', 
            year: '2024', 
            genre: 'Romance Histórico', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+1',
            description: 'Una épica historia de amor ambientada en la gloriosa Dinastía Tang, donde el destino une a dos almas destinadas a estar juntas.'
        },
        { 
            title: 'El Príncipe Perdido', 
            rating: '9.1', 
            episodes: '25 eps', 
            year: '2024', 
            genre: 'Artes Marciales', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+2',
            description: 'Un príncipe exiliado debe dominar las artes marciales para reclamar su trono y vengar la traición a su familia.'
        },
        { 
            title: 'Guerreros del Jade', 
            rating: '8.7', 
            episodes: '40 eps', 
            year: '2024', 
            genre: 'Artes Marciales', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+3',
            description: 'En busca del legendario Jade del Dragón, guerreros de diferentes escuelas se enfrentan en batallas épicas.'
        },
        { 
            title: 'La Médica Imperial', 
            rating: '9.3', 
            episodes: '35 eps', 
            year: '2024', 
            genre: 'Drama Imperial', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+4',
            description: 'Una talentosa médica navega por las intrigas de la corte imperial mientras lucha por salvar vidas y encontrar el amor.'
        },
        { 
            title: 'Secretos de la Corte', 
            rating: '8.8', 
            episodes: '28 eps', 
            year: '2024', 
            genre: 'Drama Imperial', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+5',
            description: 'Conspiraciones palaciegas y secretos ocultos ponen en peligro el imperio mientras la verdad lucha por salir a la luz.'
        },
        { 
            title: 'El Jardín Secreto', 
            rating: '8.6', 
            episodes: '22 eps', 
            year: '2024', 
            genre: 'Romance', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+6',
            description: 'En un jardín mágico escondido, dos corazones solitarios encuentran la sanación y el amor verdadero.'
        },
        { 
            title: 'Destino de Espadas', 
            rating: '9.0', 
            episodes: '38 eps', 
            year: '2024', 
            genre: 'Artes Marciales', 
            thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+1',
            description: 'Maestros espadachines compiten por la espada legendaria que determinará el destino del mundo marcial.'
        },
        { 
            title: 'Luna de Primavera', 
            rating: '8.9', 
            episodes: '32 eps', 
            year: '2024', 
            genre: 'Romance', 
            thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+2',
            description: 'Un romance que florece como la primavera entre una noble dama y un erudito talentoso en la antigua China.'
        },
        { 
            title: 'El Último General', 
            rating: '8.5', 
            episodes: '26 eps', 
            year: '2024', 
            genre: 'Artes Marciales', 
            thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+3',
            description: 'El último general de un reino caído debe reunir a los guerreros dispersos para una batalla final por la libertad.'
        },
        { 
            title: 'Corazón de Bambú', 
            rating: '9.2', 
            episodes: '20 eps', 
            year: '2024', 
            genre: 'Romance', 
            thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+4',
            description: 'Como el bambú que se dobla pero no se rompe, este amor resiste todas las adversidades del destino.'
        },
        { 
            title: 'El Emperador Eterno', 
            rating: '9.2', 
            episodes: '45 eps', 
            year: '2024', 
            genre: 'Fantasía Antigua', 
            thumbnail: 'https://via.placeholder.com/280x400/3a3a3a/fff?text=Continuar+1',
            description: 'Un emperador inmortal debe enfrentar amenazas ancestrales mientras protege su reino y encuentra el amor verdadero.'
        },
        { 
            title: 'Romance Eterno', 
            rating: '8.9', 
            episodes: '45 eps', 
            year: '2024', 
            genre: 'Romance Histórico', 
            thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Romance+1',
            description: 'Una historia de amor que trasciende el tiempo y las vidas, donde dos almas están destinadas a encontrarse.'
        }
    ];
}

function displayExpandedSearchResults(results) {
    const resultsContainer = document.getElementById('expandedSearchResults');

    resultsContainer.innerHTML = results.map(result => `
        <div class="expanded-result-card" onclick="selectExpandedSearchResult('${result.title}')">
            <img src="${result.thumbnail}" alt="${result.title}" class="expanded-result-image">
            <div class="expanded-result-info">
                <div class="expanded-result-genre">${result.genre}</div>
                <h3 class="expanded-result-title">${result.title}</h3>
                <div class="expanded-result-rating">
                    <span class="star">★</span>
                    <span>${result.rating}</span>
                    <span>•</span>
                    <span>${result.episodes}</span>
                    <span>•</span>
                    <span>${result.year}</span>
                </div>
                <p class="expanded-result-description">${result.description}</p>
                <button class="expanded-result-play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    Ver Ahora
                </button>
            </div>
        </div>
    `).join('');
}

function selectExpandedSearchResult(title) {
    hideExpandedSearch();
    showTikTokPlayer(title);
}

function performExpandedSearch(query) {
    console.log('Searching for:', query);

    const allSeries = getAllSeries();
    const filteredResults = allSeries.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.genre.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
    );

    displayExpandedSearchResults(filteredResults);
}

function filterExpandedResults(category) {
    const allSeries = getAllSeries();
    let filteredResults = allSeries;

    if (category !== 'todos') {
        filteredResults = allSeries.filter(result => 
            result.genre.toLowerCase().includes(category.toLowerCase())
        );
    }

    displayExpandedSearchResults(filteredResults);
}

// Global payment variables
let currentPurchaseAmount = 0;
let currentPurchaseCoins = 0;

// Show payment modal
function showPaymentModal(amount, coins) {
    currentPurchaseAmount = amount;
    currentPurchaseCoins = coins;

    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');

    // Reset form
    const cardForm = document.getElementById('cardForm');
    cardForm.style.display = 'none';

    // Reset payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.style.background = '#16181c';
    });
}

function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
}

// Apple Pay implementation
function processApplePay() {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        const request = {
            countryCode: 'US',
            currencyCode: 'USD',
            supportedNetworks: ['visa', 'masterCard', 'amex'],
            merchantCapabilities: ['supports3DS'],
            total: {
                label: `${currentPurchaseCoins} Monedas Beemo`,
                amount: (currentPurchaseAmount / 100).toFixed(2)
            }
        };

        const session = new ApplePaySession(3, request);

        session.onvalidatemerchant = async (event) => {
            // In a real app, you would validate with your server
            showNotification('Autenticando con Apple Pay...', 'info');
        };

        session.onpaymentauthorized = async (event) => {
            // Process payment
            const payment = event.payment;

            try {
                // Simulate payment processing
                await new Promise(resolve => setTimeout(resolve, 2000));

                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                addCoins(currentPurchaseCoins);
                hidePaymentModal();
                showNotification(`¡Compra exitosa! ${currentPurchaseCoins} monedas agregadas`, 'success');
            } catch (error) {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                showNotification('Error en el pago', 'error');
            }
        };

        session.begin();
    } else {
        showNotification('Apple Pay no está disponible en este dispositivo', 'warning');
    }
}

// Credit card processing with Stripe
async function processCreditCard() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvc = document.getElementById('cardCvc').value;
    const cardName = document.getElementById('cardName').value;

    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }

    try {
        showNotification('Procesando pago con Stripe...', 'info');
        document.getElementById('processPaymentBtn').disabled = true;
        document.getElementById('processPaymentBtn').innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="loading-spinner"></div>
                Procesando...
            </div>
        `;

        // Create payment intent on your server
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk_test_51RF622RCIbJ5KY2oXhGpadJFs8tpUIXVad4c6rL2HBq1YuWnkiKR3x4THEdrhDe9Lda8LMsMkPADUDhHDqBeA52z00heZI3BbD',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                amount: currentPurchaseAmount,
                currency: 'usd',
                description: `${currentPurchaseCoins} Monedas Beemo`,
                'payment_method_types[]': 'card'
            })
        });

        const paymentIntent = await response.json();

        if (paymentIntent.error) {
            throw new Error(paymentIntent.error.message);
        }

        // Create payment method with card details
        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: {
                number: cardNumber.replace(/\s/g, ''),
                exp_month: parseInt(cardExpiry.split('/')[0]),
                exp_year: parseInt('20' + cardExpiry.split('/')[1]),
                cvc: cardCvc,
            },
            billing_details: {
                name: cardName,
            },
        });

        if (pmError) {
            throw pmError;
        }

        // Confirm payment
        const { error: confirmError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
            paymentIntent.client_secret,
            {
                payment_method: paymentMethod.id
            }
        );

        if (confirmError) {
            throw confirmError;
        }

        if (confirmedPayment.status === 'succeeded') {
            addCoins(currentPurchaseCoins);
            hidePaymentModal();
            showNotification(`¡Pago exitoso! ${currentPurchaseCoins} monedas agregadas`, 'success');

            // Log successful payment
            console.log('Payment successful:', confirmedPayment.id);
        }

    } catch (error) {
        console.error('Payment error:', error);
        showNotification(`Error en el pago: ${error.message}`, 'error');
    } finally {
        document.getElementById('processPaymentBtn').disabled = false;
        document.getElementById('processPaymentBtn').innerHTML = 'Procesar Pago';
    }
}

// PayPal processing
function processPayPal() {
    showNotification('PayPal está temporalmente fuera de servicio. Intenta con otro método de pago.', 'warning');
}

// Purchase coins function
function purchaseCoins(amount, coins) {
    showPaymentModal(amount, coins);
}

// Check for successful payment
function checkPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const coins = urlParams.get('coins');

    if (payment === 'success' && coins) {
        addCoins(parseInt(coins));
        showNotification(`¡Compra exitosa! ${coins} monedas agregadas a tu cuenta`, 'success');

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Enhanced search functionality with real-time results
function performSearch(query) {
    console.log('Searching for:', query);

    const allSeries = [
        { title: 'Amor en la Dinastía Tang', rating: '8.9', episodes: '30 eps', year: '2024', genre: 'Romance Histórico', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+1' },
        { title: 'El Príncipe Perdido', rating: '9.1', episodes: '25 eps', year: '2024', genre: 'Artes Marciales', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+2' },
        { title: 'Guerreros del Jade', rating: '8.7', episodes: '40 eps', year: '2024', genre: 'Artes Marciales', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+3' },
        { title: 'La Médica Imperial', rating: '9.3', episodes: '35 eps', year: '2024', genre: 'Drama Imperial', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+4' },
        { title: 'Secretos de la Corte', rating: '8.8', episodes: '28 eps', year: '2024', genre: 'Drama Imperial', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+5' },
        { title: 'El Jardín Secreto', rating: '8.6', episodes: '22 eps', year: '2024', genre: 'Romance', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Drama+6' },
        { title: 'Destino de Espadas', rating: '9.0', episodes: '38 eps', year: '2024', genre: 'Artes Marciales', thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+1' },
        { title: 'Luna de Primavera', rating: '8.9', episodes: '32 eps', year: '2024', genre: 'Romance', thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+2' },
        { title: 'El Último General', rating: '8.5', episodes: '26 eps', year: '2024', genre: 'Artes Marciales', thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+3' },
        { title: 'Corazón de Bambú', rating: '9.2', episodes: '20 eps', year: '2024', genre: 'Romance', thumbnail: 'https://via.placeholder.com/280x400/2a2a2a/fff?text=Nuevo+4' },
        { title: 'El Emperador Eterno', rating: '9.2', episodes: '45 eps', year: '2024', genre: 'Fantasía Antigua', thumbnail: 'https://via.placeholder.com/280x400/3a3a3a/fff?text=Continuar+1' },
        { title: 'Romance Eterno', rating: '8.9', episodes: '45 eps', year: '2024', genre: 'Romance Histórico', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Romance+1' },
        { title: 'Corazón de Jade', rating: '8.7', episodes: '35 eps', year: '2024', genre: 'Romance', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Romance+2' },
        { title: 'El Jardín del Emperador', rating: '9.0', episodes: '25 eps', year: '2024', genre: 'Drama Imperial', thumbnail: 'https://via.placeholder.com/280x400/1a1a1a/fff?text=Imperial+1' }
    ];

    const filteredResults = allSeries.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.genre.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(filteredResults);
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    const resultsList = document.getElementById('resultsList');

    if (results.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }

    resultsList.innerHTML = results.map(result => `
        <div class="result-item" onclick="selectSearchResult('${result.title}')">
            <img src="${result.thumbnail}" alt="${result.title}" class="result-image">
            <div class="result-info">
                <h4>${result.title}</h4>
                <p class="result-genre">${result.genre}</p>
                <p class="result-details">⭐ ${result.rating} • ${result.episodes} • ${result.year}</p>
            </div>
        </div>
    `).join('');

    resultsContainer.style.display = 'block';
}

function selectSearchResult(title) {
    hideSearchModal();
    showTikTokPlayer(title);
}

// Category filtering
document.addEventListener('DOMContentLoaded', () => {
    const categoryChips = document.querySelectorAll('.category-chip');
    const contentCards = document.querySelectorAll('.content-card');

    // Category chip interactions
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            categoryChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');

            const category = chip.dataset.category;
            filterContent(category);

            // Smooth scroll to content
            document.querySelector('.content-feed').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });

    // Content card interactions
    contentCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('play-btn')) {
                const title = card.querySelector('h3').textContent;
                showTikTokPlayer(title);
            }
        });
    });

    // Play button functionality
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = btn.closest('.content-card').querySelector('h3').textContent;
            showTikTokPlayer(title);
        });
    });

    // Hero play button
    const heroPlayBtn = document.querySelector('.btn-primary');
    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', () => {
            showTikTokPlayer('La Niña de los Cuatro CEO');
        });
    }

    // My List button
    const myListBtn = document.querySelector('.btn-secondary');
    if (myListBtn) {
        myListBtn.addEventListener('click', () => {
            showNotification('Agregado a Mi Lista', 'success');
        });
    }

    // Search functionality - Show expanded search
    const searchBarInput = document.getElementById('searchBarInput');
    const expandedSearchModal = document.getElementById('expandedSearchModal');
    const expandedSearchClose = document.getElementById('expandedSearchClose');
    const expandedSearchInput = document.getElementById('expandedSearchInput');

    if (searchBarInput) {
        searchBarInput.addEventListener('click', showExpandedSearch);
        searchBarInput.addEventListener('focus', showExpandedSearch);
    }

    if (expandedSearchClose) {
        expandedSearchClose.addEventListener('click', hideExpandedSearch);
    }

    if (expandedSearchModal) {
        expandedSearchModal.addEventListener('click', (e) => {
            if (e.target === expandedSearchModal) {
                hideExpandedSearch();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && expandedSearchModal.classList.contains('active')) {
                hideExpandedSearch();
            }
        });
    }

    if (expandedSearchInput) {
        expandedSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                performExpandedSearch(query);
            } else {
                displayExpandedSearchResults(getAllSeries());
            }
        });
    }

    // Expanded search category filters
    const expandedCategoryChips = document.querySelectorAll('.expanded-category-chip');
    expandedCategoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            expandedCategoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const category = chip.dataset.category;
            filterExpandedResults(category);
        });
    });

    // Suggestion clicks
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            const query = suggestion.textContent;
            searchInput.value = query;
            performSearch(query);
        });
    });
});

// Content filtering
function filterContent(category) {
    const sections = document.querySelectorAll('.content-section');

    if (category === 'todos') {
        sections.forEach(section => {
            section.style.display = 'block';
        });
    } else {
        sections.forEach(section => {
            section.style.opacity = '0.6';
        });

        setTimeout(() => {
            sections.forEach(section => {
                section.style.opacity = '1';
            });
        }, 300);
    }

    showNotification(`Mostrando: ${getCategoryName(category)}`, 'info');
}

function getCategoryName(category) {
    const names = {
        'todos': 'Todos los Dramas',
        'nuevos': 'Nuevos Estrenos',
        'populares': 'Más Populares',
        'romance': 'Romance',
        'accion': 'Acción',
        'comedia': 'Comedia',
        'fantasia': 'Fantasía'
    };
    return names[category] || 'Todos los Dramas';
}

// Modern video player
function showVideoPlayer(title) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-container">
            <div class="video-header">
                <h2>${title}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="video-content">
                <div class="video-placeholder">
                    <div class="play-icon">▶</div>
                    <div class="video-info">
                        <h3>Episodio 1 - "El Despertar"</h3>
                        <p>⏱️ 1 minuto • 🎭 Drama • ⭐ 9.2</p>
                    </div>
                </div>
                <div class="video-controls">
                    <button class="control-btn">⏮</button>
                    <button class="control-btn">⏸</button>
                    <button class="control-btn">⏭</button>
                    <div class="progress-bar">
                        <div class="progress" style="width: 25%"></div>
                    </div>
                    <span class="time">0:15 / 1:00</span>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .video-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }

        .video-container {
            background: #16181c;
            border-radius: 16px;
            overflow: hidden;
            max-width: 90vw;
            max-height: 90vh;
            width: 800px;
            border: 1px solid #2f3336;
        }

        .video-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: #000000;
            border-bottom: 1px solid #2f3336;
        }

        .video-header h2 {
            font-size: 1.3rem;
            font-weight: 600;
            color: #e7e9ea;
        }

        .close-btn {
            background: none;
            border: 1px solid #536471;
            color: #e7e9ea;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            border-color: #ef4444;
        }

        .video-placeholder {
            aspect-ratio: 16/9;
            background: linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }

        .play-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            background: rgba(255, 255, 255, 0.2);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .play-icon:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .video-info h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .video-info p {
            font-size: 1rem;
            opacity: 0.9;
        }

        .video-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            background: #000000;
        }

        .control-btn {
            background: none;
            border: none;
            color: #e7e9ea;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .control-btn:hover {
            background: rgba(29, 155, 240, 0.1);
        }

        .progress-bar {
            flex: 1;
            height: 4px;
            background: #2f3336;
            border-radius: 2px;
            margin: 0 1rem;
            cursor: pointer;
        }

        .progress {
            height: 100%;
            background: #1d9bf0;
            border-radius: 2px;
        }

        .time {
            color: #71767b;
            font-size: 0.85rem;
            min-width: 80px;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
}



// Smooth scrolling for categories
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.categories-carousel');
    if (carousel) {
        let isScrolling = false;

        carousel.addEventListener('wheel', (e) => {
            if (!isScrolling) {
                e.preventDefault();
                isScrolling = true;

                const scrollAmount = e.deltaY > 0 ? 200 : -200;
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 300);
            }
        });
    }
});

// Monetization System
let userCoins = parseInt(localStorage.getItem('userCoins') || '0');
let unlockedEpisodes = JSON.parse(localStorage.getItem('unlockedEpisodes') || '[1,2,3,4,5,6,7,8]');

function updateCoinDisplay() {
    document.getElementById('coinCount').textContent = userCoins;
    document.getElementById('modalCoinCount').textContent = `${userCoins} Monedas`;
    localStorage.setItem('userCoins', userCoins.toString());
    updateAutoUnlockStatus();
}

function addCoins(amount) {
    userCoins += amount;
    updateCoinDisplay();
    showNotification(`+${amount} monedas ganadas!`, 'success');
}

function unlockEpisode(episodeNum) {
    if (userCoins >= 30 && !unlockedEpisodes.includes(episodeNum)) {
        userCoins -= 30;
        unlockedEpisodes.push(episodeNum);
        localStorage.setItem('unlockedEpisodes', JSON.stringify(unlockedEpisodes));
        updateCoinDisplay();
        showNotification(`Episodio ${episodeNum} desbloqueado!`, 'success');
        return true;
    }
    return false;
}

function showMonetizationModal() {
    const modal = document.getElementById('monetizationModal');
    modal.classList.add('active');
    updateCoinDisplay();
}

function hideMonetizationModal() {
    const modal = document.getElementById('monetizationModal');
    modal.classList.remove('active');
}

function showAdModal() {
    const modal = document.getElementById('adModal');
    const timer = document.getElementById('adTimer');
    const closeBtn = document.getElementById('adClose');
    const progress = document.getElementById('adProgress');

    // Bloquear scroll del body y hacer pantalla completa
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    modal.classList.add('active');
    closeBtn.style.display = 'none';

    // Update ad content with Netflix video
    const adContent = modal.querySelector('.ad-content');
    adContent.innerHTML = `
        <div class="netflix-ad-container-fullscreen">
            <video 
                id="netflixAdVideo" 
                width="100%" 
                height="100%" 
                autoplay 
                muted="false"
                playsinline
                webkit-playsinline
                controls="false"
                preload="metadata"
                style="object-fit: cover; background: #000;"
            >
                <source src="https://www.dropbox.com/scl/fi/oa2blfwyvg84csw5w13ky/copy_0B8A47E6-5756-4AA7-A69F-FF4E6C6A3194.mov?rlkey=pxs3j8ujtrnyhpf9u7qn6iyl1&st=uy6kb9o7&raw=1" type="video/mp4">
                Tu navegador no soporta el elemento de video.
            </video>
            <div class="netflix-ad-overlay-fullscreen">
                <div class="netflix-logo-fullscreen">
                    <h2 style="color: #e50914; font-weight: 800; font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">NETFLIX</h2>
                </div>
                <div class="netflix-cta-fullscreen">
                    <h3 style="color: white; margin-bottom: 1.5rem; font-size: 1.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">¿Te gustó lo que viste?</h3>
                    <button class="netflix-download-btn-fullscreen" id="netflixDownloadBtn">
                        📱 Descargar Netflix Ahora
                    </button>
                </div>
            </div>
            <div class="ad-timer-overlay">
                <span id="adTimerDisplay">30</span>
            </div>
            <div class="play-control-overlay" id="playControlOverlay">
                <button class="video-play-btn" id="videoPlayBtn">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                <p style="color: white; margin-top: 1rem; font-size: 1.1rem;">Toca para reproducir el anuncio</p>
            </div>
        </div>
    `;

    const video = document.getElementById('netflixAdVideo');
    const downloadBtn = document.getElementById('netflixDownloadBtn');
    const timerDisplay = document.getElementById('adTimerDisplay');
    const playControl = document.getElementById('playControlOverlay');
    const playBtn = document.getElementById('videoPlayBtn');

    // Detectar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Configurar video para iOS
    if (isIOS) {
        video.muted = true; // Inicialmente muted para iOS
        video.autoplay = false;
        playControl.style.display = 'flex';
    } else {
        video.muted = false; // Android y desktop con sonido
        playControl.style.display = 'none';
    }

    // Prevenir controles nativos del video
    video.setAttribute('disablePictureInPicture', '');
    video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplaybook');
    
    // Función para iniciar reproducción
    const startPlayback = async () => {
        try {
            // Habilitar sonido después del primer toque del usuario
            video.muted = false;
            video.volume = 1.0;
            
            await video.play();
            playControl.style.display = 'none';
            
            // Pequeño delay para asegurar que el sonido funcione
            setTimeout(() => {
                video.muted = false;
            }, 100);
            
        } catch (error) {
            console.log('Error al reproducir video:', error);
            // Fallback: intentar con muted si falla
            try {
                video.muted = true;
                await video.play();
                playControl.style.display = 'none';
            } catch (fallbackError) {
                console.log('Error en fallback:', fallbackError);
            }
        }
    };

    // Event listeners para reproducción
    playBtn.addEventListener('click', startPlayback);
    playControl.addEventListener('click', startPlayback);
    
    // Intentar reproducción automática para dispositivos que lo permiten
    if (!isIOS) {
        video.play().catch(() => {
            // Si falla la reproducción automática, mostrar control
            playControl.style.display = 'flex';
        });
    }

    // Bloquear eventos de click en el video
    video.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    video.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Listener para cuando el video está listo
    video.addEventListener('loadedmetadata', () => {
        if (isIOS) {
            // Para iOS, asegurar que está configurado correctamente
            video.muted = true;
        }
    });

    // Netflix download button functionality
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Detectar dispositivo y redireccionar
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isAndroid = /android/i.test(userAgent);
        
        try {
            if (isIOS) {
                // Intentar abrir la app de Netflix primero, luego App Store
                const netflixAppURL = 'netflix://';
                const appStoreURL = 'https://apps.apple.com/app/netflix/id363590051';
                
                // Crear iframe oculto para intentar abrir la app
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = netflixAppURL;
                document.body.appendChild(iframe);
                
                // Si no se abre la app, redirigir a App Store
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    window.open(appStoreURL, '_blank');
                }, 1000);
                
            } else if (isAndroid) {
                // Intentar abrir la app de Netflix primero, luego Play Store
                const netflixAppURL = 'intent://www.netflix.com/#Intent;package=com.netflix.mediaclient;scheme=https;end';
                const playStoreURL = 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient';
                
                try {
                    window.location.href = netflixAppURL;
                } catch (e) {
                    window.open(playStoreURL, '_blank');
                }
                
                // Fallback a Play Store después de 1 segundo
                setTimeout(() => {
                    window.open(playStoreURL, '_blank');
                }, 1000);
                
            } else {
                // Desktop - abrir sitio web de Netflix
                window.open('https://www.netflix.com', '_blank');
            }
            
            showNotification('¡Redirigiendo a Netflix! 🎬', 'success');
            
        } catch (error) {
            console.error('Error al redireccionar:', error);
            // Fallback general
            window.open('https://www.netflix.com', '_blank');
        }
    });

    let timeLeft = 30;
    const interval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        timerDisplay.textContent = timeLeft;
        progress.style.width = `${((30 - timeLeft) / 30) * 100}%`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            closeBtn.style.display = 'flex';
            addCoins(20);
            
            // Show interactive Netflix CTA
            const netflixCta = modal.querySelector('.netflix-cta-fullscreen');
            if (netflixCta) {
                netflixCta.style.display = 'block';
                netflixCta.style.animation = 'slideUpFromBottom 0.6s ease';
            }
            
            setTimeout(() => {
                modal.classList.remove('active');
                timer.textContent = '30';
                progress.style.width = '0%';
                
                // Restaurar scroll del body
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.height = '';
                
                // Reset ad content for next time
                adContent.innerHTML = `
                    <div class="ad-placeholder">
                        <h2>🎬 Anuncio Publicitario</h2>
                        <p>Este es un anuncio simulado de 30 segundos</p>
                        <div class="ad-progress">
                            <div class="ad-progress-fill" id="adProgress"></div>
                        </div>
                    </div>
                `;
            }, 5000);
        }
    }, 1000);
    
    // Manejar cierre del modal
    const originalCloseHandler = closeBtn.onclick;
    closeBtn.onclick = () => {
        // Restaurar scroll del body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        if (originalCloseHandler) {
            originalCloseHandler();
        }
    };
}

function shareWithFriends() {
    const shareData = {
        title: 'Beemo - Dramas Chinos',
        text: '¡Descubre increíbles dramas chinos en Beemo!',
        url: window.location.href + '?ref=' + generateShareCode()
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(shareData.url);
        showNotification('Enlace copiado al portapapeles', 'success');
    }
}

function generateShareCode() {
    return Math.random().toString(36).substring(2, 15);
}

function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if (ref && !localStorage.getItem('referralUsed_' + ref)) {
        localStorage.setItem('referralUsed_' + ref, 'true');
        addCoins(50);
        showNotification('¡Bienvenido! Has ganado 50 monedas por venir de un amigo', 'success');
    }
}

// Episode click handler with auto-unlock and monetization
function handleEpisodeClick(episodeNum) {
    if (episodeNum <= 8 || unlockedEpisodes.includes(episodeNum)) {
        showNotification(`Reproduciendo Episodio ${episodeNum}`, 'success');
        return true;
    } else {
        // Auto-unlock if user has enough coins
        if (userCoins >= 30) {
            if (unlockEpisode(episodeNum)) {
                showNotification(`Episodio ${episodeNum} desbloqueado automáticamente y reproduciéndose`, 'success');
                return true;
            }
        } else {
            showNotification('No tienes suficientes monedas. Gana más monedas o compra con dinero real.', 'warning');
            return false;
        }
    }
}

// Chapter End Animation with Ocean Wave Effect and Elegant Explosion
function showChapterEndAnimation(callback) {
    // Crear overlay con efecto de onda oceánica
    const videoOverlay = document.createElement('div');
    videoOverlay.className = 'video-ocean-effect';
    videoOverlay.innerHTML = `
        <div class="ocean-wave-container">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
            <div class="wave wave-4"></div>
        </div>
        <div class="video-freeze-effect"></div>
    `;

    // Agregar overlay al video actual
    const videoContainer = document.querySelector('.video-container-tiktok, .video-placeholder-tiktok');
    if (videoContainer) {
        videoContainer.appendChild(videoOverlay);
    }

    // Activar efecto de congelamiento con ondas
    setTimeout(() => {
        videoOverlay.classList.add('active');
        
        // Crear animación principal después del efecto de onda
        setTimeout(() => {
            showMainChapterAnimation(callback);
        }, 2000);
    }, 100);
}

function showMainChapterAnimation(callback) {
    const animationOverlay = document.createElement('div');
    animationOverlay.className = 'chapter-loading-animation';
    animationOverlay.innerHTML = `
        <div class="loading-container">
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    `;

    document.body.appendChild(animationOverlay);

    // Reproducir sonido con iframe de YouTube
    const youtubeFrame = document.createElement('iframe');
    youtubeFrame.style.display = 'none';
    youtubeFrame.src = 'https://www.youtube.com/embed/dz6Lp_PyX_Q?autoplay=1&start=0&end=4&controls=0&modestbranding=1&rel=0&showinfo=0&mute=0';
    youtubeFrame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    document.body.appendChild(youtubeFrame);

    // Activar animación
    setTimeout(() => {
        animationOverlay.classList.add('active');
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
        animationOverlay.classList.add('fade-out');
        
        // Limpiar overlay del video también
        const videoOverlay = document.querySelector('.video-ocean-effect');
        if (videoOverlay) {
            videoOverlay.remove();
        }
        
        setTimeout(() => {
            if (document.body.contains(animationOverlay)) {
                document.body.removeChild(animationOverlay);
            }
            if (document.body.contains(youtubeFrame)) {
                document.body.removeChild(youtubeFrame);
            }
            if (callback) callback();
        }, 500);
    }, 3000);
}

// Función para manejar transición entre episodios
function handleEpisodeTransition(nextEpisode, seriesTitle, playerElement) {
    // Verificar si el episodio está disponible
    if (nextEpisode <= 8) {
        // Episodios gratis, avanzar automáticamente
        currentEpisode = nextEpisode;
        const descriptionElement = playerElement.querySelector('.video-description-tiktok');
        if (descriptionElement) {
            descriptionElement.textContent = `Episodio ${nextEpisode} - "${getEpisodeTitle(seriesTitle, nextEpisode)}"`;
        }
        showNotification(`Reproduciendo Episodio ${nextEpisode}`, 'success');
    } else {
        // Episodios premium - verificar monedas o mostrar suscripción
        if (unlockedEpisodes.includes(nextEpisode)) {
            // Ya desbloqueado, continuar
            currentEpisode = nextEpisode;
            const descriptionElement = playerElement.querySelector('.video-description-tiktok');
            if (descriptionElement) {
                descriptionElement.textContent = `Episodio ${nextEpisode} - "${getEpisodeTitle(seriesTitle, nextEpisode)}"`;
            }
            showNotification(`Reproduciendo Episodio ${nextEpisode}`, 'success');
        } else if (userCoins >= 30) {
            // Auto-desbloquear con monedas
            if (unlockEpisode(nextEpisode)) {
                currentEpisode = nextEpisode;
                const descriptionElement = playerElement.querySelector('.video-description-tiktok');
                if (descriptionElement) {
                    descriptionElement.textContent = `Episodio ${nextEpisode} - "${getEpisodeTitle(seriesTitle, nextEpisode)}"`;
                }
                showNotification(`Episodio ${nextEpisode} desbloqueado automáticamente`, 'success');
            }
        } else {
            // Mostrar modal de suscripción/monetización
            showSubscriptionModal(nextEpisode, seriesTitle, playerElement);
        }
    }
}

// Función para mostrar modal de suscripción
function showSubscriptionModal(episodeNumber, seriesTitle, playerElement) {
    const subscriptionModal = document.createElement('div');
    subscriptionModal.className = 'subscription-modal-overlay';
    subscriptionModal.innerHTML = `
        <div class="subscription-modal-container">
            <div class="subscription-header">
                <h2>Episodio Premium</h2>
                <button class="subscription-close" id="subscriptionClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="subscription-content">
                <div class="episode-info">
                    <h3>${seriesTitle}</h3>
                    <p>Episodio ${episodeNumber} - "${getEpisodeTitle(seriesTitle, episodeNumber)}"</p>
                </div>
                <div class="subscription-message">
                    <div class="lock-icon-large">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                    </div>
                    <h4>Episodio Premium Bloqueado</h4>
                    <p>Los episodios a partir del 8 requieren monedas para desbloquearse</p>
                    <div class="cost-info">
                        <span class="cost-amount">30 monedas</span>
                        <span class="cost-description">por episodio</span>
                    </div>
                </div>
                <div class="subscription-options">
                    <button class="subscription-btn primary" id="earnCoinsBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Ganar Monedas Gratis
                    </button>
                    <button class="subscription-btn secondary" id="buyCoinsBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                        </svg>
                        Comprar Monedas
                    </button>
                </div>
                <div class="current-balance">
                    <p>Monedas actuales: <span class="balance-count">${userCoins}</span></p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(subscriptionModal);
    setTimeout(() => subscriptionModal.classList.add('active'), 100);

    // Event listeners
    const closeBtn = subscriptionModal.querySelector('#subscriptionClose');
    const earnCoinsBtn = subscriptionModal.querySelector('#earnCoinsBtn');
    const buyCoinsBtn = subscriptionModal.querySelector('#buyCoinsBtn');

    closeBtn.addEventListener('click', () => {
        subscriptionModal.classList.remove('active');
        setTimeout(() => document.body.removeChild(subscriptionModal), 300);
    });

    earnCoinsBtn.addEventListener('click', () => {
        subscriptionModal.classList.remove('active');
        setTimeout(() => document.body.removeChild(subscriptionModal), 300);
        showMonetizationModal();
    });

    buyCoinsBtn.addEventListener('click', () => {
        subscriptionModal.classList.remove('active');
        setTimeout(() => document.body.removeChild(subscriptionModal), 300);
        showMonetizationModal();
    });

    // Click outside to close
    subscriptionModal.addEventListener('click', (e) => {
        if (e.target === subscriptionModal) {
            subscriptionModal.classList.remove('active');
            setTimeout(() => document.body.removeChild(subscriptionModal), 300);
        }
    });
}

// Enhanced search functionality
function performSearchBar(query) {
    if (query.length > 2) {
        performSearch(query);
        document.getElementById('searchModal').classList.add('active');
    }
}

// Content sections visible immediately
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });

    // Initialize monetization
    updateCoinDisplay();
    checkReferral();
    
    // Initialize continue watching section
    updateContinueWatchingSection();

    // Monetization event listeners
    const rewardsBtn = document.getElementById('rewardsBtn');
    const monetizationClose = document.getElementById('monetizationClose');
    const monetizationModal = document.getElementById('monetizationModal');
    const watchAdBtn = document.getElementById('watchAdBtn');
    const shareBtn = document.getElementById('shareBtn');
    const adClose = document.getElementById('adClose');
    const searchBarInput = document.getElementById('searchBarInput');

    if (rewardsBtn) {
        rewardsBtn.addEventListener('click', showMonetizationModal);
    }

    if (monetizationClose) {
        monetizationClose.addEventListener('click', hideMonetizationModal);
    }

    if (monetizationModal) {
        monetizationModal.addEventListener('click', (e) => {
            if (e.target === monetizationModal) {
                hideMonetizationModal();
            }
        });
    }

    if (watchAdBtn) {
        watchAdBtn.addEventListener('click', showAdModal);
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', shareWithFriends);
    }

    if (adClose) {
        adClose.addEventListener('click', () => {
            document.getElementById('adModal').classList.remove('active');
        });
    }

    // Purchase button event listeners
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    purchaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            const coins = parseInt(btn.dataset.coins);
            purchaseCoins(amount, coins);
        });
    });

    // Payment modal event listeners
    const paymentClose = document.getElementById('paymentClose');
    const paymentModal = document.getElementById('paymentModal');
    const applePayOption = document.getElementById('applePayOption');
    const creditCardOption = document.getElementById('creditCardOption');
    const paypalOption = document.getElementById('paypalOption');
    const cardForm = document.getElementById('cardForm');
    const processPaymentBtn = document.getElementById('processPaymentBtn');

    if (paymentClose) {
        paymentClose.addEventListener('click', hidePaymentModal);
    }

    if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                hidePaymentModal();
            }
        });
    }

    if (applePayOption) {
        applePayOption.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(option => {
                option.style.background = '#16181c';
            });
            applePayOption.style.background = 'rgba(29, 155, 240, 0.1)';
            cardForm.style.display = 'none';

            setTimeout(() => {
                processApplePay();
            }, 500);
        });
    }

    if (creditCardOption) {
        creditCardOption.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(option => {
                option.style.background = '#16181c';
            });
            creditCardOption.style.background = 'rgba(29, 155, 240, 0.1)';
            cardForm.style.display = 'block';
        });
    }

    if (paypalOption) {
        paypalOption.addEventListener('click', () => {
            if (!paypalOption.classList.contains('disabled')) {
                processPayPal();
            }
        });
    }

    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processCreditCard);
    }

    // Card input formatting with better mobile support
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvcInput = document.getElementById('cardCvc');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length <= 19) { // Max length with spaces
                e.target.value = formattedValue;
            }
            validateCardForm();
        });

        // Prevent non-numeric input
        cardNumberInput.addEventListener('keypress', (e) => {
            if (!/[0-9\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
            }
        });
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            e.target.value = value;
            validateCardForm();
        });

        cardExpiryInput.addEventListener('keypress', (e) => {
            if (!/[0-9/]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
            }
        });
    }

    if (cardCvcInput) {
        cardCvcInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.substring(0, 4); // Max 4 digits
            validateCardForm();
        });

        cardCvcInput.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
            }
        });
    }

    const cardNameInput = document.getElementById('cardName');
    if (cardNameInput) {
        cardNameInput.addEventListener('input', validateCardForm);
    }

    // Check for payment success on page load
    checkPaymentSuccess();

    // Initialize expanded search with all series
    displayExpandedSearchResults(getAllSeries());
});

// Card form validation
function validateCardForm() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvc = document.getElementById('cardCvc').value;
    const cardName = document.getElementById('cardName').value;
    const processBtn = document.getElementById('processPaymentBtn');

    const isValid = cardNumber.replace(/\s/g, '').length >= 16 &&
                   cardExpiry.length === 5 &&
                   cardCvc.length >= 3 &&
                   cardName.trim().length > 0;

    if (processBtn) {
        processBtn.disabled = !isValid;
        processBtn.style.opacity = isValid ? '1' : '0.5';
    }
}

// Add CSS animation for fade out
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
    }

    .episode-item.locked {
        opacity: 0.6;
        background: #2f3336;
    }

    .episode-item.locked:hover {
        background: rgba(29, 155, 240, 0.1);
    }

    .unlock-cost {
        color: #ffd700 !important;
        font-weight: 600 !important;
        font-size: 0.8rem !important;
    }
`;
document.head.appendChild(additionalStyles);
