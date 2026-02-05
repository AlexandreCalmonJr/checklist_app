const { getSupabaseAdmin, verifyAuth, setCorsHeaders } = require('../lib/supabase.js');

module.exports = async function handler(req, res) {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Verify authentication for all operations
    const { user, error: authError } = await verifyAuth(req);
    if (authError) {
        return res.status(401).json({ error: authError });
    }

    const id = req.query.id;
    const supabaseAdmin = getSupabaseAdmin();

    try {
        switch (req.method) {
            case 'GET':
                return await getUnidades(res, supabaseAdmin, id);
            case 'POST':
                return await createUnidade(res, supabaseAdmin, req.body);
            case 'PUT':
                return await updateUnidade(res, supabaseAdmin, id, req.body);
            case 'DELETE':
                return await deleteUnidade(res, supabaseAdmin, id);
            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (err) {
        console.error('Unidades API error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

async function getUnidades(res, supabaseAdmin, id) {
    if (id) {
        const { data, error } = await supabaseAdmin
            .from('unidades')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: 'Unidade não encontrada' });
        return res.status(200).json(data);
    }

    const { data, error } = await supabaseAdmin
        .from('unidades')
        .select('*')
        .order('nome');

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
}

async function createUnidade(res, supabaseAdmin, body) {
    const { id, nome, sigla } = body || {};

    if (!id || !nome || !sigla) {
        return res.status(400).json({ error: 'ID, nome e sigla são obrigatórios' });
    }

    const { data, error } = await supabaseAdmin
        .from('unidades')
        .insert({ id, nome, sigla })
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
}

async function updateUnidade(res, supabaseAdmin, id, body) {
    if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

    const { nome, sigla } = body || {};
    const updates = {};
    if (nome) updates.nome = nome;
    if (sigla) updates.sigla = sigla;

    const { data, error } = await supabaseAdmin
        .from('unidades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
}

async function deleteUnidade(res, supabaseAdmin, id) {
    if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

    const { error } = await supabaseAdmin
        .from('unidades')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true, message: 'Unidade removida' });
}
