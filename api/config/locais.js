import { supabaseAdmin, verifyAuth, jsonResponse, errorResponse } from '../lib/supabase.js';

export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204 });
    }

    // Verify authentication for all operations
    const { user, error: authError } = await verifyAuth(req);
    if (authError) {
        return errorResponse(authError, 401);
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const tipoChecklist = url.searchParams.get('tipo');

    try {
        switch (req.method) {
            case 'GET':
                return await getLocais(id, tipoChecklist);
            case 'POST':
                return await createLocal(await req.json());
            case 'PUT':
                return await updateLocal(id, await req.json());
            case 'DELETE':
                return await deleteLocal(id);
            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (err) {
        console.error('Locais API error:', err);
        return errorResponse('Erro interno do servidor', 500);
    }
}

async function getLocais(id, tipoChecklist) {
    if (id) {
        const { data, error } = await supabaseAdmin
            .from('locais')
            .select(`
                *,
                responsaveis (id, nome)
            `)
            .eq('id', parseInt(id))
            .single();

        if (error) return errorResponse('Local não encontrado', 404);
        return jsonResponse(data);
    }

    let query = supabaseAdmin
        .from('locais')
        .select(`
            *,
            responsaveis (id, nome)
        `)
        .order('setor')
        .order('local');

    if (tipoChecklist) {
        query = query.eq('tipo_checklist_id', tipoChecklist);
    }

    const { data, error } = await query;

    if (error) return errorResponse(error.message);

    // Group by setor for easier frontend consumption
    const grouped = data.reduce((acc, item) => {
        if (!acc[item.setor]) {
            acc[item.setor] = [];
        }
        acc[item.setor].push({
            local: item.local,
            responsavel: item.responsaveis?.nome || item.responsavel_id
        });
        return acc;
    }, {});

    return jsonResponse({ raw: data, grouped });
}

async function createLocal(body) {
    const { tipo_checklist_id, setor, local, responsavel_id } = body;

    if (!tipo_checklist_id || !setor || !local) {
        return errorResponse('Tipo, setor e local são obrigatórios');
    }

    const { data, error } = await supabaseAdmin
        .from('locais')
        .insert({ tipo_checklist_id, setor, local, responsavel_id })
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
}

async function updateLocal(id, body) {
    if (!id) return errorResponse('ID é obrigatório');

    const { setor, local, responsavel_id } = body;
    const updates = {};
    if (setor !== undefined) updates.setor = setor;
    if (local !== undefined) updates.local = local;
    if (responsavel_id !== undefined) updates.responsavel_id = responsavel_id;

    const { data, error } = await supabaseAdmin
        .from('locais')
        .update(updates)
        .eq('id', parseInt(id))
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function deleteLocal(id) {
    if (!id) return errorResponse('ID é obrigatório');

    const { error } = await supabaseAdmin
        .from('locais')
        .delete()
        .eq('id', parseInt(id));

    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true, message: 'Local removido' });
}
