import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'checklist.db');

let db = null;

export function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initializeSchema();
    }
    return db;
}

function initializeSchema() {
    const database = db;

    database.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS unidades (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            sigla TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS responsaveis (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tecnicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            ativo INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS tipos_checklist (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS locais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_checklist_id TEXT NOT NULL REFERENCES tipos_checklist(id) ON DELETE CASCADE,
            setor TEXT NOT NULL,
            local TEXT NOT NULL,
            responsavel_id TEXT REFERENCES responsaveis(id) ON DELETE SET NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_locais_tipo ON locais(tipo_checklist_id);
        CREATE INDEX IF NOT EXISTS idx_locais_setor ON locais(setor);

        CREATE TABLE IF NOT EXISTS itens_config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_checklist_id TEXT NOT NULL REFERENCES tipos_checklist(id) ON DELETE CASCADE,
            label TEXT NOT NULL,
            name TEXT NOT NULL,
            options TEXT NOT NULL DEFAULT '["Sim", "Não"]',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_itens_tipo ON itens_config(tipo_checklist_id);

        CREATE TABLE IF NOT EXISTS unidade_locais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            unidade_id TEXT NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
            local_id INTEGER NOT NULL REFERENCES locais(id) ON DELETE CASCADE,
            UNIQUE(unidade_id, local_id)
        );
    `);

    // Seed initial data if tables are empty
    seedData(database);
}

function seedData(database) {
    const count = database.prepare('SELECT COUNT(*) as c FROM unidades').get();
    if (count.c > 0) return; // Already seeded

    console.log('🌱 Seeding initial data...');

    // Unidades
    const insertUnidade = database.prepare('INSERT OR IGNORE INTO unidades (id, nome, sigla) VALUES (?, ?, ?)');
    const unidades = [
        ['hteresa', 'Hospital Teresa de Lisieux', 'HTL'],
        ['hfrancisca', 'Hospital Francisca de Sande', 'HFS'],
        ['hsemed', 'Hospital SEMED', 'HS'],
        ['hlauro', 'Hospital Lauro de Freitas', 'HLF'],
        ['hcentro', 'Hospital Centro', 'HC'],
        ['hgabriel', 'Hospital Gabriel Soares', 'HGS']
    ];
    for (const u of unidades) insertUnidade.run(...u);

    // Responsáveis
    const insertResp = database.prepare('INSERT OR IGNORE INTO responsaveis (id, nome) VALUES (?, ?)');
    const responsaveis = [
        ['ATENDIMENTO', 'Supervisão de Atendimento'],
        ['IMAGEM', 'Vida e Imagem'],
        ['ENFERMAGEM', 'Enfermagem'],
        ['FARMACIA', 'Farmácia'],
        ['TI', 'TI'],
        ['ONCOLOGIA', 'Oncologia']
    ];
    for (const r of responsaveis) insertResp.run(...r);

    // Técnicos
    const insertTec = database.prepare('INSERT OR IGNORE INTO tecnicos (nome, ativo) VALUES (?, 1)');
    const tecnicos = [
        'Alexandre Calmon', 'Anderson Conceição', 'Carlos Alan', 'Flavio Torres',
        'Ramon Silva', 'Rodrigo Costa', 'Rafael Barbosa', 'Vitor Everton',
        'Elicledson Pereira', 'Bruno Sacramento', 'Uanderson Davi', 'Djair Oliveira',
        'João Paulo', 'Felipe Rosa', 'Matheus Bomfim'
    ];
    for (const t of tecnicos) insertTec.run(t);

    // Tipos Checklist
    const insertTipo = database.prepare('INSERT OR IGNORE INTO tipos_checklist (id, nome) VALUES (?, ?)');
    const tipos = [
        ['centroCirurgico', 'Centro Cirúrgico'],
        ['racks', 'Racks'],
        ['emergencia', 'Emergência'],
        ['totensepaineis', 'Totens e Painéis']
    ];
    for (const t of tipos) insertTipo.run(...t);

    // Itens Config - Centro Cirúrgico
    const insertItem = database.prepare('INSERT INTO itens_config (tipo_checklist_id, label, name, options) VALUES (?, ?, ?, ?)');
    const itensCentro = [
        ['centroCirurgico', 'Hospitalar/SIGA', 'sistema_hospitalar_pep', '["Sim", "Não"]'],
        ['centroCirurgico', 'Sistema Arya', 'sistema_arya', '["Sim", "Não"]'],
        ['centroCirurgico', 'Imprimir a partir do sistema', 'imprimir_sistema', '["Sim", "Não"]'],
        ['centroCirurgico', 'Leitor de Digital', 'leitor_digital', '["Sim", "Não"]'],
        ['centroCirurgico', 'Acesso Remoto funcionando?', 'conexao_vnc', '["Sim", "Não"]'],
        ['centroCirurgico', 'Sinal Wi-Fi', 'sinal_wifi', '["Sim", "Não"]']
    ];
    for (const i of itensCentro) insertItem.run(...i);

    // Itens Config - Racks
    const itensRacks = [
        ['racks', 'Nobreak', 'nobreak', '["Sim", "Não"]'],
        ['racks', 'Limpeza', 'limpeza', '["Sim", "Não"]'],
        ['racks', 'Org. Cabos', 'org_cabos', '["Sim", "Não"]'],
        ['racks', 'Material em sala', 'material_sala', '["Sim", "Não"]'],
        ['racks', 'Forros', 'forros', '["Sim", "Não"]'],
        ['racks', 'Pintura', 'pintura', '["Sim", "Não"]'],
        ['racks', 'Iluminação', 'iluminacao', '["Sim", "Não"]'],
        ['racks', 'Ar condicionado', 'ar_condicionado', '["Sim", "Não"]']
    ];
    for (const i of itensRacks) insertItem.run(...i);

    // Itens Config - Emergência
    const itensEmergencia = [
        ['emergencia', 'Navegador Atualizado?', 'navegador_atualizado', '["Sim", "Não"]'],
        ['emergencia', 'Sistema Hospitalar/SAMWEB funcionando?', 'samweb', '["Sim", "Não"]'],
        ['emergencia', 'Sistema Arya funcionando?', 'arya', '["Sim", "Não"]'],
        ['emergencia', 'Impressão funcionando?', 'impressao', '["Sim", "Não"]'],
        ['emergencia', 'NDD funcionando?', 'ndd', '["Rede", "USB"]'],
        ['emergencia', 'Leitor de Digital funcionando?', 'leitor_digital', '["Sim", "Não"]'],
        ['emergencia', 'Telefonia funcionando?', 'telefonia', '["Sim", "Não"]'],
        ['emergencia', 'Acesso Remoto funcionando?', 'acesso_remoto', '["Sim", "Não"]'],
        ['emergencia', 'Wi-Fi funcionando?', 'wifi', '["Sim", "Não"]']
    ];
    for (const i of itensEmergencia) insertItem.run(...i);

    // Itens Config - Totens e Painéis
    const itensTotens = [
        ['totensepaineis', 'Versão Java (7.80 + 8.231) instalada?', 'versao_java', '["Sim", "Não"]'],
        ['totensepaineis', 'Captura BIO V9 funcionando?', 'captura_bio_v9', '["Sim", "Não"]'],
        ['totensepaineis', 'Navegador (Firefox 52/Edge/IE) configurado?', 'navegador_configurado', '["Sim", "Não"]'],
        ['totensepaineis', 'Abertura em Tela Cheia funcionando?', 'abertura_tela_cheia', '["Sim", "Não"]'],
        ['totensepaineis', 'Automatos funcionando?', 'automatos', '["Sim", "Não"]'],
        ['totensepaineis', 'Leitor Biométrico funcionando?', 'leitor_biometrico', '["Sim", "Não"]'],
        ['totensepaineis', 'Touchscreen funcionando?', 'touchscreen', '["Sim", "Não"]'],
        ['totensepaineis', 'Estrutura do móvel está OK?', 'estrutura_movel', '["Sim", "Não"]'],
        ['totensepaineis', 'Conexão com a Internet funcionando?', 'conexao_internet', '["Sim", "Não"]'],
        ['totensepaineis', 'Impressora Laser funcionando?', 'impressora_laser', '["Sim", "Não"]'],
        ['totensepaineis', 'Impressora Térmica funcionando?', 'impressora_termica', '["Sim", "Não"]'],
        ['totensepaineis', 'Cabeamento Estruturado/Conexão via splitter OK?', 'cabeamento', '["Sim", "Não"]'],
        ['totensepaineis', 'Teclado de Senha funcionando?', 'teclado_senha', '["Sim", "Não"]']
    ];
    for (const i of itensTotens) insertItem.run(...i);

    console.log('✅ Initial data seeded successfully');
}

// ============================================
// CRUD Functions
// ============================================

// --- UNIDADES ---
export function getAllUnidades() {
    return getDb().prepare('SELECT * FROM unidades ORDER BY nome').all();
}

export function getUnidadeById(id) {
    return getDb().prepare('SELECT * FROM unidades WHERE id = ?').get(id);
}

export function createUnidade(data) {
    const stmt = getDb().prepare('INSERT INTO unidades (id, nome, sigla) VALUES (?, ?, ?)');
    stmt.run(data.id, data.nome, data.sigla);
    return getUnidadeById(data.id);
}

export function updateUnidade(id, data) {
    const fields = [];
    const values = [];
    if (data.nome) { fields.push('nome = ?'); values.push(data.nome); }
    if (data.sigla) { fields.push('sigla = ?'); values.push(data.sigla); }
    if (fields.length === 0) return getUnidadeById(id);
    values.push(id);
    getDb().prepare(`UPDATE unidades SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return getUnidadeById(id);
}

export function deleteUnidade(id) {
    getDb().prepare('DELETE FROM unidades WHERE id = ?').run(id);
}

// --- RESPONSÁVEIS ---
export function getAllResponsaveis() {
    return getDb().prepare('SELECT * FROM responsaveis ORDER BY nome').all();
}

export function getResponsavelById(id) {
    return getDb().prepare('SELECT * FROM responsaveis WHERE id = ?').get(id);
}

export function createResponsavel(data) {
    const stmt = getDb().prepare('INSERT INTO responsaveis (id, nome) VALUES (?, ?)');
    stmt.run(data.id, data.nome);
    return getResponsavelById(data.id);
}

export function updateResponsavel(id, data) {
    if (data.nome) {
        getDb().prepare('UPDATE responsaveis SET nome = ? WHERE id = ?').run(data.nome, id);
    }
    return getResponsavelById(id);
}

export function deleteResponsavel(id) {
    getDb().prepare('DELETE FROM responsaveis WHERE id = ?').run(id);
}

// --- TÉCNICOS ---
export function getAllTecnicos() {
    return getDb().prepare('SELECT * FROM tecnicos ORDER BY nome').all()
        .map(t => ({ ...t, ativo: t.ativo === 1 }));
}

export function getTecnicoById(id) {
    const t = getDb().prepare('SELECT * FROM tecnicos WHERE id = ?').get(id);
    return t ? { ...t, ativo: t.ativo === 1 } : null;
}

export function createTecnico(data) {
    const stmt = getDb().prepare('INSERT INTO tecnicos (nome, ativo) VALUES (?, ?)');
    const result = stmt.run(data.nome, data.ativo !== false ? 1 : 0);
    return getTecnicoById(result.lastInsertRowid);
}

export function updateTecnico(id, data) {
    const fields = [];
    const values = [];
    if (data.nome !== undefined) { fields.push('nome = ?'); values.push(data.nome); }
    if (data.ativo !== undefined) { fields.push('ativo = ?'); values.push(data.ativo ? 1 : 0); }
    if (fields.length === 0) return getTecnicoById(id);
    values.push(id);
    getDb().prepare(`UPDATE tecnicos SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return getTecnicoById(id);
}

export function deleteTecnico(id) {
    getDb().prepare('DELETE FROM tecnicos WHERE id = ?').run(id);
}

// --- TIPOS CHECKLIST ---
export function getAllTipos() {
    return getDb().prepare('SELECT * FROM tipos_checklist ORDER BY nome').all();
}

export function getTipoById(id) {
    return getDb().prepare('SELECT * FROM tipos_checklist WHERE id = ?').get(id);
}

export function createTipo(data) {
    const stmt = getDb().prepare('INSERT INTO tipos_checklist (id, nome) VALUES (?, ?)');
    stmt.run(data.id, data.nome);
    return getTipoById(data.id);
}

export function updateTipo(id, data) {
    if (data.nome) {
        getDb().prepare('UPDATE tipos_checklist SET nome = ? WHERE id = ?').run(data.nome, id);
    }
    return getTipoById(id);
}

export function deleteTipo(id) {
    getDb().prepare('DELETE FROM tipos_checklist WHERE id = ?').run(id);
}

// --- LOCAIS ---
export function getAllLocais(tipo = null) {
    let query = `
        SELECT l.*, r.nome as responsavel_nome 
        FROM locais l 
        LEFT JOIN responsaveis r ON l.responsavel_id = r.id
    `;
    const params = [];
    if (tipo) {
        query += ' WHERE l.tipo_checklist_id = ?';
        params.push(tipo);
    }
    query += ' ORDER BY l.setor, l.local';
    
    return getDb().prepare(query).all(...params).map(row => ({
        id: row.id,
        tipo_checklist_id: row.tipo_checklist_id,
        setor: row.setor,
        local: row.local,
        responsavel_id: row.responsavel_id,
        created_at: row.created_at,
        responsaveis: row.responsavel_nome ? { nome: row.responsavel_nome } : null
    }));
}

export function getLocalById(id) {
    const row = getDb().prepare(`
        SELECT l.*, r.nome as responsavel_nome 
        FROM locais l 
        LEFT JOIN responsaveis r ON l.responsavel_id = r.id
        WHERE l.id = ?
    `).get(id);
    if (!row) return null;
    return {
        id: row.id,
        tipo_checklist_id: row.tipo_checklist_id,
        setor: row.setor,
        local: row.local,
        responsavel_id: row.responsavel_id,
        created_at: row.created_at,
        responsaveis: row.responsavel_nome ? { nome: row.responsavel_nome } : null
    };
}

export function createLocal(data) {
    const stmt = getDb().prepare('INSERT INTO locais (tipo_checklist_id, setor, local, responsavel_id) VALUES (?, ?, ?, ?)');
    const result = stmt.run(data.tipo_checklist_id, data.setor, data.local, data.responsavel_id || null);
    return getLocalById(result.lastInsertRowid);
}

export function updateLocal(id, data) {
    const fields = [];
    const values = [];
    if (data.setor) { fields.push('setor = ?'); values.push(data.setor); }
    if (data.local) { fields.push('local = ?'); values.push(data.local); }
    if (data.responsavel_id !== undefined) { fields.push('responsavel_id = ?'); values.push(data.responsavel_id); }
    if (data.tipo_checklist_id) { fields.push('tipo_checklist_id = ?'); values.push(data.tipo_checklist_id); }
    if (fields.length === 0) return getLocalById(id);
    values.push(id);
    getDb().prepare(`UPDATE locais SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return getLocalById(id);
}

export function deleteLocal(id) {
    getDb().prepare('DELETE FROM locais WHERE id = ?').run(id);
}

// --- LOCAIS POR UNIDADE ---
export function getLocaisByUnidade(unidadeId, tipo = null) {
    let query = `
        SELECT l.*, r.nome as responsavel_nome 
        FROM unidade_locais ul 
        JOIN locais l ON ul.local_id = l.id
        LEFT JOIN responsaveis r ON l.responsavel_id = r.id
        WHERE ul.unidade_id = ?
    `;
    const params = [unidadeId];
    if (tipo) {
        query += ' AND l.tipo_checklist_id = ?';
        params.push(tipo);
    }
    query += ' ORDER BY l.setor, l.local';
    
    return getDb().prepare(query).all(...params).map(row => ({
        id: row.id,
        tipo_checklist_id: row.tipo_checklist_id,
        setor: row.setor,
        local: row.local,
        responsavel_id: row.responsavel_id,
        created_at: row.created_at,
        responsaveis: row.responsavel_nome ? { nome: row.responsavel_nome } : null
    }));
}

// --- ITENS CONFIG ---
export function getAllItens(tipo = null) {
    let query = 'SELECT * FROM itens_config';
    const params = [];
    if (tipo) {
        query += ' WHERE tipo_checklist_id = ?';
        params.push(tipo);
    }
    query += ' ORDER BY label';
    
    return getDb().prepare(query).all(...params).map(item => ({
        ...item,
        options: JSON.parse(item.options)
    }));
}

export function getItemById(id) {
    const item = getDb().prepare('SELECT * FROM itens_config WHERE id = ?').get(id);
    if (!item) return null;
    return { ...item, options: JSON.parse(item.options) };
}

export function createItem(data) {
    const stmt = getDb().prepare('INSERT INTO itens_config (tipo_checklist_id, label, name, options) VALUES (?, ?, ?, ?)');
    const options = JSON.stringify(data.options || ['Sim', 'Não']);
    const result = stmt.run(data.tipo_checklist_id, data.label, data.name, options);
    return getItemById(result.lastInsertRowid);
}

export function updateItem(id, data) {
    const fields = [];
    const values = [];
    if (data.label) { fields.push('label = ?'); values.push(data.label); }
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.options) { fields.push('options = ?'); values.push(JSON.stringify(data.options)); }
    if (data.tipo_checklist_id) { fields.push('tipo_checklist_id = ?'); values.push(data.tipo_checklist_id); }
    if (fields.length === 0) return getItemById(id);
    values.push(id);
    getDb().prepare(`UPDATE itens_config SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return getItemById(id);
}

export function deleteItem(id) {
    getDb().prepare('DELETE FROM itens_config WHERE id = ?').run(id);
}

// --- UNIDADE_LOCAIS ---
export function getUnidadeLocais(unidadeId) {
    return getDb().prepare(`
        SELECT ul.*, l.*, r.nome as responsavel_nome 
        FROM unidade_locais ul 
        JOIN locais l ON ul.local_id = l.id
        LEFT JOIN responsaveis r ON l.responsavel_id = r.id
        WHERE ul.unidade_id = ?
    `).all(unidadeId).map(row => ({
        id: row.id,
        tipo_checklist_id: row.tipo_checklist_id,
        setor: row.setor,
        local: row.local,
        responsavel_id: row.responsavel_id,
        created_at: row.created_at,
        responsaveis: row.responsavel_nome ? { nome: row.responsavel_nome } : null
    }));
}

export function setUnidadeLocais(unidadeId, localIds) {
    const deleteStmt = getDb().prepare('DELETE FROM unidade_locais WHERE unidade_id = ?');
    const insertStmt = getDb().prepare('INSERT OR IGNORE INTO unidade_locais (unidade_id, local_id) VALUES (?, ?)');
    
    const transaction = getDb().transaction(() => {
        deleteStmt.run(unidadeId);
        for (const localId of localIds) {
            insertStmt.run(unidadeId, localId);
        }
    });
    transaction();
}

export function deleteUnidadeLocal(unidadeId, localId) {
    getDb().prepare('DELETE FROM unidade_locais WHERE unidade_id = ? AND local_id = ?').run(unidadeId, localId);
}
