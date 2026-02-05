const { getSupabase, setCorsHeaders } = require('../lib/supabase.js');

module.exports = async function handler(req, res) {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        return res.status(200).json({
            user: data.user,
            session: data.session
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
