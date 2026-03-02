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
// IMPORT ROUTES
// ============================================

import { parseCSV, parseJSON, parseExcel, validateImportData, previewImport, executeImport, generateExcelTemplate } from './server/import.js';
import fs from 'fs';

// Download template
app.get('/api/import/template', async (req, res) => {
    const format = req.query.format || 'json';

    if (format === 'xlsx') {
        // Generate Excel template on-the-fly
        const buffer = generateExcelTemplate();
        res.setHeader('Content-Disposition', 'attachment; filename="template_checklist.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(Buffer.from(buffer));
    }

    if (format === 'pdf') {
        // Generate PDF template
        const PDFDocument = (await import('pdfkit')).default;
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Disposition', 'attachment; filename="template_checklist.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(20).text('Template - Checklist Hospitalar', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).fillColor('#666').text('Preencha este formulário e envie para a equipe de TI para cadastro no sistema.', { align: 'center' });
        doc.moveDown(2);

        // Hospital
        doc.fontSize(14).fillColor('#2563eb').text('🏥 HOSPITAL');
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#333');
        doc.text('Nome: ________________________________________________');
        doc.text('Sigla: _______________');
        doc.moveDown(1.5);

        // Responsáveis
        doc.fontSize(14).fillColor('#2563eb').text('👥 RESPONSÁVEIS');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#666').text('Liste os setores responsáveis. Exemplo: ATENDIMENTO, ENFERMAGEM, TI, IMAGEM, FARMACIA');
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#333');
        for (let i = 1; i <= 8; i++) {
            doc.text(`${i}. ID: ________________  Nome: ________________________________`);
        }
        doc.moveDown(1.5);

        // Técnicos
        doc.fontSize(14).fillColor('#2563eb').text('🔧 TÉCNICOS');
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#333');
        for (let i = 1; i <= 6; i++) {
            doc.text(`${i}. Nome: ________________________________________________`);
        }
        doc.moveDown(1.5);

        // Locais
        doc.addPage();
        doc.fontSize(14).fillColor('#2563eb').text('📍 LOCAIS');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#666').text('Tipos válidos: centroCirurgico, racks, emergencia, totensepaineis');
        doc.moveDown(0.3);
        doc.fontSize(8).fillColor('#333');

        // Table header
        const startX = 40;
        doc.font('Helvetica-Bold');
        doc.text('Tipo Checklist', startX, doc.y, { width: 100, continued: false });
        const headerY = doc.y - 12;
        doc.text('Setor', startX + 110, headerY, { width: 100 });
        doc.text('Local', startX + 220, headerY, { width: 150 });
        doc.text('Responsável', startX + 380, headerY, { width: 100 });
        doc.moveDown(0.3);
        doc.moveTo(startX, doc.y).lineTo(520, doc.y).stroke();
        doc.moveDown(0.3);
        doc.font('Helvetica');

        for (let i = 0; i < 25; i++) {
            const y = doc.y;
            doc.text('________________', startX, y, { width: 100 });
            doc.text('________________', startX + 110, y, { width: 100 });
            doc.text('____________________', startX + 220, y, { width: 150 });
            doc.text('________________', startX + 380, y, { width: 100 });
            doc.moveDown(0.2);
        }

        doc.end();
        return;
    }

    const templatePath = path.join(__dirname, 'templates', `template_checklist.${format}`);

    if (!fs.existsSync(templatePath)) {
        return res.status(404).json({ error: `Template ${format} não encontrado` });
    }

    const filename = `template_checklist.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
    res.sendFile(templatePath);
});

// Preview import (parse + validate without saving)
app.post('/api/import/preview', (req, res) => {
    try {
        const { content, format } = req.body;
        if (!content) return res.status(400).json({ error: 'Conteúdo do arquivo é obrigatório' });

        let data;
        if (format === 'csv') {
            data = parseCSV(content);
        } else if (format === 'xlsx') {
            data = parseExcel(content);
        } else {
            data = parseJSON(content);
        }

        const errors = validateImportData(data);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Dados inválidos', errors });
        }

        const preview = previewImport(data);
        return res.json({ success: true, preview, data });
    } catch (err) {
        console.error('Import preview error:', err);
        return res.status(400).json({ error: `Erro ao processar arquivo: ${err.message}` });
    }
});

// Execute import
app.post('/api/import/execute', (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ error: 'Dados são obrigatórios' });

        const errors = validateImportData(data);
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Dados inválidos', errors });
        }

        console.log(`📥 Importando hospital: ${data.hospital.nome}...`);
        const results = executeImport(data);
        console.log('✅ Importação concluída:', results);

        return res.json({ success: true, message: 'Importação concluída', results });
    } catch (err) {
        console.error('Import execute error:', err);
        return res.status(500).json({ error: `Erro na importação: ${err.message}` });
    }
});

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
