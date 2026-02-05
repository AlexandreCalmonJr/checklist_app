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
                return await getItens(id, tipoChecklist);
            case 'POST':
                return await createItem(await req.json());
            case 'PUT':
                return await updateItem(id, await req.json());
            case 'DELETE':
                return await deleteItem(id);
            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (err) {
        console.error('Itens API error:', err);
        return errorResponse('Erro interno do servidor', 500);
    }
}

async function getItens(id, tipoChecklist) {
    if (id) {
        const { data, error } = await supabaseAdmin
            .from('itens_config')
            .select('*')
            .eq('id', parseInt(id))
            .single();

        if (error) return errorResponse('Item não encontrado', 404);
        return jsonResponse(data);
    }

    let query = supabaseAdmin
        .from('itens_config')
        .select('*')
        .order('id');

    if (tipoChecklist) {
        query = query.eq('tipo_checklist_id', tipoChecklist);
    }

    const { data, error } = await query;

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function createItem(body) {
    const { tipo_checklist_id, label, name, options } = body;

    if (!tipo_checklist_id || !label || !name || !options) {
        return errorResponse('Tipo, label, name e options são obrigatórios');
    }

    const { data, error } = await supabaseAdmin
        .from('itens_config')
        .insert({
            tipo_checklist_id,
            label,
            name,
            options: Array.isArray(options) ? options : JSON.parse(options)
        })
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
}

async function updateItem(id, body) {
    if (!id) return errorResponse('ID é obrigatório');

    const { label, name, options } = body;
    const updates = {};
    if (label !== undefined) updates.label = label;
    if (name !== undefined) updates.name = name;
    if (options !== undefined) {
        updates.options = Array.isArray(options) ? options : JSON.parse(options);
    }

    const { data, error } = await supabaseAdmin
        .from('itens_config')
        .update(updates)
        .eq('id', parseInt(id))
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function deleteItem(id) {
    if (!id) return errorResponse('ID é obrigatório');

    const { error } = await supabaseAdmin
        .from('itens_config')
        .delete()
        .eq('id', parseInt(id));

    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true, message: 'Item removido' });
}
