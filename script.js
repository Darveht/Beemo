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
        'La Niña de los Cuatro CEO': 'https://www.dropbox.com/scl/fi/r24wdvq29de6w6djkaqsc/IMG_4044.png?rlkey=5e2lge2dv00n427p0i5jdqxgy&st=65b6ye7u&raw=1'
    };
    return thumbnails[title] || 'https://www.dropbox.com/scl/fi/r24wdvq29de6w6djkaqsc/IMG_4044.png?rlkey=5e2lge2dv00n427p0i5jdqxgy&st=65b6ye7u&raw=1';
}

function updateContinueWatchingSection() {
    const continueSection = document.querySelector('.continue-section');
    
    // Verificar si existe la sección antes de acceder a parentElement
    if (!continueSection) {
        return;
    }
    
    const continueCards = continueSection.parentElement;
    
    if (!continueCards || Object.keys(watchHistory).length === 0) {
        if (continueCards) {
            continueCards.style.display = 'none';
        }
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

// Sistema de Likes en Tiempo Real
let socket;
let likesCache = new Map();

// Sistema de notificaciones optimizado
let lastNotificationTime = 0;
let notificationQueue = [];

// Conectar a WebSocket para actualizaciones en tiempo real
function initializeLikesSystem() {
    try {
        console.log('🔄 Inicializando sistema de likes...');
        
        const socketOptions = {
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            timeout: 8000,
            forceNew: false,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 2000
        };
        
        const serverUrl = window.location.origin;
        console.log('🌐 Conectando a:', serverUrl);
        
        socket = io(serverUrl, socketOptions);
        
        socket.on('connect', () => {
            console.log('✅ Conectado al sistema de likes - ID:', socket.id);
            // Solo mostrar notificación en primera conexión
            if (!socket.recovered) {
                showThrottledNotification('Sistema de likes activado', 'success');
            }
        });
        
        socket.on('likeUpdate', (data) => {
            console.log('📡 Like actualizado:', data.contentId, data.likesCount);
            updateLikesDisplay(data.contentId, data.likesCount, data.likesFormatted);
            likesCache.set(data.contentId, data);
            
            // Feedback visual en lugar de notificación
            showLikeAnimation(data.contentId);
        });
        
        socket.on('disconnect', (reason) => {
            console.log('❌ Desconectado:', reason);
            // Solo mostrar si es desconexión inesperada
            if (reason === 'transport close' || reason === 'transport error') {
                showThrottledNotification('Reconectando...', 'info');
            }
        });
        
        socket.on('connect_error', (error) => {
            console.log('🔄 Error de conexión:', error.message);
            // Reducir notificaciones de error
        });
        
        socket.on('reconnect', (attemptNumber) => {
            console.log('✅ Reconectado (intento', attemptNumber, ')');
            showThrottledNotification('Reconectado', 'success');
        });
        
    } catch (error) {
        console.error('❌ Error inicializando WebSocket:', error);
        showThrottledNotification('Modo offline', 'warning');
    }
}

// Sistema de notificaciones con throttling
function showThrottledNotification(message, type = 'info') {
    const now = Date.now();
    if (now - lastNotificationTime > 3000) { // Máximo una notificación cada 3 segundos
        showNotification(message, type);
        lastNotificationTime = now;
    }
}

// Animación visual para likes en lugar de notificación
function showLikeAnimation(contentId) {
    const likeButtons = document.querySelectorAll(`[data-content-id="${contentId}"] .like-btn, .like-btn`);
    likeButtons.forEach(btn => {
        btn.style.transform = 'scale(1.2)';
        btn.style.color = '#ff4757';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.color = '';
        }, 200);
    });
}

// Obtener likes de un contenido
async function getLikes(contentId) {
    try {
        const response = await fetch(`/api/likes/${contentId}`);
        const data = await response.json();
        likesCache.set(contentId, data);
        return data;
    } catch (error) {
        console.error('Error al obtener likes:', error);
        return { contentId, likesCount: 0, likesFormatted: '0' };
    }
}

// Dar/quitar like optimizado
async function toggleLike(contentId, contentType = 'series') {
    try {
        console.log('👆 Like para:', contentId);
        
        const apiUrl = `${window.location.origin}/api/likes/${contentId}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ contentType }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Like procesado:', data.action, data.likesCount);
        
        // Actualizar cache inmediatamente
        likesCache.set(contentId, data);
        
        // Actualizar interfaz inmediatamente
        updateLikesDisplay(data.contentId, data.likesCount, data.likesFormatted);
        
        // Feedback mínimo sin spam de notificaciones
        const emoji = data.action === 'added' ? '❤️' : '💔';
        showThrottledNotification(`${emoji} ${data.likesFormatted}`, 'success');
        
        // Broadcast en tiempo real
        if (socket && socket.connected) {
            socket.emit('broadcastLike', {
                contentId: data.contentId,
                likesCount: data.likesCount,
                likesFormatted: data.likesFormatted,
                action: data.action
            });
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error en like:', error);
        showThrottledNotification('Error procesando like', 'error');
        return null;
    }
}

// Verificar si usuario ya dio like
async function checkUserLike(contentId) {
    try {
        const response = await fetch(`/api/likes/${contentId}/check`);
        const data = await response.json();
        return data.liked;
    } catch (error) {
        console.error('Error al verificar like:', error);
        return false;
    }
}

// Actualizar display de likes en la interfaz
function updateLikesDisplay(contentId, likesCount, likesFormatted) {
    // Actualizar en cards de contenido
    const contentCards = document.querySelectorAll(`[data-content-id="${contentId}"]`);
    contentCards.forEach(card => {
        const likesDisplay = card.querySelector('.likes-display');
        if (likesDisplay) {
            likesDisplay.textContent = likesFormatted;
        }
    });
    
    // Actualizar en reproductor activo
    const activePlayer = document.querySelector('.tiktok-player');
    if (activePlayer) {
        const likesCounter = activePlayer.querySelector('.likes-counter');
        if (likesCounter) {
            likesCounter.textContent = likesFormatted;
        }
    }
    
    // Actualizar en hero section si es el contenido principal
    if (contentId === 'la-nina-ceo') {
        const heroLikes = document.querySelector('.hero-likes');
        if (heroLikes) {
            heroLikes.textContent = `❤️ ${likesFormatted} likes`;
        }
    }
}

// Inicializar likes solo para el reproductor
async function initializeContentLikes() {
    // Esta función ahora solo se ejecuta dentro del reproductor
    // Las cards de la página principal no tendrán likes
    return;
}

// Generar ID de contenido desde título
function generateContentId(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// TikTok Style Video Player con navegación por episodios
function showTikTokPlayer(title, startEpisode = 1) {
    // Prevent scroll issues
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Buscar información de la serie
    const seriesData = getAllSeries().find(series => series.title === title);
    let currentEpisode = startEpisode;
    let watchInterval;
    let watchTime = 0;
    let animationTriggered = false;

    const player = document.createElement('div');
    player.className = 'tiktok-player';
    
    // Crear contenedor del reproductor
    player.innerHTML = `
        <div class="video-container-tiktok">
            <!-- Marca de agua Beemo estilo Netflix -->
            <div class="beemo-watermark">BEEMO</div>
            
            <button class="close-player">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>
            
            <!-- Video o placeholder que cambiará dinámicamente -->
            <div id="videoContent"></div>
            
            <div class="video-info-tiktok">
                <h3 class="video-title-tiktok">${title}</h3>
                <p class="video-description-tiktok" id="episodeDescription">Episodio ${currentEpisode} - "${getEpisodeTitle(title, currentEpisode)}"</p>
                <div class="video-progress-tiktok">
                    <div class="video-progress-fill" id="videoProgressBar"></div>
                </div>
            </div>
            
            <div class="video-controls-tiktok">
                <button class="tiktok-btn like-btn" id="likeBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span class="likes-counter" id="likesCounter">0</span>
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

    document.body.appendChild(player);
    setTimeout(() => player.classList.add('active'), 100);

    // Función para obtener URL del episodio
    function getEpisodeVideoUrl(episodeNumber) {
        // URLs específicas para cada episodio de "La Niña de los Cuatro CEO"
        const episodeUrls = {
            1: 'https://www.dropbox.com/scl/fi/su7cuwd60sz89hsonies4/copy_7675023E-5F80-4FA6-9FC0-E017CD157EE5.mov?rlkey=56om33xqkm4j4rngju9jqvp5o&st=cte47tl3&raw=1',
            2: 'https://www.dropbox.com/scl/fi/docmcwiuv2373hgfr660o/copy_8F810EF0-17AD-47D4-9B91-0B6B5899C202.mov?rlkey=me4ac8zdelnkr5x9qbsm8gd03&st=byqr7cc2&raw=1',
            3: 'https://www.dropbox.com/scl/fi/docmcwiuv2373hgfr660o/copy_8F810EF0-17AD-47D4-9B91-0B6B5899C202.mov?rlkey=me4ac8zdelnkr5x9qbsm8gd03&st=byqr7cc2&raw=1',
            4: 'https://www.dropbox.com/scl/fi/docmcwiuv2373hgfr660o/copy_8F810EF0-17AD-47D4-9B91-0B6B5899C202.mov?rlkey=me4ac8zdelnkr5x9qbsm8gd03&st=byqr7cc2&raw=1',
            5: 'https://www.dropbox.com/scl/fi/docmcwiuv2373hgfr660o/copy_8F810EF0-17AD-47D4-9B91-0B6B5899C202.mov?rlkey=me4ac8zdelnkr5x9qbsm8gd03&st=byqr7cc2&raw=1',
        };
        
        return episodeUrls[episodeNumber] || null;
    }

    // Función mejorada para manejar URLs de Streamable como fondo
    async function createStreamablePlayer(streamableUrl) {
        try {
            showNotification('Cargando video...', 'info');
            
            // Crear iframe de Streamable como fondo del reproductor
            const iframe = document.createElement('iframe');
            iframe.id = 'streamablePlayer';
            iframe.src = streamableUrl;
            iframe.style.cssText = `
                width: 100vw !important;
                height: 100vh !important;
                border: none !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                z-index: 1 !important;
                background: #000 !important;
                margin: 0 !important;
                padding: 0 !important;
                object-fit: cover !important;
            `;
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('webkitallowfullscreen', '');
            iframe.setAttribute('mozallowfullscreen', '');
            iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
            iframe.setAttribute('loading', 'eager');
            
            // Insertar el iframe en el contenedor del video
            const videoContent = document.getElementById('videoContent');
            if (videoContent) {
                videoContent.innerHTML = '';
                videoContent.appendChild(iframe);
            }
            
            // Manejar carga del iframe
            iframe.onload = () => {
                showNotification('Video cargado correctamente', 'success');
            };
            
            // Manejar error de carga
            iframe.onerror = () => {
                showNotification('Error cargando video, usando modo simulado', 'warning');
                loadSimulatedEpisode(currentEpisode);
            };
            
            // Timeout de seguridad
            setTimeout(() => {
                showNotification('Video listo para reproducir', 'info');
            }, 3000);
            
            // Retornar contenedor
            const container = document.createElement('div');
            container.appendChild(iframe);
            
            return container;
        } catch (error) {
            console.log('Error creando reproductor:', error);
            showNotification('Error de carga, usando modo simulado', 'error');
            return null;
        }
    }

    // Función para cargar episodio
    async function loadEpisode(episodeNumber) {
        const videoContent = document.getElementById('videoContent');
        const episodeDescription = document.getElementById('episodeDescription');
        const progressBar = document.getElementById('videoProgressBar');
        
        if (!videoContent || !episodeDescription || !progressBar) {
            console.error('Elementos del reproductor no encontrados');
            return;
        }
        
        // Actualizar información del episodio
        episodeDescription.textContent = `Episodio ${episodeNumber} - "${getEpisodeTitle(title, episodeNumber)}"`;
        progressBar.style.width = '0%';
        
        // Reset watch time and animation
        watchTime = 0;
        animationTriggered = false;
        
        // Cargar video
        const videoUrl = getEpisodeVideoUrl(episodeNumber);
        
        if (videoUrl) {
            try {
                // Crear elemento de video HTML5 nativo
                videoContent.innerHTML = `
                    <video 
                        id="mainVideo" 
                        width="100%" 
                        height="100%" 
                        autoplay 
                        muted
                        playsinline
                        webkit-playsinline
                        preload="metadata"
                        style="width: 100vw; height: 100vh; object-fit: cover; position: fixed; top: 0; left: 0; z-index: 1; background: #000;"
                        controls="false"
                    >
                        <source src="${videoUrl}" type="video/mp4">
                        Tu navegador no soporta el elemento de video.
                    </video>
                    <div class="play-control-overlay" id="playControlOverlay" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; text-align: center; color: white;">
                        <button class="video-play-btn" id="videoPlayBtn" style="background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 80px; height: 80px; font-size: 2rem; color: white; cursor: pointer;">
                            ▶
                        </button>
                        <p style="margin-top: 1rem; font-size: 1.1rem;">Toca para reproducir</p>
                    </div>
                `;
                
                // Configurar reproductor de video
                setupVideoPlayer();
                showNotification(`Episodio ${episodeNumber} cargado`, 'success');
                
            } catch (error) {
                console.log('Error cargando video:', error);
                showNotification('Error de carga, usando modo simulado', 'warning');
                loadSimulatedEpisode(episodeNumber);
            }
        } else {
            loadSimulatedEpisode(episodeNumber);
        }
    }

    // Función separada para episodios simulados
    function loadSimulatedEpisode(episodeNumber) {
        const videoContent = document.getElementById('videoContent');
        videoContent.innerHTML = `
            <div class="video-placeholder-tiktok" style="width: 100%; height: 100%; background: linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%); display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: white;">
                    <h2>Episodio ${episodeNumber}</h2>
                    <p>Reproduciendo en modo simulado</p>
                    <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 1rem;">La URL del video será cargada cuando esté disponible</p>
                </div>
            </div>
        `;
        
        setupSimulatedPlayer();
    }

    // Función para configurar reproductor Streamtape
    function setupStreamtapePlayer(iframe, episodeNumber) {
        const progressBar = document.getElementById('videoProgressBar');
        
        // Simular progreso automático (ya que no podemos acceder al iframe de Streamtape)
        let currentTime = 0;
        const duration = 60; // 1 minuto por episodio
        
        const progressInterval = setInterval(() => {
            currentTime += 1;
            const progress = (currentTime / duration) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            
            // Actualizar historial cada 5 segundos
            if (currentTime % 5 === 0) {
                addToWatchHistory(title, episodeNumber, progress);
            }
            
            // Mostrar animación 3 segundos antes del final
            if (currentTime >= duration - 3 && !animationTriggered) {
                animationTriggered = true;
                
                setTimeout(() => {
                    clearInterval(progressInterval);
                    showChapterEndAnimation(() => {
                        transitionToNextEpisode();
                    });
                }, 3000);
            }
        }, 1000);
        
        // Guardar interval para limpieza
        iframe.progressInterval = progressInterval;
        
        // Cleanup cuando se cierre
        iframe.addEventListener('remove', () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        });
    }

    // Función para configurar reproductor en pantalla completa sin anuncios
    function setupFullscreenVideoPlayer() {
        const video = document.getElementById('mainVideo');
        const progressBar = document.getElementById('videoProgressBar');
        const playControl = document.getElementById('playControlOverlay');
        const playBtn = document.getElementById('videoPlayBtn');

        if (!video) return;

        // Detectar si es móvil para optimizar reproducción
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Configurar video para pantalla completa
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.objectFit = 'cover';
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.zIndex = '1';

        // Bloquear anuncios y pop-ups
        video.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        // Bloquear controles nativos
        video.controls = false;
        video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplaybook');
        video.setAttribute('disablePictureInPicture', '');

        // Configurar reproducción según dispositivo
        if (isIOS || isMobile) {
            video.muted = false;
            video.autoplay = true;
            video.playsInline = true;
        } else {
            video.muted = false;
            video.autoplay = true;
        }

        // Función para iniciar reproducción
        const startPlayback = async () => {
            try {
                video.currentTime = 0;
                video.volume = 1.0;
                video.muted = false;
                
                await video.play();
                showNotification('Reproduciendo en pantalla completa', 'success');
                
                // Ocultar cursor después de 3 segundos
                setTimeout(() => {
                    video.style.cursor = 'none';
                }, 3000);
                
            } catch (error) {
                console.log('Intentando reproducción alternativa:', error);
                try {
                    video.muted = true;
                    await video.play();
                    setTimeout(() => {
                        video.muted = false;
                    }, 1000);
                } catch (fallbackError) {
                    console.log('Error en fallback:', fallbackError);
                    showNotification('Error de reproducción, usando modo simulado', 'warning');
                    setupSimulatedPlayer();
                }
            }
        };

        // Listeners para reproducción
        video.addEventListener('loadedmetadata', () => {
            startPlayback();
        });

        video.addEventListener('canplay', () => {
            if (video.paused) {
                startPlayback();
            }
        });

        // Actualizar barra de progreso
        video.addEventListener('timeupdate', () => {
            if (video.duration > 0) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Actualizar historial de visualización cada 5 segundos
                if (Math.floor(video.currentTime) % 5 === 0) {
                    addToWatchHistory(title, currentEpisode, progress);
                }
                
                // Activar animación 3 segundos antes del final
                const timeLeft = video.duration - video.currentTime;
                if (timeLeft <= 3 && timeLeft > 2 && !animationTriggered) {
                    animationTriggered = true;
                    
                    showChapterEndAnimation(() => {
                        transitionToNextEpisode();
                    });
                }
            }
        });
        
        // Evento cuando termina el video
        video.addEventListener('ended', () => {
            if (!animationTriggered) {
                showChapterEndAnimation(() => {
                    transitionToNextEpisode();
                });
            }
        });

        // Bloquear interacciones no deseadas
        video.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // Prevenir redirecciones y pop-ups
        video.addEventListener('error', (e) => {
            console.log('Error de video, intentando alternativa');
            setupSimulatedPlayer();
        });

        // Bloquear anuncios en pantalla
        const blockAds = () => {
            const adSelectors = [
                'iframe[src*="ads"]',
                'div[class*="ad"]',
                'div[id*="ad"]',
                '.advertisement',
                '.popup',
                '.overlay'
            ];
            
            adSelectors.forEach(selector => {
                const ads = document.querySelectorAll(selector);
                ads.forEach(ad => {
                    if (ad && ad.parentNode) {
                        ad.style.display = 'none';
                        ad.remove();
                    }
                });
            });
        };

        // Ejecutar bloqueo de anuncios cada segundo
        const adBlockInterval = setInterval(blockAds, 1000);

        // Limpiar interval cuando se cierre el reproductor
        const playerElement = video.closest('.tiktok-player');
        if (playerElement) {
            playerElement.addEventListener('remove', () => {
                clearInterval(adBlockInterval);
            });
        }
    }

    // Variables para el sistema de anuncios
    let adScheduled = false;
    let adShownAt = [];
    
    // Función para configurar reproductor de video real
    function setupVideoPlayer() {
        const video = document.getElementById('mainVideo');
        const progressBar = document.getElementById('videoProgressBar');
        const playControl = document.getElementById('playControlOverlay');
        const playBtn = document.getElementById('videoPlayBtn');

        if (!video) {
            console.error('Video element not found');
            return;
        }

        // Detectar si es iOS o dispositivo móvil
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Configurar video según dispositivo con optimización de carga
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = 'auto'; // Precargar todo el video
        video.buffered = true;
        
        // Optimización adicional para carga rápida
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x-webkit-airplay', 'allow');
        
        // Mostrar overlay de play al inicio
        if (playControl) {
            playControl.style.display = 'flex';
            playControl.style.background = 'rgba(0, 0, 0, 0.8)';
            playControl.style.zIndex = '1000';
        }

        // Configurar sistema de gestos zoom (pinch)
        setupZoomGestures(video);
        
        // Configurar sistema de anuncios interrumpidos
        setupAdSystem(video);

        // Función para iniciar reproducción con sonido optimizada
        const startPlayback = async () => {
            try {
                video.currentTime = 0;
                video.muted = false;
                video.volume = 1.0;
                
                // Precargar datos para reproducción más rápida
                if (video.readyState < 2) {
                    await new Promise(resolve => {
                        video.addEventListener('canplay', resolve, { once: true });
                    });
                }
                
                await video.play();
                
                if (playControl) {
                    playControl.style.display = 'none';
                }
                
                showNotification('Reproduciendo episodio', 'success');
                
            } catch (error) {
                console.log('Error al reproducir video:', error);
                // Fallback: mantener muted
                try {
                    video.muted = true;
                    await video.play();
                    if (playControl) {
                        playControl.style.display = 'none';
                    }
                    showNotification('Toca para activar sonido', 'info');
                    
                    // Permitir activar sonido después
                    video.addEventListener('click', () => {
                        video.muted = false;
                        video.volume = 1.0;
                    });
                } catch (fallbackError) {
                    console.log('Error en fallback:', fallbackError);
                    showNotification('Error de reproducción', 'error');
                    setupSimulatedPlayer();
                }
            }
        };

        // Event listeners para reproducción
        if (playBtn) {
            playBtn.addEventListener('click', startPlayback);
        }
        
        if (playControl) {
            playControl.addEventListener('click', startPlayback);
        }

        // Reproducción automática optimizada más rápida
        setTimeout(() => {
            video.play().then(() => {
                if (playControl) {
                    playControl.style.display = 'none';
                }
            }).catch(() => {
                console.log('Autoplay falló, mostrando controles');
                if (playControl) {
                    playControl.style.display = 'flex';
                }
            });
        }, 300); // Reducido de 1000ms a 300ms

        // Actualizar barra de progreso visible y sistema de anuncios
        video.addEventListener('timeupdate', () => {
            if (video.duration > 0 && progressBar) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Actualizar historial de visualización
                if (Math.floor(video.currentTime) % 5 === 0) {
                    addToWatchHistory(title, currentEpisode, progress);
                }
                
                // Sistema de anuncios interrumpidos cada 30 segundos (solo si no tiene premium)
                const currentTime = Math.floor(video.currentTime);
                if (currentTime > 0 && currentTime % 30 === 0 && !adShownAt.includes(currentTime) && !hasActivePremium() && !window.adsDisabled) {
                    adShownAt.push(currentTime);
                    showAdInterruption(video, currentTime);
                }
                
                // Activar animación 2 segundos antes del final
                const timeLeft = video.duration - video.currentTime;
                if (timeLeft <= 2 && timeLeft > 1.8 && !animationTriggered) {
                    animationTriggered = true;
                    console.log('Activando animación de final');
                    showChapterEndAnimation(() => {
                        transitionToNextEpisode();
                    });
                }
            }
        });
        
        // Evento cuando termina el video
        video.addEventListener('ended', () => {
            if (!animationTriggered) {
                console.log('Video terminó, activando animación');
                showChapterEndAnimation(() => {
                    transitionToNextEpisode();
                });
            }
        });

        // Eventos de carga optimizados
        video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        video.addEventListener('loadeddata', () => {
            console.log('Video data loaded');
        });
        
        video.addEventListener('canplay', () => {
            console.log('Video can play');
        });
        
        video.addEventListener('canplaythrough', () => {
            console.log('Video can play through');
            // Auto-iniciar si no está ya reproduciéndose
            if (video.paused && !playControl.style.display !== 'none') {
                startPlayback();
            }
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            showNotification('Error cargando video, usando modo simulado', 'warning');
            setupSimulatedPlayer();
        });

        // Bloquear menú contextual
        video.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
    
    // Función de gestos eliminada - herramientas siempre visibles
    function setupZoomGestures(video) {
        // Esta función ahora está vacía - las herramientas permanecen siempre visibles
        console.log('Gestos de zoom desactivados - herramientas siempre visibles');
    }
    
    // Sistema de anuncios interrumpidos
    function setupAdSystem(video) {
        // Reset array de anuncios mostrados para nuevo episodio
        adShownAt = [];
    }
    
    // Mostrar anuncio interrumpido
    function showAdInterruption(video, timePosition) {
        // Pausar video actual y guardar posición
        const currentTime = video.currentTime;
        video.pause();
        
        // Ocultar completamente el video del episodio
        const videoContainer = document.querySelector('.video-container-tiktok');
        const videoContent = document.getElementById('videoContent');
        
        if (videoContainer) {
            videoContainer.style.opacity = '0';
            videoContainer.style.visibility = 'hidden';
            videoContainer.style.zIndex = '-1';
        }
        
        if (videoContent) {
            videoContent.style.display = 'none';
        }
        
        // Mostrar indicador AD prominente
        showAdIndicator();
        showNotification('Anuncio en 2 segundos...', 'warning');
        
        // Dar tiempo para que el usuario vea que se pausó
        setTimeout(() => {
            showInterruptedAd(() => {
                // Callback cuando termina el anuncio
                hideAdIndicator();
                
                // Restaurar visibilidad del video del episodio
                if (videoContainer) {
                    videoContainer.style.opacity = '1';
                    videoContainer.style.visibility = 'visible';
                    videoContainer.style.zIndex = '1';
                }
                
                if (videoContent) {
                    videoContent.style.display = 'block';
                }
                
                // Reanudar video desde donde estaba exactamente
                video.currentTime = currentTime;
                
                // Asegurar que el video se reanude
                const resumePromise = video.play();
                if (resumePromise !== undefined) {
                    resumePromise.then(() => {
                        showNotification('Episodio reanudado', 'success');
                    }).catch((error) => {
                        console.log('Error reanudando video:', error);
                        // Intentar reanudar de nuevo
                        setTimeout(() => {
                            video.play();
                        }, 500);
                    });
                }
            });
        }, 2000);
    }
    
    // Mostrar indicador "AD"
    function showAdIndicator() {
        // Remover indicador anterior si existe
        const existingIndicator = document.getElementById('adIndicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        const indicator = document.createElement('div');
        indicator.id = 'adIndicator';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: transparent;
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 2rem;
            z-index: 100000;
            animation: adPulse 1s infinite;
            box-shadow: 0 8px 30px rgba(255, 0, 0, 0.6);
            border: 3px solid #ff0000;
            text-align: center;
            backdrop-filter: blur(10px);
        `;
        indicator.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📺</div>
            <div style="font-size: 2rem; font-weight: 800; color: #ff0000;">ANUNCIO</div>
            <div style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.9;">Video pausado</div>
        `;
        document.body.appendChild(indicator);
    }
    
    // Ocultar indicador "AD"
    function hideAdIndicator() {
        const indicator = document.getElementById('adIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Mostrar anuncio interrumpido usando el sistema existente
    function showInterruptedAd(callback) {
        // Usar el modal de anuncio existente pero con callback personalizado
        const modal = document.getElementById('adModal');
        const timer = document.getElementById('adTimer');
        const closeBtn = document.getElementById('adClose');
        const progress = document.getElementById('adProgress');

        // Ocultar completamente el reproductor principal
        const tikTokPlayer = document.querySelector('.tiktok-player');
        if (tikTokPlayer) {
            tikTokPlayer.style.zIndex = '1';
        }
        
        // Asegurar que el modal esté por encima de todo
        modal.style.zIndex = '999999';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        modal.classList.add('active');
        closeBtn.style.display = 'none';

        // Configurar contenido del anuncio con reproducción forzada
        const adContent = modal.querySelector('.ad-content');
        adContent.innerHTML = `
            <div class="netflix-ad-container-fullscreen">
                <video 
                    id="interruptedAdVideo" 
                    width="100%" 
                    height="100%" 
                    autoplay 
                    muted="false"
                    playsinline
                    webkit-playsinline
                    controls="false"
                    preload="auto"
                    style="object-fit: cover; background: #000; z-index: 1;"
                >
                    <source src="https://www.dropbox.com/scl/fi/oa2blfwyvg84csw5w13ky/copy_0B8A47E6-5756-4AA7-A69F-FF4E6C6A3194.mov?rlkey=pxs3j8ujtrnyhpf9u7qn6iyl1&st=uy6kb9o7&raw=1" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
                <div class="ad-skip-indicator">
                    <div class="ad-timer-display" id="interruptedAdTimer">15</div>
                </div>
                <div class="ad-play-overlay" id="adPlayOverlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10; cursor: pointer;">
                    <div style="text-align: center; color: white;">
                        <div style="width: 80px; height: 80px; background: #e50914; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; cursor: pointer;">▶</div>
                        <p style="font-size: 1.2rem; font-weight: 600;">Toca para ver anuncio</p>
                        <p style="font-size: 1rem; opacity: 0.8;">El episodio continuará después</p>
                    </div>
                </div>
            </div>
        `;

        const adVideo = document.getElementById('interruptedAdVideo');
        const timerDisplay = document.getElementById('interruptedAdTimer');
        const playOverlay = document.getElementById('adPlayOverlay');
        
        // Función para iniciar reproducción del anuncio
        const startAdPlayback = async () => {
            try {
                // Configurar video para reproducción
                adVideo.currentTime = 0;
                adVideo.muted = false;
                adVideo.volume = 1.0;
                
                // Intentar reproducir
                await adVideo.play();
                
                // Ocultar overlay de play
                playOverlay.style.display = 'none';
                
                showNotification('Reproduciendo anuncio...', 'info');
                
            } catch (error) {
                console.log('Error reproduciendo anuncio, intentando con muted:', error);
                try {
                    // Fallback: reproducir con muted
                    adVideo.muted = true;
                    await adVideo.play();
                    playOverlay.style.display = 'none';
                    
                    // Activar sonido después de un segundo
                    setTimeout(() => {
                        adVideo.muted = false;
                    }, 1000);
                    
                } catch (fallbackError) {
                    console.log('Error en fallback, usando modo simulado:', fallbackError);
                    playOverlay.innerHTML = `
                        <div style="text-align: center; color: white;">
                            <h2 style="font-size: 2rem; margin-bottom: 1rem;">🎬 Anuncio Netflix</h2>
                            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Anuncio en reproducción...</p>
                            <div style="width: 60px; height: 60px; border: 4px solid #e50914; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                        </div>
                    `;
                }
            }
        };

        // Event listeners para iniciar reproducción
        playOverlay.addEventListener('click', startAdPlayback);
        adVideo.addEventListener('click', startAdPlayback);

        // Intentar reproducción automática
        setTimeout(() => {
            adVideo.play().then(() => {
                playOverlay.style.display = 'none';
            }).catch(() => {
                // Si falla autoplay, mostrar overlay de play
                playOverlay.style.display = 'flex';
            });
        }, 500);

        let timeLeft = 15; // Anuncio de 15 segundos
        const interval = setInterval(() => {
            timeLeft--;
            timer.textContent = timeLeft;
            if (timerDisplay) {
                timerDisplay.textContent = timeLeft;
            }
            progress.style.width = `${((15 - timeLeft) / 15) * 100}%`;

            if (timeLeft <= 0) {
                clearInterval(interval);
                closeBtn.style.display = 'flex';
                
                // Auto-cerrar después de 1 segundo
                setTimeout(() => {
                    modal.classList.remove('active');
                    timer.textContent = '30';
                    progress.style.width = '0%';
                    
                    // Restaurar z-index del reproductor principal
                    const tikTokPlayer = document.querySelector('.tiktok-player');
                    if (tikTokPlayer) {
                        tikTokPlayer.style.zIndex = '999999';
                    }
                    
                    // Restaurar scroll del body
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                    document.body.style.height = '';
                    
                    // Ejecutar callback para continuar video
                    if (callback) callback();
                }, 1000);
            }
        }, 1000);
        
        // Manejar cierre manual
        closeBtn.onclick = () => {
            clearInterval(interval);
            modal.classList.remove('active');
            timer.textContent = '30';
            progress.style.width = '0%';
            
            // Restaurar z-index del reproductor principal
            const tikTokPlayer = document.querySelector('.tiktok-player');
            if (tikTokPlayer) {
                tikTokPlayer.style.zIndex = '999999';
            }
            
            // Restaurar scroll del body
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            
            // Ejecutar callback
            if (callback) callback();
        };

        // Evento cuando termina el video del anuncio
        adVideo.addEventListener('ended', () => {
            if (timeLeft > 0) {
                // Si el video termina antes del timer, acelerar el timer
                timeLeft = 1;
            }
        });
    }

    // Función para configurar reproductor simulado
    function setupSimulatedPlayer() {
        const progressBar = document.getElementById('videoProgressBar');
        
        // Limpiar interval anterior si existe
        if (watchInterval) {
            clearInterval(watchInterval);
        }
        
        // Simular progreso del video
        watchInterval = setInterval(() => {
            watchTime += 1;
            const progress = Math.min((watchTime / 60) * 100, 100); // 60 seconds = 100%
            progressBar.style.width = `${progress}%`;
            
            // Update watch history every 5 seconds
            if (watchTime % 5 === 0) {
                addToWatchHistory(title, currentEpisode, progress);
            }
            
            // Activar animación 2 segundos antes del final
            if (watchTime >= 58 && !animationTriggered) {
                animationTriggered = true;
                console.log('Activando animación simulada');
                showChapterEndAnimation(() => {
                    transitionToNextEpisode();
                });
            }
            
            // Auto advance to next episode after 60 seconds
            if (watchTime >= 60) {
                if (!animationTriggered) {
                    showChapterEndAnimation(() => {
                        transitionToNextEpisode();
                    });
                }
            }
        }, 1000);
    }

    // Función para transición al siguiente episodio
    function transitionToNextEpisode() {
        const nextEpisode = currentEpisode + 1;
        
        if (nextEpisode <= 45) { // Máximo 45 episodios
            if (nextEpisode <= 8 || unlockedEpisodes.includes(nextEpisode)) {
                // Episodio disponible
                currentEpisode = nextEpisode;
                loadEpisode(currentEpisode);
                showNotification(`Reproduciendo Episodio ${currentEpisode}`, 'success');
            } else if (userCoins >= 30) {
                // Auto-desbloquear con monedas
                if (unlockEpisode(nextEpisode)) {
                    currentEpisode = nextEpisode;
                    loadEpisode(currentEpisode);
                    showNotification(`Episodio ${currentEpisode} desbloqueado automáticamente`, 'success');
                }
            } else {
                // Mostrar modal de suscripción
                showSubscriptionModal(nextEpisode, title, player);
            }
        } else {
            showNotification('Has llegado al final de la serie', 'info');
        }
    }

    // Función de navegación eliminada - control automático por video

    // Cargar episodio inicial
    loadEpisode(currentEpisode);

    // Navegación eliminada - solo se puede avanzar automáticamente al terminar episodio

    // Navegación con gestos de swipe (opcional para el futuro)
    let startY = 0;
    let endY = 0;
    
    player.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    
    player.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        
        // Swipe hacia arriba = siguiente episodio
        if (deltaY > 50) {
            transitionToNextEpisode();
        }
        // Swipe hacia abajo = episodio anterior
        else if (deltaY < -50 && currentEpisode > 1) {
            currentEpisode--;
            loadEpisode(currentEpisode);
            showNotification(`Episodio ${currentEpisode}`, 'info');
        }
    });

    // Event listeners para botones de control
    const closeBtn = player.querySelector('.close-player');
    const likeBtn = player.querySelector('#likeBtn');
    const playPauseBtn = player.querySelector('#playPauseBtn');
    const muteBtn = player.querySelector('#muteBtn');
    const episodesBtn = player.querySelector('#episodesBtn');
    
    // Agregar botón de reporte al reproductor activo inmediatamente
    addReportButtonToActivePlayer();

    closeBtn.addEventListener('click', () => {
        // Limpiar todos los intervals y recursos
        if (watchInterval) clearInterval(watchInterval);
        
        // Limpiar iframe y sus intervals
        const iframe = document.getElementById('streamtapePlayer');
        if (iframe && iframe.progressInterval) {
            clearInterval(iframe.progressInterval);
        }
        
        // Restaurar estilos del body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Cerrar reproductor
        player.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(player)) {
                document.body.removeChild(player);
            }
        }, 300);
        
        showNotification('Reproductor cerrado', 'info');
    });

    // Configurar sistema de likes para este reproductor
    const contentId = generateContentId(title) + (startEpisode > 1 ? `-ep${startEpisode}` : '');
    const likesCounter = document.getElementById('likesCounter');
    
    // Unirse a la sala de WebSocket para este contenido
    if (socket) {
        socket.emit('joinContent', contentId);
    }
    
    // Cargar likes actuales
    getLikes(contentId).then(data => {
        likesCounter.textContent = data.likesFormatted;
        updateLikesDisplay(contentId, data.likesCount, data.likesFormatted);
    });
    
    // Verificar si usuario ya dio like
    checkUserLike(contentId).then(liked => {
        if (liked) {
            likeBtn.classList.add('liked');
        }
    });

    likeBtn.addEventListener('click', async () => {
        const wasLiked = likeBtn.classList.contains('liked');
        
        // Optimistic UI update
        likeBtn.classList.toggle('liked');
        const currentCount = parseInt(likesCounter.textContent.replace(/[KMB]/g, '')) || 0;
        const newCount = wasLiked ? currentCount - 1 : currentCount + 1;
        likesCounter.textContent = formatLikesCount(newCount);
        
        // Procesar like en servidor
        const result = await toggleLike(contentId, startEpisode > 1 ? 'episode' : 'series');
        
        if (result) {
            // Actualizar con datos reales del servidor
            likesCounter.textContent = result.likesFormatted;
            if (result.action === 'added') {
                likeBtn.classList.add('liked');
            } else {
                likeBtn.classList.remove('liked');
            }
        } else {
            // Revertir cambio optimistic si hubo error
            likeBtn.classList.toggle('liked');
            likesCounter.textContent = formatLikesCount(currentCount);
        }
    });
    
    // Función local para formatear números
    function formatLikesCount(count) {
        if (count >= 1000000000) {
            return (count / 1000000000).toFixed(1) + 'B';
        } else if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    let isPlaying = true;
    playPauseBtn.addEventListener('click', () => {
        const video = document.getElementById('mainVideo');
        const playPauseIcon = document.getElementById('playPauseIcon');
        
        if (video) {
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
            // Para reproductor simulado
            isPlaying = !isPlaying;
            if (isPlaying) {
                setupSimulatedPlayer();
                playPauseIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            } else {
                if (watchInterval) clearInterval(watchInterval);
                playPauseIcon.setAttribute('d', 'M8 5v14l11-7z');
            }
        }
    });

    let isMuted = false;
    muteBtn.addEventListener('click', () => {
        const video = document.getElementById('mainVideo');
        const muteIcon = document.getElementById('muteIcon');
        
        if (video) {
            isMuted = !video.muted;
            video.muted = isMuted;
            
            muteIcon.setAttribute('d', isMuted ? 
                'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' :
                'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
            );
        } else {
            isMuted = !isMuted;
            muteIcon.setAttribute('d', isMuted ?
                'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' :
                'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
            );
        }
    });

    episodesBtn.addEventListener('click', () => {
        showEpisodesModal(title, currentEpisode);
    });
}

function showEpisodesModal(seriesTitle, currentEpisodeNum = 1) {
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
            ${generateEpisodesList(currentEpisodeNum)}
        </div>
    `;

    // Agregar el modal dentro del reproductor activo en lugar del body
    const activePlayer = document.querySelector('.tiktok-player');
    if (activePlayer) {
        activePlayer.appendChild(modal);
    } else {
        document.body.appendChild(modal);
    }
    setTimeout(() => modal.classList.add('active'), 100);

    const closeBtn = modal.querySelector('.episodes-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            const parent = modal.parentElement;
            if (parent && parent.contains(modal)) {
                parent.removeChild(modal);
            }
        }, 300);
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
                setTimeout(() => {
                    const parent = modal.parentElement;
                    if (parent && parent.contains(modal)) {
                        parent.removeChild(modal);
                    }
                }, 300);
                
                // Cerrar reproductor actual y abrir nuevo episodio
                const currentPlayer = document.querySelector('.tiktok-player');
                if (currentPlayer) {
                    currentPlayer.classList.remove('active');
                    setTimeout(() => {
                        if (document.body.contains(currentPlayer)) {
                            document.body.removeChild(currentPlayer);
                        }
                        showTikTokPlayer(seriesTitle, episodeNum);
                    }, 300);
                }
            }
        });
    });
}

function generateEpisodesList(currentEpisode = 1) {
    let episodes = '';
    for (let i = 1; i <= 45; i++) {
        const isLocked = i > 8 && !unlockedEpisodes.includes(i);
        const canUnlock = isLocked && userCoins >= 30;
        const isCurrent = i === currentEpisode;
        const lockIcon = isLocked ? `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="lock-icon">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
            </svg>
        ` : '';

        episodes += `
            <div class="episode-item ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''} ${canUnlock ? 'can-unlock' : ''}" data-episode="${i}">
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
            thumbnail: 'https://www.dropbox.com/scl/fi/r24wdvq29de6w6djkaqsc/IMG_4044.png?rlkey=5e2lge2dv00n427p0i5jdqxgy&st=65b6ye7u&raw=1',
            description: 'Una joven prodigio se convierte en la protegida de cuatro poderosos CEOs, navegando el mundo empresarial mientras descubre el amor.',
            hasMultipleEpisodes: true
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

// Sistema de Membresías
let currentSubscription = localStorage.getItem('currentSubscription') || 'free';
let subscriptionExpiry = localStorage.getItem('subscriptionExpiry') || null;
let isTrialActive = localStorage.getItem('isTrialActive') === 'true';
let trialStartDate = localStorage.getItem('trialStartDate');

// Variables de autenticación biométrica
let biometricAuthAvailable = false;
let deviceFingerprint = null;

// Show payment modal
function showPaymentModal(amount, coins, plan = null) {
    currentPurchaseAmount = amount;
    currentPurchaseCoins = coins;
    
    // Si es un plan, guardarlo
    if (plan) {
        localStorage.setItem('pendingSubscription', JSON.stringify({
            plan, amount, period: getPlanPeriod(plan)
        }));
    }

    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');

    // Reset form
    const cardForm = document.getElementById('cardForm');
    cardForm.style.display = 'none';

    // Reset payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.style.background = '#16181c';
    });
    
    // Actualizar información en el modal de pago
    updatePaymentModalInfo(plan, amount, coins);
}

function getPlanPeriod(plan) {
    const periods = {
        'daily': 2,
        'weekly': 7,
        'monthly': 30
    };
    return periods[plan] || 30;
}

function updatePaymentModalInfo(plan, amount, coins) {
    // Aquí podrías actualizar el modal de pago para mostrar información específica
    // sobre lo que se está comprando (suscripción vs monedas)
}

function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
}

// Apple Pay implementation with Face ID/Touch ID
function processApplePay() {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        const pendingSubscription = JSON.parse(localStorage.getItem('pendingSubscription') || '{}');
        const isSubscription = !!pendingSubscription.plan;
        
        const request = {
            countryCode: 'US',
            currencyCode: 'USD',
            supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
            merchantCapabilities: ['supports3DS'],
            total: {
                label: isSubscription ? `Suscripción ${pendingSubscription.plan} - Beemo` : `${currentPurchaseCoins} Monedas Beemo`,
                amount: (currentPurchaseAmount / 100).toFixed(2)
            },
            // Requerir autenticación biométrica
            requiredBillingContactFields: ['postalAddress'],
            requiredShippingContactFields: []
        };

        const session = new ApplePaySession(4, request); // Versión 4 para mejor soporte

        session.onvalidatemerchant = async (event) => {
            try {
                showNotification('🔐 Verificando con Apple Pay...', 'info');
                
                // Simular validación del merchant
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // En una implementación real, harías la validación con tu servidor
                session.completeMerchantValidation({
                    merchantSession: {
                        // Datos del merchant session del servidor
                    }
                });
                
            } catch (error) {
                showNotification('Error en la validación del merchant', 'error');
                session.abort();
            }
        };

        session.onpaymentmethodselected = (event) => {
            // Actualizar total si es necesario
            session.completePaymentMethodSelection(request.total, []);
        };

        session.onpaymentauthorized = async (event) => {
            const payment = event.payment;
            
            try {
                showNotification('👤 Procesando pago con Face ID/Touch ID...', 'info');
                
                // Simular verificación biométrica y procesamiento
                await simulateBiometricPayment(payment);
                
                // Éxito del pago
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                
                if (isSubscription) {
                    activateSubscription(pendingSubscription.plan, pendingSubscription.period);
                    localStorage.removeItem('pendingSubscription');
                    showNotification(`✅ Suscripción ${pendingSubscription.plan} activada con Apple Pay`, 'success');
                } else {
                    addCoins(currentPurchaseCoins);
                    showNotification(`✅ ${currentPurchaseCoins} monedas agregadas con Apple Pay`, 'success');
                }
                
                hidePaymentModal();
                logApplePaySuccess(payment);
                
            } catch (error) {
                console.error('Apple Pay error:', error);
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                showNotification('❌ Error procesando pago con Apple Pay', 'error');
            }
        };

        session.oncancel = () => {
            showNotification('Pago cancelado por el usuario', 'info');
        };

        try {
            session.begin();
            showNotification('👆 Usa Face ID o Touch ID para confirmar', 'info');
        } catch (error) {
            showNotification('Error iniciando Apple Pay', 'error');
        }
    } else {
        showNotification('Apple Pay no está disponible en este dispositivo', 'warning');
    }
}

async function simulateBiometricPayment(paymentData) {
    // Simular proceso de autenticación biométrica
    showNotification('🔍 Verificando identidad biométrica...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular procesamiento con el banco
    showNotification('🏦 Procesando con el banco...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar datos del pago
    if (!paymentData || !paymentData.token) {
        throw new Error('Datos de pago inválidos');
    }
    
    // Simular validación 3D Secure
    showNotification('🔒 Validación de seguridad 3D...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, transactionId: generateTransactionId() };
}

function logApplePaySuccess(paymentData) {
    const timestamp = new Date().toISOString();
    const paymentId = 'apple_' + Math.random().toString(36).substring(2, 15);
    
    console.log('Apple Pay successful:', {
        id: paymentId,
        timestamp,
        amount: currentPurchaseAmount,
        coins: currentPurchaseCoins,
        paymentMethod: 'apple_pay',
        device: deviceFingerprint,
        biometric: true
    });
}

function generateTransactionId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Credit card processing with Stripe mejorado
async function processCreditCard() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvc = document.getElementById('cardCvc').value;
    const cardName = document.getElementById('cardName').value;

    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }

    // Validar formato de tarjeta
    if (!validateCardNumber(cardNumber.replace(/\s/g, ''))) {
        showNotification('Número de tarjeta inválido', 'error');
        return;
    }

    if (!validateExpiry(cardExpiry)) {
        showNotification('Fecha de vencimiento inválida', 'error');
        return;
    }

    try {
        showNotification('Procesando pago seguro...', 'info');
        const processBtn = document.getElementById('processPaymentBtn');
        processBtn.disabled = true;
        processBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="loading-spinner"></div>
                Procesando pago seguro...
            </div>
        `;

        // Simular proceso de pago real con validación
        await simulateSecurePayment(cardNumber, cardExpiry, cardCvc, cardName);
        
        // Determinar si es compra de monedas o suscripción
        const pendingSubscription = JSON.parse(localStorage.getItem('pendingSubscription') || '{}');
        
        if (pendingSubscription.plan) {
            // Es una suscripción
            activateSubscription(pendingSubscription.plan, pendingSubscription.period);
            localStorage.removeItem('pendingSubscription');
            showNotification(`¡Suscripción ${pendingSubscription.plan} activada!`, 'success');
        } else if (currentPurchaseCoins > 0) {
            // Es compra de monedas
            addCoins(currentPurchaseCoins);
            showNotification(`¡Pago exitoso! ${currentPurchaseCoins} monedas agregadas`, 'success');
        }

        hidePaymentModal();
        
        // Log de pago exitoso
        logPaymentSuccess();

    } catch (error) {
        console.error('Payment error:', error);
        showNotification(`Error en el pago: ${error.message}`, 'error');
    } finally {
        const processBtn = document.getElementById('processPaymentBtn');
        processBtn.disabled = false;
        processBtn.innerHTML = 'Procesar Pago';
    }
}

async function simulateSecurePayment(cardNumber, expiry, cvc, name) {
    // Simular validación de tarjeta con el banco
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular verificaciones de seguridad
    showNotification('Verificando con el banco...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular autorización
    showNotification('Autorizando pago...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si la tarjeta pasa las validaciones básicas
    const cardType = getCardType(cardNumber.replace(/\s/g, ''));
    
    if (!cardType) {
        throw new Error('Tipo de tarjeta no soportado');
    }
    
    // Simular posibles errores realistas
    const random = Math.random();
    if (random < 0.05) { // 5% de fallo simulado
        throw new Error('Fondos insuficientes');
    } else if (random < 0.08) { // 3% adicional
        throw new Error('Tarjeta declinada por el banco');
    }
    
    return { success: true, cardType };
}

function validateCardNumber(cardNumber) {
    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0 && cardNumber.length >= 13 && cardNumber.length <= 19;
}

function validateExpiry(expiry) {
    const [month, year] = expiry.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
}

function getCardType(cardNumber) {
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/
    };
    
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cardNumber)) {
            return type;
        }
    }
    
    return null;
}

function logPaymentSuccess() {
    const timestamp = new Date().toISOString();
    const paymentId = 'beemo_' + Math.random().toString(36).substring(2, 15);
    
    console.log('Payment successful:', {
        id: paymentId,
        timestamp,
        amount: currentPurchaseAmount,
        coins: currentPurchaseCoins,
        device: deviceFingerprint
    });
}

// PayPal processing
function processPayPal() {
    showNotification('PayPal está temporalmente fuera de servicio. Intenta con otro método de pago.', 'warning');
}

// Purchase coins function
function purchaseCoins(amount, coins) {
    showPaymentModal(amount, coins);
}

// Sistema de Membresías - Funciones principales
function initializeMembershipSystem() {
    checkSubscriptionStatus();
    updateMembershipDisplay();
    generateDeviceFingerprint();
}

function generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
    ].join('|');
    
    deviceFingerprint = btoa(fingerprint).substring(0, 32);
    localStorage.setItem('deviceFingerprint', deviceFingerprint);
}

function checkBiometricAvailability() {
    // Verificar soporte para autenticación biométrica
    if ('credentials' in navigator && 'create' in navigator.credentials) {
        biometricAuthAvailable = true;
        updateAuthButtonIcon();
    }
    
    // Verificar Apple Pay para iOS
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        biometricAuthAvailable = true;
        updateAuthButtonIcon();
    }
}

function updateAuthButtonIcon() {
    const authIcon = document.getElementById('authIcon');
    if (authIcon && biometricAuthAvailable) {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            authIcon.textContent = '👤'; // Face ID
        } else if (/Android/.test(navigator.userAgent)) {
            authIcon.textContent = '👆'; // Fingerprint
        } else {
            authIcon.textContent = '🔐'; // Generic auth
        }
    }
}

function checkSubscriptionStatus() {
    if (subscriptionExpiry) {
        const now = new Date().getTime();
        const expiry = parseInt(subscriptionExpiry);
        
        if (now > expiry) {
            // Suscripción expirada
            currentSubscription = 'free';
            localStorage.removeItem('subscriptionExpiry');
            localStorage.setItem('currentSubscription', 'free');
            showNotification('Tu suscripción ha expirado', 'warning');
        }
    }
    
    // Verificar trial
    if (isTrialActive && trialStartDate) {
        const now = new Date().getTime();
        const start = parseInt(trialStartDate);
        const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 días en ms
        
        if (now > (start + threeDays)) {
            // Trial expirado
            isTrialActive = false;
            currentSubscription = 'free';
            localStorage.setItem('isTrialActive', 'false');
            localStorage.setItem('currentSubscription', 'free');
            showNotification('Tu prueba gratuita ha terminado', 'info');
        }
    }
}

function updateMembershipDisplay() {
    const currentPlanBtn = document.getElementById('currentPlanBtn');
    if (currentPlanBtn) {
        if (currentSubscription === 'free') {
            currentPlanBtn.textContent = 'Plan Actual';
            currentPlanBtn.classList.add('secondary');
        } else {
            currentPlanBtn.textContent = `Plan ${currentSubscription.toUpperCase()} Activo`;
            currentPlanBtn.classList.remove('secondary');
            currentPlanBtn.classList.add('primary');
        }
    }
}

function setupMembershipEventListeners() {
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            switchTab(targetTab);
        });
    });
    
    // Trial button
    const startTrialBtn = document.getElementById('startTrialBtn');
    if (startTrialBtn) {
        startTrialBtn.addEventListener('click', startFreeTrial);
    }
    
    // Subscription buttons
    const subscriptionBtns = document.querySelectorAll('[data-plan]');
    subscriptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            const amount = parseInt(btn.dataset.amount);
            const period = parseInt(btn.dataset.period);
            purchaseSubscription(plan, amount, period);
        });
    });
}

function switchTab(tabName) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

async function startFreeTrial() {
    if (isTrialActive) {
        showNotification('Ya tienes una prueba gratuita activa', 'warning');
        return;
    }
    
    try {
        showNotification('Verificando identidad...', 'info');
        
        // Intentar autenticación biométrica
        const authResult = await authenticateUser();
        
        if (authResult.success) {
            // Activar trial
            isTrialActive = true;
            trialStartDate = new Date().getTime().toString();
            currentSubscription = 'trial';
            
            localStorage.setItem('isTrialActive', 'true');
            localStorage.setItem('trialStartDate', trialStartDate);
            localStorage.setItem('currentSubscription', 'trial');
            
            showNotification('¡Prueba gratuita activada! 3 días sin anuncios', 'success');
            updateMembershipDisplay();
            
            // Aplicar beneficios inmediatamente
            applySubscriptionBenefits('trial');
        } else {
            showNotification('Verificación fallida. Intenta de nuevo.', 'error');
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        showNotification('Error en la verificación. Intenta más tarde.', 'error');
    }
}

async function authenticateUser() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
        return await authenticateAppleID();
    } else if (isAndroid) {
        return await authenticateGoogle();
    } else {
        return await authenticateWebAuthn();
    }
}

async function authenticateAppleID() {
    try {
        // Simular autenticación con Apple ID
        showNotification('Verificando con Apple ID...', 'info');
        
        // En una implementación real, usarías Apple's Sign In API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            success: true,
            provider: 'apple',
            verified: true
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function authenticateGoogle() {
    try {
        showNotification('Verificando con Google...', 'info');
        
        // En una implementación real, usarías Google's Sign In API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            success: true,
            provider: 'google',
            verified: true
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function authenticateWebAuthn() {
    try {
        if (!biometricAuthAvailable) {
            throw new Error('Autenticación biométrica no disponible');
        }
        
        showNotification('Verificando identidad...', 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
            success: true,
            provider: 'webauthn',
            verified: true
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function purchaseSubscription(plan, amount, period) {
    currentPurchaseAmount = amount;
    currentPurchaseCoins = 0; // No son monedas, es suscripción
    
    // Guardar datos de suscripción
    localStorage.setItem('pendingSubscription', JSON.stringify({
        plan, amount, period
    }));
    
    showPaymentModal(amount, 0, plan);
}

function applySubscriptionBenefits(subscriptionType) {
    if (subscriptionType !== 'free') {
        // Desactivar anuncios
        window.adsDisabled = true;
        localStorage.setItem('adsDisabled', 'true');
        
        // Desbloquear todo el contenido
        unlockedEpisodes = Array.from({length: 45}, (_, i) => i + 1);
        localStorage.setItem('unlockedEpisodes', JSON.stringify(unlockedEpisodes));
        
        showNotification('¡Beneficios premium activados!', 'success');
    } else {
        // Restaurar configuración gratuita
        window.adsDisabled = false;
        localStorage.removeItem('adsDisabled');
        
        unlockedEpisodes = [1,2,3,4,5,6,7,8];
        localStorage.setItem('unlockedEpisodes', JSON.stringify(unlockedEpisodes));
    }
}

function hasActivePremium() {
    if (isTrialActive || currentSubscription !== 'free') {
        const now = new Date().getTime();
        
        if (isTrialActive && trialStartDate) {
            const start = parseInt(trialStartDate);
            const threeDays = 3 * 24 * 60 * 60 * 1000;
            return now <= (start + threeDays);
        }
        
        if (subscriptionExpiry) {
            return now <= parseInt(subscriptionExpiry);
        }
    }
    
    return false;
}

// Check for successful payment
function checkPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const coins = urlParams.get('coins');
    const subscription = urlParams.get('subscription');

    if (payment === 'success') {
        if (coins) {
            addCoins(parseInt(coins));
            showNotification(`¡Compra exitosa! ${coins} monedas agregadas a tu cuenta`, 'success');
        }
        
        if (subscription) {
            const pendingSubscription = JSON.parse(localStorage.getItem('pendingSubscription') || '{}');
            if (pendingSubscription.plan) {
                activateSubscription(pendingSubscription.plan, pendingSubscription.period);
                localStorage.removeItem('pendingSubscription');
            }
        }

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function activateSubscription(plan, period) {
    const now = new Date().getTime();
    const duration = period * 24 * 60 * 60 * 1000; // días a milisegundos
    
    currentSubscription = plan;
    subscriptionExpiry = (now + duration).toString();
    
    localStorage.setItem('currentSubscription', plan);
    localStorage.setItem('subscriptionExpiry', subscriptionExpiry);
    
    applySubscriptionBenefits(plan);
    updateMembershipDisplay();
    
    showNotification(`¡Suscripción ${plan} activada!`, 'success');
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
                <div class="netflix-logo-fullscreen" style="display: none;">
                    <h2 style="color: #e50914; font-weight: 800; font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">NETFLIX</h2>
                </div>
                <div class="netflix-cta-fullscreen" style="display: none;">
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

// Función para manejar transición entre episodios (legacy - mantenida para compatibilidad)
function handleEpisodeTransition(nextEpisode, seriesTitle, playerElement) {
    // Esta función ahora es manejada directamente en showTikTokPlayer
    // Mantenida para compatibilidad con código existente
    console.log(`Transición legacy a episodio ${nextEpisode}`);
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

// Sistema de Reportes Avanzado
let currentReportData = {};
let reportInterval;
let realTimeDetection = false;

// Función para agregar botón de reporte al reproductor activo
function addReportButtonToActivePlayer() {
    const activePlayer = document.querySelector('.tiktok-player.active');
    if (!activePlayer) return;
    
    // Verificar si ya existe el botón
    const existingBtn = activePlayer.querySelector('.video-report-btn');
    if (existingBtn) return;
    
    // Crear botón de reporte para el reproductor
    const reportBtn = document.createElement('button');
    reportBtn.className = 'video-report-btn';
    reportBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
    `;
    reportBtn.onclick = () => showVideoReportModal();
    
    // Agregar al contenedor de controles del video
    const videoControls = activePlayer.querySelector('.video-controls-tiktok');
    if (videoControls) {
        videoControls.appendChild(reportBtn);
    }
}

// Función para mostrar modal de reportes expandido en pantalla completa dentro del video
function showVideoReportModal() {
    const activePlayer = document.querySelector('.tiktok-player.active');
    if (!activePlayer) return;
    
    // Bloquear scroll del body para pantalla completa
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Crear modal expandido en pantalla completa
    const reportModal = document.createElement('div');
    reportModal.className = 'video-report-modal-fullscreen';
    reportModal.innerHTML = `
        <div class="video-report-container">
            <!-- Header del modal -->
            <div class="video-report-header">
                <h2>🚨 Reportar Problema del Video</h2>
                <button class="video-report-close" onclick="closeVideoReportModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            
            <!-- Contenido principal -->
            <div class="video-report-content">
                <div class="video-report-sections">
                    <!-- Sección de selección de problema -->
                    <div class="video-report-section active" id="videoReportSection">
                        <div class="video-report-intro">
                            <div class="video-report-icon">⚠️</div>
                            <h3>¿Qué problema tienes con este video?</h3>
                            <p>Selecciona el tipo de problema para ayudarnos a solucionarlo rápidamente</p>
                        </div>

                        <div class="video-problem-grid">
                            <div class="video-problem-card" data-problem="video-no-load">
                                <div class="video-problem-icon">📹</div>
                                <h4>Video no carga</h4>
                                <p>El video no se reproduce o pantalla negra</p>
                            </div>
                            
                            <div class="video-problem-card" data-problem="video-freezes">
                                <div class="video-problem-icon">❄️</div>
                                <h4>Video se congela</h4>
                                <p>Se detiene constantemente o tiene lag</p>
                            </div>
                            
                            <div class="video-problem-card" data-problem="audio-issues">
                                <div class="video-problem-icon">🔇</div>
                                <h4>Sin audio</h4>
                                <p>No hay sonido o audio desincronizado</p>
                            </div>
                            
                            <div class="video-problem-card" data-problem="quality-issues">
                                <div class="video-problem-icon">📺</div>
                                <h4>Mala calidad</h4>
                                <p>Video borroso o pixelado</p>
                            </div>
                            
                            <div class="video-problem-card" data-problem="controls-broken">
                                <div class="video-problem-icon">🎮</div>
                                <h4>Controles no funcionan</h4>
                                <p>Los botones no responden</p>
                            </div>
                            
                            <div class="video-problem-card" data-problem="loading-slow">
                                <div class="video-problem-icon">⏳</div>
                                <h4>Carga muy lento</h4>
                                <p>Buffering constante o lentitud</p>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de información de contacto -->
                    <div class="video-report-section" id="videoContactSection">
                        <div class="video-contact-form">
                            <h3>Información de contacto</h3>
                            <p>Te enviaremos actualizaciones sobre la solución del problema</p>
                            
                            <div class="video-form-group">
                                <label>Tu correo electrónico</label>
                                <input type="email" id="videoReportEmail" placeholder="tu@email.com" required>
                                <span class="video-form-help">Solo para enviarte actualizaciones del reporte</span>
                            </div>
                            
                            <div class="video-form-group">
                                <label>Describe el problema (opcional)</label>
                                <textarea id="videoReportDescription" placeholder="Cuéntanos más detalles sobre lo que está pasando..." rows="4"></textarea>
                            </div>
                            
                            <div class="video-tech-info">
                                <h4>📱 Información técnica detectada:</h4>
                                <div class="video-tech-grid">
                                    <div class="video-tech-item">
                                        <span>Navegador:</span>
                                        <span id="videoTechBrowser">Chrome</span>
                                    </div>
                                    <div class="video-tech-item">
                                        <span>Pantalla:</span>
                                        <span id="videoTechScreen">1920x1080</span>
                                    </div>
                                    <div class="video-tech-item">
                                        <span>Conexión:</span>
                                        <span id="videoTechConnection">4G</span>
                                    </div>
                                    <div class="video-tech-item">
                                        <span>Episodio:</span>
                                        <span id="videoTechEpisode">1</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button class="video-submit-btn" id="videoSubmitBtn" disabled>
                                <span class="btn-icon">📤</span>
                                Enviar Reporte
                            </button>
                        </div>
                    </div>

                    <!-- Sección de enviando -->
                    <div class="video-report-section" id="videoSendingSection">
                        <div class="video-sending-animation">
                            <div class="video-sending-spinner">
                                <div class="spinner-ring"></div>
                                <div class="spinner-ring"></div>
                                <div class="spinner-ring"></div>
                            </div>
                            <h3>Enviando reporte...</h3>
                            <p id="videoSendingStatus">Procesando información del video</p>
                        </div>
                        
                        <div class="video-sending-steps">
                            <div class="video-step active">
                                <div class="step-dot"></div>
                                <span>Analizando video</span>
                            </div>
                            <div class="video-step">
                                <div class="step-dot"></div>
                                <span>Enviando datos</span>
                            </div>
                            <div class="video-step">
                                <div class="step-dot"></div>
                                <span>Confirmando recepción</span>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de confirmación -->
                    <div class="video-report-section" id="videoConfirmationSection">
                        <div class="video-confirmation-success">
                            <div class="video-success-icon">✅</div>
                            <h3>¡Reporte enviado exitosamente!</h3>
                            <p>Hemos recibido tu reporte y lo procesaremos en las próximas 24 horas</p>
                            
                            <div class="video-confirmation-details">
                                <div class="confirmation-item">
                                    <span class="item-icon">🎫</span>
                                    <div>
                                        <strong>ID del reporte:</strong>
                                        <span id="videoReportId">VID-2024-001</span>
                                    </div>
                                </div>
                                <div class="confirmation-item">
                                    <span class="item-icon">📧</span>
                                    <div>
                                        <strong>Confirmación enviada a:</strong>
                                        <span id="videoConfirmationEmail">tu@email.com</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button class="video-close-btn" onclick="closeVideoReportModal()">
                                Continuar viendo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar al reproductor activo
    activePlayer.appendChild(reportModal);
    
    // Activar modal con animación
    setTimeout(() => {
        reportModal.classList.add('active');
    }, 100);
    
    // Configurar eventos
    setupVideoReportEvents();
    
    // Detectar información técnica automáticamente
    detectVideoTechnicalInfo();
    
    // Iniciar detección en tiempo real para este reporte
    startVideoRealTimeDetection();
}

// Función para cerrar el modal de reportes del video
function closeVideoReportModal() {
    const modal = document.querySelector('.video-report-modal-fullscreen');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    // Detener detección en tiempo real
    stopRealTimeDetection();
}

// Configurar eventos del modal de video
function setupVideoReportEvents() {
    // Selección de problemas
    const problemCards = document.querySelectorAll('.video-problem-card');
    problemCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remover selección anterior
            problemCards.forEach(c => c.classList.remove('selected'));
            
            // Seleccionar actual
            card.classList.add('selected');
            
            // Guardar problema seleccionado
            const problemType = card.dataset.problem;
            const problemTitle = card.querySelector('h4').textContent;
            
            currentReportData.problemType = problemType;
            currentReportData.problemTitle = problemTitle;
            
            // Avanzar a siguiente sección después de 1 segundo
            setTimeout(() => {
                showVideoReportStep('videoContactSection');
            }, 1000);
        });
    });
    
    // Validación del email
    const emailInput = document.getElementById('videoReportEmail');
    const submitBtn = document.getElementById('videoSubmitBtn');
    
    if (emailInput && submitBtn) {
        emailInput.addEventListener('input', () => {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
            submitBtn.disabled = !isValidEmail;
            
            if (isValidEmail) {
                submitBtn.classList.add('enabled');
            } else {
                submitBtn.classList.remove('enabled');
            }
        });
    }
    
    // Envío del reporte
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            submitVideoReport();
        });
    }
}

// Mostrar paso específico del reporte
function showVideoReportStep(stepId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.video-report-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección específica
    const targetSection = document.getElementById(stepId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Detectar información técnica del video
function detectVideoTechnicalInfo() {
    // Detectar navegador
    const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                   navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                   navigator.userAgent.includes('Safari') ? 'Safari' : 'Otro';
    
    // Detectar resolución
    const screen = `${window.screen.width}x${window.screen.height}`;
    
    // Detectar conexión
    const connection = navigator.connection ? navigator.connection.effectiveType : 'Desconocida';
    
    // Detectar episodio actual
    const currentEpisodeElement = document.querySelector('#episodeDescription');
    const episodeText = currentEpisodeElement ? currentEpisodeElement.textContent : 'Episodio 1';
    
    // Actualizar interfaz
    const browserEl = document.getElementById('videoTechBrowser');
    const screenEl = document.getElementById('videoTechScreen');
    const connectionEl = document.getElementById('videoTechConnection');
    const episodeEl = document.getElementById('videoTechEpisode');
    
    if (browserEl) browserEl.textContent = browser;
    if (screenEl) screenEl.textContent = screen;
    if (connectionEl) connectionEl.textContent = connection.toUpperCase();
    if (episodeEl) episodeEl.textContent = episodeText;
    
    // Guardar en datos del reporte
    currentReportData.videoTechnicalInfo = {
        browser,
        screen,
        connection,
        episode: episodeText,
        timestamp: new Date().toISOString(),
        playerActive: true
    };
}

// Iniciar detección en tiempo real específica para video
function startVideoRealTimeDetection() {
    realTimeDetection = true;
    
    reportInterval = setInterval(() => {
        if (!realTimeDetection) return;
        
        // Detectar problemas específicos del video en reproducción
        detectActiveVideoProblems();
    }, 3000); // Cada 3 segundos para video activo
    
    console.log('🎬 Detección en tiempo real de video activada');
}

// Detectar problemas del video activo
function detectActiveVideoProblems() {
    const video = document.getElementById('mainVideo');
    const problems = [];
    
    if (video) {
        // Video no carga
        if (video.readyState === 0) {
            problems.push('Video no puede cargar los datos');
        }
        
        // Video pausado inesperadamente
        if (video.paused && !video.ended && video.currentTime > 0) {
            problems.push('Video pausado inesperadamente');
        }
        
        // Problemas de buffering
        if (video.readyState < 3 && video.currentTime > 0) {
            problems.push('Video en buffering constante');
        }
        
        // Error en el video
        if (video.error) {
            problems.push(`Error de video: ${video.error.message}`);
        }
    } else {
        problems.push('Reproductor de video no encontrado');
    }
    
    if (problems.length > 0) {
        currentReportData.detectedVideoProblems = problems;
        console.log('🎬 Problemas de video detectados:', problems);
        
        // Auto-sugerencia si hay problemas críticos
        if (problems.length >= 2) {
            showVideoAutoSuggestion(problems);
        }
    }
}

// Mostrar sugerencia automática para problemas de video
function showVideoAutoSuggestion(problems) {
    // Verificar si ya existe una sugerencia
    if (document.querySelector('.video-auto-suggestion')) return;
    
    const suggestion = document.createElement('div');
    suggestion.className = 'video-auto-suggestion';
    suggestion.innerHTML = `
        <div class="suggestion-content">
            <div class="suggestion-icon">🤖</div>
            <div class="suggestion-text">
                <strong>Problemas detectados en el video</strong>
                <p>¿Quieres reportar estos problemas automáticamente?</p>
            </div>
            <button class="suggestion-btn" onclick="openAutoVideoReport()">Reportar</button>
            <button class="suggestion-close" onclick="closeVideoAutoSuggestion()">×</button>
        </div>
    `;
    
    // Agregar al reproductor activo
    const activePlayer = document.querySelector('.tiktok-player.active');
    if (activePlayer) {
        activePlayer.appendChild(suggestion);
        
        setTimeout(() => {
            suggestion.classList.add('active');
        }, 100);
        
        // Auto-remover después de 8 segundos
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.classList.remove('active');
                setTimeout(() => {
                    if (suggestion.parentNode) {
                        suggestion.parentNode.removeChild(suggestion);
                    }
                }, 300);
            }
        }, 8000);
    }
}

// Abrir reporte automático de video
function openAutoVideoReport() {
    closeVideoAutoSuggestion();
    showVideoReportModal();
    
    // Pre-seleccionar problema más relevante
    setTimeout(() => {
        if (currentReportData.detectedVideoProblems) {
            const firstProblem = currentReportData.detectedVideoProblems[0];
            let problemType = 'video-no-load';
            
            if (firstProblem.includes('pausado')) {
                problemType = 'video-freezes';
            } else if (firstProblem.includes('buffering')) {
                problemType = 'loading-slow';
            } else if (firstProblem.includes('Error')) {
                problemType = 'video-no-load';
            }
            
            const problemCard = document.querySelector(`[data-problem="${problemType}"]`);
            if (problemCard) {
                problemCard.click();
            }
        }
    }, 500);
}

// Cerrar sugerencia automática de video
function closeVideoAutoSuggestion() {
    const suggestion = document.querySelector('.video-auto-suggestion');
    if (suggestion) {
        suggestion.classList.remove('active');
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.parentNode.removeChild(suggestion);
            }
        }, 300);
    }
}

// Enviar reporte de video
async function submitVideoReport() {
    const email = document.getElementById('videoReportEmail').value;
    const description = document.getElementById('videoReportDescription').value;
    
    // Mostrar sección de envío
    showVideoReportStep('videoSendingSection');
    
    // Generar ID del reporte
    const reportId = 'VID-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    currentReportData.reportId = reportId;
    currentReportData.email = email;
    currentReportData.description = description;
    currentReportData.timestamp = new Date().toISOString();
    currentReportData.type = 'video_player';
    
    // Simular proceso de envío
    const steps = [
        { text: 'Analizando problemas del video...', delay: 1500 },
        { text: 'Enviando datos técnicos...', delay: 2000 },
        { text: 'Confirmando recepción...', delay: 1000 }
    ];
    
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
        
        // Actualizar pasos
        document.querySelectorAll('.video-step').forEach((step, index) => {
            step.classList.toggle('active', index <= i);
        });
        
        document.getElementById('videoSendingStatus').textContent = steps[i].text;
    }
    
    // Simular envío de email
    await simulateVideoEmailSending(email, reportId);
    
    // Mostrar confirmación
    setTimeout(() => {
        showVideoConfirmation(reportId, email);
    }, 1000);
}

// Simular envío de email para video
async function simulateVideoEmailSending(email, reportId) {
    console.log('📧 Enviando confirmación de reporte de video a:', email);
    
    const emailData = {
        to: email,
        subject: `Reporte de Video ${reportId} - Beemo`,
        body: `Tu reporte de problemas de video ha sido recibido y será procesado en las próximas 24 horas.`
    };
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('✅ Email de confirmación de video enviado');
}

// Mostrar confirmación final
function showVideoConfirmation(reportId, email) {
    showVideoReportStep('videoConfirmationSection');
    
    // Actualizar datos de confirmación
    document.getElementById('videoReportId').textContent = reportId;
    document.getElementById('videoConfirmationEmail').textContent = email;
}

// Funciones globales para acceso desde HTML
window.closeVideoReportModal = closeVideoReportModal;
window.openAutoVideoReport = openAutoVideoReport;
window.closeVideoAutoSuggestion = closeVideoAutoSuggestion;

// Función para mostrar el modal de reportes
function showReportModal() {
    const modal = document.getElementById('reportModal');
    modal.classList.add('active');
    
    // Reset a la primera sección
    showReportSection('reportSection');
    
    // Detectar información técnica automáticamente
    detectTechnicalInfo();
    
    // Iniciar detección en tiempo real
    startRealTimeDetection();
}

function hideReportModal() {
    const modal = document.getElementById('reportModal');
    modal.classList.remove('active');
    
    // Limpiar datos y detener detección
    currentReportData = {};
    stopRealTimeDetection();
}

function showReportSection(sectionId) {
    document.querySelectorAll('.report-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Detectar información técnica del usuario
function detectTechnicalInfo() {
    const browserInfo = navigator.userAgent;
    const screenInfo = `${screen.width}x${screen.height}`;
    
    // Detectar tipo de navegador
    let browser = 'Desconocido';
    if (browserInfo.includes('Chrome')) browser = 'Chrome';
    else if (browserInfo.includes('Firefox')) browser = 'Firefox';
    else if (browserInfo.includes('Safari')) browser = 'Safari';
    else if (browserInfo.includes('Edge')) browser = 'Edge';
    
    // Detectar conexión si está disponible
    let connection = 'Desconocida';
    if (navigator.connection) {
        connection = navigator.connection.effectiveType || 'Desconocida';
    }
    
    // Actualizar interfaz
    document.getElementById('browserInfo').textContent = browser;
    document.getElementById('screenInfo').textContent = screenInfo;
    document.getElementById('connectionInfo').textContent = connection.toUpperCase();
    
    // Guardar en datos del reporte
    currentReportData.technicalInfo = {
        browser,
        browserFull: browserInfo,
        screen: screenInfo,
        connection,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };
}

// Sistema de detección en tiempo real de problemas
function startRealTimeDetection() {
    realTimeDetection = true;
    
    // Detectar problemas de video cada 5 segundos
    reportInterval = setInterval(() => {
        if (!realTimeDetection) return;
        
        detectVideoProblems();
        detectPerformanceIssues();
        detectNetworkIssues();
    }, 5000);
    
    console.log('🔍 Detección en tiempo real activada');
}

function stopRealTimeDetection() {
    realTimeDetection = false;
    if (reportInterval) {
        clearInterval(reportInterval);
        reportInterval = null;
    }
    console.log('🔍 Detección en tiempo real desactivada');
}

// Detectar problemas específicos de video
function detectVideoProblems() {
    const video = document.getElementById('mainVideo');
    if (!video) return;
    
    const problems = [];
    
    // Verificar si el video está cargado pero no reproduce
    if (video.readyState === 4 && video.paused && !video.ended) {
        problems.push('Video cargado pero pausado inesperadamente');
    }
    
    // Verificar problemas de buffering
    if (video.readyState < 3) {
        problems.push('Video experimentando buffering');
    }
    
    // Verificar si hay error en el video
    if (video.error) {
        problems.push(`Error de video: ${video.error.message}`);
    }
    
    // Verificar calidad/fps bajo
    if (video.videoWidth && video.videoWidth < 480) {
        problems.push('Calidad de video baja detectada');
    }
    
    if (problems.length > 0) {
        currentReportData.detectedProblems = problems;
        console.log('🚨 Problemas detectados:', problems);
        
        // Auto-sugerir reporte si hay problemas críticos
        if (problems.length >= 2) {
            showAutoReportSuggestion();
        }
    }
}

// Detectar problemas de rendimiento
function detectPerformanceIssues() {
    // Verificar uso de memoria si está disponible
    if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
        if (memoryUsage > 0.8) {
            currentReportData.performanceIssues = currentReportData.performanceIssues || [];
            currentReportData.performanceIssues.push('Alto uso de memoria detectado');
        }
    }
    
    // Verificar latencia de red
    const startTime = performance.now();
    fetch('/api/health')
        .then(() => {
            const latency = performance.now() - startTime;
            if (latency > 2000) {
                currentReportData.performanceIssues = currentReportData.performanceIssues || [];
                currentReportData.performanceIssues.push(`Alta latencia detectada: ${latency.toFixed(0)}ms`);
            }
        })
        .catch(() => {
            currentReportData.performanceIssues = currentReportData.performanceIssues || [];
            currentReportData.performanceIssues.push('Problemas de conectividad detectados');
        });
}

// Detectar problemas de red
function detectNetworkIssues() {
    if (navigator.onLine === false) {
        currentReportData.networkIssues = currentReportData.networkIssues || [];
        currentReportData.networkIssues.push('Conexión offline detectada');
    }
    
    // Verificar velocidad de conexión si está disponible
    if (navigator.connection && navigator.connection.downlink) {
        const speed = navigator.connection.downlink;
        if (speed < 1) {
            currentReportData.networkIssues = currentReportData.networkIssues || [];
            currentReportData.networkIssues.push(`Velocidad baja: ${speed} Mbps`);
        }
    }
}

// Mostrar sugerencia automática de reporte
function showAutoReportSuggestion() {
    const notification = document.createElement('div');
    notification.className = 'auto-report-suggestion';
    notification.innerHTML = `
        <div class="suggestion-content">
            <div class="suggestion-icon">🤖</div>
            <div class="suggestion-text">
                <strong>Problemas detectados automáticamente</strong>
                <p>¿Quieres reportar los problemas que encontramos?</p>
            </div>
            <button class="suggestion-btn" onclick="openAutoReport()">Reportar</button>
            <button class="suggestion-close" onclick="closeAutoSuggestion(this)">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);
    
    // Auto-remove después de 10 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 10000);
}

function openReportModal() {
    showReportModal();
}

function openAutoReport() {
    closeAutoSuggestion(document.querySelector('.auto-report-suggestion'));
    showReportModal();
    
    // Pre-seleccionar el problema más relevante
    if (currentReportData.detectedProblems) {
        const firstProblem = currentReportData.detectedProblems[0];
        if (firstProblem.includes('pausado')) {
            selectProblemOption('video-freezes');
        } else if (firstProblem.includes('buffering')) {
            selectProblemOption('video-no-load');
        } else if (firstProblem.includes('calidad')) {
            selectProblemOption('quality-issues');
        }
    }
}

function closeAutoSuggestion(element) {
    const suggestion = element.closest('.auto-report-suggestion');
    suggestion.classList.remove('active');
    setTimeout(() => {
        if (document.body.contains(suggestion)) {
            document.body.removeChild(suggestion);
        }
    }, 300);
}

function selectProblemOption(problemType) {
    document.querySelectorAll('.problem-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-problem="${problemType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        
        currentReportData.problemType = problemType;
        currentReportData.problemTitle = selectedOption.querySelector('h4').textContent;
        
        // Mostrar formulario de contacto
        document.getElementById('contactForm').style.display = 'block';
        
        // Mostrar campo de descripción si es "otro"
        const descriptionGroup = document.getElementById('descriptionGroup');
        if (problemType === 'other') {
            descriptionGroup.style.display = 'block';
        } else {
            descriptionGroup.style.display = 'none';
        }
        
        // Validar formulario
        validateReportForm();
    }
}

function validateReportForm() {
    const email = document.getElementById('reportEmail').value;
    const submitBtn = document.getElementById('submitReportBtn');
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    submitBtn.disabled = !isValidEmail;
}

// Simular envío de correo electrónico
async function sendConfirmationEmail(email, reportId, problemTitle) {
    try {
        // Simular API de envío de correo
        console.log('📧 Enviando confirmación a:', email);
        
        const emailData = {
            to: email,
            subject: `Reporte ${reportId} - Confirmación recibida`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1d9bf0; color: white; padding: 20px; text-align: center;">
                        <h1>🎬 Beemo - Reporte Recibido</h1>
                    </div>
                    <div style="padding: 20px; background: #f9f9f9;">
                        <h2>Hola,</h2>
                        <p>Hemos recibido tu reporte sobre: <strong>${problemTitle}</strong></p>
                        <div style="background: white; padding: 15px; border-left: 4px solid #1d9bf0; margin: 20px 0;">
                            <p><strong>ID del reporte:</strong> ${reportId}</p>
                            <p><strong>Estado:</strong> En revisión</p>
                            <p><strong>Tiempo estimado:</strong> 24-48 horas</p>
                        </div>
                        <p>Nuestro sistema de detección automática monitoreará este problema y te notificaremos cuando esté resuelto.</p>
                        <p>Gracias por ayudarnos a mejorar Beemo.</p>
                        <hr>
                        <p style="color: #666; font-size: 12px;">Este es un correo automático, no responder.</p>
                    </div>
                </div>
            `
        };
        
        // Simular envío exitoso después de 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ Correo de confirmación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('❌ Error enviando confirmación:', error);
        return false;
    }
}

// Procesar envío del reporte
async function submitReport() {
    const email = document.getElementById('reportEmail').value;
    const description = document.getElementById('problemDescription').value;
    
    // Generar ID único del reporte
    const reportId = 'BM-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    currentReportData.reportId = reportId;
    currentReportData.email = email;
    currentReportData.description = description;
    currentReportData.timestamp = new Date().toISOString();
    
    // Cambiar a sección de enviando
    showReportSection('sendingSection');
    
    // Simular proceso de envío con pasos
    const steps = [
        { id: 0, text: 'Recopilando información técnica...', delay: 1000 },
        { id: 1, text: 'Analizando problemas detectados...', delay: 2000 },
        { id: 2, text: 'Enviando confirmación por email...', delay: 1500 }
    ];
    
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
        
        // Actualizar paso actual
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('active', index <= i);
        });
        
        document.getElementById('sendingStatus').textContent = steps[i].text;
        
        // Enviar correo en el último paso
        if (i === steps.length - 1) {
            await sendConfirmationEmail(email, reportId, currentReportData.problemTitle);
        }
    }
    
    // Cambiar a sección de confirmación
    setTimeout(() => {
        showReportSection('confirmationSection');
        
        // Actualizar información de confirmación
        document.getElementById('reportId').textContent = reportId;
        document.getElementById('confirmationEmail').textContent = email;
        
        // Activar monitoreo automático
        startAutomaticMonitoring(reportId);
        
        console.log('✅ Reporte enviado exitosamente:', currentReportData);
    }, 500);
}

// Sistema de monitoreo automático
function startAutomaticMonitoring(reportId) {
    console.log(`🤖 Iniciando monitoreo automático para reporte ${reportId}`);
    
    // Simular resolución automática después de 20 segundos para demo
    setTimeout(() => {
        if (currentReportData.problemType === 'video-no-load' || currentReportData.problemType === 'video-freezes') {
            showProblemResolvedNotification(reportId);
        }
    }, 20000);
}

function showProblemResolvedNotification(reportId) {
    showNotification(`🎉 ¡Problema ${reportId} resuelto automáticamente!`, 'success');
    
    // Simular envío de correo de resolución
    setTimeout(() => {
        console.log(`📧 Enviando notificación de resolución para ${reportId}`);
        showNotification('📧 Confirmación de resolución enviada a tu email', 'info');
    }, 2000);
}

// Enhanced search functionality
function performSearchBar(query) {
    if (query.length > 2) {
        showSearchWithSkeleton(query);
        document.getElementById('searchModal').classList.add('active');
    }
}

// Show skeleton loading before search results
function showSearchWithSkeleton(query) {
    const resultsContainer = document.getElementById('searchResults');
    const resultsList = document.getElementById('resultsList');
    
    // Show loading state immediately
    resultsContainer.style.display = 'block';
    resultsList.innerHTML = `
        <div class="search-loading">
            <div class="spinner-360"></div>
            <h3>Buscando series...</h3>
            <p>Explorando nuestra base de datos</p>
        </div>
    `;
    
    // Show skeleton cards after 1 second
    setTimeout(() => {
        resultsList.innerHTML = generateSkeletonCards(5);
        
        // Show loading dots
        setTimeout(() => {
            resultsList.innerHTML = `
                <div class="search-loading">
                    <div class="loading-dots-modern">
                        <div class="loading-dot-modern"></div>
                        <div class="loading-dot-modern"></div>
                        <div class="loading-dot-modern"></div>
                    </div>
                    <h3>Procesando resultados...</h3>
                    <p>Casi terminamos</p>
                </div>
            `;
            
            // Finally show real results after skeleton phase
            setTimeout(() => {
                performSearch(query);
            }, 2000);
        }, 2000);
    }, 1000);
}

// Generate skeleton loading cards
function generateSkeletonCards(count) {
    let skeletons = '';
    for (let i = 0; i < count; i++) {
        skeletons += `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton skeleton-text large"></div>
                    <div class="skeleton skeleton-text small"></div>
                    <div class="skeleton skeleton-text"></div>
                </div>
            </div>
        `;
    }
    return skeletons;
}

// Configurar sistema de reportes
function setupReportSystem() {
    // Event listeners para el modal de reportes
    const reportClose = document.getElementById('reportClose');
    const reportModal = document.getElementById('reportModal');
    const problemOptions = document.querySelectorAll('.problem-option');
    const reportEmail = document.getElementById('reportEmail');
    const submitReportBtn = document.getElementById('submitReportBtn');
    const closeReportBtn = document.getElementById('closeReportBtn');
    
    // Cerrar modal
    if (reportClose) {
        reportClose.addEventListener('click', hideReportModal);
    }
    
    if (reportModal) {
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                hideReportModal();
            }
        });
    }
    
    // Selección de problemas
    problemOptions.forEach(option => {
        option.addEventListener('click', () => {
            const problemType = option.dataset.problem;
            selectProblemOption(problemType);
        });
    });
    
    // Validación de email
    if (reportEmail) {
        reportEmail.addEventListener('input', validateReportForm);
    }
    
    // Envío del reporte
    if (submitReportBtn) {
        submitReportBtn.addEventListener('click', submitReport);
    }
    
    // Cerrar modal desde confirmación
    if (closeReportBtn) {
        closeReportBtn.addEventListener('click', hideReportModal);
    }
    
    // Agregar botón de reporte al reproductor
    addReportButtonToPlayer();
    
    console.log('🚨 Sistema de reportes inicializado');
}

// Agregar botón de reporte al reproductor de video
function addReportButtonToPlayer() {
    // El botón se agregará dinámicamente cuando se abra el reproductor
    // En la función showTikTokPlayer
}

// Modificar showTikTokPlayer para incluir botón de reporte
function addReportButtonToActivePlayer() {
    const videoControls = document.querySelector('.video-controls-tiktok');
    if (videoControls && !document.getElementById('reportVideoBtn')) {
        const reportBtn = document.createElement('button');
        reportBtn.className = 'tiktok-btn';
        reportBtn.id = 'reportVideoBtn';
        reportBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <span style="font-size: 0.7rem; font-weight: 600;">Reportar</span>
        `;
        
        reportBtn.addEventListener('click', () => {
            showReportModal();
            
            // Pre-detectar problemas del video actual
            const video = document.getElementById('mainVideo');
            if (video) {
                detectVideoProblems();
            }
        });
        
        videoControls.appendChild(reportBtn);
    }
}

// Enhanced expanded search with skeleton
function performExpandedSearch(query) {
    const resultsContainer = document.getElementById('expandedSearchResults');
    
    // Show loading state
    resultsContainer.innerHTML = `
        <div class="search-loading" style="grid-column: 1 / -1;">
            <div class="spinner-360"></div>
            <h3>Buscando "${query}"...</h3>
            <p>Analizando nuestra biblioteca de contenido</p>
        </div>
    `;
    
    // Show skeleton after 1 second
    setTimeout(() => {
        resultsContainer.innerHTML = generateExpandedSkeletonCards(6);
        
        // Show actual results after skeleton phase
        setTimeout(() => {
            const allSeries = getAllSeries();
            const filteredResults = allSeries.filter(result => 
                result.title.toLowerCase().includes(query.toLowerCase()) ||
                result.genre.toLowerCase().includes(query.toLowerCase()) ||
                result.description.toLowerCase().includes(query.toLowerCase())
            );
            displayExpandedSearchResults(filteredResults);
        }, 2500);
    }, 1500);
}

// Generate expanded skeleton cards
function generateExpandedSkeletonCards(count) {
    let skeletons = '';
    for (let i = 0; i < count; i++) {
        skeletons += `
            <div class="expanded-result-card" style="pointer-events: none;">
                <div class="skeleton skeleton-image" style="width: 120px; height: 160px;"></div>
                <div class="expanded-result-info">
                    <div class="skeleton skeleton-text small" style="width: 80px; height: 12px;"></div>
                    <div class="skeleton skeleton-text large" style="height: 24px; margin: 0.5rem 0;"></div>
                    <div class="skeleton skeleton-text" style="width: 200px; height: 14px; margin-bottom: 1rem;"></div>
                    <div class="skeleton skeleton-text" style="height: 14px; margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-text" style="height: 14px; width: 90%;"></div>
                    <div class="skeleton skeleton-text" style="width: 120px; height: 36px; margin-top: 1.5rem; border-radius: 20px;"></div>
                </div>
            </div>
        `;
    }
    return skeletons;
}

// Función para cargar script de Socket.IO
function loadSocketIO() {
    return new Promise((resolve, reject) => {
        if (window.io) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
        script.onload = () => {
            console.log('✅ Socket.IO cargado correctamente');
            resolve();
        };
        script.onerror = () => {
            console.error('Error cargando Socket.IO desde CDN, intentando ruta local...');
            // Intentar cargar desde ruta local
            const localScript = document.createElement('script');
            localScript.src = '/socket.io/socket.io.js';
            localScript.onload = () => {
                console.log('✅ Socket.IO cargado desde servidor local');
                resolve();
            };
            localScript.onerror = () => {
                console.error('Error cargando Socket.IO, usando modo offline');
                // Crear mock de socket para evitar errores
                window.io = () => ({
                    emit: () => {},
                    on: () => {},
                    connected: false,
                    connect: () => {},
                    disconnect: () => {}
                });
                resolve();
            };
            document.head.appendChild(localScript);
        };
        document.head.appendChild(script);
    });
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
    
    // Initialize membership system
    initializeMembershipSystem();
    setupMembershipEventListeners();
    checkBiometricAvailability();

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
    
    // Inicializar sistema de reportes
    setupReportSystem();
    
    // Inicializar sistema de likes
    console.log('🔄 Iniciando carga del sistema de likes...');
    loadSocketIO().then(() => {
        console.log('✅ Socket.IO listo, inicializando sistema de likes...');
        initializeLikesSystem();
        
        // Test de conectividad de la API
        testApiConnection();
    }).catch(error => {
        console.error('❌ Error inicializando sistema de likes:', error);
        showNotification('Sistema de likes en modo offline', 'warning');
    });
    
    // Función de prueba de conectividad silenciosa
    function testApiConnection() {
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('✅ API conectada');
            })
            .catch(error => {
                console.error('❌ API no disponible:', error);
            });
    }
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
