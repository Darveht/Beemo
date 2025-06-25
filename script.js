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

// TikTok Style Video Player
function showTikTokPlayer(title) {
    const player = document.createElement('div');
    player.className = 'tiktok-player';
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
                    <p class="video-description-tiktok">Episodio 1 - "El Despertar"</p>
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

    document.body.appendChild(player);
    setTimeout(() => player.classList.add('active'), 100);

    // Event listeners
    const closeBtn = player.querySelector('.close-player');
    const likeBtn = player.querySelector('#likeBtn');
    const playPauseBtn = player.querySelector('#playPauseBtn');
    const muteBtn = player.querySelector('#muteBtn');
    const episodesBtn = player.querySelector('#episodesBtn');

    closeBtn.addEventListener('click', () => {
        player.classList.remove('active');
        setTimeout(() => document.body.removeChild(player), 300);
    });

    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
        showNotification(likeBtn.classList.contains('liked') ? 'Agregado a favoritos' : 'Removido de favoritos');
    });

    let isPlaying = true;
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.innerHTML = isPlaying ? 
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' :
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    });

    let isMuted = false;
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.innerHTML = isMuted ?
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>' :
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="lock-icon">
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

// Purchase coins with Stripe
async function purchaseCoins(amount, coins) {
    try {
        showNotification('Procesando pago...', 'info');
        
        // Create payment intent (in real app, this would be a server call)
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${coins} Monedas Beemo`,
                        description: 'Monedas virtuales para desbloquear episodios premium'
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            successUrl: `${window.location.origin}?payment=success&coins=${coins}`,
            cancelUrl: `${window.location.origin}?payment=cancel`,
        });

        if (error) {
            showNotification('Error en el pago. Intenta de nuevo.', 'error');
        }
    } catch (err) {
        console.error('Payment error:', err);
        showNotification('Error en el pago. Intenta de nuevo.', 'error');
    }
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
            showTikTokPlayer('El Emperador Eterno');
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
    
    modal.classList.add('active');
    closeBtn.style.display = 'none';
    
    let timeLeft = 30;
    const interval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        progress.style.width = `${((30 - timeLeft) / 30) * 100}%`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            closeBtn.style.display = 'flex';
            addCoins(20);
            setTimeout(() => {
                modal.classList.remove('active');
                timer.textContent = '30';
                progress.style.width = '0%';
            }, 2000);
        }
    }, 1000);
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

// Episode click handler with monetization
function handleEpisodeClick(episodeNum) {
    if (episodeNum <= 8 || unlockedEpisodes.includes(episodeNum)) {
        showNotification(`Reproduciendo Episodio ${episodeNum}`, 'success');
        return true;
    } else {
        if (unlockEpisode(episodeNum)) {
            showNotification(`Episodio ${episodeNum} desbloqueado y reproduciéndose`, 'success');
            return true;
        } else {
            showNotification('No tienes suficientes monedas. Ve anuncios para ganar más.', 'warning');
            return false;
        }
    }
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
    
    // Check for payment success on page load
    checkPaymentSuccess();
});

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
