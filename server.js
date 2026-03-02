/**
 * LOCAL SERVER - Checklist Hospitalar
 * Hospital Teresa de Lisieux
 * 
 * Servidor Express.js local para rodar na intranet
 * Usa SQLite como banco de dados local
 * Sincronização opcional com Supabase
 * 
 * Uso: npm run start:local
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { initializeAdmin } from './server/auth.js';
import apiRouter from './server/routes.js';
import { isSyncAvailable, pullFromSupabase, pushToSupabase, getSyncStatus } from './server/sync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES (must be before static files)
// ============================================

app.use('/api', apiRouter);

// ============================================
// SYNC ROUTES
// ============================================

app.get('/api/sync/status', (req, res) => {
    try {
        return res.json(getSyncStatus());
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/sync/pull', async (req, res) => {
    try {
        if (!isSyncAvailable()) {
            return res.status(400).json({ error: 'Supabase não configurado' });
        }
        console.log('🔄 Iniciando pull do Supabase...');
        const results = await pullFromSupabase();
        console.log('✅ Pull concluído:', results);
        return res.json({ success: true, message: 'Pull concluído', ...results });
    } catch (err) {
        console.error('❌ Sync pull error:', err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/sync/push', async (req, res) => {
    try {
        if (!isSyncAvailable()) {
            return res.status(400).json({ error: 'Supabase não configurado' });
        }
        console.log('🔄 Iniciando push para Supabase...');
        const results = await pushToSupabase();
        console.log('✅ Push concluído:', results);
        return res.json({ success: true, message: 'Push concluído', ...results });
    } catch (err) {
        console.error('❌ Sync push error:', err);
        return res.status(500).json({ error: err.message });
    }
});

// ============================================
// STATIC FILES
// ============================================

// Serve static files from the project root
app.use(express.static(__dirname, {
    extensions: ['html'],
    index: 'index.html'
}));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint não encontrado' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// START SERVER
// ============================================

// Initialize admin user
initializeAdmin();

app.listen(PORT, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }

    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   🏥 Checklist Hospitalar - Servidor Local      ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  Local:    http://localhost:${PORT}                ║`);

    for (const addr of addresses) {
        const line = `║  Rede:     http://${addr}:${PORT}`;
        console.log(line + ' '.repeat(Math.max(0, 51 - line.length)) + '║');
    }

    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  Sync:     ${isSyncAvailable() ? '✅ Supabase configurado' : '⚠️  Supabase não configurado'}           ║`);
    console.log(`║  Banco:    SQLite (./data/checklist.db)          ║`);
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log('📱 Compartilhe o link da Rede com os computadores da intranet!');
    console.log('');
});
