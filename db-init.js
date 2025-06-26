
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(__dirname, 'likes.db');
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error al abrir la base de datos:', err);
                reject(err);
                return;
            }
            
            console.log('✅ Conectado a la base de datos SQLite');
            
            // Crear tablas si no existen
            db.serialize(() => {
                // Tabla de likes principales
                db.run(`CREATE TABLE IF NOT EXISTS likes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content_id TEXT NOT NULL UNIQUE,
                    content_type TEXT NOT NULL,
                    likes_count INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);
                
                // Tabla de likes individuales para evitar duplicados
                db.run(`CREATE TABLE IF NOT EXISTS user_likes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    content_id TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, content_id)
                )`);
                
                // Insertar datos iniciales si no existen
                db.get("SELECT COUNT(*) as count FROM likes WHERE content_id = 'la-nina-ceo'", (err, row) => {
                    if (!err && row.count === 0) {
                        console.log('📝 Insertando datos iniciales...');
                        
                        const insertLikes = [
                            ['la-nina-ceo', 'series', 1247583],
                            ['la-nina-ceo-ep1', 'episode', 892456],
                            ['la-nina-ceo-ep2', 'episode', 756234],
                            ['la-nina-ceo-ep3', 'episode', 644123],
                            ['la-nina-ceo-ep4', 'episode', 578901],
                            ['la-nina-ceo-ep5', 'episode', 523456]
                        ];
                        
                        insertLikes.forEach(([contentId, contentType, likesCount]) => {
                            db.run("INSERT OR IGNORE INTO likes (content_id, content_type, likes_count) VALUES (?, ?, ?)", 
                                [contentId, contentType, likesCount]);
                        });
                        
                        console.log('✅ Datos iniciales insertados');
                    }
                    resolve(db);
                });
            });
        });
    });
}

module.exports = { initializeDatabase };
