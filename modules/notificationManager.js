/**
 * NOTIFICATION MANAGER - Sistema de notificações toast
 * Hospital Teresa de Lisieux - Checklist App
 */

export class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    /**
     * Inicializa o gerenciador de notificações
     */
    init() {
        this.createContainer();
    }

    /**
     * Cria o container de notificações
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    /**
     * Mostra uma notificação
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duração em ms (0 = permanente)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.notifications.push(toast);

        // Animação de entrada
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove automaticamente após a duração
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    /**
     * Cria um elemento de toast
     * @param {string} message - Mensagem
     * @param {string} type - Tipo
     * @returns {HTMLElement} Elemento toast
     */
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = this.getIcon(type);
        const closeBtn = this.createCloseButton();

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        toast.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => this.remove(toast));

        return toast;
    }

    /**
     * Cria botão de fechar
     * @returns {HTMLElement} Botão
     */
    createCloseButton() {
        const btn = document.createElement('button');
        btn.className = 'toast-close';
        btn.setAttribute('aria-label', 'Fechar');
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="4" x2="4" y2="12"></line>
                <line x1="4" y1="4" x2="12" y2="12"></line>
            </svg>
        `;
        return btn;
    }

    /**
     * Remove uma notificação
     * @param {HTMLElement} toast - Elemento toast
     */
    remove(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.notifications = this.notifications.filter(t => t !== toast);
        }, 300);
    }

    /**
     * Remove todas as notificações
     */
    removeAll() {
        this.notifications.forEach(toast => this.remove(toast));
    }

    /**
     * Retorna o ícone baseado no tipo
     * @param {string} type - Tipo da notificação
     * @returns {string} SVG do ícone
     */
    getIcon(type) {
        const icons = {
            success: `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16.667 5L7.5 14.167 3.333 10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,
            error: `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="10" cy="10" r="8"/>
                    <line x1="10" y1="6" x2="10" y2="10"/>
                    <line x1="10" y1="13" x2="10.01" y2="13"/>
                </svg>
            `,
            warning: `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 2L2 17h16L10 2z"/>
                    <line x1="10" y1="8" x2="10" y2="12"/>
                    <line x1="10" y1="15" x2="10.01" y2="15"/>
                </svg>
            `,
            info: `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="10" cy="10" r="8"/>
                    <line x1="10" y1="10" x2="10" y2="14"/>
                    <line x1="10" y1="6" x2="10.01" y2="6"/>
                </svg>
            `
        };

        return icons[type] || icons.info;
    }

    /**
     * Atalhos para tipos específicos
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Instância global
export const notify = new NotificationManager();
