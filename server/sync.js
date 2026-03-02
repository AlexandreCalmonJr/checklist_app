import { createClient } from '@supabase/supabase-js';
import { getDb } from './database.js';

/**
 * SYNC MODULE - Sincronização bidirecional com Supabase
 * 
 * Pull: Supabase → Local (SQLite)
 * Push: Local (SQLite) → Supabase
 */

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABSE_SUPABASE_URL ||
        process.env.SUPABASE_URL;

    const serviceKey = process.env.SUPABSE_SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        return null;
    }

    return createClient(url, serviceKey);
}

export function isSyncAvailable() {
    return getSupabaseClient() !== null;
}

/**
 * Pull data from Supabase to local SQLite
 */
export async function pullFromSupabase() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.');
    }

    const db = getDb();
    const results = { tables: {}, errors: [] };

    try {
        // 1. Sync unidades
        const { data: unidades, error: e1 } = await supabase.from('unidades').select('*');
        if (e1) { results.errors.push(`unidades: ${e1.message}`); }
        else {
            const stmt = db.prepare('INSERT OR REPLACE INTO unidades (id, nome, sigla, created_at) VALUES (?, ?, ?, ?)');
            const transaction = db.transaction(() => {
                for (const u of unidades) {
                    stmt.run(u.id, u.nome, u.sigla, u.created_at);
                }
            });
            transaction();
            results.tables.unidades = unidades.length;
        }

        // 2. Sync responsaveis
        const { data: responsaveis, error: e2 } = await supabase.from('responsaveis').select('*');
        if (e2) { results.errors.push(`responsaveis: ${e2.message}`); }
        else {
            const stmt = db.prepare('INSERT OR REPLACE INTO responsaveis (id, nome) VALUES (?, ?)');
            const transaction = db.transaction(() => {
                for (const r of responsaveis) {
                    stmt.run(r.id, r.nome);
                }
            });
            transaction();
            results.tables.responsaveis = responsaveis.length;
        }

        // 3. Sync tipos_checklist
        const { data: tipos, error: e3 } = await supabase.from('tipos_checklist').select('*');
        if (e3) { results.errors.push(`tipos_checklist: ${e3.message}`); }
        else {
            const stmt = db.prepare('INSERT OR REPLACE INTO tipos_checklist (id, nome) VALUES (?, ?)');
            const transaction = db.transaction(() => {
                for (const t of tipos) {
                    stmt.run(t.id, t.nome);
                }
            });
            transaction();
            results.tables.tipos_checklist = tipos.length;
        }

        // 4. Sync tecnicos
        const { data: tecnicos, error: e4 } = await supabase.from('tecnicos').select('*');
        if (e4) { results.errors.push(`tecnicos: ${e4.message}`); }
        else {
            const stmt = db.prepare('INSERT OR REPLACE INTO tecnicos (id, nome, ativo, created_at) VALUES (?, ?, ?, ?)');
            const transaction = db.transaction(() => {
                for (const t of tecnicos) {
                    stmt.run(t.id, t.nome, t.ativo ? 1 : 0, t.created_at);
                }
            });
            transaction();
            results.tables.tecnicos = tecnicos.length;
        }

        // 5. Sync locais
        const { data: locais, error: e5 } = await supabase.from('locais').select('*');
        if (e5) { results.errors.push(`locais: ${e5.message}`); }
        else {
            const stmt = db.prepare('INSERT OR REPLACE INTO locais (id, tipo_checklist_id, setor, local, responsavel_id, created_at) VALUES (?, ?, ?, ?, ?, ?)');
            const transaction = db.transaction(() => {
                for (const l of locais) {
                    stmt.run(l.id, l.tipo_checklist_id, l.setor, l.local, l.responsavel_id, l.created_at);
                }
            });
            transaction();
            results.tables.locais = locais.length;
        }

        // 6. Sync itens_config
        const { data: itens, error: e6 } = await supabase.from('itens_config').select('*');
        if (e6) { results.errors.push(`itens_config: ${e6.message}`); }
        else {
            const stmt = db.prepare('INSERT OR REPLACE INTO itens_config (id, tipo_checklist_id, label, name, options, created_at) VALUES (?, ?, ?, ?, ?, ?)');
            const transaction = db.transaction(() => {
                for (const i of itens) {
                    stmt.run(i.id, i.tipo_checklist_id, i.label, i.name, JSON.stringify(i.options), i.created_at);
                }
            });
            transaction();
            results.tables.itens_config = itens.length;
        }

        // 7. Sync unidade_locais
        const { data: ul, error: e7 } = await supabase.from('unidade_locais').select('*');
        if (e7) { results.errors.push(`unidade_locais: ${e7.message}`); }
        else {
            const deleteAll = db.prepare('DELETE FROM unidade_locais');
            const stmt = db.prepare('INSERT OR IGNORE INTO unidade_locais (unidade_id, local_id) VALUES (?, ?)');
            const transaction = db.transaction(() => {
                deleteAll.run();
                for (const item of ul) {
                    stmt.run(item.unidade_id, item.local_id);
                }
            });
            transaction();
            results.tables.unidade_locais = ul.length;
        }

    } catch (err) {
        results.errors.push(`Erro geral: ${err.message}`);
    }

    return results;
}

/**
 * Push data from local SQLite to Supabase
 */
export async function pushToSupabase() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.');
    }

    const db = getDb();
    const results = { tables: {}, errors: [] };

    try {
        // 1. Push unidades
        const unidades = db.prepare('SELECT * FROM unidades').all();
        const { error: e1 } = await supabase.from('unidades').upsert(unidades, { onConflict: 'id' });
        if (e1) results.errors.push(`unidades: ${e1.message}`);
        else results.tables.unidades = unidades.length;

        // 2. Push responsaveis
        const responsaveis = db.prepare('SELECT * FROM responsaveis').all();
        const { error: e2 } = await supabase.from('responsaveis').upsert(responsaveis, { onConflict: 'id' });
        if (e2) results.errors.push(`responsaveis: ${e2.message}`);
        else results.tables.responsaveis = responsaveis.length;

        // 3. Push tipos_checklist
        const tipos = db.prepare('SELECT * FROM tipos_checklist').all();
        const { error: e3 } = await supabase.from('tipos_checklist').upsert(tipos, { onConflict: 'id' });
        if (e3) results.errors.push(`tipos_checklist: ${e3.message}`);
        else results.tables.tipos_checklist = tipos.length;

        // 4. Push tecnicos (convert ativo back to boolean)
        const tecnicos = db.prepare('SELECT * FROM tecnicos').all()
            .map(t => ({ ...t, ativo: t.ativo === 1 }));
        const { error: e4 } = await supabase.from('tecnicos').upsert(tecnicos, { onConflict: 'id' });
        if (e4) results.errors.push(`tecnicos: ${e4.message}`);
        else results.tables.tecnicos = tecnicos.length;

        // 5. Push locais
        const locais = db.prepare('SELECT id, tipo_checklist_id, setor, local, responsavel_id, created_at FROM locais').all();
        const { error: e5 } = await supabase.from('locais').upsert(locais, { onConflict: 'id' });
        if (e5) results.errors.push(`locais: ${e5.message}`);
        else results.tables.locais = locais.length;

        // 6. Push itens_config (parse options back to JSON)
        const itens = db.prepare('SELECT * FROM itens_config').all()
            .map(i => ({ ...i, options: JSON.parse(i.options) }));
        const { error: e6 } = await supabase.from('itens_config').upsert(itens, { onConflict: 'id' });
        if (e6) results.errors.push(`itens_config: ${e6.message}`);
        else results.tables.itens_config = itens.length;

        // 7. Push unidade_locais
        const ul = db.prepare('SELECT unidade_id, local_id FROM unidade_locais').all();
        // Delete all first, then insert
        await supabase.from('unidade_locais').delete().neq('unidade_id', '___impossible___');
        if (ul.length > 0) {
            const { error: e7 } = await supabase.from('unidade_locais').insert(ul);
            if (e7) results.errors.push(`unidade_locais: ${e7.message}`);
            else results.tables.unidade_locais = ul.length;
        } else {
            results.tables.unidade_locais = 0;
        }

    } catch (err) {
        results.errors.push(`Erro geral: ${err.message}`);
    }

    return results;
}

/**
 * Get sync status info
 */
export function getSyncStatus() {
    const db = getDb();
    const available = isSyncAvailable();

    const counts = {
        unidades: db.prepare('SELECT COUNT(*) as c FROM unidades').get().c,
        responsaveis: db.prepare('SELECT COUNT(*) as c FROM responsaveis').get().c,
        tecnicos: db.prepare('SELECT COUNT(*) as c FROM tecnicos').get().c,
        tipos_checklist: db.prepare('SELECT COUNT(*) as c FROM tipos_checklist').get().c,
        locais: db.prepare('SELECT COUNT(*) as c FROM locais').get().c,
        itens_config: db.prepare('SELECT COUNT(*) as c FROM itens_config').get().c,
        unidade_locais: db.prepare('SELECT COUNT(*) as c FROM unidade_locais').get().c,
    };

    return {
        sync_available: available,
        supabase_url: available ? (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABSE_SUPABASE_URL) : null,
        local_database: counts
    };
}
