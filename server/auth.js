import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me-in-production-min-32-chars!!';
const TOKEN_EXPIRY = '24h';

/**
 * Initialize admin user if no users exist
 */
export function initializeAdmin() {
    const db = getDb();
    const count = db.prepare('SELECT COUNT(*) as c FROM users').get();

    if (count.c === 0) {
        const email = process.env.ADMIN_EMAIL || 'admin@checklist.local';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const hash = bcrypt.hashSync(password, 10);

        db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);
        console.log(`👤 Admin user created: ${email}`);
    }
}

/**
 * Authenticate user with email and password
 */
export function login(email, password) {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
        return { error: 'Credenciais inválidas' };
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
        return { error: 'Credenciais inválidas' };
    }

    const token = jwt.sign(
        {
            sub: user.id.toString(),
            email: user.email,
            role: 'authenticated'
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );

    const decoded = jwt.decode(token);

    return {
        user: {
            id: user.id.toString(),
            email: user.email,
            role: 'authenticated'
        },
        session: {
            access_token: token,
            refresh_token: token, // Same token for simplicity
            expires_at: decoded.exp,
            token_type: 'bearer'
        }
    };
}

/**
 * Verify JWT token from request
 */
export function verifyToken(req) {
    const authHeader = req.headers.authorization || req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: 'Token não fornecido' };
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            user: {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role
            },
            error: null
        };
    } catch (err) {
        return { user: null, error: 'Token inválido ou expirado' };
    }
}
