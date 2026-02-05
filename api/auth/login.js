import { supabase, jsonResponse, errorResponse } from '../lib/supabase.js';

export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
        return errorResponse('Método não permitido', 405);
    }

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return errorResponse('Email e senha são obrigatórios');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return errorResponse(error.message, 401);
        }

        return jsonResponse({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email
            },
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        return errorResponse('Erro interno do servidor', 500);
    }
}
