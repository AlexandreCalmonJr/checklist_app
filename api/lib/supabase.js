import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (lazy initialization)
let supabase = null;
let supabaseAdmin = null;

export function getSupabase() {
    if (!supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.SUPABSE_SUPABASE_URL ||
            process.env.SUPABASE_URL;

        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            process.env.SUPABSE_SUPABASE_ANON_KEY ||
            process.env.SUPABASE_ANON_KEY;

        if (!url || !anonKey) {
            console.error('Missing Supabase env vars');
            throw new Error('Supabase configuration missing');
        }

        supabase = createClient(url, anonKey);
    }
    return supabase;
}

export function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.SUPABSE_SUPABASE_URL ||
            process.env.SUPABASE_URL;

        const serviceKey = process.env.SUPABSE_SUPABASE_SERVICE_ROLE_KEY ||
            process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !serviceKey) {
            console.error('Missing Supabase admin env vars');
            throw new Error('Supabase admin configuration missing');
        }

        supabaseAdmin = createClient(url, serviceKey);
    }
    return supabaseAdmin;
}

export async function verifyAuth(req) {
    const authHeader = req.headers.authorization || req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: 'Token não fornecido' };
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const { data: { user }, error } = await getSupabase().auth.getUser(token);

        if (error || !user) {
            return { user: null, error: 'Token inválido ou expirado' };
        }

        return { user, error: null };
    } catch (err) {
        console.error('Auth verification error:', err);
        return { user: null, error: 'Erro ao verificar autenticação' };
    }
}

export function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
