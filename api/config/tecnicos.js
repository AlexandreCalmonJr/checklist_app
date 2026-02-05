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

    const id = req.query.id;
    const supabaseAdmin = getSupabaseAdmin();

    try {
        switch (req.method) {
            case 'GET':
                if (id) {
                    const { data, error } = await supabaseAdmin
                        .from('tecnicos')
                        .select('*')
                        .eq('id', id)
                        .single();
                    if (error) return res.status(404).json({ error: 'Técnico não encontrado' });
                    return res.status(200).json(data);
                }
                const { data, error } = await supabaseAdmin
                    .from('tecnicos')
                    .select('*')
                    .order('nome');
                if (error) return res.status(400).json({ error: error.message });
                return res.status(200).json(data);

            case 'POST':
                const { nome, ativo = true } = req.body || {};
                if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
                const { data: created, error: createErr } = await supabaseAdmin
                    .from('tecnicos')
                    .insert({ nome, ativo })
                    .select()
                    .single();
                if (createErr) return res.status(400).json({ error: createErr.message });
                return res.status(201).json(created);

            case 'PUT':
                if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
                const updates = {};
                if (req.body?.nome) updates.nome = req.body.nome;
                if (req.body?.ativo !== undefined) updates.ativo = req.body.ativo;
                const { data: updated, error: updateErr } = await supabaseAdmin
                    .from('tecnicos')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                if (updateErr) return res.status(400).json({ error: updateErr.message });
                return res.status(200).json(updated);

            case 'DELETE':
                if (!id) return res.status(400).json({ error: 'ID é obrigatório' });
                const { error: deleteErr } = await supabaseAdmin
                    .from('tecnicos')
                    .delete()
                    .eq('id', id);
                if (deleteErr) return res.status(400).json({ error: deleteErr.message });
                return res.status(200).json({ success: true, message: 'Técnico removido' });

            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (err) {
        console.error('Tecnicos API error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
