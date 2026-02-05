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
    const tipo = req.query.tipo;
    const supabaseAdmin = getSupabaseAdmin();

    try {
        switch (req.method) {
            case 'GET':
                if (id) {
                    const { data, error } = await supabaseAdmin
                        .from('itens_config')
                        .select('*')
                        .eq('id', id)
                        .single();
                    if (error) return res.status(404).json({ error: 'Item não encontrado' });
                    return res.status(200).json(data);
                }
                let query = supabaseAdmin
                    .from('itens_config')
                    .select('*')
                    .order('label');
                if (tipo) query = query.eq('tipo_checklist_id', tipo);
                const { data, error } = await query;
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json(data);

            case 'POST':
                const { tipo_checklist_id, label, name, options } = req.body || {};
                if (!tipo_checklist_id || !label || !name) {
                    return res.status(400).json({ error: 'Tipo, label e name são obrigatórios' });
                }
                const { data: created, error: createErr } = await supabaseAdmin
                    .from('itens_config')
                    .insert({
                        tipo_checklist_id,
                        label,
                        name,
                        options: options || ['Sim', 'Não']
                    })
                    .select()
                    .single();
                if (createErr) return res.status(400).json({ error: createErr.message });
                return res.status(201).json(created);

            case 'PUT':
                if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
                const updates = {};
                if (req.body?.label) updates.label = req.body.label;
                if (req.body?.name) updates.name = req.body.name;
                if (req.body?.options) updates.options = req.body.options;
                if (req.body?.tipo_checklist_id) updates.tipo_checklist_id = req.body.tipo_checklist_id;
                const { data: updated, error: updateErr } = await supabaseAdmin
                    .from('itens_config')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                if (updateErr) return res.status(400).json({ error: updateErr.message });
                return res.status(200).json(updated);

            case 'DELETE':
                if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
                const { error: deleteErr } = await supabaseAdmin
                    .from('itens_config')
                    .delete()
                    .eq('id', id);
                if (deleteErr) return res.status(400).json({ error: deleteErr.message });
                return res.status(200).json({ success: true, message: 'Item removido' });

            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (err) {
        console.error('Itens API error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
