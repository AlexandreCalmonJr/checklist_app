import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verifies the Authorization header and returns user data
 * @param {Request} req - The incoming request
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
export async function verifyAuth(req) {
    const authHeader = req.headers.authorization || req.headers.get?.('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: 'Token não fornecido' };
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return { user: null, error: 'Token inválido ou expirado' };
        }
        
        return { user, error: null };
    } catch (err) {
        return { user: null, error: 'Erro ao verificar autenticação' };
    }
}

/**
 * Standard JSON response helper
 */
export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Error response helper
 */
export function errorResponse(message, status = 400) {
    return jsonResponse({ error: message }, status);
}
