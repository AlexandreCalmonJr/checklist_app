/**
 * AUTH MANAGER - Gerenciamento de autenticação
 * Hospital Teresa de Lisieux - Checklist App
 */

const AUTH_STORAGE_KEY = 'checklist_auth';
const API_BASE_URL = '/api';

class AuthManager {
    constructor() {
        this.session = this.loadSession();
    }

    /**
     * Load session from localStorage
     */
    loadSession() {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            if (stored) {
                const session = JSON.parse(stored);
                // Check if session is expired
                if (session.expires_at && Date.now() < session.expires_at * 1000) {
                    return session;
                }
                // Session expired, clear it
                this.clearSession();
            }
        } catch (e) {
            console.error('Error loading session:', e);
        }
        return null;
    }

    /**
     * Save session to localStorage
     */
    saveSession(session) {
        this.session = session;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }

    /**
     * Clear session from localStorage
     */
    clearSession() {
        this.session = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.session !== null && this.session.access_token;
    }

    /**
     * Get access token
     */
    getToken() {
        return this.session?.access_token || null;
    }

    /**
     * Get current user info
     */
    getUser() {
        return this.session?.user || null;
    }

    /**
     * Login with email and password
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            this.saveSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
                user: data.user
            });

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Logout current user
     */
    logout() {
        this.clearSession();
        window.location.href = '/login.html';
    }

    /**
     * Verify if current token is valid
     */
    async verifyToken() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            if (!response.ok) {
                this.clearSession();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }

    /**
     * Require authentication - redirects to login if not authenticated
     */
    async requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }

        const valid = await this.verifyToken();
        if (!valid) {
            window.location.href = '/login.html';
            return false;
        }

        return true;
    }

    /**
     * Make authenticated API request
     */
    async apiRequest(endpoint, options = {}) {
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.logout();
            throw new Error('Sessão expirada');
        }

        return response;
    }
}

// Export singleton instance
export const authManager = new AuthManager();
export { AuthManager };
