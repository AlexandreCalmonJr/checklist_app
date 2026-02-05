import { getSupabaseAdmin, verifyAuth, setCorsHeaders } from '../lib/supabase.js';

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const { user, error: authError } = await verifyAuth(req);
    if (authError) {
        return res.status(401).json({ error: authError });
    }

    const unidadeId = req.query.unidade;
    const supabaseAdmin = getSupabaseAdmin();

    try {
        switch (req.method) {
            case 'GET':
                // Get all locals for a specific unit
                if (!unidadeId) {
                    return res.status(400).json({ error: 'unidade é obrigatório' });
                }
                const { data, error } = await supabaseAdmin
                    .from('unidade_locais')
                    .select('local_id, locais(*, responsaveis(nome))')
                    .eq('unidade_id', unidadeId);
                if (error) return res.status(400).json({ error: error.message });
                // Flatten the response
                const locais = data.map(item => item.locais);
                return res.status(200).json(locais);

            case 'POST':
                // Associate locals to a unit (bulk operation)
                const { unidade_id, local_ids } = req.body || {};
                if (!unidade_id || !local_ids || !Array.isArray(local_ids)) {
                    return res.status(400).json({ error: 'unidade_id e local_ids são obrigatórios' });
                }

                // First, delete existing associations for this unit
                await supabaseAdmin
                    .from('unidade_locais')
                    .delete()
                    .eq('unidade_id', unidade_id);

                // Then insert new associations
                if (local_ids.length > 0) {
                    const insertData = local_ids.map(local_id => ({
                        unidade_id,
                        local_id
                    }));
                    const { error: insertErr } = await supabaseAdmin
                        .from('unidade_locais')
                        .insert(insertData);
                    if (insertErr) return res.status(400).json({ error: insertErr.message });
                }

                return res.status(200).json({ success: true, message: 'Locais associados com sucesso' });

            case 'DELETE':
                // Remove a specific association
                const deleteUnidade = req.query.unidade;
                const deleteLocal = req.query.local;
                if (!deleteUnidade || !deleteLocal) {
                    return res.status(400).json({ error: 'unidade e local são obrigatórios' });
                }
                const { error: deleteErr } = await supabaseAdmin
                    .from('unidade_locais')
                    .delete()
                    .eq('unidade_id', deleteUnidade)
                    .eq('local_id', deleteLocal);
                if (deleteErr) return res.status(400).json({ error: deleteErr.message });
                return res.status(200).json({ success: true, message: 'Associação removida' });

            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (err) {
        console.error('UnidadeLocais API error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
