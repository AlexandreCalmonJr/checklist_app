import { verifyAuth, jsonResponse, errorResponse } from '../lib/supabase.js';

export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204 });
    }

    if (req.method !== 'GET') {
        return errorResponse('Método não permitido', 405);
    }

    const { user, error } = await verifyAuth(req);

    if (error) {
        return errorResponse(error, 401);
    }

    return jsonResponse({
        valid: true,
        user: {
            id: user.id,
            email: user.email
        }
    });
}
