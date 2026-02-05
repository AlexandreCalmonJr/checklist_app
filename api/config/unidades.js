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
                return await getUnidades(id);
            case 'POST':
                return await createUnidade(await req.json());
            case 'PUT':
                return await updateUnidade(id, await req.json());
            case 'DELETE':
                return await deleteUnidade(id);
            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (err) {
        console.error('Unidades API error:', err);
        return errorResponse('Erro interno do servidor', 500);
    }
}

async function getUnidades(id) {
    if (id) {
        const { data, error } = await supabaseAdmin
            .from('unidades')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return errorResponse('Unidade não encontrada', 404);
        return jsonResponse(data);
    }

    const { data, error } = await supabaseAdmin
        .from('unidades')
        .select('*')
        .order('nome');

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function createUnidade(body) {
    const { id, nome, sigla } = body;

    if (!id || !nome || !sigla) {
        return errorResponse('ID, nome e sigla são obrigatórios');
    }

    const { data, error } = await supabaseAdmin
        .from('unidades')
        .insert({ id, nome, sigla })
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
}

async function updateUnidade(id, body) {
    if (!id) return errorResponse('ID é obrigatório');

    const { nome, sigla } = body;
    const updates = {};
    if (nome) updates.nome = nome;
    if (sigla) updates.sigla = sigla;

    const { data, error } = await supabaseAdmin
        .from('unidades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function deleteUnidade(id) {
    if (!id) return errorResponse('ID é obrigatório');

    const { error } = await supabaseAdmin
        .from('unidades')
        .delete()
        .eq('id', id);

    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true, message: 'Unidade removida' });
}
