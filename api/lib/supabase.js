const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (lazy initialization)
let supabase = null;
let supabaseAdmin = null;

function getSupabase() {
    if (!supabase) {
        supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );
    }
    return supabase;
}

function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        supabaseAdmin = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
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
