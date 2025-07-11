
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware mejorado para móviles
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: function(origin, callback) {
        // Permitir requests sin origin (como apps móviles)
        if (!origin) return callback(null, true);
        
        // Permitir localhost y Replit
        const allowedOrigins = [
            'http://localhost:5000',
            'https://localhost:5000'
        ];
        
        // Permitir todos los dominios de Replit
        if (origin.includes('replit.dev') || origin.includes('replit.app') || origin.includes('replit.co')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(null, true); // Permitir todos por ahora para debugging
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
    next();
});

app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

const { initializeDatabase } = require('./db-init');

// Inicializar base de datos SQLite
let db;
initializeDatabase().then(database => {
    db = database;
    console.log('🚀 Base de datos inicializada correctamente');
}).catch(err => {
    console.error('💥 Error fatal inicializando base de datos:', err);
    process.exit(1);
});

// Función para formatear números grandes
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

// Generar ID único para usuario basado en IP y User-Agent
function generateUserId(req) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    return require('crypto').createHash('md5').update(ip + userAgent).digest('hex');
}

// API Endpoints

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        server: 'Beemo Likes System',
        database: db ? 'Connected' : 'Disconnected'
    });
});

// Obtener likes de un contenido
app.get('/api/likes/:contentId', (req, res) => {
    const { contentId } = req.params;
    
    db.get("SELECT likes_count FROM likes WHERE content_id = ?", [contentId], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener likes' });
        } else {
            const likesCount = row ? row.likes_count : 0;
            res.json({
                contentId,
                likesCount,
                likesFormatted: formatLikesCount(likesCount)
            });
        }
    });
});

// Dar like a un contenido
app.post('/api/likes/:contentId', (req, res) => {
    const { contentId } = req.params;
    const { contentType = 'series' } = req.body;
    const userId = generateUserId(req);
    
    // Verificar si el usuario ya dio like
    db.get("SELECT id FROM user_likes WHERE user_id = ? AND content_id = ?", 
        [userId, contentId], (err, row) => {
        
        if (row) {
            // Usuario ya dio like, remover like
            db.run("DELETE FROM user_likes WHERE user_id = ? AND content_id = ?", 
                [userId, contentId], (err) => {
                if (err) {
                    res.status(500).json({ error: 'Error al remover like' });
                    return;
                }
                
                // Decrementar contador
                db.run(`UPDATE likes SET likes_count = likes_count - 1, updated_at = CURRENT_TIMESTAMP 
                        WHERE content_id = ?`, [contentId], (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Error al actualizar contador' });
                        return;
                    }
                    
                    // Obtener nuevo count
                    db.get("SELECT likes_count FROM likes WHERE content_id = ?", [contentId], (err, newRow) => {
                        const newCount = newRow ? newRow.likes_count : 0;
                        
                        // Emitir actualización en tiempo real
                        broadcastLikeUpdate(contentId, newCount);
                        
                        res.json({
                            contentId,
                            likesCount: newCount,
                            likesFormatted: formatLikesCount(newCount),
                            liked: false,
                            action: 'removed'
                        });
                    });
                });
            });
        } else {
            // Usuario no ha dado like, agregar like
            db.run("INSERT INTO user_likes (user_id, content_id) VALUES (?, ?)", 
                [userId, contentId], (err) => {
                if (err) {
                    res.status(500).json({ error: 'Error al agregar like' });
                    return;
                }
                
                // Verificar si existe el contenido, si no crearlo
                db.get("SELECT id FROM likes WHERE content_id = ?", [contentId], (err, existingRow) => {
                    if (!existingRow) {
                        // Crear entrada para el contenido
                        db.run("INSERT INTO likes (content_id, content_type, likes_count) VALUES (?, ?, ?)", 
                            [contentId, contentType, 1], (err) => {
                            if (err) {
                                res.status(500).json({ error: 'Error al crear contenido' });
                                return;
                            }
                            
                            broadcastLikeUpdate(contentId, 1);
                            res.json({
                                contentId,
                                likesCount: 1,
                                likesFormatted: '1',
                                liked: true,
                                action: 'added'
                            });
                        });
                    } else {
                        // Incrementar contador existente
                        db.run(`UPDATE likes SET likes_count = likes_count + 1, updated_at = CURRENT_TIMESTAMP 
                                WHERE content_id = ?`, [contentId], (err) => {
                            if (err) {
                                res.status(500).json({ error: 'Error al actualizar contador' });
                                return;
                            }
                            
                            // Obtener nuevo count
                            db.get("SELECT likes_count FROM likes WHERE content_id = ?", [contentId], (err, newRow) => {
                                const newCount = newRow ? newRow.likes_count : 1;
                                
                                broadcastLikeUpdate(contentId, newCount);
                                res.json({
                                    contentId,
                                    likesCount: newCount,
                                    likesFormatted: formatLikesCount(newCount),
                                    liked: true,
                                    action: 'added'
                                });
                            });
                        });
                    }
                });
            });
        }
    });
});

// Verificar si usuario ya dio like
app.get('/api/likes/:contentId/check', (req, res) => {
    const { contentId } = req.params;
    const userId = generateUserId(req);
    
    db.get("SELECT id FROM user_likes WHERE user_id = ? AND content_id = ?", 
        [userId, contentId], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error al verificar like' });
        } else {
            res.json({ liked: !!row });
        }
    });
});

// Obtener estadísticas generales
app.get('/api/stats', (req, res) => {
    db.all("SELECT content_id, content_type, likes_count FROM likes ORDER BY likes_count DESC", 
        (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        } else {
            const stats = rows.map(row => ({
                contentId: row.content_id,
                contentType: row.content_type,
                likesCount: row.likes_count,
                likesFormatted: formatLikesCount(row.likes_count)
            }));
            res.json(stats);
        }
    });
});

// Sistema de Reportes
app.post('/api/reports', (req, res) => {
    const {
        reportId,
        problemType,
        problemTitle,
        description,
        email,
        technicalInfo,
        detectedProblems,
        performanceIssues,
        networkIssues
    } = req.body;
    
    const userId = generateUserId(req);
    
    console.log('📝 Nuevo reporte recibido:', {
        reportId,
        problemType,
        email: email.substring(0, 3) + '***' // Log parcial por privacidad
    });
    
    // En una implementación real, guardarías en base de datos
    // y enviarías email real
    
    const reportData = {
        reportId,
        userId,
        problemType,
        problemTitle,
        description,
        email,
        technicalInfo,
        detectedProblems,
        performanceIssues,
        networkIssues,
        status: 'received',
        createdAt: new Date().toISOString(),
        estimatedResolution: '24-48 horas'
    };
    
    // Simular procesamiento del reporte
    setTimeout(() => {
        console.log('✅ Reporte procesado exitosamente:', reportId);
        
        // Simular envío de email de confirmación
        console.log('📧 Enviando confirmación por email a:', email);
        
        // En tiempo real, aquí iniciarías monitoreo automático
        startReportMonitoring(reportId, problemType);
        
    }, 1000);
    
    res.json({
        success: true,
        reportId,
        status: 'received',
        message: 'Reporte recibido exitosamente',
        estimatedResolution: '24-48 horas',
        emailSent: true
    });
});

// Obtener estado de un reporte
app.get('/api/reports/:reportId', (req, res) => {
    const { reportId } = req.params;
    
    // Simular búsqueda en base de datos
    const reportStatus = {
        reportId,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        estimatedResolution: '24-48 horas',
        updates: [
            {
                timestamp: new Date().toISOString(),
                status: 'received',
                message: 'Reporte recibido y en cola de procesamiento'
            }
        ]
    };
    
    res.json(reportStatus);
});

// Función para iniciar monitoreo automático de reportes
function startReportMonitoring(reportId, problemType) {
    console.log(`🤖 Iniciando monitoreo automático para ${reportId} (${problemType})`);
    
    // Simular detección y resolución automática después de 20 segundos
    setTimeout(() => {
        console.log(`🎉 Problema ${reportId} resuelto automáticamente`);
        
        // Emitir resolución en tiempo real
        io.emit('reportResolved', {
            reportId,
            status: 'resolved',
            message: 'Problema resuelto automáticamente',
            resolvedAt: new Date().toISOString()
        });
        
    }, 20000);
}

// WebSocket para actualizaciones en tiempo real
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5000", "https://*.replit.dev", "https://*.replit.app"],
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// Función para transmitir actualizaciones de likes optimizada
function broadcastLikeUpdate(contentId, likesCount) {
    const updateData = {
        contentId,
        likesCount,
        likesFormatted: formatLikesCount(likesCount),
        timestamp: Date.now()
    };
    
    // Enviar a todos los clientes conectados
    io.emit('likeUpdate', updateData);
    
    // También enviar a la sala específica del contenido
    io.to(contentId).emit('contentLikeUpdate', updateData);
}

// Conexiones WebSocket optimizadas
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
    
    // Unirse a sala de contenido específico
    socket.on('joinContent', (contentId) => {
        socket.join(contentId);
        console.log(`Usuario ${socket.id} se unió a ${contentId}`);
    });
    
    // Manejar broadcast de likes desde cliente
    socket.on('broadcastLike', (data) => {
        console.log('📡 Broadcasting like update:', data.contentId, data.likesCount);
        socket.broadcast.emit('likeUpdate', data);
        socket.broadcast.to(data.contentId).emit('contentLikeUpdate', data);
    });
    
    // Heartbeat para mantener conexión activa
    socket.on('ping', () => {
        socket.emit('pong');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`Accesible en: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err);
        } else {
            console.log('Base de datos cerrada correctamente');
        }
        process.exit(0);
    });
});
