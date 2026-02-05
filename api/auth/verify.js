import { verifyAuth, setCorsHeaders } from '../lib/supabase.js';

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { user, error } = await verifyAuth(req);

    if (error) {
        return res.status(401).json({ error, valid: false });
    }

    return res.status(200).json({ valid: true, user });
}
