const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (lazy initialization)
let supabase = null;
let supabaseAdmin = null;

function getSupabase() {
    if (!supabase) {
        // Try different env var names (Vercel integration uses different names)
        const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !anonKey) {
            console.error('Missing Supabase env vars:', {
                url: !!url,
                anonKey: !!anonKey,
                availableVars: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
            });
            throw new Error('Supabase configuration missing');
        }

        supabase = createClient(url, anonKey);
    }
    return supabase;
}

function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        // Try different env var names
        const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

        if (!url || !serviceKey) {
            console.error('Missing Supabase admin env vars:', {
                url: !!url,
                serviceKey: !!serviceKey,
                availableVars: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
            });
            throw new Error('Supabase admin configuration missing');
        }

        supabaseAdmin = createClient(url, serviceKey);
    }
    return supabaseAdmin;
}

/**
 * Verifies the Authorization header and returns user data
 */
async function verifyAuth(req) {
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

/**
 * Set CORS headers
 */
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = {
    getSupabase,
    getSupabaseAdmin,
    verifyAuth,
    setCorsHeaders
};
