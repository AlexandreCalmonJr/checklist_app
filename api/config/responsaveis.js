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
                return await getResponsaveis(id);
            case 'POST':
                return await createResponsavel(await req.json());
            case 'PUT':
                return await updateResponsavel(id, await req.json());
            case 'DELETE':
                return await deleteResponsavel(id);
            default:
                return errorResponse('Método não permitido', 405);
        }
    } catch (err) {
        console.error('Responsaveis API error:', err);
        return errorResponse('Erro interno do servidor', 500);
    }
}

async function getResponsaveis(id) {
    if (id) {
        const { data, error } = await supabaseAdmin
            .from('responsaveis')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return errorResponse('Responsável não encontrado', 404);
        return jsonResponse(data);
    }

    const { data, error } = await supabaseAdmin
        .from('responsaveis')
        .select('*')
        .order('nome');

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function createResponsavel(body) {
    const { id, nome } = body;

    if (!id || !nome) {
        return errorResponse('ID e nome são obrigatórios');
    }

    const { data, error } = await supabaseAdmin
        .from('responsaveis')
        .insert({ id, nome })
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data, 201);
}

async function updateResponsavel(id, body) {
    if (!id) return errorResponse('ID é obrigatório');

    const { nome } = body;

    const { data, error } = await supabaseAdmin
        .from('responsaveis')
        .update({ nome })
        .eq('id', id)
        .select()
        .single();

    if (error) return errorResponse(error.message);
    return jsonResponse(data);
}

async function deleteResponsavel(id) {
    if (!id) return errorResponse('ID é obrigatório');

    const { error } = await supabaseAdmin
        .from('responsaveis')
        .delete()
        .eq('id', id);

    if (error) return errorResponse(error.message);
    return jsonResponse({ success: true, message: 'Responsável removido' });
}
