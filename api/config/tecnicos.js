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

    try {
        switch (req.method) {
            case 'GET':
                return await getTecnicos(id);
            case 'POST':
                return await createTecnico(await req.json());
            case 'PUT':
                return await updateTecnico(id, await req.json());
            case 'DELETE':
                return await deleteTecnico(id);
            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (err) {
        console.error('Tecnicos API error:', err);
        return errorResponse('Erro interno do servidor', 500);
    }
}

async function getTecnicos(id) {
    if (id) {
        const { data, error } = await supabaseAdmin
            .from('tecnicos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return errorResponse('Técnico não encontrado', 404);
        return jsonResponse(data);
    }

    const { data, error } = await supabaseAdmin
        .from('tecnicos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function createTecnico(body) {
    const { nome } = body;

    if (!nome) {
        return errorResponse('Nome é obrigatório');
    }

    const { data, error } = await supabaseAdmin
        .from('tecnicos')
        .insert({ nome, ativo: true })
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
}

async function updateTecnico(id, body) {
    if (!id) return errorResponse('ID é obrigatório');

    const { nome, ativo } = body;
    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (ativo !== undefined) updates.ativo = ativo;

    const { data, error } = await supabaseAdmin
        .from('tecnicos')
        .update(updates)
        .eq('id', parseInt(id))
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function deleteTecnico(id) {
    if (!id) return errorResponse('ID é obrigatório');

    // Soft delete - apenas marca como inativo
    const { error } = await supabaseAdmin
        .from('tecnicos')
        .update({ ativo: false })
        .eq('id', parseInt(id));

    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true, message: 'Técnico desativado' });
}
