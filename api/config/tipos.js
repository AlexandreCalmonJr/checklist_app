const { getSupabaseAdmin, verifyAuth, setCorsHeaders } = require('../lib/supabase.js');

module.exports = async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const { user, error: authError } = await verifyAuth(req);
    if (authError) {
        return res.status(401).json({ error: authError });
    }

    const id = req.query.id;
    const supabaseAdmin = getSupabaseAdmin();

    try {
        switch (req.method) {
            case 'GET':
                if (id) {
                    const { data, error } = await supabaseAdmin
                        .from('tipos_checklist')
                        .select('*')
                        .eq('id', id)
                        .single();
                    if (error) return res.status(404).json({ error: 'Tipo não encontrado' });
                    return res.status(200).json(data);
                }
                const { data, error } = await supabaseAdmin
                    .from('tipos_checklist')
                    .select('*')
                    .order('nome');
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json(data);

            case 'POST':
                const { id: newId, nome } = req.body || {};
                if (!newId || !nome) return res.status(400).json({ error: 'ID e nome são obrigatórios' });
                const { data: created, error: createErr } = await supabaseAdmin
                    .from('tipos_checklist')
                    .insert({ id: newId, nome })
                    .select()
                    .single();
                if (createErr) return res.status(400).json({ error: createErr.message });
                return res.status(201).json(created);

            case 'PUT':
                if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
                const { nome: updatedNome } = req.body || {};
                if (!updatedNome) return res.status(400).json({ error: 'Nome é obrigatório' });
                const { data: updated, error: updateErr } = await supabaseAdmin
                    .from('tipos_checklist')
                    .update({ nome: updatedNome })
                    .eq('id', id)
                    .select()
                    .single();
                if (updateErr) return res.status(400).json({ error: updateErr.message });
                return res.status(200).json(updated);

            case 'DELETE':
                if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
                const { error: deleteErr } = await supabaseAdmin
                    .from('tipos_checklist')
                    .delete()
                    .eq('id', id);
                if (deleteErr) return res.status(400).json({ error: deleteErr.message });
                return res.status(200).json({ success: true, message: 'Tipo removido' });

            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (err) {
        console.error('Tipos API error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
